use crate::models::locations::{LocationIn, LocationInsert, LocationOut};
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};

pub struct LocationsRepository;

impl LocationsRepository {
    pub async fn get_all<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<LocationOut>, DatabaseError> {
        let sql = "
            SELECT
                id, \
                name, \
                description, \
                created_at \
            FROM location \
            ORDER BY name \
            LIMIT ? \
            OFFSET ?;";
        let res = sqlx::query_as::<_, LocationOut>(sql)
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
        location: LocationInsert,
    ) -> Result<(), DatabaseError> {
        let sql = "\
            INSERT INTO location (name, description)\
            VALUES (?, ?);";
        let res = sqlx::query(sql)
            .bind(location.name)
            .bind(location.description)
            .execute(executor)
            .await;

        res.map_err(|e| DatabaseError::Error(e.to_string()))
            .map(|_| ())
    }

    pub async fn update<'e>(
        executor: impl SqliteExecutor<'e>,
        id: i32,
        location: LocationIn,
    ) -> Result<(), DatabaseError> {
        let sql = "\
        UPDATE location SET \
            name = ?, \
            description = ? \
        WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(location.name)
            .bind(location.description)
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
        let sql = "DELETE FROM location WHERE id = ?;";
        let res = sqlx::query(sql).bind(id).execute(executor).await;

        match res {
            Ok(_) => Ok(()),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn search<'e>(
        executor: impl SqliteExecutor<'e>,
        query: &str,
    ) -> Result<Vec<LocationOut>, DatabaseError> {
        let sql = "
            SELECT
                id, \
                name, \
                description, \
                created_at \
            FROM location \
            WHERE name LIKE ? \
            ORDER BY id \
            LIMIT 10;";
        let res = sqlx::query_as::<_, LocationOut>(sql)
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
