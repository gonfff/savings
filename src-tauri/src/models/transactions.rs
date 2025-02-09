use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Debug)]
pub struct TransactionOut {
    id: u32,
    account_id: u32,
    #[serde(rename = "type")]
    #[sqlx(rename = "type")]
    type_: String,
    quantity: f64,
    unit_price: f64,
    description: Option<String>,
    dt: NaiveDateTime,
    created_at: NaiveDateTime,
}

#[derive(Deserialize, Debug)]
pub struct TransactionIn {
    pub account_id: u32,
    #[serde(rename = "type")]
    pub type_: String,
    pub quantity: f64,
    pub unit_price: f64,
    pub description: Option<String>,
    pub dt: NaiveDateTime,
}

pub struct TransactionInsert {
    pub account_id: u32,
    pub type_: String,
    pub quantity: f64,
    pub unit_price: f64,
    pub description: Option<String>,
    pub dt: NaiveDateTime,
}

impl From<TransactionIn> for TransactionInsert {
    fn from(source: TransactionIn) -> Self {
        TransactionInsert {
            account_id: source.account_id,
            type_: source.type_,
            quantity: source.quantity,
            unit_price: source.unit_price,
            description: source.description,
            dt: source.dt,
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct TransactionFilters {
    pub account_id: Option<i32>,
    pub location_id: Option<i32>,
}

impl TransactionFilters {
    pub fn add_sql_conditions_and_bindings(
        &self,
        conditions: &mut Vec<String>,
        bindings: &mut Vec<String>,
    ) {
        if let Some(account_id) = self.account_id {
            conditions.push("account_id = ?".to_string());
            bindings.push(account_id.to_string());
        }
        if let Some(location_id) = self.location_id {
            conditions.push("location_id = ?".to_string());
            bindings.push(location_id.to_string());
        }
    }
}
