/**
 * DATABASE.JS - ARQUIVO DE CURSOS
 * 
 * INSTRUÇÕES PARA ADICIONAR UMA NOVA AULA:
 * 1. Copie um bloco { ... },
 * 2. Mude o título, categoria, duração e imagem.
 * 3. Salve o arquivo e atualize o site. Pronto!
 */

const fluentFlixData = {
    // Categorias que vão aparecer como carrosseis (Rows)
    categories: [
        { id: "continue", title: "Continuar Assistindo" },
        { id: "business", title: "Business English" },
        { id: "conversational", title: "Conversational English" },
        { id: "prep", title: "TOEFL/IELTS Prep" }
    ],

    // Lista de todos os cursos disponíveis
    courses: [
        {
            id: 1,
            title: "Corporate Pitch",
            category: "continue",
            level: "Avançado",
            duration: "45 min",
            progress: 0, // Porcentagem assistida (ex: 60%)
            imgUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
            youtubeId: "sQWzJY3Z6Zs",
            saved: true // Para aparecer na Minha Lista
        },
        {
            id: 2,
            title: "Daily Small Talk",
            category: "continue",
            level: "Básico",
            duration: "1h 20m",
            progress: 30,
            imgUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
            youtubeId: "sQWzJY3Z6Zs",
            saved: true
        },
        {
            id: 3,
            title: "1155 et",
            category: "business",
            level: "Intermediário",
            duration: "2h",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
            youtubeId: "ITtZE5RjFP4",
            saved: true
        },
        {
            id: 4,
            title: "Email Etiquette",
            category: "business",
            level: "Intermediário",
            duration: "1h",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            title: "Negotiation Mastery",
            category: "business",
            level: "Avançado",
            duration: "3h 30m",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            title: "At the Airport",
            category: "conversational",
            level: "Básico",
            duration: "50m",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 7,
            title: "Ordering Food",
            category: "conversational",
            level: "Iniciante",
            duration: "40m",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 8,
            title: "Hanging Out",
            category: "conversational",
            level: "Intermediário",
            duration: "1h 15m",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 9,
            title: "IELTS Speaking Part 1",
            category: "prep",
            level: "Avançado",
            duration: "4h",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1546410531-ea4cea477149?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 10,
            title: "TOEFL Reading Skills",
            category: "prep",
            level: "Avançado",
            duration: "5h",
            progress: 0,
            imgUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
        }
    ],

    // Módulos para a Tela de Trilhas (Página: trilhas.html)
    trails: [
        {
            id: "t1",
            title: "Do Zero à Fluência: O Básico Essencial",
            description: "Uma jornada completa pelos fundamentos para quem está começando agora.",
            coursesIds: [2, 6, 7]
        },
        {
            id: "t2",
            title: "Carreira Executiva & Entrevistas",
            description: "Alcance o topo dominando o inglês corporativo.",
            coursesIds: [1, 3, 4, 5]
        }
    ],

    // Banco de Questões Gamificadas (Página: exercicios.html)
    exercises: [
        {
            id: 1,
            question: "Como se diz 'Apresentar um projeto' em um ambiente executivo?",
            options: ["Submit a paper", "Pitch an idea", "Introduce a draw"],
            correctAnswer: 1 // Indice 1 = Pitch an idea
        },
        {
            id: 2,
            question: "O que significa 'To take over'?",
            options: ["Assumir o controle", "Levar para fora", "Ignorar completely"],
            correctAnswer: 0
        },
        {
            id: 3,
            question: "Qual frase soa mais polida em um e-mail formal?",
            options: ["I want this done now.", "Please find attached the report.", "Look at my file."],
            correctAnswer: 1
        }
    ]
};
