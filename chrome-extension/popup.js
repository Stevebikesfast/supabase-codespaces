// popup.js
import { signUp, signIn, signOut, getUser } from './auth.js';

// Current view and task state
let currentTask = '';
let currentAssistant = '';

// Assistant data
const assistants = {
    david: {
        name: "David Kumar",
        title: "Extension Project & QA Engineer",
        assistantId: "asst_ZfHROr8g5jAEZA3HgtpBd4VT",
        image: "Assistant-Profile/david-kumar.png",
        bio: "10 years experience, guided 200+ successful extension launches with zero critical post-launch issues",
        tasks: [/* tasks */]
    },
    james: {
        name: "James Morrison",
        title: "Extension Monetization Strategist",
        assistantId: "asst_KU36EdfB300bU6thcFGloMC3",
        image: "Assistant-Profile/james-morrison.png",
        bio: "MBA with proven success generating over $2M in extension revenue",
        tasks: [/* tasks */]
    },
    // ... other assistants
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
    document.getElementById('profile-image').src = assistant.image;
    document.getElementById('profile-name').textContent = assistant.name;
    document.getElementById('profile-title').textContent = assistant.title;
    document.getElementById('profile-bio').textContent = assistant.bio;

    document.getElementById('assistants-view').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
    document.getElementById('work-interface').classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Handle assistant card clicks
    const assistantCards = document.querySelectorAll('.assistant-card');
    assistantCards.forEach(card => {
        const assistantId = card.dataset.assistant;
        const assistant = assistants[assistantId];
        if (assistant) {
            const img = card.querySelector('.profile-pic');
            img.src = assistant.image;
        }
        card.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                showProfile(this.dataset.assistant);
            }
        });
    });

    // Handle navigation buttons
    document.getElementById('back-to-assistants')?.addEventListener('click', showAssistants);
    document.getElementById('back-to-tasks')?.addEventListener('click', () => showProfile(currentAssistant));

    // Handle auth-related UI
    const userEmailSpan = document.getElementById('user-email');
    const signoutBtn = document.getElementById('signout-btn');
    const authButtons = document.querySelector('.auth-buttons');
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const authForm = document.getElementById('auth-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authCancelBtn = document.getElementById('auth-cancel-btn');
    const errorMessage = document.getElementById('error-message');

    // Auth state
    let isSignUp = true;

    // Auth UI functions
    function showAuthButtons() {
        if (authButtons) authButtons.classList.add('show');
        if (signoutBtn) signoutBtn.style.display = 'none';
        if (userEmailSpan) userEmailSpan.textContent = '';
        updateAssistantCards(false);
    }

    function handleAuthSuccess(user) {
        if (userEmailSpan) userEmailSpan.textContent = user.email;
        if (signoutBtn) signoutBtn.style.display = 'inline-block';
        if (authButtons) authButtons.classList.remove('show');
        if (authForm) authForm.classList.remove('show');
        updateAssistantCards(true);
    }

    function updateAssistantCards(isAuthenticated) {
        assistantCards.forEach((card, index) => {
            if (index === 0 || isAuthenticated) {
                card.classList.remove('locked');
            } else {
                card.classList.add('locked');
            }
        });
    }

    // Auth event listeners
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            isSignUp = true;
            if (authForm) {
                document.getElementById('auth-form-title').textContent = 'Sign Up';
                authSubmitBtn.textContent = 'Sign Up';
                authForm.classList.add('show');
                authButtons.classList.remove('show');
            }
        });
    }

    if (signinBtn) {
        signinBtn.addEventListener('click', () => {
            isSignUp = false;
            if (authForm) {
                document.getElementById('auth-form-title').textContent = 'Sign In';
                authSubmitBtn.textContent = 'Sign In';
                authForm.classList.add('show');
                authButtons.classList.remove('show');
            }
        });
    }

    if (authCancelBtn) {
        authCancelBtn.addEventListener('click', () => {
            if (authForm) {
                authForm.classList.remove('show');
                authButtons.classList.add('show');
                emailInput.value = '';
                passwordInput.value = '';
                errorMessage.classList.remove('show');
            }
        });
    }

    if (authSubmitBtn) {
        authSubmitBtn.addEventListener('click', async () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                errorMessage.textContent = 'Please enter both email and password';
                errorMessage.classList.add('show');
                return;
            }

            try {
                const { user, error } = isSignUp 
                    ? await signUp(email, password)
                    : await signIn(email, password);

                if (error) {
                    errorMessage.textContent = error.message;
                    errorMessage.classList.add('show');
                    return;
                }

                if (user) {
                    handleAuthSuccess(user);
                }
            } catch (error) {
                console.error('Auth error:', error);
                errorMessage.textContent = 'An unexpected error occurred';
                errorMessage.classList.add('show');
            }
        });
    }

    if (signoutBtn) {
        signoutBtn.addEventListener('click', async () => {
            try {
                const { error } = await signOut();
                if (error) throw error;
                showAuthButtons();
            } catch (error) {
                console.error('Error signing out:', error);
                errorMessage.textContent = 'Error signing out';
                errorMessage.classList.add('show');
            }
        });
    }

    // Check initial auth state
    getUser().then(({ user }) => {
        if (user) {
            handleAuthSuccess(user);
        } else {
            showAuthButtons();
        }
    }).catch(error => {
        console.error('Error checking auth status:', error);
        showAuthButtons();
    });
});
