from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import os

app = Flask(__name__, static_folder='public', static_url_path='')

def get_db_connection():
    conn = sqlite3.connect('fluentflix.db')
    conn.row_factory = sqlite3.Row
    return conn

# Rota Estática Base
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_public(path):
    return send_from_directory('public', path)

# ==========================================
# PAINEL API (BACKEND)
# ==========================================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    usersCount = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    coursesCount = conn.execute('SELECT COUNT(*) FROM courses').fetchone()[0]
    conn.close()
    return jsonify({"users": usersCount, "courses": coursesCount})

@app.route('/api/cursos', methods=['GET'])
def get_cursos():
    conn = get_db_connection()
    courses = conn.execute('SELECT * FROM courses').fetchall()
    conn.close()
    
    # Transmite como objeto literal mantendo compatibilidade com app.js
    response = []
    for c in courses:
        response.append({
            "id": c['id'],
            "title": c['title'],
            "category": c['category'],
            "level": c['level'],
            "duration": c['duration'],
            "imgUrl": c['img_url'],
            "youtubeId": c['youtube_id'],
            "saved": bool(c['saved']),
            "progress": 0  # mock temporario
        })
    return jsonify(response)

@app.route('/api/comentarios', methods=['POST'])
def post_comentario():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO comments (course_id, user_id, body) VALUES (?, ?, ?)',
                 (data['course_id'], 2, data['body'])) # Logando como Usuario de Testes
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

# Admin: Inserir Curso Real
@app.route('/api/admin/cursos', methods=['POST'])
def create_curso():
    data = request.json
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO courses (title, category, level, duration, img_url, youtube_id, saved) 
        VALUES (?, ?, ?, ?, ?, ?, 0)
    ''', (data['title'], data['category'], data['level'], data['duration'], data['imgUrl'], data['youtubeId']))
    conn.commit()
    conn.close()
    return jsonify({"status": "Curso adicionado com sucesso"})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
