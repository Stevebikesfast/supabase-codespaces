// Current view state management
let currentTask = '';

// View management functions
function showAssistants() {
    document.getElementById('assistants-view').style.display = 'block';
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('work-interface').style.display = 'none';
}

function showProfile() {
    document.getElementById('assistants-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('work-interface').style.display = 'none';
}

function showWorkInterface(taskType) {
    document.getElementById('assistants-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('work-interface').style.display = 'block';
    
    // Update task title
    const taskTitles = {
        'pricing': 'Pricing Strategy',
        'revenue': 'Revenue Model Analysis',
        'market': 'Market Research',
        'features': 'Feature Prioritization',
        'conversion': 'Conversion Optimization',
        'growth': 'Growth Planning'
    };
    
    document.getElementById('task-title').textContent = taskTitles[taskType];
    currentTask = taskType;
    
    // Reset interface
    document.getElementById('user-input').value = '';
    document.getElementById('response').textContent = 'Enter your query above and click "Get Assistance" to start.';
    document.getElementById('loading').style.display = 'none';
}

async function submitQuery() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    const submitButton = document.querySelector('.input-area button');
    const loadingDiv = document.getElementById('loading');
    const responseDiv = document.getElementById('response');

    try {
        // Disable input and show loading
        submitButton.disabled = true;
        loadingDiv.style.display = 'block';
        responseDiv.textContent = '';

        // Prepare context based on task
        const taskContext = {
            pricing: "You are helping with Chrome extension pricing strategy. Focus on determining optimal pricing models and tiers.",
            revenue: "You are analyzing revenue models for Chrome extensions. Focus on sustainable monetization approaches.",
            market: "You are conducting market research for Chrome extensions. Focus on competitor analysis and market positioning.",
            features: "You are helping prioritize Chrome extension features. Focus on free vs premium feature distribution.",
            conversion: "You are optimizing free-to-paid conversion for Chrome extensions. Focus on conversion strategies.",
            growth: "You are planning Chrome extension growth strategy. Focus on sustainable monetization and growth."
        };

        // Add task-specific context to user input
        const contextualizedInput = `${taskContext[currentTask]}\n\nUser Query: ${userInput}`;

        // Send message to background script
        const response = await chrome.runtime.sendMessage({
            action: 'query_assistant',
            input: contextualizedInput
        });

        if (response.error) {
            throw new Error(response.error);
        }

        responseDiv.textContent = response.message;

    } catch (error) {
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
        const copyButton = document.querySelector('.copy-button');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Handle assistant card clicks
    const assistantCards = document.querySelectorAll('.assistant-card');
    assistantCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                showProfile();
            }
        });
    });
});
