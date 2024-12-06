use crate::utils::market_data::base_provider::{Provider, ProviderError};
use crate::utils::market_data::dto::Ticker;
use yahoo_finance_api as yahoo;

pub struct YahooConnector;

impl Provider for YahooConnector {
    async fn search_ticker(&self, query: &str) -> Result<Vec<Ticker>, ProviderError> {
        let connector = yahoo::YahooConnector::new().unwrap();
        connector
            .search_ticker(query)
            .await
            .map_err(|e| ProviderError::ProviderError(e.to_string()))
            .and_then(|r| {
                if r.quotes.is_empty() {
                    Err(ProviderError::NotFound("No results found".to_string()))
                } else {
                    println!("{:?}", r.quotes);
                    Ok(r.quotes
                        .iter()
                        .map(|q| Ticker {
                            code: q.symbol.clone(),
                            name: q.long_name.clone(),
                        })
                        .collect())
                }
            })
    }
}
