/* ===== MRU Gym Buddy — platform logic (vanilla JS, no dependencies) ===== */

"use strict";

const PROFILE_KEY = "mru_gymbuddy_profile";
const INTERESTS_KEY = "mru_gymbuddy_interests";
const RESPONSES_KEY = "mru_gymbuddy_responses";

/* ---------- Icons ---------- */

const ICONS = {
  dumbbell:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3C6.4 16.2 3 12.9 3 9.2 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 3.7-3.4 7-9 11.1z"/></svg>',
  leaf:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19C5 9.5 11.5 4 20 4c0 8.5-5.5 15-15 15zm0 0c3-4.5 6.5-8 11-9.5"/></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c2.8.4 5 2.4 5 5.5"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.3-7-11a7 7 0 1 1 14 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>'
};

/* ---------- Reference data ---------- */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
  Fri: "Friday", Sat: "Saturday", Sun: "Sunday"
};
const TIME_SLOTS = ["Early morning", "Morning", "Afternoon", "Evening", "Late evening"];

const AGE_RANGES = ["18–20", "21–24", "25–29", "30+"];

const GOAL_OPTIONS = [
  "Build muscle", "Improve strength", "Lose fat", "Improve cardiovascular fitness",
  "Stay active", "Manage everyday stress through exercise", "Meet new people",
  "Build fitness consistency"
];

const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const INTEREST_OPTIONS = [
  "Weight training", "Cardio", "Running", "Yoga", "Pilates",
  "Stretching and mobility", "Group fitness", "General exercise"
];

const SOCIAL_OPTIONS = ["One-on-one workouts", "Small group workouts", "Either"];
const INTRO_OPTIONS = [
  "In-app intro message first", "Meet in person at a public campus spot",
  "Start with a group setting", "No preference, I'm open to any option"
];
const LOCATION_OPTIONS = [
  "University fitness centre", "Outdoor spaces", "Class studios", "Anywhere on campus"
];
const COMFORT_NEW_OPTIONS = ["Yes", "Maybe", "Not yet"];

/* ---------- Fictional MRU sample profiles (clearly labelled demos) ---------- */

const PROFILES = [
  {
    id: "s1", name: "Alex", uni: "Mount Royal University", initials: "AL",
    experience: "Intermediate",
    goals: ["Build muscle", "Improve strength"],
    interests: ["Weight training", "Group fitness"],
    location: "University fitness centre",
    social: "One-on-one workouts",
    intro: "In-app intro message first",
    comfortNew: "Yes",
    availability: { Mon: ["Morning", "Evening"], Wed: ["Morning", "Evening"], Fri: ["Morning", "Evening"], Sat: ["Morning"] },
    bio: "Second-year Kinesiology student. Lifts before morning classes and loves spotting newcomers."
  },
  {
    id: "s2", name: "Sam", uni: "Mount Royal University", initials: "SM",
    experience: "Advanced",
    goals: ["Improve cardiovascular fitness", "Build fitness consistency"],
    interests: ["Running", "Cardio", "Group fitness"],
    location: "Outdoor spaces",
    social: "Small group workouts",
    intro: "Start with a group setting",
    comfortNew: "Yes",
    availability: { Tue: ["Afternoon", "Evening"], Thu: ["Afternoon", "Evening"], Sat: ["Morning", "Afternoon"] },
    bio: "Nursing student who runs the Burke Mountain trail most afternoons and joins evening spin classes."
  },
  {
    id: "s3", name: "Jordan", uni: "Mount Royal University", initials: "JO",
    experience: "Beginner",
    goals: ["Stay active", "Meet new people", "Manage everyday stress through exercise"],
    interests: ["General exercise", "Stretching and mobility", "Yoga"],
    location: "Outdoor spaces",
    social: "Either",
    intro: "No preference, I'm open to any option",
    comfortNew: "Maybe",
    availability: { Mon: ["Morning", "Afternoon"], Tue: ["Morning"], Thu: ["Afternoon"] },
    bio: "Business student looking for a low-pressure way to move between classes."
  },
  {
    id: "s4", name: "Taylor", uni: "Mount Royal University", initials: "TA",
    experience: "Advanced",
    goals: ["Build muscle", "Lose fat", "Improve strength"],
    interests: ["Weight training", "Running"],
    location: "University fitness centre",
    social: "One-on-one workouts",
    intro: "Meet in person at a public campus spot",
    comfortNew: "Maybe",
    availability: { Mon: ["Evening"], Tue: ["Evening"], Wed: ["Evening"], Thu: ["Evening"], Fri: ["Evening"] },
    bio: "Engineering student with a consistent evening lifting routine."
  },
  {
    id: "s5", name: "Casey", uni: "Mount Royal University", initials: "CA",
    experience: "Intermediate",
    goals: ["Improve cardiovascular fitness", "Stay active", "Manage everyday stress through exercise"],
    interests: ["Running", "Yoga", "General exercise"],
    location: "Outdoor spaces",
    social: "Either",
    intro: "In-app intro message first",
    comfortNew: "Yes",
    availability: { Mon: ["Morning"], Wed: ["Morning", "Afternoon"], Sat: ["Morning"], Sun: ["Morning"] },
    bio: "Psychology student who starts most days with a sunrise run along the Elbow River."
  },
  {
    id: "s6", name: "Riley", uni: "Mount Royal University", initials: "RI",
    experience: "Beginner",
    goals: ["Meet new people", "Build fitness consistency", "Stay active"],
    interests: ["Yoga", "Pilates", "Group fitness"],
    location: "Class studios",
    social: "Small group workouts",
    intro: "Start with a group setting",
    comfortNew: "Yes",
    availability: { Wed: ["Afternoon", "Evening"], Fri: ["Afternoon", "Evening"], Sat: ["Afternoon"] },
    bio: "Fine arts student easing into fitness and looking for friendly company."
  },
  {
    id: "s7", name: "Morgan", uni: "Mount Royal University", initials: "MO",
    experience: "Intermediate",
    goals: ["Build muscle", "Improve strength"],
    interests: ["Weight training", "Group fitness", "General exercise"],
    location: "University fitness centre",
    social: "One-on-one workouts",
    intro: "Meet in person at a public campus spot",
    comfortNew: "Maybe",
    availability: { Mon: ["Evening"], Wed: ["Evening"], Fri: ["Evening"], Sat: ["Morning", "Afternoon"] },
    bio: "Recreation Management student who lifts most evenings and organizes pickup games."
  },
  {
    id: "s8", name: "Avery", uni: "Mount Royal University", initials: "AV",
    experience: "Beginner",
    goals: ["Stay active", "Manage everyday stress through exercise"],
    interests: ["Stretching and mobility", "Yoga", "Pilates", "General exercise"],
    location: "Class studios",
    social: "Either",
    intro: "No preference, I'm open to any option",
    comfortNew: "Yes",
    availability: { Tue: ["Morning", "Afternoon"], Thu: ["Morning"], Sat: ["Afternoon"] },
    bio: "Education student who prefers gentle movement and good conversation."
  },
  {
    id: "s9", name: "Quinn", uni: "Mount Royal University", initials: "QU",
    experience: "Intermediate",
    goals: ["Improve cardiovascular fitness", "Build fitness consistency"],
    interests: ["Cardio", "Running", "Group fitness"],
    location: "University fitness centre",
    social: "Small group workouts",
    intro: "In-app intro message first",
    comfortNew: "Yes",
    availability: { Mon: ["Morning"], Tue: ["Morning"], Thu: ["Morning"], Sat: ["Morning"] },
    bio: "Kinesiology student training for a spring half-marathon with a small crew."
  },
  {
    id: "s10", name: "Rowan", uni: "Mount Royal University", initials: "RO",
    experience: "Advanced",
    goals: ["Build muscle", "Lose fat", "Improve strength"],
    interests: ["Weight training", "Cardio", "General exercise"],
    location: "University fitness centre",
    social: "One-on-one workouts",
    intro: "Meet in person at a public campus spot",
    comfortNew: "Maybe",
    availability: { Mon: ["Evening"], Tue: ["Evening"], Wed: ["Evening"], Fri: ["Evening"], Sun: ["Afternoon"] },
    bio: "Mechanical Engineering student who treats the weight room like a second classroom."
  },
  {
    id: "s11", name: "Emery", uni: "Mount Royal University", initials: "EM",
    experience: "Beginner",
    goals: ["Meet new people", "Stay active", "Build fitness consistency"],
    interests: ["General exercise", "Yoga", "Group fitness"],
    location: "Outdoor spaces",
    social: "Small group workouts",
    intro: "Start with a group setting",
    comfortNew: "Yes",
    availability: { Mon: ["Afternoon"], Thu: ["Afternoon"], Sat: ["Afternoon", "Evening"] },
    bio: "Communication student looking for weekend hiking and casual gym company."
  },
  {
    id: "s12", name: "Devon", uni: "Mount Royal University", initials: "DE",
    experience: "Intermediate",
    goals: ["Improve strength", "Build muscle", "Improve cardiovascular fitness"],
    interests: ["Weight training", "Running", "Pilates"],
    location: "University fitness centre",
    social: "Either",
    intro: "In-app intro message first",
    comfortNew: "Maybe",
    availability: { Tue: ["Evening"], Thu: ["Evening"], Sat: ["Morning", "Evening"], Sun: ["Morning"] },
    bio: "Biology student balancing lab hours with early-morning and evening sessions."
  }
];

