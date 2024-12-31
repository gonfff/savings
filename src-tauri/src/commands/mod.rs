pub mod settings;
pub mod exchange_rates;
pub mod assets;

pub mod kv;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum CommandsError {
    #[error("Internal error: {0}")]
    Internal(String),

    #[error("Service error: {0}")]
    Service(#[from] crate::services::ServiceError),
}

impl serde::Serialize for CommandsError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}