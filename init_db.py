import sqlite3

def init_db():
    conn = sqlite3.connect('fluentflix.db')
    cursor = conn.cursor()

    # Tabela: Usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'ALUNO',
            xp_points INTEGER DEFAULT 0
        )
    ''')

    # Tabela: Cursos/Aulas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            level TEXT NOT NULL,
            duration TEXT NOT NULL,
            img_url TEXT NOT NULL,
            youtube_id TEXT NOT NULL,
            saved BOOLEAN DEFAULT 0
        )
    ''')
    
    # Tabela: Progresso
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            progress_pct INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    ''')

    # Tabela: Comentários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Populando dados Iniciais (Mock Seeding)
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES ('Artur Admin', 'admin@fluentflix.com', 'admin123', 'ADMIN')")
        cursor.execute("INSERT INTO users (name, email, password, role) VALUES ('Engage User', 'aluno@fluentflix.com', 'aluno123', 'ALUNO')")
        
    cursor.execute("SELECT COUNT(*) FROM courses")
    if cursor.fetchone()[0] == 0:
        initial_courses = [
            ("Corporate Pitch", "business", "Avançado", "45 min", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", "vBqJ9gV39B4", 1),
            ("Daily Small Talk", "conversational", "Básico", "1h 20m", "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80", "17l7C_WbU2g", 1),
            ("English for Meetings", "business", "Intermediário", "2h", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80", "dQw4w9WgXcQ", 0),
        ]
        cursor.executemany("INSERT INTO courses (title, category, level, duration, img_url, youtube_id, saved) VALUES (?, ?, ?, ?, ?, ?, ?)", initial_courses)
        
        # Popula progresso mock
        cursor.execute("INSERT INTO progress (user_id, course_id, progress_pct) VALUES (2, 1, 60)")
        cursor.execute("INSERT INTO progress (user_id, course_id, progress_pct) VALUES (2, 2, 30)")

    conn.commit()
    conn.close()
    print("Database SQL init completed successfully! (fluentflix.db)")

if __name__ == '__main__':
    init_db()
