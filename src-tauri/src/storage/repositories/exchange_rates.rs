use crate::models::exchange_rates::ExchangeRateIn;
use crate::models::ExchangeRateOut;
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};

pub struct ExchangeRatesRepository;

impl ExchangeRatesRepository {
    pub async fn get_all<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<ExchangeRateOut>, DatabaseError> {
        let sql = "
            SELECT
                er.id as id, \
                s.code as source, \
                t.code as target, \
                er.rate as rate, \
                er.dt as dt \
            FROM exchange_rate er \
            JOIN instrument s ON er.source = s.id \
            JOIN instrument t ON er.target = t.id \
            ORDER BY id \
            LIMIT ? \
            OFFSET ?;";
        // ORDER BY dt desc, source
        let res = sqlx::query_as::<_, ExchangeRateOut>(sql)
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
        rate: ExchangeRateIn,
    ) -> Result<(), DatabaseError> {
        let sql = "INSERT INTO exchange_rate (source, target, rate, dt) VALUES (?, ?, ?, ?);";
        let res = sqlx::query(sql)
            .bind(rate.source)
            .bind(rate.target)
            .bind(rate.rate)
            .bind(rate.dt)
            .execute(executor)
            .await;

        res.map_err(|e| DatabaseError::Error(e.to_string()))
            .map(|_| ())
    }

    pub async fn update<'e>(
        executor: impl SqliteExecutor<'e>,
        id: i32,
        rate: ExchangeRateIn,
    ) -> Result<(), DatabaseError> {
        let sql = "UPDATE exchange_rate SET source = ?, target = ?, rate = ?, dt = ? WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(rate.source)
            .bind(rate.target)
            .bind(rate.rate)
            .bind(rate.dt)
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
        let sql = "DELETE FROM exchange_rate WHERE id = ?;";
        let res = sqlx::query(sql).bind(id).execute(executor).await;

        match res {
            Ok(_) => Ok(()),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }
}
