use crate::services::ServiceError;
use crate::{storage::repositories::kv::KVRepository, AppState};
use serde::{de::DeserializeOwned, Serialize};

pub struct KVService<'a> {
    app_state: &'a AppState,
}

impl<'a> KVService<'a> {
    pub fn new(app_state: &'a AppState) -> Self {
        KVService { app_state }
    }

    pub async fn get_key<T>(&self, key: &str) -> Result<T, ServiceError>
    where
        T: DeserializeOwned,
    {
        let value: String = KVRepository::get(&self.app_state.db.pool, key).await?;

        // deserialize to target struct
        let result: T = serde_json::from_str(&value)
            .or_else(|_| {
                // deserialize to primitive type if struct deserialization failed
                serde_json::from_value(serde_json::Value::String(value))
            })
            .map_err(|e| ServiceError::DeserializationError(e.to_string()))?;

        Ok(result)
    }

    /// Сериализовать значение и сохранить в хранилище
    pub async fn set_key<T>(&self, key: &str, value: &T) -> Result<(), ServiceError>
    where
        T: Serialize,
    {
        let serialized_value = serde_json::to_string(value)
            .map_err(|e| ServiceError::SerializationError(e.to_string()))?;
        KVRepository::set(&self.app_state.db.pool, key, &serialized_value).await?;
        Ok(())
    }
}
