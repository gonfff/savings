use crate::models::accounts::{AccountFilters, AccountIn, AccountInsert, AccountOut};
use crate::services::ServiceError;
use crate::state::AppState;
use crate::storage::repositories::accounts::AccountsRepository;

pub struct AccountsService<'a> {
    app_state: &'a AppState,
}

impl<'a> AccountsService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        AccountsService { app_state }
    }

    pub async fn get_accounts(
        &self,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<AccountOut>, ServiceError> {
        let accounts = AccountsRepository::get_all(&self.app_state.db.pool, limit, offset).await?;
        Ok(accounts)
    }

    pub async fn add_account(&self, account: AccountIn) -> Result<(), ServiceError> {
        let new_account: AccountInsert = account.into();
        AccountsRepository::add(&self.app_state.db.pool, new_account).await?;
        Ok(())
    }

    pub async fn update_account(&self, id: i32, account: AccountIn) -> Result<(), ServiceError> {
        AccountsRepository::update(&self.app_state.db.pool, id, account).await?;
        Ok(())
    }

    pub async fn delete_account(&self, id: i32) -> Result<(), ServiceError> {
        AccountsRepository::delete(&self.app_state.db.pool, id).await?;
        Ok(())
    }

    pub async fn get_accounts_by(
        &self,
        filters: AccountFilters,
        limit: i32,
        offset: i32,
    ) -> Result<Vec<AccountOut>, ServiceError> {
        let accounts =
            AccountsRepository::get_by(&self.app_state.db.pool, filters, limit, offset).await?;
        Ok(accounts)
    }
}
