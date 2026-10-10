import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "Не задан DATABASE_URL. Скопируйте .env.example в .env и настройте PostgreSQL."
    )

if not DATABASE_URL.startswith(("postgresql://", "postgresql+psycopg2://")):
    raise RuntimeError(
        "Для этого проекта требуется PostgreSQL. Укажите DATABASE_URL вида "
        "postgresql+psycopg2://USER:PASSWORD@HOST:5432/DB_NAME."
    )

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
