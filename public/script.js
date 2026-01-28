// ------------------------------
// POPUP + LOGIN/SIGNUP LOGIC
// ------------------------------

console.log("popup element =", document.getElementById("loginpopup"));

const popup = document.getElementById("loginpopup");
const closeBtn = document.getElementById("closepopup");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

// Prevent closing until login/signup success
let canClosePopup = false;

// ⭐ NEW: Only show popup if user is NOT logged in
window.onload = () => {
  const savedUser = localStorage.getItem("username");

  if (!savedUser) {
    console.log("No user logged in → showing popup");
    popup.style.display = "block";
  } else {
    console.log("User already logged in:", savedUser);
    popup.style.display = "none";
    canClosePopup = true; // allow closing if needed
  }
};

// Disable closing by clicking X
closeBtn.onclick = () => {
  if (!canClosePopup) {
    alert("Please log in or sign up first.");
    return;
  }
  popup.style.display = "none";
};

// Disable closing by clicking outside
window.onclick = (event) => {
  if (!canClosePopup) return;
  if (event.target === popup) {
    popup.style.display = "none";
  }
};

// ------------------------------
// SIGNUP HANDLER
// ------------------------------

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  const res = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("signup-message").textContent = data.message || data.error;

  if (data.message === "Signup successful!") {
    localStorage.setItem("username", username);
    canClosePopup = true;
    popup.style.display = "none"; // close automatically
  }
});

// ------------------------------
// LOGIN HANDLER
// ------------------------------

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("login-message").textContent = data.message || data.error;

  if (data.message === "Login successful!") {
    localStorage.setItem("username", username);
    canClosePopup = true;
    popup.style.display = "none"; // close automatically
  }
});

// ------------------------------
// SWITCH BETWEEN LOGIN/SIGNUP
// ------------------------------

showSignup.onclick = () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
};

showLogin.onclick = () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
};
fetch("/admin/quiz")
  .then(res => res.json())
  .then(data => console.log(data));
