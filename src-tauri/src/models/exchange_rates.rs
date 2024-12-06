use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct ExchangeRate {
    id: u32,
    source: String,
    target: String,
    rate: f64,
    dt: DateTime<Utc>,
}
