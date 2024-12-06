use log::debug;
use tokio::sync::RwLock;

use crate::storage::db::Database;
use crate::models::kv::Key;
use crate::storage::repositories::kv::KVRepository;
use crate::AppError;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};

/// Core struct of application. Should be provided to all commands and services.
#[derive(Debug)]
pub struct AppState {
    pub db: Database,
    pub base_currency: RwLock<String>,
    pub use_external_api: AtomicBool,
    pub app_dir: PathBuf,
}

impl AppState {
    pub async fn new(app_dir: PathBuf) -> Result<Self, AppError> {
        let db = Database::new(app_dir.clone())
            .await
            .map_err(|e| AppError::StateError(format!("Error while connect to DB: {}", e)))?;

        let state = Self {
            db,
            app_dir,
            base_currency: "USD".to_string().into(),
            use_external_api: AtomicBool::new(false),
        };

        debug!("App dir: {:?}", state.app_dir); // pass dead code
        state.get_settings().await?;

        Ok(state)
    }

    async fn get_settings(&self) -> Result<(), AppError> {
        // Set base currency to state from DB or default value
        let base_currency = KVRepository::get(&self.db.pool, Key::BaseCurrency.as_str())
            .await
            .map_or_else(|_| "USD".to_string(), |v| v);
        *self.base_currency.write().await = base_currency;

        // Set use external API to state from DB or default value
        let use_external_api = KVRepository::get(&self.db.pool, Key::UseExternalApi.as_str())
            .await
            .map_or_else(|_| false, |v| v.parse().unwrap_or(false));
        self.use_external_api
            .store(use_external_api, Ordering::Relaxed);
        Ok(())
    }
}
