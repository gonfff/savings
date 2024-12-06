use crate::utils::market_data::dto::Ticker;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ProviderError {
    #[error("Provider error: {0}")]
    ProviderError(String),
    #[error("Not found: {0}")]
    NotFound(String),
}

pub trait Provider {
    async fn search_ticker(&self, query: &str) -> Result<Vec<Ticker>, ProviderError>;
}
