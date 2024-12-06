use log::debug;
use tauri;
use tauri::Manager;
use tokio::task::block_in_place;

mod commands;
use commands::exchange_rates::get_exchange_rates;
mod services;
mod state;
mod storage;
pub mod models;

use crate::state::AppState;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Error while setup state: {0}")]
    StateError(String),
    #[error("Error while connect to DB: {0}")]
    DatabaseError(String),
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app: &mut tauri::App| {
            block_in_place(move || {
                let state = tauri::async_runtime::block_on(async { setup_savings_app(app).await });
                debug!("App state: {:?}", state);
                app.manage(state);
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_exchange_rates])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn setup_savings_app(app: &mut tauri::App) -> AppState {
    let app_data_dir = app.path().app_data_dir().unwrap();
    AppState::new(app_data_dir).await.unwrap()
}
