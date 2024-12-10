use sqlx::{migrate::MigrateDatabase, sqlite::SqlitePoolOptions, Error, Sqlite};
use std::path::PathBuf;

#[derive(Debug)]
pub struct Database {
    pub pool: sqlx::SqlitePool,
}

/// Implementation of the Database struct
impl Database {
    /// Create a new database
    pub async fn new(app_dir: PathBuf) -> Result<Self, Error> {
        let db_url = format!("sqlite://{}/db.sqlite", app_dir.to_str().unwrap());

        if !Sqlite::database_exists(&db_url).await.unwrap_or(false) {
            Sqlite::create_database(&db_url).await?;
        }
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await?;
        let db = Database { pool };
        db.migrate().await?;
        Ok(db)
    }

    /// Migrate the database
    async fn migrate(&self) -> Result<(), Error> {
        let migrations_path = std::path::Path::new("src/storage/migrations");

        let migrator = sqlx::migrate::Migrator::new(migrations_path).await.unwrap();
        let result = migrator.run(&self.pool).await;
        match result {
            Ok(_) => {
                println!("Migrations ran successfully");
                Ok(())
            }
            Err(e) => {
                println!("Error running migrations: {:?}", e);
                std::process::exit(1);
            }
        }
    }
}
