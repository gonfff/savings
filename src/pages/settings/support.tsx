import { SettingsCard } from '@/components/settings-card';

export const SupportPage = () => {
  return (
    <div class="h-full space-y-4 overflow-y-auto">
      <SupportCard />
      <div></div> {/* Add this div to beautify end */}
    </div>
  );
};

const SupportCard = () => {
  const openLink = async () => {
    await open('https://gonfff.github.io');
  };

  return (
    <SettingsCard title="Creds & Support" description="">
      <div class="flex mt-auto my-4 justify-center items-center">
        <div class="btn btn-primary w-40" onClick={openLink}>
          Open creds page
        </div>
      </div>
    </SettingsCard>
  );
};
