#!/usr/bin/env python
"""Check the database schema"""

import sqlite3

conn = sqlite3.connect('app.db')
cur = conn.cursor()

# Get table info
cur.execute("PRAGMA table_info(shots)")
cols = cur.fetchall()
print("Columns in shots table:")
for col in cols:
    print(f"  {col[1]}: {col[2]}")

conn.close()
