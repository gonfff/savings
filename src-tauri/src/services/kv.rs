use crate::state::AppState;
use crate::storage::repositories::kv::KVRepository;
use sqlx::Error;

pub struct KVService<'a> {
    app_state: &'a AppState,
}

impl<'a> KVService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        KVService { app_state }
    }

    // pub async fn get_key(&self, key: &str) -> Result<String, Error> {
    //     let mut transaction = self.app_state.db.pool.begin().await?;
    //     let r = KVRepository::get(&mut transaction, key)
    //         .await?
    //         .expect("Key not found");

    //     transaction.commit().await?;
    //     Ok(r)
    // }

    // pub async fn set_key(&self, key: &str, value: &str) -> Result<(), Error> {
    //     let mut transaction = self.app_state.db.pool.begin().await?;
    //     KVRepository::set(transaction.as_mut(), key, value).await;
    //     transaction.commit().await?;
    //     Ok(())
    // }
}
