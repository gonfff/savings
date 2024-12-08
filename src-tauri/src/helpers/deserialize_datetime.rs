use chrono::{DateTime, Utc};
use serde::{de, Deserialize, Deserializer};

pub fn null_to_utc_dt<'de, D>(deserializer: D) -> Result<Option<DateTime<Utc>>, D::Error>
where
    D: Deserializer<'de>,
{
    let option: Option<String> = Option::deserialize(deserializer)?;

    match option {
        Some(s) => DateTime::parse_from_str(&s, "%+")
            .map(|dt| Some(dt.with_timezone(&Utc)))
            .map_err(de::Error::custom),
        None => Ok(Some(Utc::now())),
    }
}
