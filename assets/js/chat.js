const chat = document.getElementById("ai-chat");
const toggle = document.getElementById("ai-toggle");
const close = document.getElementById("ai-close");

const input = document.getElementById("message");
const send = document.getElementById("send");
const messages = document.getElementById("chat-messages");

toggle.addEventListener("click", () => {
    chat.classList.add("open");
});

close.addEventListener("click", () => {
    chat.classList.remove("open");
});

send.addEventListener("click", sendMessage);

input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    messages.innerHTML += `
        <div class="message user">
            ${text}
        </div>
    `;

    input.value = "";

    try {

        const response = await fetch("https://weband3d-ai.weband3d-ai.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        messages.innerHTML += `
            <div class="message ai">
                ${data.answer}
            </div>
        `;

        messages.scrollTop = messages.scrollHeight;

    } catch (err) {

        console.error(err);

        messages.innerHTML += `
            <div class="message ai">
                ❌ Cannot connect to Gemini Worker
            </div>
        `;
    }

}