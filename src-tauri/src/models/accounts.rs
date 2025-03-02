use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct Account {
    id: u32,
    name: Option<String>,
    location_id: u32,
    location_name: String,
    asset_id: u32,
    description: Option<String>,
    asset_name: String,
    asset_code: String,
    created_at: NaiveDateTime,
}

#[derive(Serialize, FromRow, Debug)]
pub struct AccountBalance {
    #[serde(flatten)]
    #[sqlx(flatten)]
    account: Account,
    balance: f64,
}

#[derive(Deserialize, Debug)]
pub struct AccountIn {
    pub location_id: u32,
    pub asset_id: u32,
    pub name: Option<String>,
    pub description: Option<String>,
}

pub struct AccountInsert {
    pub location_id: u32,
    pub asset_id: u32,
    pub name: Option<String>,
    pub description: Option<String>,
}

impl From<AccountIn> for AccountInsert {
    fn from(source: AccountIn) -> Self {
        AccountInsert {
            location_id: source.location_id,
            asset_id: source.asset_id,
            name: source.name,
            description: source.description,
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct AccountFilters {
    pub location_id: Option<i32>,
    pub asset_id: Option<i32>,
    pub id: Option<i32>,
}

impl AccountFilters {
    pub fn add_sql_conditions_and_bindings(
        &self,
        conditions: &mut Vec<String>,
        bindings: &mut Vec<String>,
    ) {
        if let Some(location_id) = self.location_id {
            conditions.push("a.location_id = ?".to_string());
            bindings.push(location_id.to_string());
        }
        if let Some(asset_id) = self.asset_id {
            conditions.push("a.asset_id = ?".to_string());
            bindings.push(asset_id.to_string());
        }
        if let Some(id) = self.id {
            conditions.push("a.id = ?".to_string());
            bindings.push(id.to_string());
        }
    }
}
