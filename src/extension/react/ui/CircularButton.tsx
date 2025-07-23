// type
type Props = {
  children: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  active?: boolean;
};

function CircularButton({
  children,
  onClick,
  tooltip = '',
  disabled = false,
  active = false,
}: Props) {
  return (
    <button
      title={tooltip}
      disabled={disabled}
      className={`${active ? 'text-blue-500' : 'text-charcoal-200'} rounded-full p-1 ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:bg-gray-300 hover:dark:bg-charcoal-300'
      }`}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
}

export default CircularButton;
