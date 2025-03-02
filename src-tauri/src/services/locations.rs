use crate::models::locations::{Location, LocationIn, LocationInsert, LocationOut};
use crate::services::ServiceError;
use crate::state::AppState;
use crate::storage::repositories::locations::LocationsRepository;

pub struct LocationsService<'a> {
    app_state: &'a AppState,
}

impl<'a> LocationsService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        LocationsService { app_state }
    }

    pub async fn get_locations_with_balance(
        &self,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<LocationOut>, ServiceError> {
        let locations =
            LocationsRepository::get_all_with_balance(&self.app_state.db.pool, limit, offset)
                .await?;
        Ok(locations)
    }

    pub async fn add_location(&self, location: LocationIn) -> Result<(), ServiceError> {
        let new_location: LocationInsert = location.into();
        LocationsRepository::add(&self.app_state.db.pool, new_location).await?;
        Ok(())
    }

    pub async fn update_location(&self, id: i32, location: LocationIn) -> Result<(), ServiceError> {
        LocationsRepository::update(&self.app_state.db.pool, id, location).await?;
        Ok(())
    }

    pub async fn delete_location(&self, id: i32) -> Result<(), ServiceError> {
        LocationsRepository::delete(&self.app_state.db.pool, id).await?;
        Ok(())
    }

    pub async fn search_locations(&self, query: &str) -> Result<Vec<Location>, ServiceError> {
        let assets = LocationsRepository::search(&self.app_state.db.pool, query).await?;
        Ok(assets)
    }
}
