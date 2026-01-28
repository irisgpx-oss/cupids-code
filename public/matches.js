// Fetch all matches from backend
fetch(`/matches?username=${localStorage.getItem("username")}`)
  .then(res => res.json())
  .then(matches => displayMatches(matches));

function displayMatches(matches) {
  const grid = document.getElementById("match-grid");
  const currentUser = localStorage.getItem("username");

  matches.forEach(person => {

    // Skip the logged‑in user (you don't want to see yourself in the grid)
    if (person.username === currentUser) return;

    // Skip users the person has hidden before
    if (localStorage.getItem("hide_" + person.username) === "true") return;

    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <h3>${person.username}</h3>
      <p><strong>Compatibility:</strong> ${person.score}%</p>
      <p><strong>Age:</strong> ${person.age}</p>
      <p><strong>Zodiac:</strong> ${person.zodiac}</p>
      <p><strong>Personality:</strong> ${person.personality}</p>

      <button class="hide-btn">Remove</button>
    `;

    grid.appendChild(card);

    // Hide/remove button
    card.querySelector(".hide-btn").addEventListener("click", () => {
      localStorage.setItem("hide_" + person.username, "true");
      card.remove();
    });
  });
}
