import { useCallback, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  direction?: 'right' | 'bottom';
};

function ResizablePanel({ children, isOpen, direction = 'right' }: Props) {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(() => Math.max(window.innerWidth / 3, 200));
  const [height, setHeight] = useState(() => window.innerHeight / 3);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      if (direction === 'right') {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 200 && newWidth <= (window.innerWidth * 70) / 100) {
          setWidth(newWidth);
        }
      } else if (direction === 'bottom') {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight >= 35 && newHeight <= window.innerHeight - 50) {
          setHeight(newHeight);
        }
      }
    },
    [isResizing, direction],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  if (direction === 'bottom') {
    return (
      <div className="relative flex w-full flex-col">
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute left-0 top-0 z-10 h-1 w-full cursor-row-resize transition-colors ${
            isResizing ? 'bg-blue-500' : 'hover:bg-gray-400'
          }`}
        />
        {/* Children */}
        <div style={{ height: `${height}px` }} className="w-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full">
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 z-10 h-full w-1 cursor-col-resize transition-colors ${
          isResizing ? 'bg-blue-500' : 'hover:bg-gray-400'
        }`}
      />
      {/* Children */}
      <div style={{ width: `${width}px` }} className="h-full">
        {children}
      </div>
    </div>
  );
}

export default ResizablePanel;
