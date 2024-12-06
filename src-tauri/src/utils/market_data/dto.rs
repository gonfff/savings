#[derive(Debug)]
pub struct Ticker {
    pub code: String,
    pub name: String,
}

pub enum TickerCategory {
    Asset,
    Crypto,
    Currency,
}
