import { getThemeContext } from '@/components/contexts/theme';
import { DropdownSelect } from '@/components/inputs';
import { SettingsCard } from '@/components/settings-card';
import { saveThemeButton } from '@/core/themes';
import { inputDataTypes, inputType, inputValue } from '@/types/inputs';
import { availableThemes } from '@/types/themes';

export const AppearancePage = () => {
  return (
    <div class="h-full space-y-4 overflow-y-auto">
      <ThemeCard />
      <div></div> {/* Add this div to beautify end */}
    </div>
  );
};

const ThemeCard = () => {
  const { theme, setTheme } = getThemeContext();

  const themeList = async () => {
    return Object.values(availableThemes).map((theme) => ({
      id: 1,
      value: theme,
    }));
  };

  return (
    <SettingsCard
      title="Theme"
      description="Select theme. You should press 'save' button for saving between
            sessions."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveThemeButton(theme());
        }}
      >
        <DropdownSelect
          input={{
            type: inputType.DropdownSelect,
            key: 'theme',
            title: '',
            placeholder: '',
            required: true,
            dataType: inputDataTypes.String,
            fetchFunction: themeList,
            value: { id: 1, value: theme() },
            validationFunction: () => true,
          }}
          setter={(value: inputValue) => setTheme(value.value.toString())}
        />
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Save</button>
        </div>
      </form>
    </SettingsCard>
  );
};
