class ProjectCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'card-wrapper');

        const style = document.createElement('style');
        style.textContent = `
            .card-wrapper {
                display: flex;
                gap: 8%;
                margin-left: 25%;
                margin-bottom: 5%;
                margin-top: 5%;
            }
            .content {
                display: flex;
                flex-direction: column;
                max-width: 40%;
            }
            picture {
                display: block;
                width: 35%;
                border-radius: 10%;
                transition: transform 0.5s;
            }
            img {
                width: 100%;
                border-radius: 10%;
                display: block;
            }
            picture:hover {
                transform: scale(1.05);
            }
        `;

        const picture = document.createElement('picture');
        const img = document.createElement('img');
        picture.appendChild(img);

        const content = document.createElement('div');
        content.classList.add('content');

        const title = document.createElement('h1');
        const subtitle = document.createElement('h2');
        const description = document.createElement('p');
        const link = document.createElement('a');

        content.append(title, subtitle, description, link);
        wrapper.append(picture, content);

        shadow.append(style, wrapper);

        this.picture = picture;
        this.img = img;
        this.titleEl = title;
        this.subtitleEl = subtitle;
        this.descriptionEl = description;
        this.linkEl = link;
    }

    connectedCallback() {
        this.img.src = this.getAttribute('image') || '';
        this.img.alt = this.getAttribute('title') || 'Project Image';
        this.titleEl.textContent = this.getAttribute('title') || 'Untitled Project';
        this.subtitleEl.textContent = this.getAttribute('subtitle') || 'No Subtitle';
        this.descriptionEl.textContent = this.getAttribute('description') || 'No description provided.';
        this.linkEl.href = this.getAttribute('link') || '#';
        this.linkEl.target = '_blank';
        this.linkEl.textContent = 'Read more';
    }
}

customElements.define('project-card', ProjectCard);

async function loadProjects(source) {
    const projectsSection = document.getElementById('projects');
    let projects = [];

    if (source === 'local') {
        projects = JSON.parse(localStorage.getItem('projects')) || [];
    } else if (source === 'remote') {
        try {
            const response = await fetch('https://api.jsonbin.io/v3/b/67d7afc68a456b7966774893', {
                headers: {
                    'X-Master-Key': '$2a$10$n6XEtl/4nyPwEUcxu10sE.pA1TNaJh4WvU49Gi.Mgwpurto5Xcjs6'
                }
            });
            if (!response.ok) {
                console.error('Error fetching projects.json:', response.status);
                return;
            }
            const data = await response.json();
            projects = data.record;
            localStorage.setItem('projects', JSON.stringify(projects));
        } catch (error) {
            console.error('Failed to load projects from remote server.', error);
            return;
        }
    }

    projectsSection.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('project-card');
        card.setAttribute('image', project.image || '');
        card.setAttribute('title', project.title || '');
        card.setAttribute('subtitle', project.subtitle || '');
        card.setAttribute('description', project.description || '');
        card.setAttribute('link', project.link || '#');
        projectsSection.appendChild(card);
    });
}

document.getElementById('load-local').addEventListener('click', () => loadProjects('local'));
document.getElementById('load-remote').addEventListener('click', () => loadProjects('remote'));
