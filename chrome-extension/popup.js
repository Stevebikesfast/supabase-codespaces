// Current view and task state
let currentTask = '';
let currentAssistant = '';

// Assistant data
const assistants = {
    david: {
        name: "David Kumar",
        title: "Extension Project & QA Engineer",
        assistantId: "asst_ZfHROr8g5jAEZA3HgtpBd4VT",
        bio: "10 years experience, guided 200+ successful extension launches with zero critical post-launch issues",
        tasks: [
            {
                name: "Project Roadmap Creator",
                description: "Creates your extension development plan and timeline",
                type: "roadmap",
                workInstructions: "List your extension features, available timeline, team resources, and any technical dependencies"
            },
            {
                name: "Test Plan Generator",
                description: "Builds comprehensive testing strategy for your extension",
                type: "testing",
                workInstructions: "Describe your extension features, critical paths, user scenarios, and performance requirements"
            },
            {
                name: "Quality Checklist Manager",
                description: "Creates quality assurance process for your extension",
                type: "quality",
                workInstructions: "List your quality requirements, critical features, user expectations, and performance targets"
            },
            {
                name: "Risk Assessment Expert",
                description: "Identifies and plans for potential project risks",
                type: "risks",
                workInstructions: "Outline your project scope, critical paths, dependencies, and constraints"
            },
            {
                name: "Release Manager",
                description: "Plans smooth deployment of your extension",
                type: "release",
                workInstructions: "Specify your release scope, dependencies, stakeholders, and timeline"
            },
            {
                name: "Performance Optimizer",
                description: "Maximizes extension performance and efficiency",
                type: "performance",
                workInstructions: "Share your performance metrics, user feedback, resource usage, and speed requirements"
            }
        ]
    },
    james: {
        name: "James Morrison",
        title: "Extension Monetization Strategist",
        assistantId: "asst_KU36EdfB300bU6thcFGloMC3",
        bio: "MBA with proven success generating over $2M in extension revenue",
        tasks: [
            {
                name: "Revenue Model Designer",
                description: "Creates profitable business model for your extension",
                type: "revenue",
                workInstructions: "List your extension features, target market size, user segments, and cost structure"
            },
            {
                name: "Growth Strategy Planner",
                description: "Develops sustainable user growth plan",
                type: "growth",
                workInstructions: "Share your current metrics, growth targets, available resources, and timeline"
            },
            {
                name: "Market Analysis Expert",
                description: "Analyzes market opportunities",
                type: "market",
                workInstructions: "Describe your target market, competitor data, user needs, and market trends"
            },
            {
                name: "User Acquisition Manager",
                description: "Plans efficient user acquisition strategy",
                type: "acquisition",
                workInstructions: "Define your target users, potential acquisition channels, budget, and goals"
            },
            {
                name: "Retention Strategist",
                description: "Maximizes user retention",
                type: "retention",
                workInstructions: "Share your user behavior data, churn points, feature usage, and feedback data"
            },
            {
                name: "Partnership Developer",
                description: "Creates strategic partnership plan",
                type: "partnerships",
                workInstructions: "List desired partner types, integration needs, value proposition, and growth goals"
            }
        ]
    },
    maya: {
        name: "Dr. Maya Patel",
        title: "AI Integration Architect",
        assistantId: "asst_TiwJg7g4ADVOc304Z6btxcSN",
        bio: "PhD in AI with extensive experience in prompt engineering and extension development",
        tasks: [
            {
                name: "Prompt Architecture Designer",
                description: "Creates effective AI prompts for your extension",
                type: "prompts",
                workInstructions: "Describe your use case, AI model choice, desired output, and context needs"
            },
            {
                name: "AI Integration Engineer",
                description: "Designs seamless AI service connection",
                type: "integration",
                workInstructions: "Specify your AI service choice, API requirements, response handling needs, and error scenarios"
            },
            {
                name: "Cost Optimization Manager",
                description: "Optimizes AI usage efficiency",
                type: "costs",
                workInstructions: "Share your usage patterns, budget constraints, performance needs, and scale requirements"
            },
            {
                name: "Response Handler Builder",
                description: "Creates AI response processing system",
                type: "responses",
                workInstructions: "Define your response format, processing needs, error cases, and required output format"
            },
            {
                name: "AI Security Architect",
                description: "Implements secure AI integration",
                type: "security",
                workInstructions: "List your security requirements, data handling needs, privacy needs, and compliance rules"
            },
            {
                name: "Model Performance Optimizer",
                description: "Optimizes AI response performance",
                type: "optimization",
                workInstructions: "Share your performance metrics, quality requirements, speed needs, and accuracy goals"
            }
        ]
    },
    marcus: {
        name: "Marcus Thompson",
        title: "Chrome Store Launch Strategist",
        assistantId: "asst_mLuXIK4Dq9EvEgiAuWX89yja",
        bio: "10 years of app store optimization, 500+ successful launches",
        tasks: [
            {
                name: "Store Listing Optimizer",
                description: "Creates compelling store page",
                type: "listing",
                workInstructions: "List your extension features, target audience, key benefits, and competitor information"
            },
            {
                name: "Category Strategist",
                description: "Optimizes store categorization",
                type: "category",
                workInstructions: "Describe your extension functionality, user needs, target demographics, and similar extensions"
            },
            {
                name: "Price Point Optimizer",
                description: "Determines revenue-maximizing pricing",
                type: "pricing",
                workInstructions: "Share your feature set, target market, competitor prices, and cost structure"
            },
            {
                name: "Review Response Manager",
                description: "Creates effective review management system",
                type: "reviews",
                workInstructions: "Provide review content, user sentiment, technical issues, and response goals"
            },
            {
                name: "Store Analytics Expert",
                description: "Analyzes store performance data",
                type: "analytics",
                workInstructions: "List your current metrics, target metrics, time period, and growth goals"
            },
            {
                name: "Launch Sequence Planner",
                description: "Plans successful store launch",
                type: "launch",
                workInstructions: "Define your launch timeline, target audience, marketing assets, and success metrics"
            }
        ]
    },
    sarah: {
        name: "Dr. Sarah Peterson",
        title: "Extension Architecture Specialist",
        assistantId: "asst_qnef4J22UaggREIffmdJ60Ye",
        bio: "PhD in Computer Science, 12 years Chrome extension development experience",
        tasks: [
            {
                name: "Manifest Generator",
                description: "Creates optimized manifest.json",
                type: "manifest",
                workInstructions: "List your extension features, required permissions, API usage, and security needs"
            },
            {
                name: "Background Service Builder",
                description: "Develops efficient background processing",
                type: "background",
                workInstructions: "Describe required functionality, performance needs, state management, and API interactions"
            },
            {
                name: "Content Script Architect",
                description: "Implements page interactions",
                type: "content",
                workInstructions: "List target websites, required access, user interactions, and data needs"
            },
            {
                name: "Storage System Designer",
                description: "Creates data management solution",
                type: "storage",
                workInstructions: "Define your data structure, storage needs, security requirements, and sync preferences"
            },
            {
                name: "API Integration Expert",
                description: "Sets up external API connections",
                type: "api",
                workInstructions: "Specify API requirements, authentication needs, data handling, and error scenarios"
            },
            {
                name: "Extension Debugger",
                description: "Creates testing and debugging setup",
                type: "debug",
                workInstructions: "Share known issues, test scenarios, performance metrics, and error logs"
            }
        ]
    },
    alex: {
        name: "Alex Chen",
        title: "Visual Design Architect",
        assistantId: "asst_SEpK5PwswVJmYKIObjwiYttw",
        bio: "15 years UI/UX experience specializing in Chrome extensions",
        tasks: [
            {
                name: "Extension Icon Creator",
                description: "Designs professional icon suite",
                type: "icons",
                workInstructions: "Describe extension purpose, target audience, brand colors/style, and key visual elements"
            },
            {
                name: "Store Screenshot Planner",
                description: "Creates compelling store listing visuals",
                type: "screenshots",
                workInstructions: "List key features, user benefits, UI highlights, and target emotions"
            },
            {
                name: "Extension UI Designer",
                description: "Develops user-friendly interface",
                type: "ui",
                workInstructions: "Specify required elements, core functions, space needs, and user flow"
            },
            {
                name: "Marketing Visual Generator",
                description: "Creates promotional assets",
                type: "marketing",
                workInstructions: "Share value proposition, target platforms, brand identity, and campaign goals"
            },
            {
                name: "Animation Designer",
                description: "Designs engaging UI interactions",
                type: "animations",
                workInstructions: "List interactive elements, desired effects, performance needs, and timing requirements"
            },
            {
                name: "Visual Asset Organizer",
                description: "Manages visual asset system",
                type: "assets",
                workInstructions: "Provide asset inventory, file structure needs, naming conventions, and version control requirements"
            }
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
    document.getElementById('profile-image').src = `https://ui-avatars.com/api/?name=${assistant.name.replace(' ', '+')}&background=3ECF8E&color=fff&size=80`;
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
    document.getElementById('user-input').placeholder = task.workInstructions;
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
                assistantId: assistant.assistantId,
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
