use crate::helpers::default_datetime_deserializer;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct ExchangeRateOut {
    id: u32,
    from_id: u32,
    from_code: String,
    to_id: u32,
    to_code: String,
    rate: f64,
    source: String,
    to_date: NaiveDateTime,
}

#[derive(Deserialize, Debug)]
pub struct ExchangeRateIn {
    pub from_id: u32,
    pub to_id: u32,
    pub rate: f64,
    #[serde(deserialize_with = "default_datetime_deserializer")]
    pub to_date: NaiveDateTime,
}

pub struct ExchangeRatesInsert {
    pub from_id: u32,
    pub to_id: u32,
    pub rate: f64,
    pub to_date: NaiveDateTime,
    pub source: String,
}

impl From<ExchangeRateIn> for ExchangeRatesInsert {
    fn from(source: ExchangeRateIn) -> Self {
        ExchangeRatesInsert {
            from_id: source.from_id,
            to_id: source.to_id,
            rate: source.rate,
            to_date: source.to_date,
            source: "MANUAL".to_string(),
        }
    }
}
