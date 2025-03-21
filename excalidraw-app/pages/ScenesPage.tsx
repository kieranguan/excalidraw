import React, { useMemo } from "react";
import { ScenesManager } from "../components/ScenesManager";
import { Link, useLocation } from "react-router-dom";

export const ScenesPage: React.FC = () => {
  const location = useLocation();
  const currentSceneId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("current");
  }, [location.search]);

  return (
    <div className="scenes-page">
      <header className="scenes-page-header">
        <Link to="/" className="back-to-editor">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Editor
        </Link>
        <div className="new-scene-button">
          <Link to="/" className="new-scene-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Scene
          </Link>
        </div>
      </header>
      <main>
        <ScenesManager currentSceneId={currentSceneId || undefined} />
      </main>
      <style>{`
        .scenes-page {
          min-height: 100vh;
          background: var(--color-background);
        }
        
        .scenes-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--color-gray-20);
          background: var(--color-surface);
        }
        
        .back-to-editor {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-primary);
          text-decoration: none;
          font-weight: 500;
        }
        
        .back-to-editor:hover {
          color: var(--color-primary);
        }
        
        .new-scene-button {
          display: flex;
          align-items: center;
        }
        
        .new-scene-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .new-scene-link:hover {
          background: var(--color-primary-darker);
        }
      `}</style>
    </div>
  );
};

export default ScenesPage;