/* ---------- Feedback questionnaire (pilot survey) ---------- */

const FEEDBACK_QUESTIONS = [
  {
    id: "goal",
    title: "What is your main fitness goal?",
    hint: "Pick the one that fits you best.",
    type: "single",
    options: [
      { value: "Build muscle / strength", label: "Build muscle / strength", icon: "dumbbell" },
      { value: "Cardio and fitness", label: "Cardio and fitness", icon: "heart" },
      { value: "Stay active and reduce stress", label: "Stay active and reduce stress", icon: "leaf" },
      { value: "Meet people and stay consistent", label: "Meet people and stay consistent", icon: "users" }
    ]
  },
  {
    id: "time",
    title: "When do you prefer working out?",
    hint: "Choose the time of day that works best for you.",
    type: "single",
    options: [
      { value: "Morning", label: "Morning" },
      { value: "Afternoon", label: "Afternoon" },
      { value: "Evening", label: "Evening" },
      { value: "Late evening", label: "Late evening" }
    ]
  },
  {
    id: "days",
    title: "Which days work best for you?",
    hint: "Select all that apply.",
    type: "multi",
    options: DAYS.map((d) => ({ value: d, label: d, sub: DAY_FULL[d] }))
  },
  {
    id: "experience",
    title: "How much workout experience do you have?",
    type: "single",
    options: EXPERIENCE_OPTIONS.map((v) => ({ value: v, label: v }))
  },
  {
    id: "comfort",
    title: "Would you feel comfortable meeting a new student for a workout?",
    hint: "Honest answers help us build trust.",
    type: "single",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "Maybe", label: "Maybe" },
      { value: "Not yet", label: "Not yet" }
    ]
  },
  {
    id: "interest",
    title: "Would you be interested in joining a free Gym Buddy matching pilot?",
    hint: "This is voluntary and free.",
    type: "single",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "Maybe", label: "Maybe" },
      { value: "No", label: "No" }
    ]
  },
  {
    id: "activities",
    title: "Which workout activities interest you?",
    hint: "Optional. Select all that apply, or skip.",
    type: "optionalMulti",
    options: INTEREST_OPTIONS.map((v) => ({ value: v, label: v }))
  },
  {
    id: "comfortHelp",
    title: "What would help you feel comfortable meeting a new workout partner?",
    hint: "Optional. Select any that apply, or skip this question.",
    type: "optionalMulti",
    options: [
      "Meeting in a public gym space",
      "Knowing a bit about my partner first",
      "Group or class setting",
      "Friendlier, low-pressure first workout",
      "Nothing specific, I am open to it"
    ].map((v) => ({ value: v, label: v }))
  },
  {
    id: "matchComfort",
    title: "After seeing the sample profiles, would you feel comfortable connecting with a student like this?",
    hint: "Think about the fictional matches you saw.",
    type: "single",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "Maybe", label: "Maybe" },
      { value: "No", label: "No" }
    ]
  }
];

/* ---------- State ---------- */

let currentRoute = "home";
let wizardStep = -1; // -1 = verification demo, 0-5 = profile steps
const wizardState = emptyProfile();
const qAnswers = {};
let qIndex = -1; // -1 = intro screen
let feedbackMode = "quiz"; // quiz | results
let surveyDone = false;

function emptyProfile() {
  const availability = {};
  DAYS.forEach((d) => { availability[d] = []; });
  return {
    name: "", ageRange: "", location: "", goals: [], experience: "",
    interests: [], social: "", intro: "", comfortNew: "", publicLocation: "",
    availability
  };
}

/* ---------- Storage ---------- */

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function loadProfile() {
  const p = readJSON(PROFILE_KEY, null);
  if (!p) return emptyProfile();
  const base = emptyProfile();
  return { ...base, ...p, availability: { ...base.availability, ...(p.availability || {}) } };
}
function saveProfile() { writeJSON(PROFILE_KEY, profile); }
let profile = loadProfile();

