import styles from './Taskbar.module.scss';

type DropdownOption = {
  label: string;
  value: string;
};

type Dropdown = {
  id: string;
  label: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
};

type TaskbarProps = {
  dropdowns: Dropdown[];
};

const Taskbar = ({ dropdowns }: TaskbarProps) => {
  return (
    <div className={styles.taskbar}>
      {dropdowns.map((dropdown) => (
        <select
          key={dropdown.id}
          id={dropdown.id}
          className={styles.dropdown}
          onChange={(e) => dropdown.onChange(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled hidden>
            {dropdown.label}
          </option>
          {dropdown.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

export default Taskbar;
