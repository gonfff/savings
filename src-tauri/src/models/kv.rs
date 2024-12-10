pub enum SettingKey {
    BaseCurrency,
    UseExternalApi,
}

impl SettingKey {
    pub fn as_str(&self) -> &str {
        match self {
            SettingKey::BaseCurrency => "base_currency",
            SettingKey::UseExternalApi => "use_external_api",
        }
    }
}
