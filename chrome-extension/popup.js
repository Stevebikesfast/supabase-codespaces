document.addEventListener('DOMContentLoaded', () => {
  const assistantSelect = document.getElementById('assistant');
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const statusDiv = document.getElementById('status');

  // Load assistants into dropdown
  chrome.runtime.sendMessage({ type: 'GET_ASSISTANTS' }, response => {
    assistantSelect.innerHTML = response.assistants
      .map(name => `<option value="${name}">${name}</option>`)
      .join('');
  });

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show status message
  function showStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'error' : 'success';
  }

  // Handle send message
  async function handleSend() {
    const message = userInput.value.trim();
    const selectedAssistant = assistantSelect.value;

    if (!message) {
      showStatus('Please enter a message', true);
      return;
    }

    if (!selectedAssistant) {
      showStatus('Please select an assistant', true);
      return;
    }

    // Disable input while processing
    userInput.disabled = true;
    sendButton.disabled = true;
    showStatus('Sending message...');

    // Add user message to chat
    addMessage(message, true);

    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'SEND_MESSAGE',
      assistant: selectedAssistant,
      message: message
    }, response => {
      if (response.success) {
        // Add assistant response to chat
        addMessage(response.response);
        showStatus('Message sent successfully');
      } else {
        showStatus(`Error: ${response.error}`, true);
      }

      // Re-enable input
      userInput.disabled = false;
      sendButton.disabled = false;
      userInput.value = '';
      userInput.focus();
    });
  }

  // Event listeners
  sendButton.addEventListener('click', handleSend);
  
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Initial status
  showStatus('Select an assistant and start chatting!');
});
