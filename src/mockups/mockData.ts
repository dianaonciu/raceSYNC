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

export const dropdownMocks: Dropdown[] = [
  {
    id: 'file',
    label: 'File',
    options: [
      { label: 'Load Layout', value: 'load_layout' },
      { label: 'Save Layout', value: 'save_layout' },
      { label: 'Save Layout as', value: 'save_layout_as' },
      { label: 'Export Layout to file', value: 'export_layout' },
      { label: 'Import Layout from file', value: 'import_layout' },
      { label: 'Preferences / Options', value: 'preferences' },
      { label: 'License', value: 'license' },
    ],
    onChange: (value: string) => {
      console.log('File menu action:', value);
    },
  },
  {
    id: 'tools',
    label: 'Tools',
    options: [
      { label: 'Analysis', value: 'analysis' },
      { label: 'Organization', value: 'organization' },
      { label: 'Endurance', value: 'endurance' },
      { label: 'Strategy', value: 'strategy' },
      { label: 'Timing & Race Control', value: 'timing_control' },
      { label: 'More…', value: 'more' },
    ],
    onChange: (value: string) => {
      console.log('Tools menu action:', value);
    },
  },
  {
    id: 'historical',
    label: 'Historical data',
    options: [
      { label: 'DTM', value: 'dtm' },
      { label: 'GTWC', value: 'gtwc' },
      { label: 'Championship 1', value: 'champ_1' },
      { label: 'Championship 2', value: 'champ_2' },
      { label: 'Championship 3', value: 'champ_3' },
      { label: 'Championship 4', value: 'champ_4' },
    ],
    onChange: (value: string) => {
      console.log('Historical data selected:', value);
    },
  },
];
