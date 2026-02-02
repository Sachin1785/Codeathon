import sqlite3
from datetime import datetime
from config import Config

def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with all required tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table for authentication
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('user', 'responder')),
            email TEXT,
            phone TEXT,
            avatar TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    # Incidents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            location_name TEXT,
            report_source TEXT,
            reported_by INTEGER,
            victims_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP
        )
    ''')
    
    # Personnel table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS personnel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'available',
            lat REAL,
            lng REAL,
            assigned_incident_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_incident_id) REFERENCES incidents(id)
        )
    ''')
    
    # Resources table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'available',
            assigned_incident_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_incident_id) REFERENCES incidents(id)
        )
    ''')
    
    # Communications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS communications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER,
            sender_id INTEGER,
            sender_name TEXT,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'text',
            read_status BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        )
    ''')
    
    # Alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            radius REAL NOT NULL,
            message TEXT NOT NULL,
            severity TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )
    ''')
    
    # Incident timeline/history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incident_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            description TEXT NOT NULL,
            user_id INTEGER,
            user_name TEXT,
            metadata TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )
    ''')
    
    # File attachments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attachments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER,
            uploaded_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )
    ''')
    
    # Geofence zones table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS geofence_zones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER,
            name TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            radius REAL NOT NULL,
            zone_type TEXT NOT NULL,
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )
    ''')
    
    # Notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            incident_id INTEGER,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            priority TEXT NOT NULL,
            read_status BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")

