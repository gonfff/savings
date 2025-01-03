use crate::models::assets::{AssetIn, AssetInsert, AssetOut};
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

    pub async fn add_asset(&self, asset: AssetIn) -> Result<(), ServiceError> {
        let new_asset: AssetInsert = asset.into();
        AssetsRepository::add(&self.app_state.db.pool, new_asset).await?;
        Ok(())
    }

    pub async fn update_asset(&self, id: i32, asset: AssetIn) -> Result<(), ServiceError> {
        AssetsRepository::update(&self.app_state.db.pool, id, asset).await?;
        Ok(())
    }

    pub async fn delete_asset(&self, id: i32) -> Result<(), ServiceError> {
        AssetsRepository::delete(&self.app_state.db.pool, id).await?;
        Ok(())
    }

    pub async fn search_assets(&self, query: &str) -> Result<Vec<AssetOut>, ServiceError> {
        let assets = AssetsRepository::search(&self.app_state.db.pool, query).await?;
        Ok(assets)
    }
}
