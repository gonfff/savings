use crate::models::accounts::{AccountFilters, AccountIn, AccountInsert, AccountOut};
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};

pub struct AccountsRepository;

impl AccountsRepository {
    pub async fn get_all<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<AccountOut>, DatabaseError> {
        let sql = "
            SELECT
                a.id as id, \
                a.location_id as location_id, \
                l.name as location_name, \
                a.asset_id as asset_id, \
                a.description as description, \
                ass.name as asset_name, \
                ass.code as asset_code, \
                a.created_at as created_at \
            FROM accounts a \
            JOIN asset ass ON a.asset_id = ass.id \
            JOIN location l ON a.location_id = l.id \
            ORDER BY a.id DESC \
            LIMIT ? \
            OFFSET ?;";
        let res = sqlx::query_as::<_, AccountOut>(sql)
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
        account: AccountInsert,
    ) -> Result<(), DatabaseError> {
        let sql = "\
            INSERT INTO account (location_id, asset_id, description) \
            VALUES (?, ?, ?);";
        let res = sqlx::query(sql)
            .bind(account.location_id)
            .bind(account.asset_id)
            .bind(account.description)
            .execute(executor)
            .await;

        res.map_err(|e| DatabaseError::Error(e.to_string()))
            .map(|_| ())
    }

    pub async fn update<'e>(
        executor: impl SqliteExecutor<'e>,
        id: i32,
        account: AccountIn,
    ) -> Result<(), DatabaseError> {
        let sql = "\
        UPDATE account SET \
            location_id = ?, \
            asset_id = ?, \
            description = ? \
        WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(account.location_id)
            .bind(account.asset_id)
            .bind(account.description)
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
        let sql = "DELETE FROM accounts WHERE id = ?;";
        let res = sqlx::query(sql).bind(id).execute(executor).await;

        match res {
            Ok(_) => Ok(()),
            Err(e) => Err(DatabaseError::Error(e.to_string())),
        }
    }

    pub async fn get_by<'e>(
        executor: impl SqliteExecutor<'e>,
        filters: AccountFilters,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<AccountOut>, DatabaseError> {
        // base sql query
        let mut sql = "
            SELECT
                a.id as id, \
                a.location_id as location_id, \
                l.name as location_name, \
                a.asset_id as asset_id, \
                a.description as description, \
                ass.name as asset_name, \
                ass.code as asset_code, \
                a.created_at as created_at \
            FROM accounts a \
            JOIN asset ass ON a.asset_id = ass.id \
            JOIN location l ON a.location_id = l.id"
            .to_string();

        let mut conditions = vec![];
        let mut bindings = vec![];

        filters.add_sql_conditions_and_bindings(&mut conditions, &mut bindings);

        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        sql.push_str(" ORDER BY a.id DESC LIMIT ? OFFSET ?;");

        let mut query = sqlx::query_as::<_, AccountOut>(&sql);
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
