use serde::{Deserialize, Serialize};
use sqlx::FromRow;

pub enum SettingKey {
    BaseCurrency,
    Theme,
    UseExternalApi,
}

impl SettingKey {
    pub fn as_str(&self) -> &str {
        match self {
            SettingKey::BaseCurrency => "base_currency",
            SettingKey::UseExternalApi => "use_external_api",
            SettingKey::Theme => "theme",
        }
    }
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct BaseCurrency {
    id: u32,
    value: String,
}
