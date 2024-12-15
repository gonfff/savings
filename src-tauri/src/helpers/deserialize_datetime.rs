use chrono::NaiveDate;
use chrono::Utc;

pub fn default_date_deserializer<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s: Option<&str> = serde::Deserialize::deserialize(deserializer)?;
    match s {
        Some(date_str) => NaiveDate::parse_from_str(date_str, "%d-%m-%Y")
            .or_else(|_| NaiveDate::parse_from_str(date_str, "%Y-%m-%dT%H:%M:%SZ"))
            .or_else(|_| NaiveDate::parse_from_str(date_str, "%Y-%m-%dT%H:%M:%S%.3fZ"))
            .map_err(serde::de::Error::custom),
        None => Ok(Utc::now().naive_utc().date()),
    }
}
