use crate::models::locations::{Location, LocationIn, LocationInsert, LocationOut};
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};

pub struct LocationsRepository;

impl LocationsRepository {
    pub async fn get_all_with_balance<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<LocationOut>, DatabaseError> {
        let sql = "
            SELECT
                l.id                                                                   as id,
                l.name                                                                 as name,
                l.description                                                          as description,
                l.created_at                                                           as created_at,
                json_extract(kv.value, '$.value')                                      as base_asset_name,
                ((SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE 0 END) -
                    SUM(CASE WHEN t.type = 'SELL' THEN t.quantity ELSE 0 END))) * e.rate as total_balance
            FROM locations l
                    JOIN accounts a ON a.location_id = l.id
                    JOIN transactions t ON t.account_id = a.id
                    JOIN assets s ON s.id = a.asset_id
                    JOIN kv ON kv.key = 'base_currency'
                    JOIN exchange_rates e ON e.asset_from_id = s.id
                AND e.asset_to_id = json_extract(kv.value, '$.id')
                AND e.to_date = (SELECT MAX(e2.to_date)
                                FROM exchange_rates e2
                                WHERE e2.asset_from_id = s.id
                                AND e2.asset_to_id = json_extract(kv.value, '$.id'))
            GROUP BY l.id,
                    l.name,
                    l.description,
                    l.created_at
            ORDER BY l.id
";
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
            INSERT INTO locations (name, description)\
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
        UPDATE locations SET \
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
        let sql = "DELETE FROM locations WHERE id = ?;";
        let res = sqlx::query(sql).bind(id).execute(executor).await;

        match res {
            Ok(_) => Ok(()),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn search<'e>(
        executor: impl SqliteExecutor<'e>,
        query: &str,
    ) -> Result<Vec<Location>, DatabaseError> {
        let sql = "
            SELECT
                id, \
                name, \
                description, \
                created_at \
            FROM locations \
            WHERE name LIKE ? \
            ORDER BY id \
            LIMIT 10;";
        let res = sqlx::query_as::<_, Location>(sql)
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
