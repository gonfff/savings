use crate::commands::CommandsError;
use crate::models::transactions::{TransactionFilters, TransactionIn, TransactionOut};
use crate::models::PaginatedResponse;
use crate::services::transactions::TransactionsService;
use crate::state::AppState;
use tauri::command;

#[command]
pub async fn add_transaction(
    state: tauri::State<'_, AppState>,
    transaction: TransactionIn,
) -> Result<(), CommandsError> {
    let svc = TransactionsService::new(&state);
    svc.add_transaction(transaction)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn update_transaction(
    state: tauri::State<'_, AppState>,
    id: i32,
    transaction: TransactionIn,
) -> Result<(), CommandsError> {
    let svc = TransactionsService::new(&state);
    svc.update_transaction(id, transaction)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn delete_transaction(
    state: tauri::State<'_, AppState>,
    id: i32,
) -> Result<(), CommandsError> {
    let svc = TransactionsService::new(&state);
    svc.delete_transaction(id)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn get_transactions_by(
    state: tauri::State<'_, AppState>,
    filters: TransactionFilters,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<TransactionOut>, CommandsError> {
    let svc = TransactionsService::new(&state);
    let transactions = svc.get_transactions(filters, limit, offset).await?;
    Ok(PaginatedResponse {
        next: transactions.len() as i32 == limit,
        items: transactions,
    })
}
