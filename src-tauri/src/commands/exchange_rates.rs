use crate::commands::CommandsError;
use crate::models::exchange_rates::{ExchangeRateIn, ExchangeRateOut};
use crate::models::PaginatedResponse;
use crate::services::exchannge_rates::ExchangeRatesService;
use crate::state::AppState;
use tauri::command;

#[command]
pub async fn get_exchange_rates(
    state: tauri::State<'_, AppState>,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<ExchangeRateOut>, CommandsError> {
    let svc = ExchangeRatesService::new(&state);
    let exchange_rates = svc.get_exchange_rates(limit, offset).await?;
    Ok(PaginatedResponse {
        next: exchange_rates.len() as i32 == limit,
        items: exchange_rates,
    })
}

#[command]
pub async fn add_exchange_rate(
    state: tauri::State<'_, AppState>,
    rate: ExchangeRateIn,
) -> Result<(), CommandsError> {
    let svc = ExchangeRatesService::new(&state);
    svc.add_exchange_rate(rate)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn update_exchange_rate(
    state: tauri::State<'_, AppState>,
    id: i32,
    rate: ExchangeRateIn,
) -> Result<(), CommandsError> {
    let svc = ExchangeRatesService::new(&state);
    svc.update_exchange_rate(id, rate)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn delete_exchange_rate(
    state: tauri::State<'_, AppState>,
    id: i32,
) -> Result<(), CommandsError> {
    let svc = ExchangeRatesService::new(&state);
    svc.delete_exchange_rate(id)
        .await
        .map_err(CommandsError::from)
}
