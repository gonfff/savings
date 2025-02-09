use crate::models::assets::AssetOut;
use crate::models::assets::{AssetIn, AssetInsert};
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
            FROM assets \
            ORDER BY created_at DESC, id DESC \
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

    pub async fn add<'e>(
        executor: impl SqliteExecutor<'e>,
        asset: AssetInsert,
    ) -> Result<(), DatabaseError> {
        let sql = "\
            INSERT INTO assets (code, type, name)\
            VALUES (?, ?, ?);";
        let res = sqlx::query(sql)
            .bind(asset.code)
            .bind(asset.type_)
            .bind(asset.name)
            .execute(executor)
            .await;

        res.map_err(|e| DatabaseError::Error(e.to_string()))
            .map(|_| ())
    }

    pub async fn update<'e>(
        executor: impl SqliteExecutor<'e>,
        id: i32,
        asset: AssetIn,
    ) -> Result<(), DatabaseError> {
        let sql = "\
        UPDATE assets SET \
            code = ?, \
            type = ?, \
            name = ? \
        WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(asset.code)
            .bind(asset.type_)
            .bind(asset.name)
            .bind(id)
            .execute(executor)
            .await;

        match res {
            Ok(_) => Ok(()),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn delete<'e>(
        executor: impl SqliteExecutor<'e>,
        id: i32,
    ) -> Result<(), DatabaseError> {
        let sql = "DELETE FROM assets WHERE id = ?;";
        let res = sqlx::query(sql).bind(id).execute(executor).await;

        match res {
            Ok(_) => Ok(()),
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
            FROM assets \
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
