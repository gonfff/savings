use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct AssetOut {
    id: u32,
    code: String,
    #[serde(rename = "type")]
    #[sqlx(rename = "type")]
    type_: String,
    name: String,
    created_at: NaiveDateTime,
}

#[derive(Deserialize, Debug)]
pub struct AssetIn {
    pub code: String,
    #[serde(rename = "type")]
    pub type_: String,
    pub name: String,
}

pub struct AssetInsert {
    pub code: String,
    pub type_: String,
    pub name: String,
}

impl From<AssetIn> for AssetInsert {
    fn from(source: AssetIn) -> Self {
        AssetInsert {
            code: source.code,
            type_: source.type_,
            name: source.name,
        }
    }
}
