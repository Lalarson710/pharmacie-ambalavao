import './ToggleSwitch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <label className="toggle-switch" aria-label={ariaLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      <span className="toggle-switch-inner">
        <span className="toggle-switch-switch" />
      </span>
    </label>
  );
}