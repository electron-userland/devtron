import { ArrowDown, ArrowUp, HelpCircle } from 'lucide-react';

export default function DirectionBadge({ direction }) {
  const isRTM = direction === 'renderer-to-main';
  const isMTR = direction === 'main-to-renderer';

  const baseClass =
    'flex items-center justify-center w-full px-2 py-0.5 rounded-sm text-xs font-medium border';

  let colorClass, Icon, label, tooltip;

  if (isRTM) {
    colorClass = 'bg-blue-100 text-blue-800 border-blue-300';
    Icon = ArrowDown;
    label = 'RTM';
    tooltip = 'Renderer to Main';
  } else if (isMTR) {
    colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-400';
    Icon = ArrowUp;
    label = 'MTR';
    tooltip = 'Main to Renderer';
  } else {
    colorClass = 'bg-gray-100 text-gray-800 border border-gray-400';
    Icon = HelpCircle;
    label = 'Unknown';
    tooltip = 'Unknown direction';
  }

  return (
    <span className={`${baseClass} ${colorClass}`} title={tooltip}>
      <Icon size={13} className="mr-1" />
      {label}
    </span>
  );
}
