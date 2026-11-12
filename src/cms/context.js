import { createContext, useCallback, useContext } from "react";
import { getIn } from "./path";

export const ContentContext = createContext(null);

/** Full CMS API: content, update, undo/redo, edit mode, save status… */
export const useCms = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useCms must be used inside <ContentProvider>");
  return ctx;
};

/** Read-only content for page sections. */
export const useContent = () => useCms().content;

/** Two-way binding to one value in the content tree. */
export const useField = (path) => {
  const { content, update } = useCms();
  const key = path.join(".");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const set = useCallback((value) => update(path, value), [update, key]);
  return [getIn(content, path), set];
};
