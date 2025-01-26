use crate::models::exchange_rates::{ExchangeRateIn, ExchangeRateOut, ExchangeRatesInsert};
use crate::services::ServiceError;
use crate::state::AppState;
use crate::storage::repositories::exchange_rates::ExchangeRatesRepository;

pub struct ExchangeRatesService<'a> {
    app_state: &'a AppState,
}

impl<'a> ExchangeRatesService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        ExchangeRatesService { app_state }
    }

    pub async fn get_exchange_rates(
        &self,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<ExchangeRateOut>, ServiceError> {
        let exchange_rates =
            ExchangeRatesRepository::get_all(&self.app_state.db.pool, limit, offset).await?;
        Ok(exchange_rates)
    }

    pub async fn add_exchange_rate(&self, rate: ExchangeRateIn) -> Result<(), ServiceError> {
        let new_rate: ExchangeRatesInsert = rate.into();
        ExchangeRatesRepository::add(&self.app_state.db.pool, new_rate).await?;
        Ok(())
    }

    pub async fn update_exchange_rate(
        &self,
        id: i32,
        rate: ExchangeRateIn,
    ) -> Result<(), ServiceError> {
        ExchangeRatesRepository::update(&self.app_state.db.pool, id, rate).await?;
        Ok(())
    }

    pub async fn delete_exchange_rate(&self, id: i32) -> Result<(), ServiceError> {
        ExchangeRatesRepository::delete(&self.app_state.db.pool, id).await?;
        Ok(())
    }
}
