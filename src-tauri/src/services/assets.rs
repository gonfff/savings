use crate::models::assets::AssetOut;
use crate::services::ServiceError;
use crate::state::AppState;
use crate::storage::repositories::assets::AssetsRepository;

pub struct AssetsService<'a> {
    app_state: &'a AppState,
}

impl<'a> AssetsService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        AssetsService { app_state }
    }

    pub async fn get_assets(&self, limit: i32, offset: i32) -> Result<Vec<AssetOut>, ServiceError> {
        let assets = AssetsRepository::get_all(&self.app_state.db.pool, limit, offset).await?;
        Ok(assets)
    }

    pub async fn search_assets(&self, query: &str) -> Result<Vec<AssetOut>, ServiceError> {
        let assets = AssetsRepository::search(&self.app_state.db.pool, query).await?;
        Ok(assets)
    }
}
