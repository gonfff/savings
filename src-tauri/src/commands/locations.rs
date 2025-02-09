use crate::commands::CommandsError;
use crate::models::locations::{LocationIn, LocationOut};
use crate::models::PaginatedResponse;
use crate::services::locations::LocationsService;
use crate::state::AppState;
use tauri::command;

#[command]
pub async fn get_locations(
    state: tauri::State<'_, AppState>,
    limit: i32,
    offset: i32,
) -> Result<PaginatedResponse<LocationOut>, CommandsError> {
    let svc = LocationsService::new(&state);
    let exchange_rates = svc.get_locations(limit, offset).await?;
    Ok(PaginatedResponse {
        next: exchange_rates.len() as i32 == limit,
        items: exchange_rates,
    })
}

#[command]
pub async fn add_location(
    state: tauri::State<'_, AppState>,
    location: LocationIn,
) -> Result<(), CommandsError> {
    let svc = LocationsService::new(&state);
    svc.add_location(location)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn update_location(
    state: tauri::State<'_, AppState>,
    id: i32,
    location: LocationIn,
) -> Result<(), CommandsError> {
    let svc = LocationsService::new(&state);
    svc.update_location(id, location)
        .await
        .map_err(CommandsError::from)
}

#[command]
pub async fn delete_location(
    state: tauri::State<'_, AppState>,
    id: i32,
) -> Result<(), CommandsError> {
    let svc = LocationsService::new(&state);
    svc.delete_location(id)
        .await
        .map_err(CommandsError::from)
}


#[command]
pub async fn search_locations(
    state: tauri::State<'_, AppState>,
    query: String,
) -> Result<Vec<LocationOut>, CommandsError> {
    let svc = LocationsService::new(&state);
    let locations = svc.search_locations(&query).await?;
    Ok(locations)
}
