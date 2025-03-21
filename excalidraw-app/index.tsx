import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../excalidraw-app/sentry";

import ExcalidrawApp from "./App";
import ScenesPage from "./pages/ScenesPage";

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
registerSW();
root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ExcalidrawApp />} />
        <Route path="/scenes" element={<ScenesPage />} />
      </Routes>
    </Router>
  </StrictMode>,
);
