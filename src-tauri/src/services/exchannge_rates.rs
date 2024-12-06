use crate::models::ExchangeRate;
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
    ) -> Result<Vec<ExchangeRate>, ServiceError> {
        let exchange_rates =
            ExchangeRatesRepository::get_all(&self.app_state.db.pool, limit, offset).await?;
        Ok(exchange_rates)
    }
}
