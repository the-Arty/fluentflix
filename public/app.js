/**
 * APP.JS - Lógica de Rendering e Interação
 */

// LOGIC GUARD: Protege as páginas da aplicação
const appPathname = window.location.pathname;
const appUser = JSON.parse(localStorage.getItem('currentUser'));

if (!appUser && !appPathname.includes('login.html')) {
    // Se não estiver logado, bloqueia o carregamento e manda pro login
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {

    // LOGOUT LOGIC (Anexado aos avatares disponíveis na barra)
    const userProfiles = document.querySelectorAll('.user-profile');
    userProfiles.forEach(profile => {
        if(appUser && appUser.name) {
            const nameSpan = profile.querySelector('span');
            const avatarDiv = profile.querySelector('.avatar');
            if(nameSpan) nameSpan.innerText = appUser.name;
            if(avatarDiv) avatarDiv.innerText = appUser.name.substring(0, 2).toUpperCase();
        }
        
        profile.style.cursor = 'pointer';
        profile.title = "Sair da Conta";
        profile.addEventListener('click', () => {
            if(confirm('Deseja realmente sair da conta?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        });
    });

    // Efeito de sombra na Navbar ao dar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 🔴 FETCH INICIAL DO BACKEND (PYTHON/FLASK DB)
    try {
        const response = await fetch('/api/cursos');
        const dbCourses = await response.json();
        
        // Substitui os cursos chumbados no código pelos do Banco de Dados Dinâmico!
        fluentFlixData.courses = dbCourses;

        // Se estivermos na home, inciamos o painel hero dinamico
        if (document.getElementById('courseContainer')) {
            initHeroCarousel(dbCourses);
        }
    } catch (e) {
        console.error("Erro ao puxar dados do DB ou rodando puramente localmente:", e);
    }
    
    // ==========================================
    // HERO CAROUSEL LOGIC
    // ==========================================
    function initHeroCarousel(courses) {
        const heroSection = document.getElementById('heroSection');
        const heroTitle = document.getElementById('heroTitle');
        const heroDesc = document.getElementById('heroDesc');
        const btnWatch = document.querySelector('.hero-buttons .btn-primary');
        const durationSpan = document.querySelector('.hero-meta .duration');
        const levelBadge = document.querySelector('.hero-meta .level');

        if (!heroSection || courses.length === 0) return;

        let currentIndex = 0;
        
        function updateHero() {
            const course = courses[currentIndex];
            
            // Sucesso cross-fade basico
            heroSection.style.transition = 'background-image 1s ease-in-out';
            heroSection.style.backgroundImage = `url('${course.imgUrl}')`;
            heroTitle.innerText = course.title;
            heroDesc.innerText = `Um curso focado na categoria ${course.category}. Aproveite e comece a estudar agora.`;
            durationSpan.innerText = course.duration;
            levelBadge.innerText = course.level;
            
            // Ao clicar em Assistir, vai pra aula específica
            btnWatch.onclick = () => {
                window.location.href = `aula.html?id=${course.id}`;
            };

            currentIndex = (currentIndex + 1) % courses.length;
        }

        // Rodar a primeira vez imediatamente
        updateHero();
        
        // Rotacionar a cada 6 segundos
        setInterval(updateHero, 6000);
    }

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
            window.location.href = `aula.html?id=${course.id}`;
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

    // 5. RENDERIZAÇÃO DA PÁGINA ESPECÍFICA DA AULA (aula.html)
    if (document.getElementById('page-aula')) {
        const params = new URLSearchParams(window.location.search);
        const courseId = parseInt(params.get('id'));

        if (!courseId) {
            window.location.href = 'index.html'; // Fallback
            return;
        }

        const currentCourse = fluentFlixData.courses.find(c => c.id === courseId);
        
        if (currentCourse) {
            // Renderiza Vídeo
            const iframe = document.getElementById('mainVideoFrame');
            const vId = currentCourse.youtubeId || 'dQw4w9WgXcQ';
            iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1`;

            // Renderiza Titulo
            document.getElementById('moduleTitle').textContent = `Módulo: ${currentCourse.level}`;
            document.getElementById('lessonTitle').textContent = currentCourse.title;

            // Renderiza Sidebar Playlist baseada na "categoria" deste curso (Agrupa pelo mesmo modulo)
            const playlistContainer = document.getElementById('playlistContainer');
            const relatedCourses = fluentFlixData.courses.filter(c => c.category === currentCourse.category);
            
            relatedCourses.forEach(related => {
                const item = document.createElement('div');
                item.className = 'playlist-item';
                // Destaque para o curso que o usuário está atualmente assistindo
                if (related.id === courseId) {
                    item.classList.add('active');
                }
                
                item.innerHTML = `
                    <div class="thumb-mini"><img src="${related.imgUrl}" alt="${related.title}"></div>
                    <div class="details">
                        <h4>${related.title}</h4>
                        <span>${related.duration}</span>
                    </div>
                `;
                
                item.addEventListener('click', () => {
                    window.location.href = `aula.html?id=${related.id}`;
                });
                
                playlistContainer.appendChild(item);
            });
        }
    }

    // 6. RENDERIZAÇÃO DA BARRA INFERIOR MOBILE
    const pathname = window.location.pathname;
    if (!document.getElementById('mobileNav') && !pathname.includes('login') && !pathname.includes('admin')) {
        const mobileNav = document.createElement('div');
        mobileNav.id = 'mobileNav';
        mobileNav.className = 'mobile-bottom-nav';
        mobileNav.innerHTML = `
            <a href="index.html" class="${pathname.includes('index') || pathname === '/' || pathname.endsWith('public/') ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                Home
            </a>
            <a href="trilhas.html" class="${pathname.includes('trilhas') ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
                Trilhas
            </a>
            <a href="lista.html" class="${pathname.includes('lista') ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg>
                Lista
            </a>
            <a href="exercicios.html" class="${pathname.includes('exercicios') ? 'active' : ''}">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                Exercícios
            </a>
        `;
        document.body.appendChild(mobileNav);
    }

});
