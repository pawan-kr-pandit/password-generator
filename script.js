const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const scoreText = document.getElementById("scoreText");
const copyBtn = document.getElementById("copyBtn");
const themeBtn = document.getElementById("themeBtn");
const suggestionsList = document.getElementById("suggestions");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const includeUpper = document.getElementById("includeUpper");
const includeLower = document.getElementById("includeLower");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const messageText = document.getElementById("messageText");

const rules = {
  length: document.getElementById("ruleLength"),
  upper: document.getElementById("ruleUpper"),
  lower: document.getElementById("ruleLower"),
  number: document.getElementById("ruleNumber"),
  special: document.getElementById("ruleSpecial"),
};

const checks = [
  {
    key: "length",
    test: (v) => v.length >= 12,
    message: "Increase the password length to at least 12 characters.",
  },
  {
    key: "upper",
    test: (v) => /[A-Z]/.test(v),
    message: "Add an uppercase letter (A-Z).",
  },
  {
    key: "lower",
    test: (v) => /[a-z]/.test(v),
    message: "Add a lowercase letter (a-z).",
  },
  {
    key: "number",
    test: (v) => /\d/.test(v),
    message: "Include at least one number (0-9).",
  },
  {
    key: "special",
    test: (v) => /[^A-Za-z0-9]/.test(v),
    message: "Include one special character.",
  },
];

const charSets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+{}[]<>?/|~",
};

function setRuleState(ruleElement, isPass) {
  ruleElement.classList.toggle("pass", isPass);
}

function renderSuggestions(messages) {
  suggestionsList.innerHTML = "";

  if (messages.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Great! Your password meets all main requirements.";
    suggestionsList.appendChild(li);
    return;
  }

  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    suggestionsList.appendChild(li);
  });
}

function setStrengthUI(scorePercent) {
  strengthBar.style.width = `${scorePercent}%`;

  if (scorePercent <= 40) {
    strengthBar.style.backgroundColor = "#ef4444";
    strengthText.textContent = "Strength: Weak";
    return;
  }

  if (scorePercent <= 80) {
    strengthBar.style.backgroundColor = "#f59e0b";
    strengthText.textContent = "Strength: Medium";
    return;
  }

  strengthBar.style.backgroundColor = "#22c55e";
  strengthText.textContent = "Strength: Strong";
}

function getSelectedSets() {
  return [
    includeUpper.checked ? charSets.upper : "",
    includeLower.checked ? charSets.lower : "",
    includeNumbers.checked ? charSets.numbers : "",
    includeSymbols.checked ? charSets.symbols : "",
  ].filter(Boolean);
}

function randomChar(pool) {
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function shuffleText(value) {
  const chars = value.split("");

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

function evaluate(value) {
  if (!value) {
    strengthBar.style.width = "0%";
    strengthText.textContent = "Strength: --";
    scoreText.textContent = "Score: 0%";
    renderSuggestions(["Start typing a password to see suggestions."]);
    Object.values(rules).forEach((rule) => rule.classList.remove("pass"));
    return;
  }

  let passCount = 0;
  const suggestions = [];

  checks.forEach((item) => {
    const isPass = item.test(value);
    setRuleState(rules[item.key], isPass);
    if (isPass) passCount += 1;
    if (!isPass) suggestions.push(item.message);
  });

  const scorePercent = Math.round((passCount / checks.length) * 100);
  scoreText.textContent = `Score: ${scorePercent}%`;
  setStrengthUI(scorePercent);
  renderSuggestions(suggestions);
}

function generatePassword() {
  const selectedSets = getSelectedSets();

  if (selectedSets.length === 0) {
    passwordInput.value = "";
    messageText.textContent = "Select at least one character type.";
    evaluate("");
    return;
  }

  const targetLength = Number(lengthRange.value);
  const requiredChars = selectedSets.map((set) => randomChar(set));
  const fullPool = selectedSets.join("");
  const remainingLength = targetLength - requiredChars.length;
  let generated = requiredChars.join("");

  for (let i = 0; i < remainingLength; i += 1) {
    generated += randomChar(fullPool);
  }

  passwordInput.value = shuffleText(generated);
  messageText.textContent = "Password generated successfully.";
  evaluate(passwordInput.value);
}

lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
});

copyBtn.addEventListener("click", async () => {
  if (!passwordInput.value) {
    copyBtn.textContent = "No Text";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 900);
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = "Copied!";
  } catch (error) {
    copyBtn.textContent = "Failed";
  }

  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 1000);
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light")
    ? "Dark Mode"
    : "Light Mode";
});

generateBtn.addEventListener("click", generatePassword);

passwordInput.addEventListener("click", () => {
  passwordInput.select();
});

generatePassword();
