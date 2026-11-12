import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import bundled from "../data/content.json";
import { ContentContext } from "./context";
import { getIn, setIn } from "./path";
import {
  clearDraft,
  hashContent,
  loadInitialState,
  readEditMode,
  saveDraft,
  writeEditMode,
} from "./storage";

const HISTORY_LIMIT = 100;
const COALESCE_MS = 1000; // typing into one field within 1s = one undo step
const bundledHash = hashContent(bundled);

const reducer = (state, action) => {
  switch (action.type) {
    case "update": {
      const prev = getIn(state.content, action.path);
      const value = typeof action.value === "function" ? action.value(prev) : action.value;
      if (Object.is(prev, value)) return state;
      const key = action.path.join(".");
      const coalesce = key === state.lastKey && action.now - state.lastTs < COALESCE_MS;
      return {
        content: setIn(state.content, action.path, value),
        past: coalesce ? state.past : [...state.past, state.content].slice(-HISTORY_LIMIT),
        future: [],
        lastKey: key,
        lastTs: action.now,
      };
    }
    case "replace":
      return {
        content: action.content,
        past: action.record ? [...state.past, state.content].slice(-HISTORY_LIMIT) : state.past,
        future: action.record ? [] : state.future,
        lastKey: null,
        lastTs: 0,
      };
    case "undo": {
      if (!state.past.length) return state;
      return {
        content: state.past[state.past.length - 1],
        past: state.past.slice(0, -1),
        future: [state.content, ...state.future],
        lastKey: null,
        lastTs: 0,
      };
    }
    case "redo": {
      if (!state.future.length) return state;
      return {
        content: state.future[0],
        past: [...state.past, state.content],
        future: state.future.slice(1),
        lastKey: null,
        lastTs: 0,
      };
    }
    default:
      return state;
  }
};

const ContentProvider = ({ children }) => {
  const [initial] = useState(() => {
    const editMode = readEditMode();
    return { editMode, ...loadInitialState(bundled, editMode) };
  });
  const [editMode, setEditModeState] = useState(initial.editMode);
  const [publishedHash, setPublishedHash] = useState(initial.publishedHash);
  const [notice, setNotice] = useState(initial.notice);
  // `content` = the snapshot last written; status is "saving" while it lags behind.
  const [saveState, setSaveState] = useState({ status: "idle", at: 0, content: initial.content });
  const [state, dispatch] = useReducer(reducer, {
    content: initial.content,
    past: [],
    future: [],
    lastKey: null,
    lastTs: 0,
  });

  // ---- Autosave the draft to this device (debounced) ----
  useEffect(() => {
    if (!editMode || state.content === saveState.content) return;
    const t = setTimeout(() => {
      const ok = saveDraft(state.content, publishedHash, bundledHash);
      setSaveState({ status: ok ? "saved" : "error", at: Date.now(), content: state.content });
    }, 400);
    return () => clearTimeout(t);
  }, [state.content, saveState.content, publishedHash, editMode]);

  // Flush immediately when the tab is hidden/closed so nothing is lost.
  const latest = useRef({ content: state.content, publishedHash, editMode });
  useEffect(() => {
    latest.current = { content: state.content, publishedHash, editMode };
  });
  useEffect(() => {
    const flush = () => {
      const l = latest.current;
      if (l.editMode && document.visibilityState === "hidden") saveDraft(l.content, l.publishedHash, bundledHash);
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  const update = useCallback((path, value) => dispatch({ type: "update", path, value, now: Date.now() }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const replaceContent = useCallback((content) => dispatch({ type: "replace", content, record: true }), []);

  /**
   * Turning edit mode on loads this device's saved draft (so it is never
   * overwritten); turning it off shows the published content again.
   */
  const setEditMode = useCallback((on) => {
    writeEditMode(on);
    const next = loadInitialState(bundled, on);
    dispatch({ type: "replace", content: next.content, record: false });
    setPublishedHash(next.publishedHash);
    setNotice(next.notice);
    setSaveState({ status: "idle", at: 0, content: next.content });
    setEditModeState(on);
  }, []);

  // Typing #edit into the address bar of an already-open page doesn't reload
  // it, so listen for the hash change too.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash !== "#edit") return;
      history.replaceState(null, "", window.location.pathname + window.location.search);
      setEditMode(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [setEditMode]);

  /** Throw away the device draft and return to what the live site shows. */
  const resetToPublished = useCallback(() => {
    clearDraft();
    dispatch({ type: "replace", content: bundled, record: true });
    setPublishedHash(bundledHash);
    setNotice(null);
  }, []);

  /** After a successful publish: adopt the published content as the new baseline. */
  const markPublished = useCallback((content) => {
    const hash = hashContent(content);
    dispatch({ type: "replace", content, record: false });
    setPublishedHash(hash);
    setNotice("deploy-pending");
    const ok = saveDraft(content, hash, bundledHash);
    setSaveState({ status: ok ? "saved" : "error", at: Date.now(), content });
  }, []);

  const contentHash = useMemo(() => hashContent(state.content), [state.content]);

  const value = useMemo(
    () => ({
      content: state.content,
      update,
      undo,
      redo,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      replaceContent,
      resetToPublished,
      markPublished,
      editMode,
      setEditMode,
      saveState: { ...saveState, status: editMode && state.content !== saveState.content ? "saving" : saveState.status },
      hasUnpublished: contentHash !== publishedHash,
      notice,
      dismissNotice: () => setNotice(null),
    }),
    [state, update, undo, redo, replaceContent, resetToPublished, markPublished, editMode, setEditMode, saveState, contentHash, publishedHash, notice]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export default ContentProvider;
