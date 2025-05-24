use crate::models::charts::ChartFilters;
use crate::models::transactions::{
    TransactionFilters, TransactionIn, TransactionInsert, TransactionOut,
};
use crate::storage::DatabaseError;
use sqlx::SqliteExecutor;

pub struct ChartsRepository;

impl ChartsRepository {
    pub async fn get_by<'e>(
        executor: impl SqliteExecutor<'e>,
        filters: ChartFilters,
    ) -> Result<Vec<TransactionOut>, DatabaseError> {
        // base sql query
        let mut sql = "
            SELECT
                id, \
                account_id, \
                type, \
                quantity, \
                unit_price, \
                description, \
                dt, \
                created_at \
            FROM transactions"
            .to_string();

        // let mut conditions = vec![];
        // let mut bindings = vec![];

        // filters.add_sql_conditions_and_bindings(&mut conditions, &mut bindings);

        // if !conditions.is_empty() {
        //     sql.push_str(" WHERE ");
        //     sql.push_str(&conditions.join(" AND "));
        // }

        sql.push_str(" ORDER BY a.id DESC LIMIT ? OFFSET ?;");

        let mut query = sqlx::query_as::<_, TransactionOut>(&sql);
        // for binding in bindings {
        //     query = query.bind(binding);
        // }
        // query = query.bind(limit).bind(offset);

        let res = query.fetch_all(executor).await;

        match res {
            Ok(value) => Ok(value),
            Err(sqlx::Error::RowNotFound) => Ok(vec![]),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }
}
