// ==========================================
// Theme Management
// ==========================================

(function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }
    updateIcon();
})();

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcon();
}

function updateIcon() {
    const icon = document.getElementById('themeIcon');
    const isDark = document.documentElement.classList.contains('dark');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
}

// Print event listeners to ensure dark mode is disabled for physical printing
window.addEventListener('beforeprint', () => {
    document.documentElement.classList.remove('dark');
});

window.addEventListener('afterprint', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
});

// ==========================================
// Dynamic Data Fetching
// ==========================================

async function loadResumeData() {
    try {
        const response = await fetch('resume.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // 1. Populate Document Title
        document.getElementById('document-title').textContent = `${data.personal.name} | ${data.personal.title}`;

        // 2. Populate Personal Information
        document.getElementById('personal-name').textContent = data.personal.name;
        document.getElementById('personal-title').textContent = data.personal.title;
        document.getElementById('personal-location').textContent = data.personal.location;
        
        const emailLink = document.getElementById('personal-email');
        emailLink.href = `mailto:${data.personal.email}`;
        emailLink.textContent = data.personal.email;
        
        document.getElementById('personal-phone').textContent = `Phone: ${data.personal.phone}`;
        document.getElementById('personal-linkedin').href = data.personal.linkedin;
        document.getElementById('personal-github').href = data.personal.github;

        // 3. Populate Summary
        document.getElementById('summary-text').textContent = data.summary;

        // 4. Populate Skills
        const skillsContainer = document.getElementById('skills-container');
        const skillKeys = Object.keys(data.skills);
        const half = Math.ceil(skillKeys.length / 2);
        const col1 = skillKeys.slice(0, half);
        const col2 = skillKeys.slice(half);

        const createSkillColumn = (keys) => `
            <div class="space-y-2 text-gray-700 dark:text-slate-300">
                ${keys.map(key => `<p><span class="font-semibold text-blue-600 dark:text-blue-300">${key}:</span> ${data.skills[key]}</p>`).join('')}
            </div>
        `;
        skillsContainer.innerHTML = createSkillColumn(col1) + createSkillColumn(col2);

        // 5. Populate Experience
        const expContainer = document.getElementById('experience-container');
        expContainer.innerHTML = data.experience.map(job => `
            <div class="mb-12">
                <div class="flex flex-col md:flex-row justify-between items-baseline mb-4">
                    <h3 class="text-xl font-bold text-gray-700 dark:text-slate-100">${job.company} - ${job.role}</h3>
                    <span class="${job.current ? 'text-pro-green bg-pro-green-dim' : 'text-gray-300 dark:text-slate-400 bg-slate-800'} font-bold text-sm px-3 py-1 rounded-full uppercase">${job.period}</span>
                </div>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 dark:text-slate-300">
                    ${job.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // 6. Populate Projects
        const projContainer = document.getElementById('projects-container');
        projContainer.innerHTML = data.projects.map(proj => `
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
                <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100">${proj.name}</h3>
                <p class="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-3 italic">${proj.tech}</p>
                ${(proj.live || proj.code) ? `
                <div class="mb-5 flex gap-6 text-sm">
                    ${proj.live ? `<a href="${proj.live}" target="_blank" class="project-link print-url">Live</a>` : ''}
                    ${proj.code ? `<a href="${proj.code}" target="_blank" class="source-link print-url">Code</a>` : ''}
                </div>
                ` : ''}
                <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400 text-sm">
                    ${proj.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // 7. Populate Education
        const eduContainer = document.getElementById('education-container');
        eduContainer.innerHTML = `
            <div class="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-lg border-l-4 border-pro-green">
                <div>
                    <p class="font-bold text-gray-900 dark:text-slate-100 text-lg">${data.education.degree}</p>
                    <p class="text-gray-600 dark:text-slate-400">${data.education.university} | Graduated ${data.education.year}</p>
                </div>
                <div class="text-right font-bold text-pro-green text-2xl">
                    ${data.education.cgpa} <span class="text-sm font-normal text-slate-500">CGPA</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Failed to load resume data:", error);
        document.getElementById('summary-text').textContent = "Failed to load resume data. Ensure resume.json is available in the same directory and you are running a local server.";
    }
}

// Initialize the data fetch once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadResumeData);