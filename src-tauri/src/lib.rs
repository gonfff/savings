use std::fs;

use log::debug;
use tauri;
use tauri::Manager;
use tokio::task::block_in_place;

mod commands;
use commands::accounts::{
    add_account, delete_account, get_accounts, get_accounts_by, update_account,
};
use commands::assets::{add_asset, delete_asset, get_assets, search_assets, update_asset};
use commands::exchange_rates::{
    add_exchange_rate, delete_exchange_rate, get_exchange_rates, update_exchange_rate,
};
use commands::kv::{get_base_currency, get_theme, set_base_currency, set_theme};
use commands::locations::{
    add_location, delete_location, get_locations, search_locations, update_location,
};
mod helpers;
mod models;
mod services;
mod state;
mod storage;

use crate::commands::kv::get_env;
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
        .invoke_handler(tauri::generate_handler![
            // exchange rates
            get_exchange_rates,
            add_exchange_rate,
            update_exchange_rate,
            delete_exchange_rate,
            // assets
            get_assets,
            add_asset,
            update_asset,
            delete_asset,
            search_assets,
            // settings
            get_base_currency,
            set_base_currency,
            get_theme,
            set_theme,
            get_env,
            // locations
            get_locations,
            add_location,
            update_location,
            delete_location,
            search_locations,
            // accounts
            get_accounts,
            add_account,
            update_account,
            delete_account,
            get_accounts_by,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn setup_savings_app(app: &mut tauri::App) -> AppState {
    let app_data_dir = app.path().app_data_dir().unwrap();
    // Ensure the directory exists
    fs::create_dir_all(app_data_dir.clone()).unwrap();

    AppState::new(app_data_dir).await.unwrap()
}
