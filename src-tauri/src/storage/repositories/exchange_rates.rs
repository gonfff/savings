use crate::models::exchange_rates::{ExchangeRateIn, ExchangeRateOut, ExchangeRatesInsert};
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
                er.asset_from_id as from_id, \
                f.code as from_code, \
                er.asset_to_id as to_id, \
                t.code as to_code, \
                er.rate as rate, \
                er.source as source,
                er.to_date as to_date \
            FROM exchange_rate er \
            JOIN asset f ON er.asset_from_id = f.id \
            JOIN asset t ON er.asset_to_id = t.id \
            ORDER BY to_date DESC, id DESC \
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
        rate: ExchangeRatesInsert,
    ) -> Result<(), DatabaseError> {
        let sql = "\
            INSERT INTO exchange_rate (asset_from_id, asset_to_id, rate, to_date, source)\
            VALUES (?, ?, ?, ?, ?);";
        let res = sqlx::query(sql)
            .bind(rate.from_id)
            .bind(rate.to_id)
            .bind(rate.rate)
            .bind(rate.to_date)
            .bind(rate.source)
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
        let sql = "\
        UPDATE exchange_rate SET \
            asset_from_id = ?, \
            asset_to_id = ?, \
            rate = ?, \
            to_date = ? \
        WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(rate.from_id)
            .bind(rate.to_id)
            .bind(rate.rate)
            .bind(rate.to_date)
            .bind(id)
            .execute(executor)
            .await;
        println!("update res: {:?}", res);
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
