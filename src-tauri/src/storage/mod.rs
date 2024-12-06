pub mod db;
pub mod repositories;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("Error: {0}")]
    Error(String),
    #[error("Not Found: {0}")]
    NotFound(String),
}
