const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database("users.db");

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Create quiz answers table
db.run(`CREATE TABLE IF NOT EXISTS quiz_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  name TEXT,
  age INTEGER,
  height TEXT,
  personality TEXT,
  ambitions TEXT,
  partner_preference TEXT,
  zodiac TEXT,
  friend_description TEXT,
  height_preference TEXT,
  age_preference TEXT,
  love_language TEXT,
  kids_preference TEXT,
  first_date TEXT,
  relationship_type TEXT,
  insecurity TEXT,
  flaw TEXT,
  dealbreaker TEXT
)`);
//function//
function calculateCompatibility(userA, userB) {
  let score = 0;

  if (userA.personality === userB.personality) score += 10;

  if (userA.ambitions === userB.ambitions) {
    score += 5;
  } else {
    score -= 5;
  }


 
  const partnerFriendMatch = {
   "outgoing adventurous": ["funny", "responsible"],
"introverted soft": ["kind", "considerate", "loyal"],
"studious ambitious": ["smart", "responsible"],
"athletic bubbly": ["funny", "kind"]

  };

  if (partnerFriendMatch[userA.partner_preference]?.includes(userB.friend_description)) {
    score += 15;
  }
  if (partnerFriendMatch[userB.partner_preference]?.includes(userA.friend_description)) {
    score += 15;
  }

  // -----------------------------
  // 3. HEIGHT COMPARISON (cm)
  // -----------------------------

  const heightA = parseInt(userA.height);
  const heightB = parseInt(userB.height);

  if (userA.height_preference === "taller" && heightB > heightA) score += 10;
  if (userA.height_preference === "shorter" && heightB < heightA) score += 10;

    
  if (userB.height_preference === "taller" && heightA > heightB) score += 10;
  if (userB.height_preference === "shorter" && heightA < heightB) score += 10;


  const ageA = parseInt(userA.age);
  const ageB = parseInt(userB.age);

  if (userA.age_preference === "older" && ageB > ageA) score += 10;
  if (userA.age_preference === "younger" && ageB < ageA) score += 10;
if (userA.age_preference === "sameage" && ageB === ageA) score += 10;


  if (userB.age_preference === "older" && ageB > ageA) score += 10;
  if (userB.age_preference === "younger" && ageB < ageA) score += 10;
if (userB.age_preference === "sameage" && ageA === ageB) score += 10;


  // -----------------------------
  // 4. ZODIAC COMPATIBILITY
  // -----------------------------

  const zodiacMatches = {
    aries: ["leo", "sagittarius", "gemini", "aquarius"],
    taurus: ["virgo", "capricorn", "cancer", "pisces"],
    gemini: ["libra", "aquarius", "aries", "leo"],
    cancer: ["scorpio", "pisces", "taurus", "virgo"],
    leo: ["aries", "sagittarius", "gemini", "libra"],
    virgo: ["taurus", "capricorn", "cancer", "scorpio"],
    libra: ["gemini", "aquarius", "leo", "sagittarius"],
    scorpio: ["cancer", "pisces", "virgo", "capricorn"],
    sagittarius: ["aries", "leo", "libra", "aquarius"],
    capricorn: ["taurus", "virgo", "scorpio", "pisces"],
    aquarius: ["gemini", "libra", "aries", "sagittarius"],
    pisces: ["cancer", "scorpio", "taurus", "capricorn"]
  };

  if (zodiacMatches[userA.zodiac]?.includes(userB.zodiac)) score += 5;
  if (zodiacMatches[userB.zodiac]?.includes(userA.zodiac)) score += 5;

  // -----------------------------
  // 5. LOVE LANGUAGE COMPATIBILITY
  // -----------------------------

  const loveMatches = {
    "words of affirmation": ["words of affirmation", "quality time"],
    "quality time": ["quality time", "words of affirmation", "physical touch"],
    "acts of service": ["acts of service", "receiving gifts"],
    "receiving gifts": ["receiving gifts", "acts of service"],
    "physical touch": ["physical touch", "quality time"]
  };

  if (loveMatches[userA.love_language]?.includes(userB.love_language)) score += 15;
  if (loveMatches[userB.love_language]?.includes(userA.love_language)) score += 15;

if (userA.kids_preference === userB.kids_preference) { score += 10; }
if (userA.first_date === userB.first_date) { score += 5; }
  // -----------------------------
  // 6. RELATIONSHIP TYPE MATCHING
  // -----------------------------

  if (userA.relationship_type === userB.relationship_type) {
    score += 10;
  } else {
    score -= 10;
  }

  // -----------------------------
  // 7. INSECURITY → PARTNER PREFERENCE
  // -----------------------------

  const insecurityMatches = {
   "your looks": ["introverted soft"],
"your personality being too much": ["outgoing adventurous", "athletic bubbly"],
"your personality being too little": ["introverted soft"],
"your humour": ["studious ambitious"],
"your social skills": ["introverted soft", "studious ambitious"],
"your intelligence": ["athletic bubbly", "outgoing adventurous"],
"financial status": ["introverted soft", "athletic bubbly"]

  };

  if (insecurityMatches[userA.insecurity]?.includes(userB.partner_preference)) score += 15;
  if (insecurityMatches[userB.insecurity]?.includes(userA.partner_preference)) score += 15;

  // -----------------------------
  // 8. DEALBREAKER → FLAW (NEGATIVE MATCHING)
  // -----------------------------

  const dealbreakerNotCompatible = {
  "dishonesty": ["inability to be vulnerable"],
  "lack of effort": ["commitment issues", "inability to be vulnerable"],
  "disrespect": ["commitment issues", "inability to be vulnerable", "jealousy"],
  "lack of communication": ["fear of abandonment", "inability to be vulnerable", "self deprecation"],
  "emotional unavailability": ["commitment issues", "fear of abandonment", "inability to be vulnerable", "self deprecation"],
  "clingyness": ["jealousy", "fear of abandonment", "self deprecation"]
};


  if (dealbreakerNotCompatible[userA.dealbreaker]?.includes(userB.flaw)) score -= 15;
  if (dealbreakerNotCompatible[userB.dealbreaker]?.includes(userA.flaw)) score -= 15;
return Math.round((score / 200) * 100);


}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

