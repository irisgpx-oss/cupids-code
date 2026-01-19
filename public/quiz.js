document.getElementById("quizForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect all form data
  const formData = new FormData(e.target);
  const quizData = Object.fromEntries(formData.entries());

  // Attach logged-in username
  const username = localStorage.getItem("username");
  if (!username) {
    alert("You must be logged in to submit the quiz.");
    return;
  }

  quizData.username = username;

  // SEND QUIZ TO SERVER (this was missing!)
  const res = await fetch("/submit-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData)
  });

  const data = await res.json();
  alert(data.message);

  if (data.message === "Quiz submitted!") {
    window.location.href = "match.html";
  }
});
