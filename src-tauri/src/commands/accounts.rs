use crate::commands::CommandsError;
use crate::models::accounts::{Account, AccountBalance, AccountFilters, AccountIn};
use crate::models::PaginatedResponse;
use crate::services::accounts::AccountsService;
use crate::state::AppState;
use tauri::command;

#[command]
pub async fn get_accounts(
    state: tauri::State<'_, AppState>,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<Account>, CommandsError> {
    let svc = AccountsService::new(&state);
    let accounts = svc.get_accounts(limit, offset).await?;
    Ok(PaginatedResponse {
        next: accounts.len() as i32 == limit,
        items: accounts,
    })
}

#[command]
pub async fn add_account(
    state: tauri::State<'_, AppState>,
    account: AccountIn,
) -> Result<(), CommandsError> {
    let svc = AccountsService::new(&state);
    svc.add_account(account).await.map_err(CommandsError::from)
}

#[command]
pub async fn update_account(
    state: tauri::State<'_, AppState>,
    id: i32,
    account: AccountIn,
) -> Result<(), CommandsError> {
    let svc = AccountsService::new(&state);
    svc.update_account(id, account)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn delete_account(
    state: tauri::State<'_, AppState>,
    id: i32,
) -> Result<(), CommandsError> {
    let svc = AccountsService::new(&state);
    svc.delete_account(id).await.map_err(CommandsError::from)
}

#[command]
pub async fn get_accounts_by(
    state: tauri::State<'_, AppState>,
    filters: AccountFilters,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<AccountBalance>, CommandsError> {
    let svc = AccountsService::new(&state);
    let accounts = svc.get_accounts_by(filters, limit, offset).await?;
    Ok(PaginatedResponse {
        next: accounts.len() as i32 == limit,
        items: accounts,
    })
}
