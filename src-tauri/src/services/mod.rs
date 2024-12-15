pub mod kv;
pub mod exchannge_rates;
pub mod assets;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum ServiceError {
    #[error("Internal error: {0}")]
    Internal(String),

    #[error("Database error: {0}")]
    Database(#[from] crate::storage::DatabaseError),
}