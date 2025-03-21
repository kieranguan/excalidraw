import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { AppState } from "@excalidraw/excalidraw/types";
import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { exportToBlob } from "@excalidraw/excalidraw";
import { useNavigate } from "react-router-dom";

export interface Scene {
  id: string;
  name: string;
  elements: ExcalidrawElement[];
  appState: Partial<AppState>;
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
}

const scenesAtom = atomWithStorage<Scene[]>("excalidraw-scenes", []);

export const useScenes = () => {
  const [scenes, setScenes] = useAtom(scenesAtom);

  const createScene = useCallback(
    (
      name: string,
      elements: ExcalidrawElement[],
      appState: Partial<AppState>,
      thumbnail?: string,
    ) => {
      const newScene: Scene = {
        id: crypto.randomUUID(),
        name,
        elements,
        appState,
        thumbnail,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setScenes((prev) => [...prev, newScene]);
      return newScene;
    },
    [setScenes],
  );

  const updateScene = useCallback(
    (
      id: string,
      elements: ExcalidrawElement[],
      appState: Partial<AppState>,
      thumbnail?: string,
    ) => {
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === id
            ? {
                ...scene,
                elements,
                appState,
                thumbnail,
                updatedAt: Date.now(),
              }
            : scene,
        ),
      );
    },
    [setScenes],
  );

  const deleteScene = useCallback(
    (id: string) => {
      setScenes((prev) => prev.filter((scene) => scene.id !== id));
    },
    [setScenes],
  );

  const renameScene = useCallback(
    (id: string, newName: string) => {
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === id
            ? {
                ...scene,
                name: newName,
                updatedAt: Date.now(),
              }
            : scene,
        ),
      );
    },
    [setScenes],
  );

  return useMemo(
    () => ({
      scenes,
      createScene,
      updateScene,
      deleteScene,
      renameScene,
    }),
    [scenes, createScene, updateScene, deleteScene, renameScene],
  );
};

export const ScenesManager = ({ currentSceneId }: { currentSceneId?: string }) => {
  const { scenes, deleteScene, renameScene } = useScenes();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScenes = useMemo(() => {
    if (!searchTerm.trim()) return scenes;
    const term = searchTerm.toLowerCase();
    return scenes.filter(scene => 
      scene.name.toLowerCase().includes(term)
    );
  }, [scenes, searchTerm]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSceneSelect = useCallback((sceneId: string) => {
    console.log("Scene selected:", sceneId);
    // Navigate to the main app with the selected scene ID
    navigate(`/?scene=${sceneId}`);
  }, [navigate]);

  return (
    <div className="scenes-manager">
      <div className="scenes-header">
        <h1>Your Scenes</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search scenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredScenes.length === 0 ? (
        <div className="no-scenes">
          <p>No scenes found. Create your first scene to get started!</p>
        </div>
      ) : (
        <div className="scenes-grid">
          {filteredScenes.map((scene) => (
            <div
              key={scene.id}
              className={clsx("scene-card", {
                "is-current": scene.id === currentSceneId,
              })}
              onClick={() => handleSceneSelect(scene.id)}
            >
              <div className="scene-thumbnail">
                {scene.thumbnail ? (
                  <img
                    src={scene.thumbnail}
                    alt={scene.name}
                    className="thumbnail-image"
                  />
                ) : (
                  <div className="thumbnail-placeholder">No preview</div>
                )}
              </div>
              <div className="scene-info">
                <input
                  value={scene.name}
                  onChange={(e) => renameScene(scene.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="scene-name-input"
                  aria-label="Scene name"
                />
                <div className="scene-meta">
                  <span className="scene-date">
                    {formatDate(scene.updatedAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this scene?")) {
                        deleteScene(scene.id);
                      }
                    }}
                    className="delete-button"
                    aria-label="Delete scene"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .scenes-manager {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .scenes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .scenes-header h1 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--color-text-primary);
        }
        
        .search-container {
          width: 300px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-gray-20);
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .scenes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        
        .scene-card {
          border: 1px solid var(--color-gray-20);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          background: var(--color-surface);
        }
        
        .scene-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--color-primary);
        }
        
        .scene-card.is-current {
          border-color: var(--color-primary);
          position: relative;
        }
        
        .scene-card.is-current::after {
          content: "Current";
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--color-primary);
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .scene-thumbnail {
          height: 180px;
          background: var(--color-gray-10);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .thumbnail-placeholder {
          color: var(--color-gray-40);
          font-size: 0.9rem;
        }
        
        .scene-info {
          padding: 0.75rem;
        }
        
        .scene-name-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 500;
          padding: 0;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }
        
        .scene-name-input:focus {
          outline: none;
          border-bottom: 1px solid var(--color-primary);
        }
        
        .scene-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--color-gray-60);
        }
        
        .delete-button {
          background: transparent;
          border: none;
          color: var(--color-danger);
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .delete-button:hover {
          background: var(--color-danger-lighter);
        }
        
        .no-scenes {
          text-align: center;
          padding: 3rem 0;
          color: var(--color-gray-60);
        }
      `}</style>
    </div>
  );
};
