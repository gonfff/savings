CREATE TABLE
    transactions
(
    id         INTEGER PRIMARY KEY NOT NULL,
    account_id INTEGER             NOT NULL,
    type       TEXT                NOT NULL,
    quantity   REAL                NOT NULL,
    unit_price REAL                NOT NULL,
    for_date   DATE                NOT NULL,
    created_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account (id)
);