use crate::models::ExchangeRate;
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};
pub struct ExchangeRatesRepository;

impl ExchangeRatesRepository {
    pub async fn get_all<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<ExchangeRate>, DatabaseError> {
        let sql = "
            SELECT id, source, target, rate, dt \
            FROM exchange_rate \
            ORDER BY dt desc, source  \
            LIMIT ? \
            OFFSET ?;";
        let res = sqlx::query_as::<_, ExchangeRate>(sql)
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
}