// SIGNUP ROUTE
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "User already exists" });
      }
      res.json({ message: "Signup successful!" });
    }
  );
});

// LOGIN ROUTE (correct location)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: "Incorrect password" });

    res.json({ message: "Login successful!" });
  });
});
// SUBMIT QUIZ ROUTE
app.post("/submit-quiz", (req, res) => {
  const data = req.body;
  console.log("Received quiz:", data);

  db.run(
    `INSERT INTO quiz_answers (
      username, name, age, height, personality, ambitions,
      partner_preference, zodiac, friend_description, height_preference, age_preference,
      love_language, kids_preference, first_date, relationship_type,
      insecurity, flaw, dealbreaker
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.username,
      data.name,
      data.age,
      data.height,
      data.personality,
      data.ambitions,
      data.partner_preference,
      data.zodiac,
      data.friend_description,
      data.height_preference,
      data.age_preference,
      data.love_language,
      data.kids_preference,
      data.first_date,
      data.relationship_type,
      data.insecurity,
      data.flaw,
      data.dealbreaker
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Quiz submitted!" });
    }
  );
});

// MATCH ROUTE
// MATCH ROUTE
app.get("/match", (req, res) => {
  const username = req.query.username;

  db.all(`SELECT * FROM quiz_answers`, (err, users) => {
    console.log("All quiz users:", users);

    if (err) return res.status(500).json({ error: "Database error" });

    const currentUser = users.find(u => u.username === username);
    if (!currentUser) {
      return res.json({ match: null, score: 0 });
    }

    let bestMatch = null;
    let bestScore = -Infinity;

    for (const other of users) {
      if (other.username === username) continue;

      const score = calculateCompatibility(currentUser, other);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = other;
      }
    }

    res.json({ match: bestMatch, score: bestScore });
  });
});

// ⭐ ADD THIS ADMIN ROUTE HERE
// Admin route to view all registered users
app.get("/admin/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Admin route to view all quiz answers
app.get("/admin/quiz", (req, res) => {
  db.all("SELECT * FROM quiz_answers", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});


// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
