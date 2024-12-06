// popup.js
import { signUp, signIn, signOut, getUser } from './auth.js';

// DOM Elements
const userEmailSpan = document.getElementById('user-email');
const signoutBtn = document.getElementById('signout-btn');
const authButtons = document.querySelector('.auth-buttons');
const signupBtn = document.getElementById('signup-btn');
const signinBtn = document.getElementById('signin-btn');
const authForm = document.getElementById('auth-form');
const authFormTitle = document.getElementById('auth-form-title');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authCancelBtn = document.getElementById('auth-cancel-btn');
const errorMessage = document.getElementById('error-message');
const assistantCards = document.querySelectorAll('.assistant-card');

// State
let isSignUp = true;
let currentUser = null;

// Initialize
async function init() {
  try {
    const { user, error } = await getUser();
    if (error) throw error;
    
    if (user) {
      handleAuthSuccess(user);
    } else {
      showAuthButtons();
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    showAuthButtons();
  }
}

// UI Handlers
function showAuthButtons() {
  authButtons.classList.add('show');
  signoutBtn.style.display = 'none';
  userEmailSpan.textContent = '';
  updateAssistantCards(false);
}

function showAuthForm(isSigningUp) {
  isSignUp = isSigningUp;
  authFormTitle.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  authSubmitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  authForm.classList.add('show');
  authButtons.classList.remove('show');
}

function hideAuthForm() {
  authForm.classList.remove('show');
  authButtons.classList.add('show');
  emailInput.value = '';
  passwordInput.value = '';
  errorMessage.classList.remove('show');
}

function handleAuthSuccess(user) {
  currentUser = user;
  userEmailSpan.textContent = user.email;
  signoutBtn.style.display = 'inline-block';
  authButtons.classList.remove('show');
  authForm.classList.remove('show');
  updateAssistantCards(true);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
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

// Event Listeners
signupBtn.addEventListener('click', () => showAuthForm(true));
signinBtn.addEventListener('click', () => showAuthForm(false));
authCancelBtn.addEventListener('click', hideAuthForm);

authSubmitBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }

  try {
    const { user, error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      showError(error.message);
      return;
    }

    if (user) {
      handleAuthSuccess(user);
    }
  } catch (error) {
    console.error('Auth error:', error);
    showError('An unexpected error occurred');
  }
});

signoutBtn.addEventListener('click', async () => {
  try {
    const { error } = await signOut();
    if (error) throw error;
    
    currentUser = null;
    showAuthButtons();
  } catch (error) {
    console.error('Error signing out:', error);
    showError('Error signing out');
  }
});

// Initialize the popup
init();
