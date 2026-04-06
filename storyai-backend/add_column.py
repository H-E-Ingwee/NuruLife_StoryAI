#!/usr/bin/env python
"""Add missing time_of_day column to shots table"""

import sqlite3

try:
    conn = sqlite3.connect('app.db')
    cur = conn.cursor()
    
    # Try to add the column
    try:
        cur.execute("ALTER TABLE shots ADD COLUMN time_of_day VARCHAR(32) DEFAULT('DAY')")
        conn.commit()
        print("✓ Added time_of_day column to shots table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("✓ time_of_day column already exists")
        else:
            raise
    
    # Verify
    cur.execute("PRAGMA table_info(shots)")
    cols = cur.fetchall()
    print("\nColumns in shots table after update:")
    for col in cols:
        if 'time' in col[1].lower():
            print(f"  ✓ {col[1]}: {col[2]}")
    
    conn.close()
    print("\n✓ Database schema updated successfully!")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
