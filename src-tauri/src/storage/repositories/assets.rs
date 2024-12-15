use crate::models::assets::AssetOut;
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};

pub struct AssetsRepository;

impl AssetsRepository {
    pub async fn get_all<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<AssetOut>, DatabaseError> {
        let sql = "
            SELECT
                id, \
                code, \
                type, \
                name, \
                created_at \
            FROM assets 
            ORDER BY id \
            LIMIT ? \
            OFFSET ?;";
        let res = sqlx::query_as::<_, AssetOut>(sql)
            .bind(limit)
            .bind(offset)
            .fetch_all(executor)
            .await;

        match res {
            Ok(value) => Ok(value),
            Err(Error::RowNotFound) => Ok(vec![]),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn search<'e>(
        executor: impl SqliteExecutor<'e>,
        query: &str,
    ) -> Result<Vec<AssetOut>, DatabaseError> {
        let sql = "
            SELECT
                id, \
                code, \
                type, \
                name, \
                created_at \
            FROM asset \
            WHERE code LIKE ? OR name LIKE ? \
            ORDER BY id \
            LIMIT 10;";
        let res = sqlx::query_as::<_, AssetOut>(sql)
            .bind(format!("%{}%", query))
            .bind(format!("%{}%", query))
            .fetch_all(executor)
            .await;

        match res {
            Ok(value) => Ok(value),
            Err(Error::RowNotFound) => Ok(vec![]),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }
}
