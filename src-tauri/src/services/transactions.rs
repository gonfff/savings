use crate::models::transactions::{
    TransactionFilters, TransactionIn, TransactionInsert, TransactionOut,
};
use crate::services::ServiceError;
use crate::state::AppState;
use crate::storage::repositories::transactions::TransactionsRepository;

pub struct TransactionsService<'a> {
    app_state: &'a AppState,
}

impl<'a> TransactionsService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        TransactionsService { app_state }
    }

    pub async fn get_transactions(
        &self,
        filters: TransactionFilters,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<TransactionOut>, ServiceError> {
        let transactions =
            TransactionsRepository::get_by(&self.app_state.db.pool, filters, limit, offset).await?;
        Ok(transactions)
    }

    pub async fn add_transaction(&self, transaction: TransactionIn) -> Result<(), ServiceError> {
        let new_transaction: TransactionInsert = transaction.into();
        TransactionsRepository::add(&self.app_state.db.pool, new_transaction).await?;
        Ok(())
    }

    pub async fn update_transaction(
        &self,
        id: i32,
        transaction: TransactionIn,
    ) -> Result<(), ServiceError> {
        TransactionsRepository::update(&self.app_state.db.pool, id, transaction).await?;
        Ok(())
    }

    pub async fn delete_transaction(&self, id: i32) -> Result<(), ServiceError> {
        TransactionsRepository::delete(&self.app_state.db.pool, id).await?;
        Ok(())
    }
}
