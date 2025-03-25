document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".sidebar a");
    const messageLists = document.querySelectorAll(".message-list");

    // Handle sidebar category switching
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            // Hide all message lists and show only the selected category
            messageLists.forEach(list => list.style.display = "none");
            document.getElementById(this.dataset.category).style.display = "block";
        });
    });

    // Sample messages categorized
    const sampleMessages = {
        banking: ["Your account balance is ₹5000.", "Transaction alert: ₹2000 debited."],
        fake: ["You've won a lottery! Click here.", "Suspicious login detected!"],
        otp: ["Your OTP is 123456.", "Use 987654 for login verification."],
        school: ["Exam results are out.", "Fee payment due on 20th March."],
        personal: ["Hey, how are you?", "Let's meet tomorrow."]
    };

    // Load messages into categories
    Object.keys(sampleMessages).forEach(category => {
        const container = document.getElementById(category);
        sampleMessages[category].forEach(msg => {
            const div = document.createElement("div");
            div.classList.add("message-card");
            div.textContent = msg;
            container.appendChild(div);
        });
    });

    // Ensure only the first category is visible initially
    messageLists.forEach(list => list.style.display = "none");
    if (messageLists.length > 0) {
        messageLists[0].style.display = "block";
    }

    // Search bar functionality
    document.getElementById("searchBar").addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        document.querySelectorAll(".message-card").forEach(msg => {
            msg.style.display = msg.textContent.toLowerCase().includes(searchText) ? "block" : "none";
        });
    });

    // Theme switching functionality
    document.getElementById('themeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            this.innerHTML = '☀️';
            this.classList.replace('btn-light', 'btn-dark');
        } else {
            this.innerHTML = '🌙';
            this.classList.replace('btn-dark', 'btn-light');
        }
    });

    // Message reply functionality
    document.getElementById("sendReply").addEventListener("click", function () {
        const replyInput = document.getElementById("replyInput");
        const messageText = replyInput.value.trim();
        
        if (messageText !== "") {
            const newMessage = document.createElement("div");
            newMessage.classList.add("message-card");
            newMessage.textContent = "You: " + messageText;
            
            const activeTab = document.querySelector(".message-list:not([style*='display: none'])");
            if (activeTab) {
                activeTab.appendChild(newMessage);
            }

            replyInput.value = ""; // Clear input after sending
        }
    });

    // Floating Action Button Click (Future Use)
    document.querySelector(".fab").addEventListener("click", function () {
        alert("New message feature coming soon!");
    });

    // Fetch messages from backend
    fetchMessages();

    // New Message Modal Functionality
    const newMessageBtn = document.getElementById("newMessageBtn");
    const newMessageModal = document.getElementById("newMessageModal");
    const closeModal = document.querySelector(".close");
    const sendNewMessageBtn = document.getElementById("sendNewMessage");

    // Open modal
    newMessageBtn.addEventListener("click", function () {
        newMessageModal.style.display = "flex";
    });

    // Close modal
    closeModal.addEventListener("click", function () {
        newMessageModal.style.display = "none";
    });

    // Send new message
    sendNewMessageBtn.addEventListener("click", function () {
        const mobileNumber = document.getElementById("mobileNumber").value.trim();
        const category = document.getElementById("messageCategory").value;
        const messageText = document.getElementById("newMessageText").value.trim();

        if (mobileNumber === "" || messageText === "") {
            alert("Please enter a mobile number and message.");
            return;
        }

        // Simulate sending a message
        console.log(`Sending message to ${mobileNumber}: ${messageText}`);

        // Add the message to the selected category with mobile number
        const messageContainer = document.getElementById(category);
        if (messageContainer) {
            const newMessage = document.createElement("div");
            newMessage.classList.add("message-card");
            newMessage.textContent = `To: ${mobileNumber} - ${messageText}`;
            messageContainer.appendChild(newMessage);
        }

        // Clear input and close modal
        document.getElementById("mobileNumber").value = "";
        document.getElementById("newMessageText").value = "";
        newMessageModal.style.display = "none";
    });

    // Close modal if clicking outside content
    window.addEventListener("click", function (event) {
        if (event.target === newMessageModal) {
            newMessageModal.style.display = "none";
        }
    });
});

function fetchMessages() {
    fetch("http://127.0.0.1:5000/get_messages")
        .then(response => response.json())
        .then(data => {
            updateMessages("banking", data.banking);
            updateMessages("fake", data.fake);
            updateMessages("otp", data.otp);
            updateMessages("school", data.school);
            updateMessages("personal", data.personal);
        })
        .catch(error => console.error("Error fetching messages:", error));
}

function updateMessages(category, messages) {
    let container = document.getElementById(category);
    container.innerHTML = messages.map(msg => `<div class="message-card">${msg}</div>`).join("");
}
