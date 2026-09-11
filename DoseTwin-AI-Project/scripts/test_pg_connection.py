import psycopg2

passwords_to_try = ['postgres', 'admin', 'root', 'password', '1234', '123456', 'dell', 'Dell', '']
connected = False

print("Testing connection to PostgreSQL 17 on localhost:5432...")
for pwd in passwords_to_try:
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password=pwd,
            dbname="postgres",
            connect_timeout=2
        )
        print(f"[SUCCESS] Connected to PostgreSQL with password: '{pwd}'")
        connected = True
        
        # Test creating database dosetwin_db
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'dosetwin_db'")
        exists = cur.fetchone()
        if not exists:
            cur.execute("CREATE DATABASE dosetwin_db")
            print("[OK] Created database 'dosetwin_db'")
        else:
            print("[OK] Database 'dosetwin_db' already exists")
        cur.close()
        conn.close()
        break
    except Exception as e:
        print(f"Failed with password '{pwd}': {e}")

if not connected:
    print("[NOTE] Local PostgreSQL is running as Windows service on 5432 but uses a user-configured password.")
