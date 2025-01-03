use crate::commands::CommandsError;
use crate::models::assets::AssetOut;
use crate::models::PaginatedResponse;

use crate::models::assets::AssetIn;
use crate::services::assets::AssetsService;
use crate::state::AppState;
use tauri::command;

#[command]
pub async fn get_assets(
    state: tauri::State<'_, AppState>,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<AssetOut>, CommandsError> {
    let svc = AssetsService::new(&state);
    let assets = svc.get_assets(limit, offset).await?;
    Ok(PaginatedResponse {
        next: assets.len() as i32 == limit,
        items: assets,
    })
}

#[command]
pub async fn add_asset(
    state: tauri::State<'_, AppState>,
    asset: AssetIn,
) -> Result<(), CommandsError> {
    let svc = AssetsService::new(&state);
    svc.add_asset(asset).await.map_err(CommandsError::from)
}

#[command]
pub async fn update_asset(
    state: tauri::State<'_, AppState>,
    id: i32,
    asset: AssetIn,
) -> Result<(), CommandsError> {
    let svc = AssetsService::new(&state);
    svc.update_asset(id, asset)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn delete_asset(state: tauri::State<'_, AppState>, id: i32) -> Result<(), CommandsError> {
    let svc = AssetsService::new(&state);
    svc.delete_asset(id).await.map_err(CommandsError::from)
}

#[command]
pub async fn search_assets(
    state: tauri::State<'_, AppState>,
    query: String,
) -> Result<Vec<AssetOut>, CommandsError> {
    let svc = AssetsService::new(&state);
    let assets = svc.search_assets(&query).await?;
    Ok(assets)
}
