const socket = io(); // Attempt to connect to the server

const visitorsCount = document.getElementById("visitors-count");
const msgContainer = document.getElementById("msg-container");
const nameInput = document.getElementById("name-input");
const msgForm = document.getElementById("msg-form");
const msgInput = document.getElementById("msg-input");
const feedback = document.getElementById("feedback");

let isTyping = false;

socket.on("connect", () => {
  console.log("Connected to the server!");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server.");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

socket.on("visitors-count", (data) => {
  visitorsCount.innerText = `Visitors count: ${data}`;
});

socket.on("chat-message", (data) => {
  console.log(data);
  addMsgToUI(false, data); // Add the incoming message to the UI
});

socket.on("feedback", (data) => {
  console.log(data);

  feedback.innerText = data.feedback; // Display feedback from others
});

// Form submission for sending messages
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMsg();
  socket.emit("feedback", { feedback: "" });
  msgInput.value = "";
  isTyping = false;
});

// Emit feedback when typing
msgInput.addEventListener("input", () => {
  const hasInputValue = msgInput.value.trim();
  if (!hasInputValue) {
    isTyping = false;
    socket.emit("feedback", {
      feedback: ``,
    });
    return;
  }
  if (isTyping == false) {
    isTyping = true;
    socket.emit("feedback", {
      feedback: `${nameInput.value || "Anonymous"} is typing...`,
    });
  }
});

// Send the message
function sendMsg() {
  if (msgInput.value.trim()) {
    // Only send if message is not empty
    const currentDate = dayjs();
    const formattedDate = currentDate.format("YYYY-MM-DD HH:mm:ss");

    const data = {
      name: nameInput.value || "Anonymous", // Default to "Anonymous" if no name entered
      msg: msgInput.value.trim(), // Get trimmed message
      dateTime: formattedDate, // Format date and time
    };

    addMsgToUI(true, data); // Add message to UI before sending
    socket.emit("message", data);
    // Emit the message to the server
  }
}

// Add messages to the UI
function addMsgToUI(isOwnMsg, data) {
  const element = `
    <li class="${isOwnMsg ? "msg-right" : "msg-left"}">
      <p class="msg">
        ${data.msg}
        <span>${data.name} : ${data.dateTime}</span>
      </p>
    </li>`;
  msgContainer.innerHTML += element; // Add message element to the container
  scrollToTheBottom(); // Scroll to bottom of the message container
}

// Scroll to the bottom of the message container
function scrollToTheBottom() {
  msgContainer.scrollTo(0, msgContainer.scrollHeight);
}
