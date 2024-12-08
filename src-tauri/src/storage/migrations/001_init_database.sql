-- 001_init_database.sql
-- Table for user settings
CREATE TABLE
    kv
(
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT             NOT NULL
);

-- Table for assets (currencies, cryptocurrencies, stocks, etc.)
CREATE TABLE
    instrument
(
    id         INTEGER PRIMARY KEY NOT NULL,
    code       TEXT UNIQUE         NOT NULL,
    type       TEXT                NOT NULL,
    name       TEXT                NOT NULL,
    created_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table for locations (e.g., banks, exchanges)
CREATE TABLE
    location
(
    id          INTEGER PRIMARY KEY NOT NULL,
    name        TEXT                NOT NULL,
    description TEXT,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table for exchange rates between assets
CREATE TABLE
    exchange_rate
(
    id     INTEGER PRIMARY KEY NOT NULL,
    source INTEGER             NOT NULL,
    target INTEGER             NOT NULL,
    rate   REAL                NOT NULL,
    dt     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source) REFERENCES instrument (id),
    FOREIGN KEY (target) REFERENCES instrument (id)
);

CREATE INDEX idx_exchange_rate_source_target ON exchange_rate (source, target);

CREATE INDEX idx_exchange_dt ON exchange_rate (dt);

-- Table for accounts
CREATE TABLE
    account
(
    id          INTEGER PRIMARY KEY NOT NULL,
    location_id INTEGER             NOT NULL,
    asset_id    INTEGER             NOT NULL,
    name        TEXT,
    description TEXT,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES location (id),
    FOREIGN KEY (asset_id) REFERENCES instrument (id)
);

-- Table for cache to store the state of an account for each date
CREATE TABLE
    state
(
    id         INTEGER PRIMARY KEY NOT NULL,
    account_id INTEGER             NOT NULL,
    quantity   REAL                NOT NULL,
    unit_price REAL                NOT NULL,
    for_date   DATE                NOT NULL,
    created_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account (id)
);