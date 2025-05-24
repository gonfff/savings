use serde::{Deserialize, Serialize};
use sqlx::FromRow;

pub enum PeriodEnum {
    Day,
    Week,
    Month,
    Year,
}

impl PeriodEnum {
    pub fn as_str(&self) -> &str {
        match self {
            PeriodEnum::Day => "1w",
            PeriodEnum::Week => "1m",
            PeriodEnum::Month => "1y",
            PeriodEnum::Year => "All",
        }
    }
}

pub struct ChartFilters {
    pub location_id: Option<i32>,
    pub account_id: Option<i32>,
    pub period: PeriodEnum,
}
