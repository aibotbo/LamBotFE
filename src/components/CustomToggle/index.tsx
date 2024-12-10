import CustomSwitch from 'components/CustomSwitch';
import { FC } from 'react';

interface CustomToggleProps {
  className?: string;
  content: string;
  checked: boolean;
  onChange: () => void;
}

const CustomToggle: FC<CustomToggleProps> = ({
  className = '',
  content,
  checked,
  onChange,
}) => {
  return (
    <div
      className={`p-3 flex items-center gap-2 bg-primary-10 rounded-xl ${className}`}
    >
      <p className="text-ink-100">{content}</p>
      <CustomSwitch checked={checked} onChange={onChange} />
    </div>
  );
};

export default CustomToggle;
