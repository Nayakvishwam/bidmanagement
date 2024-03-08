from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists, create_database

URL_DATABASE = "postgresql://postgres:root@localhost:5432/bidsdb"

engine = create_engine(URL_DATABASE)

# Create engine without connecting to the database
if not database_exists(engine.url):
    create_database(engine.url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()
Base = declarative_base()


roles = ['admin', 'superadmin']
