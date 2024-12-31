use crate::commands::CommandsError;
use crate::models::kv::{BaseCurrency, SettingKey};
use crate::services::kv::KVService;
use crate::state::AppState;
use serde::de::value;
use tauri::command;

#[command]
pub async fn get_base_currency(
    state: tauri::State<'_, AppState>,
) -> Result<BaseCurrency, CommandsError> {
    let svc = KVService::new(&state);
    let base_currency: BaseCurrency = svc.get_key(SettingKey::BaseCurrency.as_str()).await?;
    Ok(base_currency)
}

#[command]
pub async fn set_base_currency(
    state: tauri::State<'_, AppState>,
    value: BaseCurrency,
) -> Result<(), CommandsError> {
    let svc = KVService::new(&state);
    svc.set_key(SettingKey::BaseCurrency.as_str(), &value)
        .await?;
    Ok(())
}
