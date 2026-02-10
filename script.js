document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotIcon = document.getElementById("chatbot-icon");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatBotInput = document.getElementById("chatbot-input");

    chatbotIcon.addEventListener("click", () => {
        chatbotContainer.classList.remove("hidden");
        chatbotIcon.style.display = "none";
    });

    closeBtn.addEventListener("click", () => {
        chatbotContainer.classList.add("hidden");
        chatbotIcon.style.display = "flex";
    });


    sendBtn.addEventListener("click", sendMessage);
    chatBotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});

function sendMessage() {
    const inputField = document.getElementById("chatbot-input");
    const userMessage = inputField.value.trim();

    if (userMessage) {

        const welcome = document.getElementById("welcome-screen");
        if (welcome) welcome.style.display = "none";

        appendMessage("user", userMessage);
        inputField.value = ""; 
        getBotResponse(userMessage);
    }
}

function appendMessage(sender, message) {
    const messageContainer = document.getElementById("chatbot-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    

    const chatBody = document.getElementById("chatbot-body");
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function getBotResponse(userMessage) {
    
    const API_KEY = "AIzaSyAhOdekxM72HCrb2rPYgn6LbKhBr45eeyw"; 
    
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;


    appendMessage("bot", "...");

    try {
        const response = await fetch(API_URL, {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            }),
        });

        const data = await response.json();

        const messages = document.getElementById("chatbot-messages");
        if (messages.lastChild && messages.lastChild.textContent === "...") {
            messages.removeChild(messages.lastChild);
        }

        if (!response.ok) {

            throw new Error(data.error ? data.error.message : `Error: ${response.status}`);
        }

        if (data.candidates && data.candidates.length > 0) {
            const botMessage = data.candidates[0].content.parts[0].text;
            appendMessage("bot", botMessage);
        }
    } catch (error) {
        const messages = document.getElementById("chatbot-messages");
        if (messages.lastChild && messages.lastChild.textContent === "...") {
            messages.removeChild(messages.lastChild);
        }

        console.error("Debug Error:", error);
    

        if (error.message.includes("429") || error.message.includes("quota")) {
            appendMessage("bot", "Whoa there! I'm thinking a bit too hard. Give me a minute to cool down!");
        } else {
            appendMessage("bot", "I'm having a bit of a connection issue. Try again in a second?");
        }
    }
}