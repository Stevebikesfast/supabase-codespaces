document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assistant-form');
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        try {
            // Disable form while processing
            submitButton.disabled = true;
            responseDiv.textContent = 'Asking David...';
            
            // Send message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'query_assistant',
                input: message
            });
            
            // Handle response
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
        }
    });
});
