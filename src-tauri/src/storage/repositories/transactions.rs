use crate::models::transactions::{
    TransactionFilters, TransactionIn, TransactionInsert, TransactionOut,
};
use crate::storage::DatabaseError;
use sqlx::SqliteExecutor;

pub struct TransactionsRepository;

impl TransactionsRepository {
    pub async fn add<'e>(
        executor: impl SqliteExecutor<'e>,
        transaction: TransactionInsert,
    ) -> Result<(), DatabaseError> {
        let sql = "\
            INSERT INTO transactions (account_id, type, quantity, unit_price, description, dt) \
            VALUES (?, ?, ?, ?, ?, ?);";
        let res = sqlx::query(sql)
            .bind(transaction.account_id)
            .bind(transaction.type_)
            .bind(transaction.quantity)
            .bind(transaction.unit_price)
            .bind(transaction.description)
            .bind(transaction.dt)
            .execute(executor)
            .await;

        res.map_err(|e| DatabaseError::Error(e.to_string()))
            .map(|_| ())
    }

    pub async fn update<'e>(
        executor: impl SqliteExecutor<'e>,
        id: i32,
        transaction: TransactionIn,
    ) -> Result<(), DatabaseError> {
        let sql = "\
        UPDATE transactions SET \
            account_id = ?, \
            type = ?, \
            quantity = ?, \
            unit_price = ?, \
            description = ?, \
            dt = ? \
        WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(transaction.account_id)
            .bind(transaction.type_)
            .bind(transaction.quantity)
            .bind(transaction.unit_price)
            .bind(transaction.description)
            .bind(transaction.dt)
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
        let sql = "DELETE FROM transactions WHERE id = ?;";
        let res = sqlx::query(sql).bind(id).execute(executor).await;

        match res {
            Ok(_) => Ok(()),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn get_by<'e>(
        executor: impl SqliteExecutor<'e>,
        filters: TransactionFilters,
        limit: i32,
        offset: i32,
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

        let mut conditions = vec![];
        let mut bindings = vec![];

        filters.add_sql_conditions_and_bindings(&mut conditions, &mut bindings);

        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        sql.push_str(" ORDER BY a.id DESC LIMIT ? OFFSET ?;");

        let mut query = sqlx::query_as::<_, TransactionOut>(&sql);
        for binding in bindings {
            query = query.bind(binding);
        }
        query = query.bind(limit).bind(offset);

        let res = query.fetch_all(executor).await;

        match res {
            Ok(value) => Ok(value),
            Err(sqlx::Error::RowNotFound) => Ok(vec![]),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }
}
