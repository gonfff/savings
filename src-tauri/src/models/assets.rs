use chrono::{DateTime, NaiveDateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct AssetOut {
    id: u32,
    code: String,
    #[serde(rename = "type")]
    #[sqlx(rename = "type")]
    type_: String,
    name: String,
    created_at: DateTime<Utc>,
}
// TODO
// #[derive(Deserialize, Debug)]
// pub struct AssetIn {
//     pub source: u32,
//     pub target: u32,
//     pub rate: f64,
// }
