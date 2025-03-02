use crate::models::accounts::{Account, AccountBalance, AccountFilters, AccountIn, AccountInsert};
use crate::storage::DatabaseError;
use sqlx::{Error, SqliteExecutor};

pub struct AccountsRepository;

impl AccountsRepository {
    pub async fn get_all<'e>(
        executor: impl SqliteExecutor<'e>,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<Account>, DatabaseError> {
        let sql = "
            SELECT
                a.id as id, \
                a.name as name, \
                a.location_id as location_id, \
                l.name as location_name, \
                a.asset_id as asset_id, \
                a.description as description, \
                ass.name as asset_name, \
                ass.code as asset_code, \
                a.created_at as created_at \
            FROM accounts a \
            JOIN assets ass ON a.asset_id = ass.id \
            JOIN locations l ON a.location_id = l.id \
            ORDER BY a.id DESC \
            LIMIT ? \
            OFFSET ?;";
        let res = sqlx::query_as::<_, Account>(sql)
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
            INSERT INTO accounts (location_id, asset_id, name, description) \
            VALUES (?, ?, ?);";
        let res = sqlx::query(sql)
            .bind(account.location_id)
            .bind(account.asset_id)
            .bind(account.name)
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
        UPDATE accounts SET \
            location_id = ?, \
            asset_id = ?, \
            name = ? \
            description = ? \
        WHERE id = ?;";
        let res = sqlx::query(sql)
            .bind(account.location_id)
            .bind(account.asset_id)
            .bind(account.name)
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
    ) -> Result<Vec<AccountBalance>, DatabaseError> {
        // base sql query
        let mut sql = "
        SELECT 
            a.id                                                          as id,
            a.name                                                        as name,
            a.location_id                                                 as location_id,
            l.name                                                        as location_name,
            a.asset_id                                                    as asset_id,
            a.description                                                 as description,
            ass.name                                                      as asset_name,
            ass.code                                                      as asset_code,
            a.created_at                                                  as created_at,
            ((SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE 0 END) -
                SUM(CASE WHEN t.type = 'SELL' THEN t.quantity ELSE 0 END))) as balance
        FROM accounts a
                JOIN assets ass ON a.asset_id = ass.id
                JOIN locations l ON a.location_id = l.id
                JOIN transactions t ON t.account_id = a.id
        {conditions}
        GROUP BY a.id, a.name, a.location_id, l.name, a.asset_id, a.description, ass.name, ass.code, a.created_at
        ORDER BY a.id DESC LIMIT ? OFFSET ?;
        ";

        let mut conditions = vec![];
        let mut bindings = vec![];

        filters.add_sql_conditions_and_bindings(&mut conditions, &mut bindings);

        let conditions_str = if !conditions.is_empty() {
            format!("WHERE {}", conditions.join(" AND "))
        } else {
            String::new()
        };

        let stmt = sql.replace("{conditions}", &conditions_str);

        let mut query = sqlx::query_as::<_, AccountBalance>(&stmt);
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
