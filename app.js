/**
 * APP.JS - Lógica de Rendering e Interação
 */

document.addEventListener('DOMContentLoaded', () => {

    // Efeito de sombra na Navbar ao dar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // LÓGICA DE RENDERIZAÇÃO
    // ==========================================

    // Função utilitária para criar o HTML do Card (reutilizável)
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.classList.add('card');
        
        let progressHTML = '';
        if (course.progress > 0) {
            progressHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
            `;
        }

        card.innerHTML = `
            <img src="${course.imgUrl}" alt="${course.title}">
            <div class="card-info">
                <div class="card-title">${course.title}</div>
                <div class="card-tags">
                    <span class="badge" style="font-size: 10px;">${course.level}</span> • ${course.duration}
                </div>
            </div>
            ${progressHTML}
        `;

        card.addEventListener('click', () => {
            const modal = document.getElementById('videoModal');
            const iframe = document.getElementById('youtubeFrame');
            if(modal && iframe) {
                const videoId = course.youtubeId || 'dQw4w9WgXcQ'; 
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.style.display = 'flex';
            }
        });

        return card;
    }

    // 1. HOME PAGE (index.html) -> courseContainer
    const homeContainer = document.getElementById('courseContainer');
    if (homeContainer) {
        fluentFlixData.categories.forEach(category => {
            const categoryCourses = fluentFlixData.courses.filter(course => course.category === category.id);
            if (categoryCourses.length > 0) {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row');
                
                const titleH3 = document.createElement('h3');
                titleH3.textContent = category.title;
                
                const cardsContainer = document.createElement('div');
                cardsContainer.classList.add('cards-container');

                categoryCourses.forEach(course => {
                    cardsContainer.appendChild(createCourseCard(course));
                });

                rowDiv.appendChild(titleH3);
                rowDiv.appendChild(cardsContainer);
                homeContainer.appendChild(rowDiv);
            }
        });
    }

    // 2. MINHA LISTA (lista.html) -> watchlistContainer
    const watchlistContainer = document.getElementById('watchlistContainer');
    if (watchlistContainer) {
        const savedCourses = fluentFlixData.courses.filter(course => course.saved === true);
        savedCourses.forEach(course => {
            watchlistContainer.appendChild(createCourseCard(course));
        });
        if (savedCourses.length === 0) {
            watchlistContainer.innerHTML = "<p>Você ainda não adicionou cursos à sua lista.</p>";
        }
    }

    // 3. TRILHAS (trilhas.html) -> trailsContainer
    const trailsContainer = document.getElementById('trailsContainer');
    if (trailsContainer) {
        fluentFlixData.trails.forEach(trail => {
            const block = document.createElement('div');
            block.classList.add('trail-block');
            
            block.innerHTML = `
                <h3>${trail.title}</h3>
                <p>${trail.description}</p>
                <div class="trail-cards" id="trail-row-${trail.id}"></div>
            `;
            
            trailsContainer.appendChild(block);
            
            const trailRow = document.getElementById(`trail-row-${trail.id}`);
            trail.coursesIds.forEach(id => {
                const course = fluentFlixData.courses.find(c => c.id === id);
                if (course) {
                    trailRow.appendChild(createCourseCard(course));
                }
            });
        });
    }

    // 4. EXERCÍCIOS GAMIFICADOS (exercicios.html) -> quizCard
    if (document.getElementById('page-exercicios')) {
        let currentQuestionIndex = 0;
        let score = 0;
        const questions = fluentFlixData.exercises;

        function renderQuestion() {
            if (currentQuestionIndex >= questions.length) {
                // Fim do quiz
                document.getElementById('quizCard').style.display = 'none';
                const result = document.getElementById('quizResult');
                result.style.display = 'block';
                document.getElementById('scoreText').innerText = `${score} de ${questions.length} corretas`;
                return;
            }

            const q = questions[currentQuestionIndex];
            document.getElementById('currentQ').innerText = currentQuestionIndex + 1;
            document.getElementById('totalQ').innerText = questions.length;
            document.getElementById('quizQuestion').innerText = q.question;
            
            const optionsBox = document.getElementById('quizOptions');
            optionsBox.innerHTML = '';
            
            q.options.forEach((optText, i) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.innerText = optText;
                
                btn.onclick = () => {
                    // Desabilita as outras opções
                    Array.from(optionsBox.children).forEach(b => b.disabled = true);
                    
                    if (i === q.correctAnswer) {
                        btn.classList.add('correct');
                        score++;
                    } else {
                        btn.classList.add('wrong');
                        // Destaca a certa também
                        optionsBox.children[q.correctAnswer].classList.add('correct');
                    }
                    
                    // Avança após 1.5s
                    setTimeout(() => {
                        currentQuestionIndex++;
                        renderQuestion();
                    }, 1500);
                };
                optionsBox.appendChild(btn);
            });
        }
        
        if(questions && questions.length > 0) {
            renderQuestion();
        } else {
            document.getElementById('quizQuestion').innerText = "Nenhum exercício cadastrado no data.js";
            document.getElementById('quizOptions').innerHTML = "";
        }
    }

});

// Função para fechar o modal chamada pelo HTML
function closeVideo() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('youtubeFrame');
    if(modal && iframe) {
        modal.style.display = 'none';
        iframe.src = ''; // Limpa o src para parar o audio do vídeo
    }
}
