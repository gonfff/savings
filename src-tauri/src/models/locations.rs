use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct LocationOut {
    id: u32,
    name: String,
    description: Option<String>,
    created_at: NaiveDateTime,
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