function loadInterests() { return readJSON(INTERESTS_KEY, []); }
function saveInterests(list) { writeJSON(INTERESTS_KEY, list); }
function loadResponses() { return readJSON(RESPONSES_KEY, []); }
function saveResponses(list) { writeJSON(RESPONSES_KEY, list); }

/* ---------- DOM helpers ---------- */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function showToast(msg) {
  let t = $(".toast");
  if (!t) {
    t = el("div", "toast");
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

function setProgress(label, pct) {
  $("#progressWrap").hidden = false;
  $("#progressFill").style.width = `${pct}%`;
  $("#progressText").textContent = label;
  $("#progressPercent").textContent = `${pct}%`;
}
function hideProgress() { $("#progressWrap").hidden = true; }

/* ---------- Router ---------- */

const ROUTES = ["home", "find", "matches", "schedule", "profile", "connections", "safety", "testplan", "feedback"];

function route() {
  const hash = (location.hash || "#/home").replace(/^#\/?/, "");
  const name = ROUTES.includes(hash) ? hash : "home";
  if (name !== currentRoute || hash !== name) {
    if (!ROUTES.includes(hash)) history.replaceState(null, "", "#/home");
  }
  currentRoute = name;

  $$(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${name}`));
  $$(".main-nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === name));
  $("#mainNav").classList.remove("open");
  $("#navToggle").setAttribute("aria-expanded", "false");

  hideProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "find") renderWizard();
  if (name === "matches") renderMatches();
  if (name === "schedule") renderSchedulePage();
  if (name === "profile") renderProfilePage();
  if (name === "connections") renderConnections();
  if (name === "feedback") renderFeedback();
}

/* ---------- Shared UI builders ---------- */

function chipRow(options, { multi = false, selected = [], onChange } = {}) {
  const wrap = el("div", "chip-row");
  const state = { values: multi ? [...selected] : (selected[0] || "") };
  options.forEach((opt, i) => {
    const value = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    const ic = typeof opt === "string" ? null : opt.icon;
    const isSel = multi ? state.values.includes(value) : state.values === value;
    const btn = el("button", "chip" + (isSel ? " selected" : ""));
    btn.type = "button";
    btn.style.animationDelay = `${i * 40}ms`;
    btn.innerHTML = (ic ? `<span class="opt-icon">${ICONS[ic] || ""}</span>` : "") + `<span>${label}</span>`;
    btn.addEventListener("click", () => {
      if (multi) {
        const idx = state.values.indexOf(value);
        if (idx >= 0) { state.values.splice(idx, 1); btn.classList.remove("selected"); }
        else { state.values.push(value); btn.classList.add("selected"); }
      } else {
        wrap.querySelectorAll(".chip").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.values = value;
      }
      if (onChange) onChange(state.values);
    });
    wrap.appendChild(btn);
  });
  return { wrap, state };
}

function buildScheduleGrid(target, availability, onCellToggle) {
  target.innerHTML = "";
  target.appendChild(el("div", "sched-corner", ""));
  TIME_SLOTS.forEach((slot) => target.appendChild(el("div", "sched-slot-head", slot)));
  DAYS.forEach((day) => {
    target.appendChild(el("div", "sched-day", DAY_FULL[day]));
    TIME_SLOTS.forEach((slot) => {
      const on = (availability[day] || []).includes(slot);
      const btn = el("button", "sched-cell" + (on ? " selected" : ""));
      btn.type = "button";
      btn.dataset.key = `${day}|${slot}`;
      btn.setAttribute("aria-label", `${DAY_FULL[day]} ${slot}`);
      btn.setAttribute("aria-pressed", String(on));
      btn.addEventListener("click", () => {
        const [d, s] = btn.dataset.key.split("|");
        const arr = availability[d] || (availability[d] = []);
        const idx = arr.indexOf(s);
        if (idx >= 0) { arr.splice(idx, 1); btn.classList.remove("selected"); }
        else { arr.push(s); btn.classList.add("selected"); }
        btn.setAttribute("aria-pressed", String(btn.classList.contains("selected")));
        if (onCellToggle) onCellToggle();
      });
      target.appendChild(btn);
    });
  });
}

function countSlots(availability) {
  return DAYS.reduce((n, d) => n + (availability[d] || []).length, 0);
}

/* ---------- Onboarding wizard ---------- */

const WIZARD_STEPS = [
  { title: "About you", sub: "Tell us a little about yourself. You can use a nickname." },
  { title: "Fitness goals", sub: "What do you want to get out of working out? Select all that apply." },
  { title: "Experience", sub: "Pick the level that feels most like you." },
  { title: "Interests & style", sub: "What activities do you enjoy, and how do you like to work out?" },
  { title: "Comfort preferences", sub: "Help us suggest matches that feel right for you." },
  { title: "Your schedule", sub: "Mark the times you are usually free to work out." }
];

function renderWizard() {
  const TOTAL_STEPS = WIZARD_STEPS.length + 1; // +1 for verification demo
  wizardStep = Math.max(-1, Math.min(wizardStep, WIZARD_STEPS.length - 1));
  const card = $("#wizardCard");
  card.innerHTML = "";

  const displayStep = wizardStep + 1; // 0-based across all 7 steps
  setProgress(`Step ${displayStep + 1} of ${TOTAL_STEPS}`, Math.round(((displayStep + 1) / TOTAL_STEPS) * 100));

  const fields = el("div", "wizard-fields");

  if (wizardStep === -1) {
    // Student verification demo (no real verification)
    card.appendChild(el("h2", "wizard-step-title", "Student verification"));
    card.appendChild(el("p", "wizard-step-sub", "In the live version, MRU students would verify their university email here."));

    const vField = el("div", "wizard-field");
    vField.appendChild(el("label", "", "MRU email address"));
    const email = el("input");
    email.type = "email";
    email.placeholder = "name@mtroyal.ca";
    email.autocomplete = "off";
    email.setAttribute("aria-label", "MRU email address (demo only)");
    vField.appendChild(email);
    fields.appendChild(vField);

    fields.appendChild(el("p", "demo-verification-note",
      "Demo Only — Student verification will be available in a future version. No codes or emails are sent, and whatever you type here is never saved."));
    card.appendChild(fields);
  } else {
    const step = WIZARD_STEPS[wizardStep];
    card.appendChild(el("h2", "wizard-step-title", step.title));
    card.appendChild(el("p", "wizard-step-sub", step.sub));
  }

  if (wizardStep === 0) {
    const grid = el("div", "wizard-grid-2");
    const nameField = el("div", "wizard-field");
    nameField.appendChild(el("label", "", "Preferred name"));
    const input = el("input");
    input.type = "text";
    input.maxLength = 30;
    input.placeholder = "e.g. Alex";
    input.value = wizardState.name;
    input.addEventListener("input", () => { wizardState.name = input.value; });
    nameField.appendChild(input);

    const ageField = el("div", "wizard-field");
    ageField.appendChild(el("label", "", "Age range"));
    const age = chipRow(AGE_RANGES, { selected: wizardState.ageRange ? [wizardState.ageRange] : [], onChange: (v) => { wizardState.ageRange = v; } });
    ageField.appendChild(age.wrap);

    grid.appendChild(nameField);
    grid.appendChild(ageField);
    fields.appendChild(grid);

    const locField = el("div", "wizard-field");
    locField.appendChild(el("label", "", "Preferred campus fitness location"));
    const loc = chipRow(LOCATION_OPTIONS, { selected: wizardState.location ? [wizardState.location] : [], onChange: (v) => { wizardState.location = v; } });
    locField.appendChild(loc.wrap);
    fields.appendChild(locField);

    const badge = el("div", "mru-badge");
    badge.innerHTML = `<span class="opt-icon">${ICONS.pin || ""}</span> Mount Royal University student`;
    fields.appendChild(badge);
  }

  if (wizardStep === 1) {
    const f = el("div", "wizard-field");
    const g = chipRow(GOAL_OPTIONS, { multi: true, selected: wizardState.goals, onChange: (v) => { wizardState.goals = v; } });
    f.appendChild(g.wrap);
    fields.appendChild(f);
  }

  if (wizardStep === 2) {
    const f = el("div", "wizard-field");
    const e = chipRow(EXPERIENCE_OPTIONS.map((v) => ({ value: v, label: v })), { selected: wizardState.experience ? [wizardState.experience] : [], onChange: (v) => { wizardState.experience = v; } });
    f.appendChild(e.wrap);
    fields.appendChild(f);
  }

  if (wizardStep === 3) {
    const goals = el("div", "wizard-field");
    goals.appendChild(el("label", "", "Workout interests (select all that apply)"));
    const i = chipRow(INTEREST_OPTIONS, { multi: true, selected: wizardState.interests, onChange: (v) => { wizardState.interests = v; } });
    goals.appendChild(i.wrap);
    fields.appendChild(goals);

    const social = el("div", "wizard-field");
    social.appendChild(el("label", "", "Preferred workout style"));
    const s = chipRow(SOCIAL_OPTIONS, { selected: wizardState.social ? [wizardState.social] : [], onChange: (v) => { wizardState.social = v; } });
    social.appendChild(s.wrap);
    fields.appendChild(social);
  }

  if (wizardStep === 4) {
    const intro = el("div", "wizard-field");
    intro.appendChild(el("label", "", "Preferred way to start connecting"));
    const a = chipRow(INTRO_OPTIONS, { selected: wizardState.intro ? [wizardState.intro] : [], onChange: (v) => { wizardState.intro = v; } });
    intro.appendChild(a.wrap);
    fields.appendChild(intro);

    const comfort = el("div", "wizard-field");
    comfort.appendChild(el("label", "", "Would you feel comfortable meeting an unfamiliar student?"));
    const c = chipRow(COMFORT_NEW_OPTIONS, { selected: wizardState.comfortNew ? [wizardState.comfortNew] : [], onChange: (v) => { wizardState.comfortNew = v; } });
    comfort.appendChild(c.wrap);
    fields.appendChild(comfort);
  }

  if (wizardStep === 5) {
    const f = el("div", "wizard-field");
    const grid = el("div", "schedule-wrap");
    const sg = el("div", "schedule-grid");
    sg.id = "wizardSchedule";
    buildScheduleGrid(sg, wizardState.availability, updateScheduleCount);
    grid.appendChild(sg);
    const legend = el("div", "schedule-legend");
    legend.innerHTML = '<span><i class="legend-swatch selected"></i> Available</span><span><i class="legend-swatch"></i> Not selected</span>';
    grid.appendChild(legend);
    f.appendChild(grid);
    const count = el("p", "schedule-count", "");
    count.id = "wizardScheduleCount";
    f.appendChild(count);
    fields.appendChild(f);
    updateScheduleCount();
  }

  if (wizardStep >= 0) card.appendChild(fields);

  // nav row
  const nav = el("div", "wizard-actions");
  const dots = el("div", "wizard-dots");
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const d = el("span", i < displayStep ? "done" : i === displayStep ? "current" : "");
    dots.appendChild(d);
  }

  const back = el("button", "btn btn-ghost", "Back");
  back.type = "button";
  back.disabled = wizardStep === -1;
  back.addEventListener("click", () => { wizardStep--; renderWizard(); });

  const next = el("button", "btn btn-primary",
    wizardStep === WIZARD_STEPS.length - 1 ? "Finish and see matches" : "Continue");
  next.type = "button";
  next.addEventListener("click", () => {
    if (wizardStep < WIZARD_STEPS.length - 1) { wizardStep++; renderWizard(); }
    else {
      profile = { ...wizardState, availability: { ...wizardState.availability } };
      saveProfile();
      // New preferences mean dismissed profiles get a fresh chance;
      // keep "Interested" selections for Connections untouched.
      saveInterests(loadInterests().filter((i) => i.type !== "not_interested"));
      location.hash = "#/matches";
    }
  });

  nav.appendChild(back);
  nav.appendChild(dots);
  nav.appendChild(next);
  card.appendChild(nav);
}

function updateScheduleCount() {
  const elCount = $("#wizardScheduleCount") || $("#scheduleCount");
  if (!elCount) return;
  const n = countSlots(wizardState.availability);
  elCount.textContent = n ? `${n} time slot${n === 1 ? "" : "s"} selected across your week.` : "No availability selected yet. Tap cells to add times.";
}

/* ---------- Matching ---------- */

const WEIGHTS = { availability: 0.40, goals: 0.25, interests: 0.15, experience: 0.10, styleComfort: 0.10 };

function flatSlots(availability) {
  const flat = [];
  DAYS.forEach((d) => (availability[d] || []).forEach((s) => flat.push(`${d}|${s}`)));
  return flat;
}

function overlapList(userList, profileList) {
  if (!userList || !userList.length || !profileList || !profileList.length) return [];
  return userList.filter((x) => profileList.includes(x));
}

function scoreProfile(p) {
  const reasons = [];
  let score = 0;
  let sharedCellCount = 0;

  // 40% availability
  const uCells = flatSlots(profile.availability);
  const pCells = flatSlots(p.availability);
  const sharedCells = uCells.filter((c) => pCells.includes(c));
  sharedCellCount = sharedCells.length;
  const availRatio = uCells.length && pCells.length
    ? sharedCells.length / Math.min(uCells.length, pCells.length)
    : 0;
  score += availRatio * WEIGHTS.availability * 100;
  if (sharedCells.length) {
    const daysHit = [...new Set(sharedCells.map((c) => c.split("|")[0]))];
    reasons.push({
      label: "Shared workout times",
      detail: `${sharedCells.length} overlapping slot${sharedCells.length > 1 ? "s" : ""} on ${daysHit.length} day${daysHit.length > 1 ? "s" : ""}`
    });
  }

  // 25% goals
  const sharedGoals = overlapList(profile.goals, p.goals);
  const goalRatio = profile.goals.length && p.goals.length
    ? sharedGoals.length / Math.min(profile.goals.length, p.goals.length) : 0;
  score += goalRatio * WEIGHTS.goals * 100;
  if (sharedGoals.length) reasons.push({ label: "Common fitness goals", detail: sharedGoals.slice(0, 3).join(", ") });

  // 15% interests
  const sharedInt = overlapList(profile.interests, p.interests);
  const intRatio = profile.interests.length && p.interests.length
    ? sharedInt.length / Math.min(profile.interests.length, p.interests.length) : 0;
  score += intRatio * WEIGHTS.interests * 100;
  if (sharedInt.length) reasons.push({ label: "Shared workout interests", detail: sharedInt.slice(0, 3).join(", ") });

  // 10% experience
  if (profile.experience && p.experience === profile.experience) {
    score += WEIGHTS.experience * 100;
    reasons.push({ label: "Similar experience level", detail: p.experience });
  }

  // 10% style + location + comfort
  let stylePts = 0;
  if (profile.social && p.social === profile.social) {
    stylePts += 0.4;
    reasons.push({ label: "Similar workout style", detail: p.social });
  }
  if (profile.location && p.location === profile.location) {
    stylePts += 0.3;
    reasons.push({ label: "Preferred workout location", detail: p.location });
  }
  const comfortHits = [
    profile.intro && p.intro === profile.intro,
    profile.comfortNew && p.comfortNew === profile.comfortNew
  ].filter(Boolean).length;
  if (comfortHits) {
    stylePts += Math.min(0.3, comfortHits * 0.15);
    reasons.push({ label: "Compatible comfort preferences", detail: `${comfortHits} preference${comfortHits > 1 ? "s" : ""} in common` });
  }
  score += stylePts * WEIGHTS.styleComfort * 100;

  return { profile: p, score: Math.round(score), reasons, sharedCellCount, sharedCells };
}

function compatLabel(score, sharedCellCount) {
  if (sharedCellCount === 0) return { cls: "compat-emerging", text: "Emerging" };
  if (score >= 70) return { cls: "compat-excellent", text: "Excellent" };
  if (score >= 45) return { cls: "compat-good", text: "Good" };
  return { cls: "compat-emerging", text: "Emerging" };
}

function getMatches() {
  const hidden = new Set(loadInterests().filter((i) => i.type === "not_interested").map((i) => i.profile));
  return PROFILES
    .filter((p) => !hidden.has(p.id))
    .map(scoreProfile)
    .sort((a, b) => b.score - a.score);
}

/* ---------- Matches view ---------- */

function renderMatches() {
  const list = $("#matchList");
  list.innerHTML = "";
  $("#matchIntro").textContent = profile.name
    ? `Hi ${profile.name}! Here are fictional MRU students who match your profile. All profiles are samples until real accounts launch.`
    : "Complete your profile in Find a Buddy for better matches, or browse these fictional MRU samples.";

  let matches = getMatches();
  const overlapOnly = $("#matchOverlapOnly") && $("#matchOverlapOnly").checked;
  if (overlapOnly) matches = matches.filter((m) => m.sharedCellCount > 0);

  const sort = $("#matchSort") ? $("#matchSort").value : "score";
  if (sort === "shared") matches.sort((a, b) => b.sharedCellCount - a.sharedCellCount);
  if (sort === "name") matches.sort((a, b) => a.profile.name.localeCompare(b.profile.name));

  if (!matches.length) {
    list.appendChild(el("p", "empty-state",
      overlapOnly ? "No sample profiles share your availability yet. Try removing the filter or updating your schedule." : "No matches to show right now."));
    return;
  }

  matches.forEach(({ profile: p, score, reasons, sharedCellCount, sharedCells }) => {
    const card = el("article", "profile-card");
    const compat = compatLabel(score, sharedCellCount);

    const head = el("div", "match-head");
    head.appendChild(el("div", "match-avatar", p.initials));
    const meta = el("div", "match-meta");
    meta.appendChild(el("h3", "match-name", p.name));
    meta.appendChild(el("p", "match-sub", `${p.uni} · ${p.experience}`));
    const badges = el("div", "tag-row");
    badges.appendChild(el("span", `compat-badge ${compat.cls}`, compat.text));
    badges.appendChild(el("span", "fictional-tag", "Sample profile"));
    meta.appendChild(badges);
    head.appendChild(meta);
    card.appendChild(head);

    const tags = el("div", "profile-tags");
    p.goals.slice(0, 3).forEach((g) => tags.appendChild(el("span", "tag tag-goal", g)));
    p.interests.slice(0, 4).forEach((i) => tags.appendChild(el("span", "tag", i)));
    card.appendChild(tags);

    const sharedBox = el("div", "shared-box");
    sharedBox.appendChild(el("span", "shared-label", "Shared availability"));
    if (sharedCells.length) {
      const preview = sharedCells.slice(0, 4).map((c) => {
        const [d, s] = c.split("|");
        return `${DAY_FULL[d].slice(0, 3)} ${s}`;
      }).join(" · ");
      sharedBox.appendChild(el("span", "shared-value", preview + (sharedCells.length > 4 ? ` +${sharedCells.length - 4} more` : "")));
    } else {
      sharedBox.appendChild(el("span", "shared-value", "No overlapping slots yet"));
    }
    card.appendChild(sharedBox);

    const reasonsTitle = el("h4", "match-reasons-title", "Why this match");
    const reasonsList = el("ul", "match-reasons");
    reasons.slice(0, 3).forEach((r) => {
      const li = el("li");
      li.innerHTML = '<span class="reason-check" aria-hidden="true">✓</span>' +
        `<span><strong>${r.label}:</strong> ${r.detail}</span>`;
      reasonsList.appendChild(li);
    });
    if (!reasons.length) reasonsList.appendChild(el("li", "reason-none", "Broad match. Add availability for sharper suggestions."));
    card.appendChild(reasonsTitle);
    card.appendChild(reasonsList);

    const details = el("div", "profile-details");
    details.hidden = true;
    details.appendChild(el("p", "match-bio", p.bio));
    details.appendChild(el("p", "profile-detail-line",
      `Style: ${p.social} · Location: ${p.location} · Intro: ${p.intro}`));
    card.appendChild(details);

    const viewBtn = el("button", "btn btn-ghost btn-small", "View profile");
    viewBtn.type = "button";
    viewBtn.addEventListener("click", () => {
      details.hidden = !details.hidden;
      viewBtn.textContent = details.hidden ? "View profile" : "Hide profile";
    });

    const actions = el("div", "profile-actions");
    actions.appendChild(viewBtn);
    const reactRow = el("div", "react-row");
    const interests = loadInterests();
    const mine = interests.find((i) => i.profile === p.id);
    [["interested", "Send interest", "btn-primary"], ["not_interested", "Not for me", "btn-ghost"]]
      .forEach(([key, label, cls]) => {
        const isActive = mine && mine.type === key;
        const btnLabel = key === "interested" && isActive ? "Interest sent · Pending (Demo)" : label;
        const b = el("button", `btn ${cls} btn-small`, btnLabel);
        b.type = "button";
        if (isActive) b.classList.add("reacted");
        b.addEventListener("click", () => {
          const list = loadInterests().filter((i) => i.profile !== p.id);
          if (!(mine && mine.type === key)) {
            list.push({ profile: p.id, type: key, ts: new Date().toISOString() });
          }
          saveInterests(list);
          renderMatches();
          if (key === "interested") showToast(`Interest sent for ${p.name}. It is pending under Connections (demo).`);
        });
        reactRow.appendChild(b);
      });
    actions.appendChild(reactRow);
    card.appendChild(actions);

    list.appendChild(card);
  });
}

/* ---------- Schedule page ---------- */

function renderSchedulePage() {
  const grid = $("#scheduleGrid");
  buildScheduleGrid(grid, profile.availability, updateScheduleCount);
  updateScheduleCount();
}

function updateScheduleCount() {
  const target = $("#scheduleCount") || $("#wizardScheduleCount");
  if (!target) return;
  const n = countSlots(currentRoute === "schedule" ? profile.availability : wizardState.availability);
  target.textContent = n
    ? `${n} time slot${n === 1 ? "" : "s"} selected across your week.`
    : "No availability selected yet. Tap cells to add times.";
}

/* ---------- Profile dashboard ---------- */

function profileCompletion() {
  const checks = [
    !!profile.name, !!profile.ageRange, !!profile.location,
    profile.goals.length > 0, !!profile.experience,
    profile.interests.length > 0, !!profile.social,
    !!profile.intro, !!profile.comfortNew, countSlots(profile.availability) > 0
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function renderProfilePage() {
  const card = $("#profileCard");
  card.innerHTML = "";
  const pct = profileCompletion();
  const hasProfile = pct > 0;

  const head = el("div", "dash-header");
  head.appendChild(el("div", "dash-avatar", profile.name ? profile.name.slice(0, 2).toUpperCase() : "?"));
  const meta = el("div");
  meta.appendChild(el("h2", "dash-name", profile.name ? `${profile.name}'s profile` : "Your profile"));
  meta.appendChild(el("p", "dash-sub", "Mount Royal University · Student member"));
  head.appendChild(meta);
  card.appendChild(head);

  const bar = el("div", "completion-bar");
  bar.innerHTML = `<div class="completion-track"><div class="completion-fill" style="width:${pct}%"></div></div>
    <p class="schedule-count" style="margin-top:6px">Profile ${pct}% complete</p>`;
  card.appendChild(bar);

  if (!hasProfile) {
    const empty = el("div", "dash-empty");
    empty.appendChild(el("p", "", "You have not set up your fitness profile yet. It takes about two minutes."));
    const a = el("a", "btn btn-primary btn-small", "Set up my profile");
    a.href = "#/find";
    empty.appendChild(a);
    card.appendChild(empty);
    return;
  }

  const grid = el("div", "dash-grid");
  const tiles = [
    ["Age range", profile.ageRange || "Not set"],
    ["Experience", profile.experience || "Not set"],
    ["Workout style", profile.social || "Not set"],
    ["Location", profile.location || "Not set"],
    ["Comfort meeting new students", profile.comfortNew || "Not set"],
    ["Intro preference", profile.intro || "Not set"],
    ["Available slots", `${countSlots(profile.availability)} per week`],
    ["Connected partners", String(loadInterests().filter((i) => i.type === "interested").length)]
  ];
  tiles.forEach(([k, v]) => {
    const t = el("div", "dash-tile");
    t.appendChild(el("div", "tile-label", k));
    t.appendChild(el("div", "tile-value", v));
    grid.appendChild(t);
  });
  card.appendChild(grid);

  const goalsSec = el("div", "dash-section");
  goalsSec.appendChild(el("h3", "", "Fitness goals"));
  const goalTags = el("div", "profile-tags");
  (profile.goals.length ? profile.goals : ["None selected"]).forEach((g) =>
    goalTags.appendChild(el("span", "tag tag-goal", g)));
  goalsSec.appendChild(goalTags);
  card.appendChild(goalsSec);

  const intSec = el("div", "dash-section");
  intSec.appendChild(el("h3", "", "Workout interests"));
  const intTags = el("div", "profile-tags");
  (profile.interests.length ? profile.interests : ["None selected"]).forEach((i) =>
    intTags.appendChild(el("span", "tag", i)));
  intSec.appendChild(intTags);
  card.appendChild(intSec);

  const actions = el("div", "actions");
  const edit = el("a", "btn btn-primary", "Edit profile");
  edit.href = "#/find";
  const sched = el("a", "btn btn-ghost", "Edit schedule");
  sched.href = "#/schedule";
  actions.appendChild(edit);
  actions.appendChild(sched);
  card.appendChild(actions);
}

/* ---------- Connections ---------- */

function renderConnections() {
  const interests = loadInterests().filter((i) => i.type === "interested");
  const pending = $("#pendingList");
  const accepted = $("#acceptedList");
  pending.innerHTML = "";
  accepted.innerHTML = "";

  if (!interests.length) {
    $("#connEmpty").hidden = false;
  } else {
    $("#connEmpty").hidden = true;
    interests.forEach((it) => {
      const p = PROFILES.find((x) => x.id === it.profile);
      if (!p) return;
      const item = el("div", "conn-item");
      item.appendChild(el("div", "conn-avatar", p.initials));
      const info = el("div", "conn-info");
      info.appendChild(el("div", "conn-name", p.name));
      info.appendChild(el("div", "conn-meta", `${p.experience} · ${p.location}`));
      item.appendChild(info);
      item.appendChild(el("span", "demo-pill", "Pending (Demo)"));
      const remove = el("button", "btn btn-ghost btn-small", "Remove");
      remove.type = "button";
      remove.addEventListener("click", () => {
        saveInterests(loadInterests().filter((i) => !(i.profile === p.id && i.type === "interested")));
        renderConnections();
        showToast(`Removed demo interest for ${p.name}.`);
      });
      item.appendChild(remove);
      pending.appendChild(item);
    });
  }

  accepted.appendChild(el("p", "empty-state",
    "No accepted partners yet. In the live service, mutual interest would create a connection here, with plans and chat protected by privacy controls."));
}

/* ---------- Feedback survey ---------- */

function renderFeedback() {
  const card = $("#feedbackCard");
  card.innerHTML = "";

  if (feedbackMode === "results") {
    hideProgress();
    card.appendChild(el("h2", "", "Pilot Feedback Snapshot"));
    card.appendChild(el("p", "body-text",
      "Simple counts of responses collected on <strong>this device only</strong>. To gather real data across students, use each tester's device or merge exported CSVs. Nothing is sent to a server."));
    card.appendChild(buildResultsGrid());
    const notice = el("div", "notice",
      "Because results live in this browser's localStorage, they do not collect responses centrally from multiple devices.");
    card.appendChild(notice);
    const actions = el("div", "actions");
    const csv = el("button", "btn btn-primary", "Export Responses as CSV");
    csv.type = "button";
    csv.addEventListener("click", exportCsv);
    const again = el("button", "btn btn-ghost", "Answer again");
    again.type = "button";
    again.addEventListener("click", () => {
      Object.keys(qAnswers).forEach((k) => delete qAnswers[k]);
      qIndex = 0;
      feedbackMode = "quiz";
      renderFeedback();
    });
    const clear = el("button", "btn btn-ghost", "Clear demo data");
    clear.type = "button";
    clear.addEventListener("click", () => {
      if (confirm("Delete all stored demo responses on this device?")) {
        localStorage.removeItem(RESPONSES_KEY);
        buildResultsGrid();
        showToast("Demo data cleared.");
      }
    });
    actions.appendChild(csv);
    actions.appendChild(again);
    actions.appendChild(clear);
    card.appendChild(actions);
    return;
  }

  // intro screen or question
  if (qIndex === -1) {
    hideProgress();
    card.appendChild(el("h2", "", "Pilot feedback survey"));
    card.appendChild(el("p", "body-text",
      "Help us understand whether MRU students want a workout partner matching service. Nine quick questions, about two minutes, completely anonymous. No names, student IDs or personal details are collected."));
    if (surveyDone) {
      card.appendChild(el("p", "notice", "Your response was recorded. Thank you for helping!"));
    }
    const start = el("button", "btn btn-primary", "Start survey");
    start.type = "button";
    start.addEventListener("click", () => { qIndex = 0; renderFeedback(); });
    card.appendChild(start);
    const resultsBtn = el("button", "btn btn-ghost", "View collected results");
    resultsBtn.type = "button";
    resultsBtn.addEventListener("click", () => { feedbackMode = "results"; renderFeedback(); });
    card.appendChild(resultsBtn);
    return;
  }

  if (qIndex >= FEEDBACK_QUESTIONS.length) {
    submitResponse();
    qIndex = -1;
    surveyDone = true;
    showToast("Thanks for your feedback!");
    renderFeedback();
    return;
  }

  const q = FEEDBACK_QUESTIONS[qIndex];
  setProgress(`Question ${qIndex + 1} of ${FEEDBACK_QUESTIONS.length}`, Math.round(((qIndex + 1) / FEEDBACK_QUESTIONS.length) * 100));

  const qCard = el("div", "question-card");
  qCard.appendChild(el("h2", "", q.title));
  if (q.hint) qCard.appendChild(el("p", "question-hint", q.hint));

  const options = el("div", "options");
  if (q.type === "multi" || q.type === "optionalMulti") {
    if (q.type === "multi") {
      const grid = el("div", "day-grid");
      const selected = new Set(qAnswers[q.id] || []);
      DAYS.forEach((d, i) => {
        const btn = el("button", "day-btn" + (selected.has(d) ? " selected" : ""));
        btn.type = "button";
        btn.style.animationDelay = `${i * 50}ms`;
        btn.innerHTML = `${d}<span class="day-label">${DAY_FULL[d]}</span>`;
        btn.addEventListener("click", () => {
          if (selected.has(d)) { selected.delete(d); btn.classList.remove("selected"); }
          else { selected.add(d); btn.classList.add("selected"); }
          qAnswers[q.id] = [...selected];
          updateQContinue();
        });
        grid.appendChild(btn);
      });
      options.appendChild(grid);
    } else {
      options.classList.add("cols-2");
      const selected = new Set(qAnswers[q.id] || []);
      q.options.forEach((opt, i) => {
        const btn = el("button", "option-btn chip-btn" + (selected.has(opt.value) ? " selected" : ""), opt.label);
        btn.type = "button";
        btn.style.animationDelay = `${i * 60}ms`;
        btn.addEventListener("click", () => {
          if (selected.has(opt.value)) { selected.delete(opt.value); btn.classList.remove("selected"); }
          else { selected.add(opt.value); btn.classList.add("selected"); }
          qAnswers[q.id] = [...selected];
          updateQContinue();
        });
        options.appendChild(btn);
      });
    }
  } else {
    if (q.options.length <= 4) options.classList.add("cols-2");
    q.options.forEach((opt, i) => {
      const value = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      const ic = typeof opt === "string" ? null : opt.icon;
      const btn = el("button", "option-btn" + (qAnswers[q.id] === value ? " selected" : ""));
      btn.type = "button";
      btn.style.animationDelay = `${i * 70}ms`;
      btn.innerHTML = ic
        ? `<span class="opt-icon">${ICONS[ic] || ""}</span><span>${label}</span>`
        : label;
      btn.addEventListener("click", () => {
        qAnswers[q.id] = value;
        options.querySelectorAll(".option-btn").forEach((b) => b.classList.toggle("selected", b === btn));
        updateQContinue();
      });
      options.appendChild(btn);
    });
  }

  const nav = el("div", "question-nav");
  const back = el("button", "btn-back", qIndex > 0 ? "Back" : "Exit survey");
  back.type = "button";
  back.addEventListener("click", () => {
    if (qIndex > 0) { qIndex--; renderFeedback(); }
    else { qIndex = -1; hideProgress(); renderFeedback(); }
  });
  const next = el("button", "btn btn-primary",
    qIndex === FEEDBACK_QUESTIONS.length - 1 ? "Finish" : "Continue");
  next.type = "button";
  next.id = "btnQNext";
  next.disabled = true;
  next.addEventListener("click", () => {
    qIndex++;
    renderFeedback();
  });
  nav.appendChild(back);
  nav.appendChild(next);
  qCard.appendChild(options);
  qCard.appendChild(nav);
  card.appendChild(qCard);
  updateQContinue();
}

function updateQContinue() {
  const q = FEEDBACK_QUESTIONS[qIndex];
  if (!q) return;
  const val = qAnswers[q.id];
  const has = q.type === "multi" ? Array.isArray(val) && val.length > 0
    : q.type === "optionalMulti" ? true : !!val;
  const btn = $("#btnQNext");
  if (btn) btn.disabled = !has;
}

function submitResponse() {
  const response = {
    goal: qAnswers.goal,
    time: qAnswers.time,
    days: qAnswers.days || [],
    experience: qAnswers.experience,
    comfort: qAnswers.comfort,
    interest: qAnswers.interest,
    activities: qAnswers.activities || [],
    comfortHelp: qAnswers.comfortHelp || [],
    matchComfort: qAnswers.matchComfort,
    submittedAt: new Date().toISOString()
  };
  const list = loadResponses();
  list.push(response);
  saveResponses(list);
  Object.keys(qAnswers).forEach((k) => delete qAnswers[k]);
}

/* ---------- Results ---------- */

function countCategory(list, field) {
  const counts = { Yes: 0, Maybe: 0, No: 0, "Not yet": 0 };
  list.forEach((r) => { if (counts[r[field]] !== undefined) counts[r[field]]++; });
  return counts;
}
function modeOf(list, field) {
  const freq = {};
  list.forEach((r) => { if (r[field]) freq[r[field]] = (freq[r[field]] || 0) + 1; });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  return top ? `${top[0]} (${top[1]})` : "No data yet";
}
function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }

function buildResultsGrid() {
  const grid = el("div", "results-grid");
  const list = loadResponses();
  const total = list.length;
  const interest = countCategory(list, "interest");
  const comfort = countCategory(list, "comfort");
  const matchComfort = countCategory(list, "matchComfort");
  const reactions = loadInterests();
  const reactedInterested = reactions.filter((r) => r.type === "interested").length;

  const stats = el("div", "stat-grid");
  [
    ["Completed questionnaires", total, ""],
    ["Interested in pilot", interest.Yes, `${pct(interest.Yes, total)}% of responses`],
    ["Comfortable meeting someone new", comfort.Yes, `${pct(comfort.Yes, total)}% said Yes`],
    ["Comfortable with sample matches", matchComfort.Yes, `${pct(matchComfort.Yes, total)}% said Yes`],
    ["Marked a sample profile interested", reactedInterested, `${reactions.length} total demo reactions`]
  ].forEach(([label, value, sub]) => {
    const card = el("div", "stat-card");
    card.appendChild(el("div", "stat-value", String(value)));
    card.appendChild(el("div", "stat-label", label));
    if (sub) card.appendChild(el("div", "stat-sub", sub));
    stats.appendChild(card);
  });
  grid.appendChild(stats);

  [
    ["Comfort meeting a new student", comfort, ["Yes", "Maybe", "Not yet"]],
    ["Interest in joining the pilot", interest, ["Yes", "Maybe", "No"]],
    ["Comfort with the sample matches", matchComfort, ["Yes", "Maybe", "No"]]
  ].forEach(([title, counts, cats]) => {
    const div = el("div", "result-block");
    div.appendChild(el("h3", "", title));
    cats.forEach((cat) => {
      const row = el("div", "result-row");
      row.innerHTML = `<span>${cat}</span><span class="count">${counts[cat] || 0}</span>`;
      div.appendChild(row);
    });
    grid.appendChild(div);
  });

  const prefsBlock = el("div", "result-block");
  prefsBlock.appendChild(el("h3", "", "Most common preferences"));
  const actFreq = {};
  list.forEach((r) => (r.activities || []).forEach((a) => { actFreq[a] = (actFreq[a] || 0) + 1; }));
  const topAct = Object.entries(actFreq).sort((a, b) => b[1] - a[1])[0];
  [["Fitness goal", modeOf(list, "goal")], ["Preferred time", modeOf(list, "time")],
   ["Experience level", modeOf(list, "experience")],
   ["Top activity", topAct ? `${topAct[0]} (${topAct[1]})` : "No data yet"]
  ].forEach(([k, v]) => {
    const row = el("div", "result-row");
    row.innerHTML = `<span>${k}</span><span class="count pref-value">${v}</span>`;
    prefsBlock.appendChild(row);
  });
  grid.appendChild(prefsBlock);
  return grid;
}

function exportCsv() {
  const list = loadResponses();
  if (!list.length) { showToast("No responses to export yet."); return; }
  const headers = ["timestamp", "goal", "preferred_time", "days", "experience",
    "comfort_meeting_new_student", "interested_in_pilot", "activities",
    "comfort_factors", "comfortable_with_sample_matches"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = list.map((r) => [
    r.submittedAt, r.goal, r.time, (r.days || []).join("; "), r.experience,
    r.comfort, r.interest, (r.activities || []).join("; "),
    (r.comfortHelp || []).join("; "), r.matchComfort
  ].map(esc).join(","));
  const csv = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = el("a");
  a.href = url;
  a.download = `mru_gym_buddy_responses_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("CSV downloaded.");
}

/* ---------- Init ---------- */

function init() {
  // Pre-fill wizard state from saved profile so Find a Buddy resumes
  Object.assign(wizardState, profile);
  wizardState.availability = JSON.parse(JSON.stringify(profile.availability));

  $("#navToggle").addEventListener("click", () => {
    const nav = $("#mainNav");
    const open = nav.classList.toggle("open");
    $("#navToggle").setAttribute("aria-expanded", String(open));
  });

  $("#matchSort").addEventListener("change", renderMatches);
  $("#matchOverlapOnly").addEventListener("change", renderMatches);

  $("#btnSaveSchedule").addEventListener("click", () => {
    profile.availability = { ...profile.availability };
    saveProfile();
    showToast("Schedule saved. Your matches have been updated.");
  });

  $("#btnResetDismissed").addEventListener("click", () => {
    const before = loadInterests().filter((i) => i.type === "not_interested").length;
    saveInterests(loadInterests().filter((i) => i.type !== "not_interested"));
    renderMatches();
    showToast(before ? "Dismissed profiles restored." : "No dismissed profiles to restore.");
  });

  window.addEventListener("hashchange", route);
  route();

  // Parallax (reduced-motion / touch safe)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!reduceMotion && finePointer) {
    const shapes = $$(".shape");
    let raf = null;
    document.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        shapes.forEach((s, i) => {
          const depth = (i + 1) * 4;
          s.style.translate = `${x * depth / 24}px ${y * depth / 24}px`;
        });
        raf = null;
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
