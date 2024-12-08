use crate::helpers::deserialize_datetime::null_to_utc_dt;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct ExchangeRateOut {
    id: u32,
    source: String,
    target: String,
    rate: f64,
    dt: DateTime<Utc>,
}

#[derive(Deserialize, Debug)]
pub struct ExchangeRateIn {
    pub source: u32,
    pub target: u32,
    pub rate: f64,

    #[serde(deserialize_with = "null_to_utc_dt")]
    pub dt: Option<DateTime<Utc>>,
}
