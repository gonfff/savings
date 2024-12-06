#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use crate::utils::market_data::base_provider::Provider;
mod utils;

#[tokio::main]
async fn main() {
    savings_lib::run().await;
}
