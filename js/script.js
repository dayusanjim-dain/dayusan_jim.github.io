"use strict";

document.addEventListener("DOMContentLoaded", function () {
    loadPortfolio();
    setupContactForm();
    setupBackToTop();
    setupScrollAnimations();
    setupElectricSparks(); // ⚡ Keep the blue spark effect
});

async function loadPortfolio() {
    const projectsMessage = document.getElementById("projectsMessage");
    
    // ✅ If you're NOT using projects.json yet, just show static content
    try {
        const response = await fetch("data/projects.json");
        if (!response.ok) throw new Error("JSON not found");
        
        const data = await response.json();
        
        // Update content from JSON
        if (document.getElementById("studentName"))
            document.getElementById("studentName").textContent = data.name;
        if (document.getElementById("tagline"))
            document.getElementById("tagline").textContent = data.tagline;
        if (document.getElementById("introduction"))
            document.getElementById("introduction").textContent = data.introduction;
        if (document.getElementById("profileImage"))
            document.getElementById("profileImage").src = data.profileImage;
        if (document.getElementById("biography"))
            document.getElementById("biography").textContent = data.about.biography;
        if (document.getElementById("education"))
            document.getElementById("education").textContent = data.about.program + " - " + data.about.school;
        if (document.getElementById("graduation"))
            document.getElementById("graduation").textContent = data.about.graduation;
        if (document.getElementById("careerGoal"))
            document.getElementById("careerGoal").textContent = data.about.careerGoal;
        if (document.getElementById("interests"))
            document.getElementById("interests").textContent = data.about.interests;
        if (document.getElementById("contactEmail")) {
            document.getElementById("contactEmail").textContent = data.contact.email;
            document.getElementById("contactEmail").href = "mailto:" + data.contact.email;
        }
        if (document.getElementById("contactLocation"))
            document.getElementById("contactLocation").textContent = "Location: " + data.contact.location;
        if (document.getElementById("linkedinLink"))
            document.getElementById("linkedinLink").href = data.contact.linkedin;
        if (document.getElementById("footerText"))
            document.getElementById("footerText").textContent = "\u00A9 " + new Date().getFullYear() + " " + data.name + ". All rights reserved.";
        
        displaySkills(data.skills);
        displayProjects(data.projects);
        loadGitHubRepositories(data.githubUsername);
        
    } catch (error) {
        console.log("📄 Using static content (no projects.json needed):", error.message);
        // ✅ Your HTML already has the content hardcoded — so this is fine!
        if (projectsMessage) projectsMessage.textContent = "";
    }
}

function displaySkills(skills) {
    const container = document.getElementById("skillsContainer");
    if (!container || !Array.isArray(skills)) return;
    
    container.replaceChildren();
    skills.forEach(function (skill) {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.textContent = skill;
        container.appendChild(card);
    });
}

function displayProjects(projects) {
    const container = document.getElementById("projectsContainer");
    const message = document.getElementById("projectsMessage");
    if (!container) return;
    
    if (!Array.isArray(projects) || projects.length === 0) {
        if (message) message.textContent = "";
        return;
    }
    
    if (message) message.textContent = "";
    container.replaceChildren();
    
    projects.forEach(function (project) {
        const card = document.createElement("article");
        card.className = "project-card project-card-single";
        
        const content = document.createElement("div");
        content.className = "project-content";
        
        const title = document.createElement("h3");
        title.textContent = project.title;
        
        const description = document.createElement("p");
        description.textContent = project.description;
        
        const tech = document.createElement("span");
        tech.className = "project-tech";
        tech.textContent = project.technologies;
        
        content.append(title, description, tech);
        card.appendChild(content);
        container.appendChild(card);
    });
}

async function loadGitHubRepositories(username) {
    const container = document.getElementById("githubRepos");
    const message = document.getElementById("githubMessage");
    const profileLink = document.getElementById("githubProfile");
    
    if (!container) return;
    
    if (!username || username === "yourusername") {
        if (message) message.textContent = "";
        return;
    }
    
    if (profileLink) profileLink.href = "https://github.com/" + encodeURIComponent(username);
    
    try {
        const apiURL = "https://api.github.com/users/" + encodeURIComponent(username) + "/repos?sort=updated&per_page=5&type=public";
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("GitHub API failed");
        
        const repositories = await response.json();
        container.replaceChildren();
        
        if (repositories.length === 0) {
            if (message) message.textContent = "";
            return;
        }
        
        if (message) message.textContent = "";
        repositories.forEach(function (repo) {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = repo.name;
            
            const language = document.createElement("p");
            language.className = "repository-language";
            language.textContent = "Main language: " + (repo.language || "Not specified");
            
            item.append(link, language);
            container.appendChild(item);
        });
        
    } catch (error) {
        console.log("GitHub API error:", error.message);
        if (message) message.textContent = "";
    }
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    
    if (!form || !feedback) return;
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!form.checkValidity()) {
            feedback.textContent = "Please complete all fields correctly.";
            return;
        }
        
        const visitorName = document.getElementById("visitorName").value.trim();
        const visitorMessage = document.getElementById("visitorMessage").value.trim();
        
        if (visitorName.length < 2 || visitorMessage.length < 10) {
            feedback.textContent = "Enter a valid name and message (at least 10 characters).";
            return;
        }
        
        feedback.textContent = "✅ Message sent successfully!";
        form.reset();
        
        setTimeout(() => {
            feedback.textContent = "";
        }, 5000);
    });
}

function setupBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;
    
    window.addEventListener("scroll", function () {
        button.classList.toggle("visible", window.scrollY > 300);
    });
    
    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ⚡ BLUE ELECTRIC FLAME SPARKS EFFECT
function setupElectricSparks() {
    function createElectricSparks(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.classList.add('electric-spark');
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 25 + Math.random() * 15;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            spark.style.left = centerX + 'px';
            spark.style.top = centerY + 'px';
            spark.style.transform = `translate(-50%, -50%) translate(${endX}px, ${endY}px)`;
            spark.style.animation = `sparkFade 0.5s ease-out forwards`;
            
            document.body.appendChild(spark);
            
            setTimeout(() => spark.remove(), 500);
        }
    }
    
    document.querySelectorAll('.btn, .nav-btn, .back-to-top').forEach(btn => {
        btn.addEventListener('click', createElectricSparks);
        btn.addEventListener('touchstart', createElectricSparks);
    });
}
