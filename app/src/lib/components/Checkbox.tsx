type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const Checkbox = (props: CheckboxProps) => {
  const { checked, onChange, disabled = false } = props;

  return (
    <label
      className={`checkbox ${checked ? "checkbox--completed" : ""} ${
        disabled ? "checkbox--disabled" : ""
      }`}
    >
      <input
        className="checkbox__input"
        type="checkbox"
        aria-label={
          checked ? "Označit jako nedokončený" : "Označit jako dokončený"
        }
        aria-checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        checked={checked}
        disabled={disabled}
      />
      <span className="checkbox__icon">{checked ? "✓" : ""}</span>
    </label>
  );
};
