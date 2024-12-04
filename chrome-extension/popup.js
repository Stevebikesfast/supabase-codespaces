// Current view and task state
let currentTask = '';
let currentAssistant = '';

// Assistant data
const assistants = {
    david: {
        name: "David Kumar",
        title: "Extension Project & QA Engineer",
        bio: "Extension development expert with 10+ years experience. Successfully guided 200+ extension launches with zero critical post-launch issues.",
        tasks: [
            { name: "Project Roadmap Creator", description: "Creates your extension development plan and timeline", type: "roadmap" },
            { name: "Test Plan Generator", description: "Builds comprehensive testing strategy for your extension", type: "testing" },
            { name: "Quality Checklist Manager", description: "Creates quality assurance process for your extension", type: "quality" },
            { name: "Risk Assessment Expert", description: "Identifies and plans for potential project risks", type: "risks" },
            { name: "Release Manager", description: "Plans smooth deployment of your extension", type: "release" },
            { name: "Performance Optimizer", description: "Maximizes extension performance and efficiency", type: "performance" }
        ]
    },
    james: {
        name: "James Morrison",
        title: "Extension Monetization Strategist",
        bio: "MBA-qualified strategist who has generated over $2M in extension revenue. Expert in turning extensions into profitable businesses.",
        tasks: [
            { name: "Revenue Model Designer", description: "Creates profitable business model for your extension", type: "revenue" },
            { name: "Growth Strategy Planner", description: "Develops sustainable user growth plan", type: "growth" },
            { name: "Market Analysis Expert", description: "Analyzes market opportunities and competition", type: "market" },
            { name: "User Acquisition Manager", description: "Plans efficient user acquisition strategy", type: "acquisition" },
            { name: "Retention Strategist", description: "Maximizes user retention and engagement", type: "retention" },
            { name: "Partnership Developer", description: "Creates strategic partnership growth plan", type: "partnerships" }
        ]
    },
    maya: {
        name: "Dr. Maya Patel",
        title: "AI Integration Architect",
        bio: "PhD in AI with extensive experience in prompt engineering and extension development. Expert in AI tool integration.",
        tasks: [
            { name: "Prompt Architecture Designer", description: "Creates effective AI prompts for your extension", type: "prompts" },
            { name: "AI Integration Engineer", description: "Plans seamless AI service connection", type: "integration" },
            { name: "Cost Optimization Manager", description: "Optimizes AI usage efficiency", type: "costs" },
            { name: "Response Handler Builder", description: "Designs AI response processing system", type: "responses" },
            { name: "AI Security Architect", description: "Creates secure AI implementation plan", type: "security" },
            { name: "Model Performance Optimizer", description: "Optimizes AI response efficiency", type: "optimization" }
        ]
    },
    marcus: {
        name: "Marcus Thompson",
        title: "Chrome Store Launch Strategist",
        bio: "10 years of app store optimization experience with 500+ successful launches. Expert in store presence and conversion optimization.",
        tasks: [
            { name: "Store Listing Optimizer", description: "Creates compelling store page content", type: "listing" },
            { name: "Category Strategist", description: "Optimizes store categorization", type: "category" },
            { name: "Price Point Optimizer", description: "Determines revenue-maximizing pricing", type: "pricing" },
            { name: "Review Response Manager", description: "Creates effective review management strategy", type: "reviews" },
            { name: "Store Analytics Expert", description: "Analyzes store performance data", type: "analytics" },
            { name: "Launch Sequence Planner", description: "Plans successful store launch", type: "launch" }
        ]
    },
    sarah: {
        name: "Dr. Sarah Peterson",
        title: "Extension Architecture Specialist",
        bio: "PhD in Computer Science with 12 years of Chrome extension development experience. Expert in technical implementation.",
        tasks: [
            { name: "Manifest Generator", description: "Creates optimized manifest.json configuration", type: "manifest" },
            { name: "Background Service Builder", description: "Designs efficient background processing", type: "background" },
            { name: "Content Script Architect", description: "Plans page interaction implementation", type: "content" },
            { name: "Storage System Designer", description: "Creates data management solution", type: "storage" },
            { name: "API Integration Expert", description: "Plans external API connections", type: "api" },
            { name: "Extension Debugger", description: "Creates testing and debugging setup", type: "debug" }
        ]
    },
    alex: {
        name: "Alex Chen",
        title: "Visual Design Architect",
        bio: "15 years of UI/UX experience specializing in Chrome extensions. Expert in creating professional, user-friendly designs.",
        tasks: [
            { name: "Extension Icon Creator", description: "Designs professional icon suite", type: "icons" },
            { name: "Store Screenshot Planner", description: "Creates compelling store listing visuals", type: "screenshots" },
            { name: "Extension UI Designer", description: "Develops user-friendly interface", type: "ui" },
            { name: "Marketing Visual Generator", description: "Creates promotional assets", type: "marketing" },
            { name: "Animation Designer", description: "Plans engaging UI interactions", type: "animations" },
            { name: "Visual Asset Organizer", description: "Creates visual asset management system", type: "assets" }
        ]
    }
};

