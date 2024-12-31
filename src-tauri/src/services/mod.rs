pub mod assets;
pub mod exchannge_rates;
pub mod kv;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum ServiceError {
    #[error("Internal error: {0}")]
    Internal(String),

    #[error("Database error: {0}")]
    Database(#[from] crate::storage::DatabaseError),

    #[error("Deserialization error: {0}")]
    DeserializationError(String),

    #[error("Serialization error: {0}")]
    SerializationError(String),
}
