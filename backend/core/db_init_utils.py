import os
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any

from sqlalchemy import inspect, text, exc
from sqlalchemy.orm import Session

from core.config import settings
from db.session import engine, SessionLocal

logger = logging.getLogger(__name__)


def is_table_empty(table_name: str, db: Session) -> bool:
    """Check if a table is empty.

    Args:
        table_name: Name of the table to check
        db: SQLAlchemy session

    Returns:
        bool: True if table is empty or doesn't exist, False otherwise or if there's an error
    """
    try:
        # First check if table exists
        result = db.execute(
            text(
                """
                SELECT COUNT(*) as table_exists 
                FROM information_schema.tables 
                WHERE table_schema = :db_name 
                AND table_name = :table_name
            """
            ),
            {"db_name": settings.MYSQL_DB_NAME, "table_name": table_name},
        ).fetchone()

        if not result or result[0] == 0:
            return True  # Table doesn't exist, consider it empty

        # Table exists, check if it has data
        result = db.execute(
            text(f"SELECT COUNT(*) as count FROM `{table_name}`")
        ).fetchone()

        return result[0] == 0
    except Exception as e:
        logger.warning(f"Could not check if table {table_name} is empty: {str(e)}")
        return False  # Assume table is not empty to avoid re-inserting data


def get_all_tables() -> List[str]:
    """Get all table names from the database.

    Returns:
        List[str]: List of table names that exist in the database
    """
    try:
        inspector = inspect(engine)
        return inspector.get_table_names()
    except Exception as e:
        logger.error(f"Could not get table list: {str(e)}")
        return []


def execute_sql_file(file_path: str, db: Session) -> None:
    """Execute SQL commands from a file.

    Args:
        file_path: Path to the SQL file
        db: SQLAlchemy session
    """
    if not os.path.exists(file_path):
        logger.warning(f"SQL file not found: {file_path}")
        return

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            sql_commands = f.read()

        # Split the file into individual SQL commands
        commands = [cmd.strip() for cmd in sql_commands.split(";") if cmd.strip()]

        for command in commands:
            try:
                # Skip table creation/alteration statements
                if command.upper().startswith(
                    ("CREATE TABLE", "ALTER TABLE", "DROP TABLE")
                ):
                    continue

                # Only execute INSERT, UPDATE, DELETE statements
                if command.upper().startswith(("INSERT", "UPDATE", "DELETE")):
                    logger.debug(f"Executing SQL: {command[:100]}...")
                    db.execute(text(command))
                    db.commit()
            except Exception as e:
                db.rollback()
                logger.warning(f"Error executing SQL command (continuing): {str(e)}")
                continue  # Continue with next command even if one fails
    except Exception as e:
        logger.error(f"Error reading/executing SQL file {file_path}: {str(e)}")


def initialize_database(dump_file_path: Optional[str] = None) -> None:
    """Initialize the database by checking for empty tables and populating them from dump if needed.

    This function is designed to be safe to call at application startup. It will not raise exceptions
    and will log any issues that occur.

    Args:
        dump_file_path: Optional path to the SQL dump file. If not provided, will look for 'initial_data.sql' in the root directory.
    """
    try:
        # Get database name from settings
        db_name = getattr(settings, "MYSQL_DB_NAME", None)
        if not db_name:
            logger.warning(
                "Database name not found in settings. Skipping database initialization."
            )
            return

        logger.info(f"Starting database initialization for database: {db_name}")

        if dump_file_path is None:
            # Default to looking for initial_data.sql in the project root
            dump_file_path = str(Path(__file__).parent.parent / "initial_data.sql")

        if not os.path.exists(dump_file_path):
            logger.info(
                f"No dump file found at {dump_file_path}. Continuing without database initialization."
            )
            return

        db = SessionLocal()
        try:
            tables = get_all_tables()
            if not tables:
                logger.warning(
                    "No tables found in the database. Tables may not be created yet."
                )
                return

            empty_tables = [table for table in tables if is_table_empty(table, db)]

            if empty_tables:
                logger.info(
                    f"Found {len(empty_tables)} empty tables. Initializing from dump file..."
                )
                logger.debug(f"Empty tables: {', '.join(empty_tables)}")

                # Execute the dump file to populate empty tables
                execute_sql_file(dump_file_path, db)
                logger.info("Database initialization completed successfully.")
            else:
                logger.info("All tables have data. Skipping database initialization.")

        except Exception as e:
            logger.error(
                f"Error during database initialization: {str(e)}", exc_info=True
            )
        finally:
            try:
                db.close()
            except Exception as e:
                logger.error(f"Error closing database connection: {str(e)}")

    except Exception as e:
        logger.error(
            f"Unexpected error in initialize_database: {str(e)}", exc_info=True
        )
