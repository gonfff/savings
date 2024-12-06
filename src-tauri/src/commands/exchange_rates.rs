use crate::commands::CommandsError;
use crate::models::{ExchangeRate, PaginatedResponse};
use crate::services::exchannge_rates::ExchangeRatesService;
use crate::state::AppState;
use tauri::command;

#[command]
pub async fn get_exchange_rates(
    state: tauri::State<'_, AppState>,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<ExchangeRate>, CommandsError> {
    let svc = ExchangeRatesService::new(&state);
    let exchange_rates = svc.get_exchange_rates(limit, offset).await;

    match exchange_rates {
        Ok(exchange_rates) => Ok(PaginatedResponse {
            next: exchange_rates.len() as i32 == limit,
            items: exchange_rates,
        }),
        Err(e) => Err(CommandsError::from(e)),
    }
}
