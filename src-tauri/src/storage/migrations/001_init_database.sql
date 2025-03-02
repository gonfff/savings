-- 001_init_database.sql
-- Table for user settings
CREATE TABLE
    kv (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
    );

-- Table for assets (currencies, cryptocurrencies, stocks, etc.)
CREATE TABLE
    assets (
        id INTEGER PRIMARY KEY NOT NULL,
        code TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Table for locations (e.g., banks, exchanges)
CREATE TABLE
    locations (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Table for exchange rates between assets
CREATE TABLE
    exchange_rates (
        id INTEGER PRIMARY KEY NOT NULL,
        asset_from_id INTEGER NOT NULL,
        asset_to_id INTEGER NOT NULL,
        rate REAL NOT NULL,
        source TEXT NOT NULL,
        to_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_from_id) REFERENCES assets (id),
        FOREIGN KEY (asset_to_id) REFERENCES assets (id)
    );

CREATE INDEX idx_exchange_rates_asset_from_id_asset_to_id ON exchange_rates (asset_from_id, asset_to_id);

CREATE INDEX idx_exchange_rates_to_date ON exchange_rates (to_date);

-- Table for accounts
CREATE TABLE
    accounts (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        location_id INTEGER NOT NULL,
        asset_id INTEGER NOT NULL,
        description TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations (id),
        FOREIGN KEY (asset_id) REFERENCES assets (id)
    );

-- Table for transactions
CREATE TABLE
    transactions (
        id INTEGER PRIMARY KEY NOT NULL,
        account_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        description TEXT,
        dt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts (id)
    );