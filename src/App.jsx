import { lazy, Suspense, useCallback, useState } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import ReactLenis from "lenis/react";
import Home from "./page/Home";
import Loader from "./component/ui/Loader";
import CustomCursor from "./component/ui/CustomCursor";
import ScrollProgress from "./component/ui/ScrollProgress";
import ContentProvider from "./cms/ContentProvider";
import { useCms } from "./cms/context";
import { useFinePointer } from "./hooks/useMediaQuery";

// The editor is only downloaded on devices in edit mode — visitors never load it.
const Editor = lazy(() => import("./cms/editor/Editor"));
const EditorGate = () => {
  const { editMode } = useCms();
  return editMode ? (
    <Suspense fallback={null}>
      <Editor />
    </Suspense>
  ) : null;
};

const LOADER_KEY = "yash-portfolio-intro-seen";

/** Show the intro loader once per browser session (skipped for reduced motion). */
const shouldShowLoader = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(LOADER_KEY);
  } catch {
    return true;
  }
};

const App = () => {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const [loading, setLoading] = useState(shouldShowLoader);

  const onLoaded = useCallback(() => {
    try {
      sessionStorage.setItem(LOADER_KEY, "1");
    } catch {
      /* storage unavailable — loader simply shows again next visit */
    }
    setLoading(false);
  }, []);

  const content = (
    <ContentProvider>
      <MotionConfig reducedMotion="user">
        <div className="grain">
          <AnimatePresence>{loading && <Loader key="loader" onDone={onLoaded} />}</AnimatePresence>
          <ScrollProgress />
          {finePointer && !reduceMotion && <CustomCursor />}
          <Home ready={!loading} />
          <EditorGate />
        </div>
      </MotionConfig>
    </ContentProvider>
  );

  // Lenis smooth scrolling, disabled for users who prefer reduced motion.
  return reduceMotion ? (
    content
  ) : (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true }}>
      {content}
    </ReactLenis>
  );
};

export default App;
