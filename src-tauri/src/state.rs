use log::debug;
use sqlx::sqlite::SqlitePool;
use tokio::sync::RwLock;

use crate::models::kv::SettingKey;
use crate::storage::db::Database;
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
        // TODO think about it, maybe it should be removed
        let db = Database::new(app_dir.clone())
            .await
            .map_err(|e| AppError::StateError(format!("Error while connect to DB: {}", e)))?;

        let pool = &db.pool.clone();
        let state = Self {
            db,
            app_dir,
            base_currency: Self::get_base_currency(pool).await?,
            use_external_api: Self::get_use_external_api(pool).await?,
        };

        Ok(state)
    }

    /// Set base currency to state from DB or default value
    async fn get_base_currency(db: &SqlitePool) -> Result<RwLock<String>, AppError> {
        let base_currency = KVRepository::get(db, SettingKey::BaseCurrency.as_str())
            .await
            .map_or_else(|_| "USD".to_string(), |v| v);
        Ok(RwLock::new(base_currency))
    }

    /// Set use external API to state from DB or default value
    async fn get_use_external_api(db: &SqlitePool) -> Result<AtomicBool, AppError> {
        let use_external_api = KVRepository::get(db, SettingKey::UseExternalApi.as_str())
            .await
            .map_or_else(|_| false, |v| v.parse().unwrap_or(false));
        let atomic_bool = AtomicBool::new(use_external_api);
        Ok(atomic_bool)
    }
}
