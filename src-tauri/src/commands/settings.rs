use crate::state::AppState;
use tauri::command;

#[command]
pub async fn set_use_external_api(
    state: tauri::State<'_, AppState>,
    use_external_api: bool,
) -> Result<String, String> {
    println!("Setting use external api to:");
    let sql = "SELECT value FROM kv WHERE key = ?";
    let res = sqlx::query_as::<_, (String,)>(sql)
        .bind("use_external_api")
        .fetch_one(&state.db.pool)
        .await;
    println!("rows {:?}", res);
    println!(
        "frontend:{} db:{:?}",
        use_external_api, state.use_external_api
    );
    Ok("ok".to_string())
}
