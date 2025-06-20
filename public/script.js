const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;


  appendMessage('user', userMessage);
  input.value = '';
  input.focus();

  await sendMessageToGemini(userMessage);
});

async function sendMessageToGemini(message) {
  appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }), // Send message as JSON
    });

    // Remove the "thinking..." message before displaying the actual response or error
    const thinkingMessage = chatBox.lastChild;
    if (thinkingMessage && thinkingMessage.classList.contains('bot') && thinkingMessage.textContent.includes('thinking...')) {
      chatBox.removeChild(thinkingMessage);
    }

    if (!response.ok) {
      // Try to parse error response from backend
      let errorData = { reply: `HTTP error! status: ${response.status}` }; // Default error
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // If response is not JSON, use the statusText or a generic message
        console.error("Could not parse error JSON:", jsonError);
        errorData.reply = response.statusText || `HTTP error! status: ${response.status}`;
      }
      appendMessage('bot', `Error: ${errorData.reply || errorData.error || 'An unknown error occurred.'}`);
      return;
    }

    const data = await response.json();
    appendMessage('bot', data.reply); // Display Gemini's response

  } catch (error) {
    // Handle network errors or other issues with the fetch call itself
    console.error('Fetch error:', error);
    // Ensure thinking message is removed even on network error
    const thinkingMessage = chatBox.lastChild;
    if (thinkingMessage && thinkingMessage.classList.contains('bot') && thinkingMessage.textContent.includes('thinking...')) {
      chatBox.removeChild(thinkingMessage);
    }
    appendMessage('bot', 'Error: Could not connect to the server. ' + error.message);
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  if (sender === 'bot') {
    let finalHtml = '';
    // Split by ``` to alternate between non-code and code segments
    const parts = text.split(/```/g);

    for (let i = 0; i < parts.length; i++) {
      let segment = parts[i];

      // First, sanitize any '<' or '>' characters in the current segment
      // to prevent XSS and ensure they are displayed literally if not part of our markdown.
      segment = segment.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      if (i % 2 === 0) { // Non-code segment
        // Apply bold and italics
        segment = segment.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>'); // **bold**
        segment = segment.replace(/__([\s\S]*?)__/g, '<strong>$1</strong>'); // __bold__
        segment = segment.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');   // *italic*
        segment = segment.replace(/_([\s\S]*?)_/g, '<em>$1</em>');     // _italic_

        // Convert newlines to <br> for display in HTML
        segment = segment.replace(/\n/g, '<br>');
        finalHtml += segment;
      } else { // Code segment (content was between ```...```)
        // The segment is already sanitized for < and > from the step above.
        // Trim leading/trailing whitespace which often includes newlines around the code.
        const codeContent = segment.trim();

        // Render the code block. If codeContent is empty, it means we had something like ``` ```
        // or ```\n``` which should render as an empty code block.
        if (codeContent || parts.length > 1) { // Ensure we add pre/code even for empty blocks if ``` was used
          finalHtml += `<pre><code>${codeContent}</code></pre>`;
        }
      }
    }
    msg.innerHTML = finalHtml;

    // Add copy buttons to <pre> elements after HTML is set
    msg.querySelectorAll('pre').forEach(preElement => {
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.classList.add('copy-btn');
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');

      copyButton.addEventListener('click', () => {
        const codeElement = preElement.querySelector('code');
        if (codeElement) {
          navigator.clipboard.writeText(codeElement.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.classList.remove('copied');
            }, 2000); // Reset after 2 seconds
          }).catch(err => {
            console.error('Failed to copy text: ', err);
            copyButton.textContent = 'Error'; // Or handle error more gracefully
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 2000);
          });
        }
      });
      preElement.prepend(copyButton); // Add button inside the <pre> tag
    });
  } else {
    // For user messages, textContent is safer as it doesn't parse HTML.
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  // Ensure the scroll happens after the DOM update and layout reflow
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }, 0);
}
