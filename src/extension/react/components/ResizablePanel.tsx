import { useCallback, useEffect, useState } from 'react';

function ResizablePanel({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(500);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 200) {
        setWidth(newWidth);
      }
    },
    [isResizing]
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

  return (
    <div className="flex h-full">
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-1 cursor-col-resize transition-colors ${
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
