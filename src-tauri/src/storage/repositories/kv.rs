use sqlx::{Error, SqliteExecutor};

use crate::storage::DatabaseError;
pub struct KVRepository;

impl KVRepository {
    pub async fn get<'e>(
        executor: impl SqliteExecutor<'e>,
        key: &str,
    ) -> Result<String, DatabaseError> {
        let sql = "SELECT value FROM kv WHERE key = ?";
        let res = sqlx::query_as::<_, (String,)>(sql)
            .bind(key)
            .fetch_one(executor)
            .await;

        match res {
            Ok((value, )) => Ok(value),
            Err(Error::RowNotFound) => Err(DatabaseError::NotFound(key.to_string())),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn set<'e>(
        executor: impl SqliteExecutor<'e>,
        key: &str,
        value: &str,
    ) -> Result<(), DatabaseError> {
        let sql = "INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;";

        sqlx::query(sql)
            .bind(key)
            .bind(value)
            .execute(executor) // Используем &mut
            .await
            .map_err(|e| DatabaseError::Error(e.to_string()))?;
        Ok(())
    }
}