def seed_sample_data():
    """Seed database with sample data matching the UIs"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] > 0:
        print("⚠️  Database already contains data. Skipping seed.")
        conn.close()
        return
    
    # Sample users (3 regular users)
    # Password is 'password123' for all (in production, use proper hashing!)
    users = [
        ('user1', 'password123', 'Command Center Admin', 'user', 'admin@crisis.com', '+91-9876543210'),
        ('user2', 'password123', 'Operations Manager', 'user', 'ops@crisis.com', '+91-9876543211'),
        ('user3', 'password123', 'Dispatch Coordinator', 'user', 'dispatch@crisis.com', '+91-9876543212'),
    ]
    
    cursor.executemany('''
        INSERT INTO users (username, password, name, role, email, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', users)
    
    # Sample responders (5 responders)
    responders = [
        ('responder1', 'password123', 'Firefighter John', 'responder', 'john@crisis.com', '+91-9876543220'),
        ('responder2', 'password123', 'Paramedic Sarah', 'responder', 'sarah@crisis.com', '+91-9876543221'),
        ('responder3', 'password123', 'Officer Mike', 'responder', 'mike@crisis.com', '+91-9876543222'),
        ('responder4', 'password123', 'Hazmat Specialist Lisa', 'responder', 'lisa@crisis.com', '+91-9876543223'),
        ('responder5', 'password123', 'EMT David', 'responder', 'david@crisis.com', '+91-9876543224'),
    ]
    
    cursor.executemany('''
        INSERT INTO users (username, password, name, role, email, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', responders)
    
    print(f"✅ Created {len(users)} users and {len(responders)} responders")
    
    # Sample incidents
    incidents = [
        (1, "Structure Fire - Delhi Downtown", "Multi-story commercial building fire reported in Central Delhi", 
         "fire", "critical", "active", 28.7041, 77.1025, "Delhi Downtown", "voice-call"),
        (2, "Traffic Accident - Mumbai Highway", "Multi-vehicle collision on Eastern Express Highway, lanes blocked",
         "accident", "high", "active", 19.0906, 72.8679, "Mumbai Highway", "sms"),
        (3, "Medical Emergency - Bangalore Hospital", "Cardiac arrest reported at hospital, CPR in progress",
         "medical", "high", "in-transit", 12.9716, 77.5946, "Bangalore Hospital", "bluetooth-mesh"),
        (4, "Industrial Spill - Pune Industrial Area", "Chemical spill at manufacturing facility near residential zone",
         "hazmat", "critical", "active", 18.5595, 73.8081, "Pune Industrial Area", "voice-call"),
    ]
    
    cursor.executemany('''
        INSERT INTO incidents (id, title, description, type, severity, status, lat, lng, location_name, report_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', incidents)
    
    # Sample personnel
    personnel = [
        # Delhi area
        ("Delhi Fire-01", "Fire Fighter", "on-scene", 28.7041, 77.1025, 1),
        ("Delhi Fire-02", "Fire Fighter", "on-scene", 28.7045, 77.1028, 1),
        ("Delhi Fire-03", "Fire Fighter", "on-scene", 28.7038, 77.1022, 1),
        ("Delhi Fire-04", "Fire Fighter", "available", 28.7055, 77.1035, None),
        ("Delhi Medical-01", "Paramedic", "available", 28.7030, 77.1015, None),
        # Mumbai area
        ("Mumbai Police-04", "Police Officer", "on-scene", 19.0906, 72.8679, 2),
        ("Mumbai Police-05", "Police Officer", "on-scene", 19.0908, 72.8682, 2),
        ("Mumbai Medical-01", "Paramedic", "en-route", 19.0915, 72.8690, 2),
        ("Mumbai Fire-01", "Fire Fighter", "available", 19.0895, 72.8665, None),
        # Bangalore area
        ("Bangalore Medical-06", "Paramedic", "en-route", 12.9720, 77.5950, 3),
        ("Bangalore Medical-07", "Paramedic", "en-route", 12.9718, 77.5948, 3),
        ("Bangalore Police-01", "Police Officer", "available", 12.9710, 77.5940, None),
        ("Bangalore Fire-01", "Fire Fighter", "available", 12.9725, 77.5955, None),
        # Pune area
        ("Pune Hazmat-1", "Hazmat Specialist", "on-scene", 18.5595, 73.8081, 4),
        ("Pune Emergency-08", "Emergency Response", "on-scene", 18.5598, 73.8085, 4),
        ("Pune Emergency-09", "Emergency Response", "on-scene", 18.5592, 73.8078, 4),
        ("Pune Medical-01", "Paramedic", "en-route", 18.5600, 73.8090, 4),
        ("Pune Fire-01", "Fire Fighter", "available", 18.5585, 73.8070, None),
    ]
    
    cursor.executemany('''
        INSERT INTO personnel (name, role, status, lat, lng, assigned_incident_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', personnel)
    
    # Sample resources
    resources = [
        ("Engine Pump-1", "Fire Engine", "deployed", 1),
        ("Aerial Ladder-1", "Fire Truck", "deployed", 1),
        ("Hazmat Unit-1", "Hazmat Vehicle", "deployed", 1),
        ("Ambulance-1", "Medical", "deployed", 2),
        ("Rescue Van-1", "Rescue Vehicle", "deployed", 2),
        ("Ambulance-2", "Medical", "en-route", 3),
        ("Ambulance-3", "Medical", "en-route", 3),
        ("Hazmat Containment-2", "Hazmat Vehicle", "deployed", 4),
        ("Engine Pump-3", "Fire Engine", "deployed", 4),
    ]
    
    cursor.executemany('''
        INSERT INTO resources (name, type, status, assigned_incident_id)
        VALUES (?, ?, ?, ?)
    ''', resources)
    
    # Sample timeline events
    timeline_events = [
        (1, "incident_created", "Incident reported via voice call", None, "System"),
        (1, "personnel_assigned", "3 fire units assigned to incident", None, "Dispatcher"),
        (1, "status_update", "First unit arrived on scene", None, "Delhi Fire-01"),
        (2, "incident_created", "Traffic accident reported via SMS", None, "System"),
        (2, "personnel_assigned", "2 police units dispatched", None, "Dispatcher"),
    ]
    
    cursor.executemany('''
        INSERT INTO incident_timeline (incident_id, event_type, description, user_id, user_name)
        VALUES (?, ?, ?, ?, ?)
    ''', timeline_events)
    
    # Sample geofence zones
    geofence_zones = [
        (1, "Fire Danger Zone", 28.7041, 77.1025, 500, "danger"),
        (4, "Chemical Spill Area", 18.5595, 73.8081, 800, "danger"),
    ]
    
    cursor.executemany('''
        INSERT INTO geofence_zones (incident_id, name, lat, lng, radius, zone_type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', geofence_zones)
    
    conn.commit()
    conn.close()
    print("✅ Sample data seeded successfully!")

if __name__ == '__main__':
    init_db()
    seed_sample_data()
