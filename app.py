from pathlib import Path
from threading import Lock
import sqlite3

from flask import Flask, jsonify, send_from_directory


BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "assets"
DATABASE = BASE_DIR / "views.db"

app = Flask(__name__)

db_lock = Lock()


def init_db():
    connection = sqlite3.connect(DATABASE)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            views INTEGER NOT NULL DEFAULT 0
        )
    """)

    connection.execute("""
        INSERT OR IGNORE INTO stats (id, views)
        VALUES (1, 0)
    """)

    connection.commit()
    connection.close()


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/style.css")
def style():
    return send_from_directory(BASE_DIR, "style.css")


@app.route("/script.js")
def script():
    return send_from_directory(BASE_DIR, "script.js")


@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(ASSETS_DIR, filename)


@app.route("/api/views")
def views():
    with db_lock:
        connection = sqlite3.connect(DATABASE)

        connection.execute("""
            UPDATE stats
            SET views = views + 1
            WHERE id = 1
        """)

        result = connection.execute("""
            SELECT views
            FROM stats
            WHERE id = 1
        """).fetchone()

        connection.commit()
        connection.close()

    return jsonify({
        "views": result[0]
    })


if __name__ == "__main__":
    init_db()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )