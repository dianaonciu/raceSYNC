import { useState, useEffect } from 'react';
import styles from './MainView.module.scss';
import DraggableWindow, { type WindowState } from '../DraggableWindow/DraggableWindow';

type WindowsMap = Record<
  string,
  WindowState & { visible: boolean }
>;

const defaultWindows: WindowsMap = {
  window1: {
    position: { x: 100, y: 100 },
    size: { width: 300, height: 200 },
    minimized: false,
    maximized: false,
    visible: true,
  },
  window2: {
    position: { x: 450, y: 150 },
    size: { width: 320, height: 220 },
    minimized: false,
    maximized: false,
    visible: true,
  },
};

const STORAGE_KEY = 'raceTrackr_windows';

const MainView = () => {
  const [windows, setWindows] = useState<WindowsMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      /* mimimi */
    }
    return defaultWindows;
  });

  const [zOrder, setZOrder] = useState<string[]>(Object.keys(windows));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
  }, [windows]);

  const bringToFront = (id: string) => {
    setZOrder((prev) => {
      const filtered = prev.filter((w) => w !== id);
      return [...filtered, id];
    });
  };

  const updateWindow = (id: string, newState: Partial<WindowState & { visible?: boolean }>) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...newState,
      },
    }));
  };

  return (
    <div className={styles.mainView}>
      {Object.entries(windows).map(([id, state]) =>
        state.visible ? (
          <DraggableWindow
            key={id}
            id={id}
            title={id.replace(/window/, 'Window ')}
            initialPosition={state.position}
            initialSize={state.size}
            minimized={state.minimized}
            maximized={state.maximized}
            zIndex={zOrder.indexOf(id) + 10}
            onFocus={() => bringToFront(id)}
            onUpdate={(newState) => updateWindow(id, newState)}
            onClose={() => updateWindow(id, { visible: false })}
          >
            <p>Content of {id}</p>
          </DraggableWindow>
        ) : null
      )}
      <div className={styles.minimizedBar}>
      {Object.entries(windows)
       .filter(([, state]) => state.visible && state.minimized)
       .map(([id]) => (
         <button
          key={id}
          className={styles.minimizedButton}
          onClick={() => updateWindow(id, { minimized: false })}
       >
           {id.replace(/window/, 'Window ')}
         </button>
      ))}
</div>
    </div>
  );
};

export default MainView;