// View management functions
function showAssistants() {
    document.getElementById('assistants-view').classList.remove('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('work-interface').classList.add('hidden');
}

function showProfile(assistantId) {
    const assistant = assistants[assistantId];
    if (!assistant) return;

    currentAssistant = assistantId;
    
    // Update profile details
    document.getElementById('profile-image').src = `https://ui-avatars.com/api/?name=${assistant.name.replace(' ', '+')}&background=3ECF8E&color=fff&size=200`;
    document.getElementById('profile-name').textContent = assistant.name;
    document.getElementById('profile-title').textContent = assistant.title;
    document.getElementById('profile-bio').textContent = assistant.bio;

    // Clear and populate tasks
    const tasksGrid = document.getElementById('tasks-grid');
    tasksGrid.innerHTML = '';
    assistant.tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.task = task.type;
        taskCard.innerHTML = `
            <h3 class="task-name">${task.name}</h3>
            <p class="task-description">${task.description}</p>
        `;
        taskCard.addEventListener('click', () => showWorkInterface(task.type));
        tasksGrid.appendChild(taskCard);
    });

    document.getElementById('assistants-view').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
    document.getElementById('work-interface').classList.add('hidden');
}

function showWorkInterface(taskType) {
    document.getElementById('assistants-view').classList.add('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('work-interface').classList.remove('hidden');
    
    const assistant = assistants[currentAssistant];
    const task = assistant.tasks.find(t => t.type === taskType);
    
    document.getElementById('task-title').textContent = task.name;
    currentTask = taskType;
    
    // Reset interface
    document.getElementById('user-input').value = '';
    document.getElementById('response').textContent = 'Enter your query above and click "Get Assistance" to start.';
    document.getElementById('loading').style.display = 'none';
}

async function submitQuery() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    const submitButton = document.getElementById('submit-query');
    const loadingDiv = document.getElementById('loading');
    const responseDiv = document.getElementById('response');

    try {
        // Disable input and show loading
        submitButton.disabled = true;
        loadingDiv.style.display = 'block';
        responseDiv.textContent = '';

        const assistant = assistants[currentAssistant];
        const task = assistant.tasks.find(t => t.type === currentTask);

        // Send message to background script
        const response = await chrome.runtime.sendMessage({
            action: 'query_assistant',
            input: userInput,
            context: {
                assistant: currentAssistant,
                task: currentTask,
                isPaid: document.getElementById('dev-toggle').checked
            }
        });

        if (response.error) {
            throw new Error(response.error);
        }

        responseDiv.textContent = response.message;
        responseDiv.classList.remove('error');

    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = `Error: ${error.message}`;
        responseDiv.classList.add('error');
    } finally {
        submitButton.disabled = false;
        loadingDiv.style.display = 'none';
    }
}

function copyResponse() {
    const responseText = document.getElementById('response').textContent;
    navigator.clipboard.writeText(responseText).then(() => {
        const copyButton = document.getElementById('copy-response');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    });
}

function updateAssistantCards() {
    const isPaid = document.getElementById('dev-toggle').checked;
    const assistantCards = document.querySelectorAll('.assistant-card');
    
    assistantCards.forEach(card => {
        if (!isPaid && card.dataset.assistant !== 'james') {
            card.classList.add('locked');
        } else {
            card.classList.remove('locked');
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Handle assistant card clicks
    const assistantCards = document.querySelectorAll('.assistant-card');
    assistantCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                showProfile(this.dataset.assistant);
            }
        });
    });

    // Handle navigation buttons
    document.getElementById('back-to-assistants').addEventListener('click', showAssistants);
    document.getElementById('back-to-tasks').addEventListener('click', () => showProfile(currentAssistant));

    // Handle submit and copy buttons
    document.getElementById('submit-query').addEventListener('click', submitQuery);
    document.getElementById('copy-response').addEventListener('click', copyResponse);

    // Handle free/paid toggle
    document.getElementById('dev-toggle').addEventListener('change', updateAssistantCards);
    
    // Initial state setup
    updateAssistantCards();
});
