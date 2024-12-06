pub enum Key {
    BaseCurrency,
    UseExternalApi,
}

impl Key {
    pub fn as_str(&self) -> &str {
        match self {
            Key::BaseCurrency => "base_currency",
            Key::UseExternalApi => "use_external_api",
        }
    }
}
