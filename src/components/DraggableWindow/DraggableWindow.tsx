import React, { useState, useRef, useEffect } from 'react';
import styles from './DraggableWindow.module.scss';

export type WindowState = {
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  maximized: boolean;
};

type DraggableWindowProps = {
  id: string;
  title: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  minimized?: boolean;
  maximized?: boolean;
  zIndex?: number;
  children?: React.ReactNode;
  onFocus: () => void;
  onUpdate: (state: Partial<WindowState>) => void;
  onClose: () => void;
};

const DraggableWindow = ({
  id,
  title,
  initialPosition,
  initialSize,
  minimized = false,
  maximized = false,
  zIndex = 10,
  children,
  onFocus,
  onUpdate,
  onClose,
}: DraggableWindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(null);
  const [startPosition, setStartPosition] = useState(position);
  const [startSize, setStartSize] = useState(size);
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number } | null>(null);
  const [prevSize, setPrevSize] = useState<{ width: number; height: number } | null>(null);
  const baseWindowSize = useRef({ width: window.innerWidth, height: window.innerHeight });
  const baseComponent = useRef({ position, size });

  useEffect(() => {
   baseComponent.current = { position, size };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    const handleResize = () => {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;

        const widthRatio = currentWidth / baseWindowSize.current.width;
        const heightRatio = currentHeight / baseWindowSize.current.height;

        const newX = baseComponent.current.position.x * widthRatio;
        const newY = baseComponent.current.position.y * heightRatio;

        const newWidth = baseComponent.current.size.width * widthRatio;
        const newHeight = baseComponent.current.size.height * heightRatio;

        setPosition({ x: newX, y: newY });
        setSize({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    
  }, []);



  const onMouseDownDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    setMouseStart({ x: e.clientX, y: e.clientY });
    setStartPosition(position);
  };

  const onTouchStartDrag = (e: React.TouchEvent) => {
  e.preventDefault();
  onFocus();
  setIsDragging(true);
  const touch = e.touches[0];
  setMouseStart({ x: touch.clientX, y: touch.clientY });
  setStartPosition(position);
};


  const onMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    setMouseStart({ x: e.clientX, y: e.clientY });
    setStartSize(size);
  };

  const onTouchStartResize = (e: React.TouchEvent) => {
  e.preventDefault();
  e.stopPropagation();
  onFocus();
  setIsResizing(true);
  const touch = e.touches[0];
  setMouseStart({ x: touch.clientX, y: touch.clientY });
  setStartSize(size);
};


  const onMouseMove = (e: MouseEvent) => {
    if (isDragging && mouseStart) {
      const dx = e.clientX - mouseStart.x;
      const dy = e.clientY - mouseStart.y;
      const newPos = {
        x: Math.max(startPosition.x + dx, 0),
        y: Math.max(startPosition.y + dy, 0),
      };
      setPosition(newPos);
    } else if (isResizing && mouseStart) {
      const dx = e.clientX - mouseStart.x;
      const dy = e.clientY - mouseStart.y;
      const newSize = {
        width: Math.max(startSize.width + dx, 150),
        height: Math.max(startSize.height + dy, 100),
      };
      setSize(newSize);
    }
  };

  const onMouseUp = () => {
    if (isDragging) {
      onUpdate({ position });
    }
    if (isResizing) {
      onUpdate({ size });
    }
    setIsDragging(false);
    setIsResizing(false);
    setMouseStart(null);
  };

   const handleTouchMove = (e: TouchEvent) => {
    if (!mouseStart) return;
    const touch = e.touches[0];

    if (isDragging) {
      const dx = touch.clientX - mouseStart.x;
      const dy = touch.clientY - mouseStart.y;
      const newPos = {
        x: Math.max(startPosition.x + dx, 0),
        y: Math.max(startPosition.y + dy, 0),
      };
      setPosition(newPos);
    } else if (isResizing) {
      const dx = touch.clientX - mouseStart.x;
      const dy = touch.clientY - mouseStart.y;
      const newSize = {
        width: Math.max(startSize.width + dx, 150),
        height: Math.max(startSize.height + dy, 100),
      };
      setSize(newSize);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onUpdate({ position });
    }
    if (isResizing) {
      onUpdate({ size });
    }
    setIsDragging(false);
    setIsResizing(false);
    setMouseStart(null);
  };

  useEffect(() => {
   if (isDragging || isResizing) {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  }

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };
  }, [isDragging, isResizing, mouseStart, position, size]);   // eslint-disable-line react-hooks/exhaustive-deps

  const handleMinimize = () => {
    onUpdate({ minimized: true });
  };

  const handleMaximize = () => {
  if (maximized) {
    // restore position & size from saved prev values or initial as fallback
    onUpdate({ maximized: false });
    if (prevPosition && prevSize) {
      setPosition(prevPosition);
      setSize(prevSize);
    } else {
      setPosition(initialPosition);
      setSize(initialSize);
    }
  } else {
    // save current pos & size before maximizing
    setPrevPosition(position);
    setPrevSize(size);

    onUpdate({ maximized: true, minimized: false });
    setPosition({ x: 0, y: 0 });
    setSize({
      width: window.innerWidth,
      height: window.innerHeight - 10 * (window.innerHeight / 100), // adjust for header + taskbar
    });
  }
};

const handleRestore = () => {
  onUpdate({ minimized: false, maximized: false });
  if (prevPosition && prevSize) {
    setPosition(prevPosition);
    setSize(prevSize);
  } else {
    setPosition(initialPosition);
    setSize(initialSize);
  }
};

  const style = maximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 10vh)',
        position: 'fixed' as const,
        zIndex,
      }
    : {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        position: 'absolute' as const,
        zIndex,
        display: minimized ? 'none' : 'flex',
      };

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={style}
      onMouseDown={onFocus}
      data-id={id}
      tabIndex={0}
      aria-label={title}
    >
      <div className={styles.titleBar} onMouseDown={onMouseDownDrag}  onTouchStart={onTouchStartDrag}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          {minimized ? (
            <button className={styles.controlBtn} onClick={handleRestore} title="Restore">
              ;
            </button>
          ) : (
            <>
              <button className={styles.controlBtn} onClick={handleMinimize} title="Minimize">
                &#8211;
              </button>
              <button className={styles.controlBtn} onClick={handleMaximize} title={maximized ? 'Restore' : 'Maximize'}>
                {maximized ? '' : ''}
              </button>
              <button className={styles.controlBtn} onClick={onClose} title="Close">
                &#10005;
              </button>
            </>
          )}
        </div>
      </div>
      {!minimized && <div className={styles.content}>{children}</div>}
      {!maximized && !minimized && <div className={styles.resizeHandle} onMouseDown={onMouseDownResize} onTouchStart={onTouchStartResize} />}
    </div>
  );
};

export default DraggableWindow;
