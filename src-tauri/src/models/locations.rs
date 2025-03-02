use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct Location {
    pub id: u32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, FromRow, Debug)]
pub struct LocationOut {
    pub id: u32,
    pub name: String,
    pub description: Option<String>,
    pub base_asset_name: String,
    pub total_balance: f64, // total amount of assets in base currency
    pub created_at: NaiveDateTime,
}

#[derive(Deserialize, Debug)]
pub struct LocationIn {
    pub name: String,
    pub description: Option<String>,
}

pub struct LocationInsert {
    pub name: String,
    pub description: Option<String>,
}

impl From<LocationIn> for LocationInsert {
    fn from(source: LocationIn) -> Self {
        LocationInsert {
            name: source.name,
            description: source.description,
        }
    }
}
