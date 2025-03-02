use crate::storage::db::Database;
use crate::AppError;
use std::path::PathBuf;

/// Core struct of application. Should be provided to all commands and services.
#[derive(Debug)]
pub struct AppState {
    pub db: Database,
}

impl AppState {
    pub async fn new(app_dir: PathBuf) -> Result<Self, AppError> {
        let db = Database::new(app_dir.clone())
            .await
            .map_err(|e| AppError::StateError(format!("Error while connect to DB: {}", e)))?;

        let state = Self { db };

        Ok(state)
    }
}
