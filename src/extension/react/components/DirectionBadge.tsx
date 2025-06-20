import { ArrowDown, ArrowUp, HelpCircle } from 'lucide-react';
import type { Direction } from '../../../types/shared';

type Props = {
  direction: Direction;
};
export default function DirectionBadge({ direction }: Props) {
  const baseClass =
    'flex items-center justify-center w-full px-2 py-0.5 rounded-sm text-xs font-medium border';

  const getBadgeConfig = (direction: Direction) => {
    switch (direction) {
      case 'renderer-to-main':
        return {
          colorClass: 'bg-blue-100 text-blue-800 border-blue-300',
          Icon: ArrowDown,
          label: 'RTM',
          tooltip: 'Renderer to Main',
        };
      case 'main-to-renderer':
        return {
          colorClass: 'bg-green-100 text-green-800 border-green-300',
          Icon: ArrowUp,
          label: 'MTR',
          tooltip: 'Main to Renderer',
        };
      default:
        return {
          colorClass: 'bg-gray-100 text-gray-800 border-gray-400',
          Icon: HelpCircle,
          label: 'Unknown',
          tooltip: 'Unknown direction',
        };
    }
  };

  const { colorClass, Icon, label, tooltip } = getBadgeConfig(direction);

  return (
    <span className={`${baseClass} ${colorClass}`} title={tooltip}>
      <Icon size={13} className="mr-1" />
      {label}
    </span>
  );
}
