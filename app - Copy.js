"use strict";

const STORAGE_KEYS = {
  faqs: "campusly.faqs.v1",
  conversations: "campusly.conversations.v1",
};

const starterFaqs = [
  {
    id: "admissions-apply",
    question: "How do I apply for admission?",
    answer: "Check the current admission information and confirm required documents and dates with the college office. The prospectus listed in the information reviewed is for 2022–23 and may be out of date.",
    category: "Admissions",
    keywords: ["apply", "application", "admission", "enrol", "enroll", "documents", "deadline"],
  },
  {
    id: "admissions-deadline",
    question: "When is the application deadline?",
    answer: "I could not verify a current admission deadline. Please check the latest admission notice or confirm the date with the college office.",
    category: "Admissions",
    keywords: ["deadline", "date", "last date", "apply", "application", "intake"],
  },
  {
    id: "admissions-eligibility",
    question: "What are the admission eligibility requirements?",
    answer: "Eligibility depends on the program and current university rules. Please confirm the criteria for your chosen subject with the college office.",
    category: "Admissions",
    keywords: ["eligibility", "eligible", "requirements", "qualification", "marks", "criteria"],
  },
  {
    id: "academics-courses",
    question: "What courses and programs do you offer?",
    answer: "Sitabai College's information lists Arts undergraduate and postgraduate subject areas and B.Sc. subject areas including Botany, Chemistry, Computer Science, Mathematics, Microbiology, Physics, and Zoology. It also has a Commerce department. Check with the college to confirm current course titles and combinations.",
    category: "Academics",
    keywords: ["course", "courses", "program", "programs", "degree", "subjects", "study"],
  },
  {
    id: "academics-calendar",
    question: "When does the semester start?",
    answer: "Semester start dates are published in the academic calendar. Please check the latest college calendar or ask the academic office for your program's confirmed schedule.",
    category: "Academics",
    keywords: ["semester", "start", "term", "calendar", "class", "schedule", "academic"],
  },
  {
    id: "fees-tuition",
    question: "How much are the tuition fees?",
    answer: "I could not verify a current fee schedule. Please ask the college office for the fees for your course and intake, including any additional charges.",
    category: "Fees & Aid",
    keywords: ["fee", "fees", "tuition", "cost", "price", "payment", "accounts"],
  },
  {
    id: "fees-scholarships",
    question: "Are scholarships or financial aid available?",
    answer: "Please ask the college office to confirm current scholarship and financial assistance options, eligibility, and deadlines.",
    category: "Fees & Aid",
    keywords: ["scholarship", "scholarships", "financial aid", "financial", "grant", "bursary", "aid"],
  },
  {
    id: "campus-hostel",
    question: "Is hostel accommodation available?",
    answer: "The college profile mentions a girls' hostel. Ask the college office to confirm current availability, application steps, and fees.",
    category: "Campus Life",
    keywords: ["hostel", "housing", "accommodation", "room", "dorm", "residence", "stay"],
  },
  {
    id: "campus-clubs",
    question: "What clubs and activities are available on campus?",
    answer: "The college profile mentions sports, games, cultural activities, NCC, and NSS. Check with the college to confirm current activities and schedules.",
    category: "Campus Life",
    keywords: ["club", "clubs", "activity", "activities", "events", "sports", "student life"],
  },
  {
    id: "services-library",
    question: "What are the library opening hours?",
    answer: "I could not verify the current library hours. Please check today's schedule with the college office.",
    category: "Student Services",
    keywords: ["library", "hours", "opening", "open", "close", "books", "study"],
  },
  {
    id: "services-location",
    question: "Where is Sitabai College located?",
    answer: "Sitabai Arts, Commerce & Science College is located in Civil Lines, Akola 444001, Maharashtra.",
    category: "Student Services",
    keywords: ["address", "location", "where", "Akola", "Civil Lines"],
  },
  {
    id: "services-placement",
    question: "Does the college provide placement or career support?",
    answer: "Please check with Sitabai College to confirm the current career guidance, internship, or placement support available for your course.",
    category: "Student Services",
    keywords: ["placement", "career", "internship", "job", "employment", "counselling"],
  },
];

const elements = {
  adminButton: document.getElementById("adminButton"),
  adminFaqList: document.getElementById("adminFaqList"),
  adminModal: document.getElementById("adminModal"),
  cancelEditButton: document.getElementById("cancelEditButton"),
  characterCount: document.getElementById("characterCount"),
  chatForm: document.getElementById("chatForm"),
  chatStat: document.getElementById("chatStat"),
  connectionDot: document.getElementById("connectionDot"),
  connectionStatus: document.getElementById("connectionStatus"),
  conversation: document.getElementById("conversation"),
  conversationTitle: document.getElementById("conversationTitle"),
  dashboardView: document.getElementById("dashboardView"),
  faqAnswer: document.getElementById("faqAnswer"),
  faqCategory: document.getElementById("faqCategory"),
  faqError: document.getElementById("faqError"),
  faqForm: document.getElementById("faqForm"),
  faqFormTitle: document.getElementById("faqFormTitle"),
  faqId: document.getElementById("faqId"),
  faqKeywords: document.getElementById("faqKeywords"),
  faqList: document.getElementById("faqList"),
  faqQuestion: document.getElementById("faqQuestion"),
  faqSearch: document.getElementById("faqSearch"),
  faqStat: document.getElementById("faqStat"),
  historyCount: document.getElementById("historyCount"),
  historyList: document.getElementById("historyList"),
  infoView: document.getElementById("infoView"),
  loginError: document.getElementById("loginError"),
  loginForm: document.getElementById("loginForm"),
  loginView: document.getElementById("loginView"),
  demoLoginHint: document.getElementById("demoLoginHint"),
  messageInput: document.getElementById("messageInput"),
  messageList: document.getElementById("messageList"),
  mobileMenuButton: document.getElementById("mobileMenuButton"),
  newChatButton: document.getElementById("newChatButton"),
  saveFaqButton: document.getElementById("saveFaqButton"),
  sendButton: document.getElementById("sendButton"),
  voiceButton: document.getElementById("voiceButton"),
  voiceStatus: document.getElementById("voiceStatus"),
  sidebar: document.getElementById("sidebar"),
  storageNote: document.getElementById("storageNote"),
  toast: document.getElementById("toast"),
  welcomeScreen: document.getElementById("welcomeScreen"),
};

function loadFromStorage(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === null) return fallback;
  try {
    const value = JSON.parse(saved);
    return Array.isArray(value) ? value : fallback;
  } catch (error) {
    console.error(`Could not read saved ${key} data.`, error);
    return fallback;
  }
}

let faqs = [
  ...starterFaqs,
  ...loadFromStorage(STORAGE_KEYS.faqs, []).filter((savedFaq) =>
    savedFaq &&
    typeof savedFaq === "object" &&
    savedFaq.id !== "services-contact" &&
    !starterFaqs.some((starterFaq) => starterFaq.id === savedFaq.id)
  ),
];
let conversations = loadFromStorage(STORAGE_KEYS.conversations, []);
let activeConversationId = null;
let adminSignedIn = false;
let toastTimer;
let supabaseClient = null;
let adminSupabaseClient = null;
let supabaseUserId = null;
let cloudReady = false;
let isReplyPending = false;
let voicePeerConnection = null;
let voiceMediaStream = null;
let voiceDataChannel = null;
let voiceAudioElement = null;
let isVoiceStarting = false;
let voiceSessionGeneration = 0;
let voiceInputItems = new Set();
let voiceOutputItems = new Set();
let currentView = "home";

const courseCatalog = [
  {
    id: "arts-undergraduate",
    name: "Arts · listed subjects",
    department: "ARTS",
    level: "Subject areas",
    subjects: ["English", "Marathi", "Hindi", "Sanskrit", "Political Science", "Urdu", "Economics", "Sociology", "History", "Home Science", "Music", "Yogshastra", "Physical Education", "Home Economics"],
    summary: "Explore the undergraduate Arts subject areas listed by Sitabai College.",
  },
  {
    id: "arts-postgraduate",
    name: "Arts · Postgraduate subjects",
    department: "ARTS",
    level: "Postgraduate",
    subjects: [],
    summary: "The college About page lists postgraduate Arts subjects. Confirm current availability and degree titles with the college.",
  },
  {
    id: "commerce-department",
    name: "Commerce department",
    department: "COMMERCE",
    level: "Program details to confirm",
    subjects: [],
    summary: "The college lists a Commerce department. Confirm current degree titles, subject combinations, and availability with the college.",
  },
  {
    id: "bsc-science",
    name: "B.Sc. · Science subject areas",
    department: "SCIENCE",
    level: "Undergraduate",
    subjects: ["Botany", "Chemistry", "Computer Science", "Mathematics", "Microbiology", "Physics", "Zoology"],
    summary: "Explore the B.Sc. subject areas listed on the college's official Science department page.",
  },
];

const sectionContent = {
  about: {
    eyebrow: "SITABAI ARTS, COMMERCE & SCIENCE COLLEGE",
    title: "A long-standing learning community in Akola.",
    description: "Sitabai Arts College was established in 1938 as the first college of the Berar General Education Society, founded in 1935. The college describes its roots in widening access to higher education in the Vidarbha region.",
    cards: [
      { icon: "1938", title: "A legacy in Vidarbha", body: "Sitabai College was established in 1938 as the first college set up by the Berar General Education Society, founded in 1935.", action: "Ask about college history", question: "Tell me about Sitabai College history." },
      { icon: "✦", title: "Student-centred mission", body: "The college emphasizes quality teaching, inclusive education, student development, employability, and respect for folk arts and culture.", action: "Ask about the college mission", question: "What is Sitabai College's mission?" },
      { icon: "▤", title: "Arts, Commerce & Science", body: "Browse the college's official department information and ask admissions to confirm current programs, combinations, and eligibility.", action: "Explore departments", view: "courses" },
    ],
    notice: "About and history details are summarized from college information reviewed. Some facilities and programs may change; confirm current details with the college.",
  },
  admissions: {
    eyebrow: "YOUR NEXT CHAPTER",
    title: "Plan your admission to Sitabai.",
    description: "Review admission information and verify current program availability, eligibility, dates, and required documents with the admissions office.",
    cards: [
      { icon: "01", title: "Choose your course", body: "Browse the verified department and subject information, then ask the college about programs currently available.", action: "Explore departments", view: "courses" },
      { icon: "02", title: "Review admission information", body: "Review the admission information available and make sure it applies to your intake.", action: "Ask about admission steps", question: "What are the current admission steps and required documents?" },
      { icon: "03", title: "Confirm current dates", body: "Intake dates and application deadlines can change. Confirm the current admission notice with the college office.", action: "Ask about admission dates", question: "What is the current admission deadline?" },
    ],
    notice: "The college's website links a 2022–23 prospectus, which may be out of date. Verify current admission deadlines and course rules directly with the college.",
  },
  fees: {
    eyebrow: "PLAN WITH CONFIDENCE",
    title: "Get the right fee for your course.",
    description: "Fees can differ by course, year, and student category. A current fee schedule was not available in the information reviewed, so ask the college office to confirm the approved amount.",
    cards: courseCatalog.map((course) => ({
      icon: "₹",
      title: course.name,
      body: "Current fees and intake must be confirmed with admissions.",
      action: "Check fee details",
      courseId: course.id,
    })),
    notice: "No tuition figures are shown here because a current official fee schedule could not be verified. Ask for the full fee breakdown, including exam, library, hostel, and other charges.",
  },
  campus: {
    eyebrow: "MAKE CAMPUS YOURS",
    title: "A campus with room to grow.",
    description: "The college describes a city-centre campus with student activities and support. Ask the college to confirm current service hours and availability.",
    cards: [
      { icon: "✳", title: "Sports & cultural life", body: "The college profile highlights sports, games, cultural activities, NCC, and NSS.", action: "Ask about campus activities", question: "What sports and cultural activities are available?" },
      { icon: "⌂", title: "Girls' hostel", body: "The college profile mentions a girls' hostel facility. Confirm current availability and fees with the college.", action: "Ask about hostel availability", question: "Is the girls' hostel currently available, and what are its fees?" },
      { icon: "▤", title: "Library & departments", body: "Explore the college's library and academic department information.", action: "Ask about the library", question: "What library facilities and hours are available?" },
      { icon: "◎", title: "Student support", body: "Ask the college office for current guidance about academic, admission, and student services.", action: "Ask about student support", question: "What student support services are available?" },
    ],
    notice: "Hostel availability, service hours, facilities, and student activity schedules can change. Please confirm current information with the college.",
  },
};

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save ${key} data.`, error);
    showToast("Could not save changes. Check browser storage.");
    return false;
  }
}

function createUuid() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
      const random = Math.floor(Math.random() * 16);
      return (character === "x" ? random : (random & 0x3) | 0x8).toString(16);
    });
  }

  function isSupabaseConfigured() {
    const config = window.CAMPUSLY_SUPABASE_CONFIG;
    return Boolean(config && /^https:\/\/.+\.supabase\.co\/?$/.test(config.url.trim()) && config.anonKey.trim());
  }

  function hasSupabaseSettings() {
    const config = window.CAMPUSLY_SUPABASE_CONFIG;
    return Boolean(config && (config.url.trim() || config.anonKey.trim()));
  }

  function setConnectionStatus(isConnected, message) {
    elements.connectionStatus.textContent = message;
    elements.connectionDot.classList.toggle("connected", isConnected);
  }

  async function ensureStudentSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (data.session) {
      supabaseUserId = data.session.user.id;
      return;
    }
    const { data: anonymousData, error: anonymousError } = await supabaseClient.auth.signInAnonymously();
    if (anonymousError) throw anonymousError;
    supabaseUserId = anonymousData.user.id;
  }

  async function refreshFaqsFromSupabase() {
    const { data, error } = await supabaseClient
      .from("faqs")
      .select("id, question, answer, category, keywords")
      .order("created_at", { ascending: true });
    if (error) throw error;
    faqs = data.map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      keywords: row.keywords || [],
    }));
    persist(STORAGE_KEYS.faqs, faqs);
    renderFaqs();
    renderAdmin();
  }

  async function loadConversationsFromSupabase() {
    const { data: rows, error } = await supabaseClient
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    if (!rows.length) {
      conversations = [];
    } else {
      const { data: messageRows, error: messagesError } = await supabaseClient
        .from("messages")
        .select("id, conversation_id, role, content, fallback, created_at")
        .in("conversation_id", rows.map((row) => row.id))
        .order("created_at", { ascending: true });
      if (messagesError) throw messagesError;

      conversations = rows.map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        messages: messageRows
          .filter((message) => message.conversation_id === row.id)
          .map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            fallback: message.fallback,
            createdAt: message.created_at,
          })),
      }));
    }
    persist(STORAGE_KEYS.conversations, conversations);
    activeConversationId = null;
    renderHistory();
    renderAdminStats();
  }

  async function initializeSupabase() {
    if (!isSupabaseConfigured()) return;
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("The Supabase client library did not load. Check your internet connection.");
    }

    const config = window.CAMPUSLY_SUPABASE_CONFIG;
    supabaseClient = window.supabase.createClient(config.url.trim(), config.anonKey.trim());
    adminSupabaseClient = window.supabase.createClient(config.url.trim(), config.anonKey.trim(), {
      auth: { storageKey: "campusly-admin-auth-v1" },
    });
    await ensureStudentSession();
    cloudReady = true;
    const { data: adminSession, error: adminSessionError } = await adminSupabaseClient.auth.getSession();
    if (adminSessionError) throw adminSessionError;
    adminSignedIn = adminSession.session?.user.app_metadata?.role === "admin";
    elements.demoLoginHint.textContent = "Use the staff account created for this Supabase project.";
    elements.storageNote.textContent = "Cloud connected: FAQs and conversations sync to this Supabase project.";
    document.getElementById("adminEmail").value = "";
    document.getElementById("adminEmail").placeholder = "Staff email address";

    await Promise.all([refreshFaqsFromSupabase(), loadConversationsFromSupabase()]);
    setConnectionStatus(true, "Cloud sync connected");

    supabaseClient
      .channel("campusly-faq-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "faqs" }, () => {
        refreshFaqsFromSupabase().catch((error) => {
          console.error("Could not refresh FAQs after a live update.", error);
          showToast("A live FAQ update could not be loaded.");
        });
      })
      .subscribe((status, error) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("The live FAQ subscription is unavailable.", error);
          showToast("Live FAQ updates are unavailable; refresh to check for changes.");
        }
      });
  }

  async function initializeApp() {
    renderFaqs();
    renderHistory();
    renderAdminStats();
    updateComposer();
    renderSection("home");

    if (!hasSupabaseSettings()) return;
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Enter both a valid Supabase project URL and its anon/publishable key in supabase-config.js.");
      }
      await initializeSupabase();
    } catch (error) {
      cloudReady = false;
      console.error("Could not initialize Supabase.", error);
      setConnectionStatus(false, "Cloud unavailable · using browser-only mode");
      elements.storageNote.textContent = "Cloud unavailable: changes are kept in this browser until the connection is fixed.";
      showToast("Cloud setup failed. Check supabase-config.js, database setup, and network.");
    }
  }

  async function syncConversationToSupabase(conversation) {
    if (!cloudReady || !supabaseUserId) return;
    const firstQuestion = conversation.messages.find((message) => message.role === "user");
    const { error: conversationError } = await supabaseClient.from("conversations").upsert({
      id: conversation.id,
      owner_id: supabaseUserId,
      title: firstQuestion ? firstQuestion.content.slice(0, 140) : "New conversation",
      created_at: conversation.createdAt,
      updated_at: new Date().toISOString(),
    });
    if (conversationError) throw conversationError;

    if (conversation.messages.length) {
      const { error: messagesError } = await supabaseClient.from("messages").upsert(
        conversation.messages.map((message) => ({
          id: message.id,
          conversation_id: conversation.id,
          owner_id: supabaseUserId,
          role: message.role,
          content: message.content,
          fallback: Boolean(message.fallback),
          created_at: message.createdAt,
        })),
      );
      if (messagesError) throw messagesError;
    }
  }

  function saveConversations(conversation) {
    persist(STORAGE_KEYS.conversations, conversations);
    if (cloudReady && conversation) {
      syncConversationToSupabase(conversation).catch((error) => {
        console.error("Could not sync this conversation to Supabase.", error);
        showToast("Cloud sync failed. This conversation is saved only in this browser.");
      });
    }
  }

  async function saveFaqToSupabase(faq) {
    if (!adminSupabaseClient) return;
    const { error } = await adminSupabaseClient.from("faqs").upsert({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      keywords: faq.keywords,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  async function deleteFaqFromSupabase(id) {
    if (!adminSupabaseClient) return;
    const { error } = await adminSupabaseClient.from("faqs").delete().eq("id", id);
    if (error) throw error;
  }

async function deleteConversationFromSupabase(id) {
    if (!cloudReady) return;
    const { error } = await supabaseClient.from("conversations").delete().eq("id", id);
    if (error) throw error;
  }
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatText(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function showChat(question = "") {
  currentView = "assistant";
  elements.infoView.hidden = true;
  document.querySelector(".chat-layout").hidden = false;
  document.querySelectorAll(".sidebar-nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === "assistant");
  });
  if (question) {
    elements.messageInput.value = question;
    updateComposer();
    elements.messageInput.focus();
  }
  elements.sidebar.classList.remove("open");
}

function renderSection(view, courseId = "") {
  if (view !== "assistant" && (voicePeerConnection || isVoiceStarting)) stopVoiceSession();
  if (view === "assistant") {
    showChat();
    return;
  }
  currentView = view;
  document.querySelector(".chat-layout").hidden = true;
  elements.infoView.hidden = false;
  document.querySelectorAll(".sidebar-nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  if (view === "home") {
    elements.infoView.innerHTML = `
      <div class="info-page dashboard-page">
        <section class="college-hero">
          <div class="college-hero-copy">
            <span class="eyebrow">WELCOME TO SITABAI</span>
            <h1>Sitabai Arts, Commerce &amp; Science College</h1>
            <p class="college-hero-location"><span aria-hidden="true">⌖</span> Civil Lines, Akola, Maharashtra 444001</p>
            <div class="hero-actions">
              <button class="hero-primary" type="button" data-view="courses">Explore departments <span aria-hidden="true">→</span></button>
              <button class="hero-secondary" type="button" data-view="assistant">Talk to the AI assistant <span aria-hidden="true">→</span></button>
            </div>
          </div>
          <div class="college-hero-seal"><img src="assets/sitabai-college-logo.png" alt="Sitabai College official emblem" /><span>AKOLA · EST. 1938</span></div>
          <div class="hero-decoration" aria-hidden="true"></div>
        </section>
        <div class="dashboard-stat-grid">
          <div class="dashboard-stat"><span class="dashboard-stat-icon">✦</span><span><strong>1938</strong><small>College established</small></span></div>
          <div class="dashboard-stat"><span class="dashboard-stat-icon fee-stat-icon">▤</span><span><strong>3</strong><small>Arts · Commerce · Science</small></span></div>
          <div class="dashboard-stat"><span class="dashboard-stat-icon campus-stat-icon">⌖</span><span><strong>Akola</strong><small>Vidarbha, Maharashtra</small></span></div>
        </div>
        <div class="dashboard-section-heading"><div><span class="eyebrow">EXPLORE THE COLLEGE</span><h2>Where would you like to go?</h2></div></div>
        <div class="info-card-grid dashboard-links">
          <article class="info-card"><span class="info-card-icon">▧</span><h2>About Sitabai College</h2><p>Learn about the college's history, founding society, and student-centred mission.</p><button class="info-card-action" type="button" data-view="about">Explore college profile <span aria-hidden="true">→</span></button></article>
          <article class="info-card"><span class="info-card-icon">▤</span><h2>Departments & subjects</h2><p>Explore the official Arts subjects, B.Sc. subject areas, and Commerce department.</p><button class="info-card-action" type="button" data-view="courses">Browse departments <span aria-hidden="true">→</span></button></article>
          <article class="info-card"><span class="info-card-icon">↗</span><h2>Admissions</h2><p>Review the admission steps and confirm current dates and requirements.</p><button class="info-card-action" type="button" data-view="admissions">Admission information <span aria-hidden="true">→</span></button></article>
          <article class="info-card"><span class="info-card-icon">₹</span><h2>Fees & scholarships</h2><p>Review fee and scholarship information. Current amounts must be confirmed.</p><button class="info-card-action" type="button" data-view="fees">Explore fee information <span aria-hidden="true">→</span></button></article>
          <article class="info-card"><span class="info-card-icon">✳</span><h2>Campus life</h2><p>Find information about the girls' hostel, sports, cultural activities, and student services.</p><button class="info-card-action" type="button" data-view="campus">Discover campus life <span aria-hidden="true">→</span></button></article>
          <article class="info-card"><span class="info-card-icon">✦</span><h2>Ask the AI assistant</h2><p>Ask a question about departments, admissions, or the campus in a natural conversation.</p><button class="info-card-action" type="button" data-view="assistant">Start a conversation <span aria-hidden="true">→</span></button></article>
        </div>
        <p class="source-credit">College profile and department details are summarized from institutional information. Confirm current admissions, fees, and availability before making decisions.</p>
      </div>`;
    bindInfoViewButtons();
    return;
  }

  if (view === "courses" && courseId) {
    const course = courseCatalog.find((item) => item.id === courseId);
    if (!course) {
      renderSection("courses");
      return;
    }
    elements.infoView.innerHTML = `
      <div class="info-page">
        <button class="back-link" type="button" data-view="courses">← All courses</button>
        <div class="course-detail-hero">
          <div class="course-art" aria-hidden="true"><span>✦</span><strong>${escapeHtml(course.name.split(" ").slice(0, 2).join(" "))}</strong></div>
          <div class="course-detail-heading">
            <span class="eyebrow">${escapeHtml(course.department)}</span>
            <h1>${escapeHtml(course.name)}</h1>
            <p>${escapeHtml(course.summary)}</p>
            <div class="course-badges"><span>${escapeHtml(course.level)}</span><span>Current availability: confirm with college</span></div>
          </div>
        </div>
        <div class="detail-grid">
          <section class="detail-card fee-detail-card">
            <span class="detail-label">CURRENT FEES</span>
            <strong class="fee-amount">Ask the college office</strong>
            <p>No current official fee schedule was verified for this subject area.</p>
            <span class="detail-divider"></span>
            <span class="detail-label">INTAKE & SEATS</span>
            <strong class="detail-value">Confirm current details</strong>
            <p>Ask the college about this year's intake, seats, and application dates.</p>
          </section>
          <section class="detail-card">
            <span class="detail-label">PROGRAM & ELIGIBILITY</span>
            <p class="eligibility-copy">Degree titles, subject combinations, and eligibility depend on current college and university admission rules. Ask admissions to confirm.</p>
            <span class="detail-divider"></span>
            <span class="detail-label">CURRENT PROGRAM DETAILS</span>
            <strong class="detail-value">Confirm with the college</strong>
          </section>
        </div>
        <section class="detail-card subjects-card">
          <div class="detail-section-heading"><div><span class="detail-label">OFFICIAL DEPARTMENT INFORMATION</span><h2>Listed subject areas</h2></div>${course.subjects.length ? `<span class="subject-count">${course.subjects.length} subject areas</span>` : ""}</div>
          ${course.subjects.length
    ? `<div class="subject-list">${course.subjects.map((subject, index) => `<div class="subject-item"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(subject)}</div>`).join("")}</div>`
    : `<p class="subject-empty">Subject details could not be reliably listed here. Ask the college office for current information.</p>`}
        </section>
        <div class="course-detail-footer">
          <p>Fees, admissions, and current availability are not confirmed here. Please verify these directly with the college.</p>
          <div class="course-detail-actions">
            <button class="primary-button ask-course-button" type="button" data-ask-question="Tell me about ${escapeHtml(course.name)}, including current availability and fees.">Ask the AI assistant <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>`;
    bindInfoViewButtons();
    return;
  }

  if (view === "courses") {
    elements.infoView.innerHTML = `
      <div class="info-page">
        <div class="info-page-heading">
          <span class="eyebrow">SITABAI COLLEGE · AKOLA</span>
          <h1>Departments & subject areas.</h1>
          <p>Browse department information and verify current courses, subject combinations, eligibility, fees, and intake with the college.</p>
        </div>
        <div class="catalog-notice"><span aria-hidden="true">✳</span><p><strong>Verified information:</strong> These are department and subject areas included in institutional information. Exact degree titles, duration, fees, seat counts, intake dates, and eligibility are not stated here; confirm these with the college.</p></div>
        <label class="course-search"><span>Search departments and subjects</span><input id="courseSearch" type="search" placeholder="Try science, history, or commerce..." autocomplete="off" /></label>
        <div class="course-filters" role="group" aria-label="Filter by department">
          <button type="button" class="course-filter active" data-department-filter="ALL" aria-pressed="true">All</button>
          <button type="button" class="course-filter" data-department-filter="ARTS" aria-pressed="false">Arts</button>
          <button type="button" class="course-filter" data-department-filter="COMMERCE" aria-pressed="false">Commerce</button>
          <button type="button" class="course-filter" data-department-filter="SCIENCE" aria-pressed="false">Science</button>
        </div>
        <div class="course-grid">${courseCatalog.map((course, index) => `
          <article class="course-card" data-course-department="${escapeHtml(course.department)}" data-course-search="${escapeHtml(`${course.name} ${course.summary} ${course.subjects.join(" ")}`.toLowerCase())}">
            <div class="course-card-top"><span class="course-number">0${index + 1}</span><span class="course-dept">${escapeHtml(course.department)}</span><span class="course-symbol" aria-hidden="true">${["⌘", "▤", "↗", "✎"][index % 4]}</span></div>
            <h2>${escapeHtml(course.name)}</h2>
            <p>${escapeHtml(course.summary)}</p>
            <div class="course-card-meta"><span>${escapeHtml(course.level)}</span>${course.subjects.length ? `<span>${course.subjects.length} listed areas</span>` : ""}</div>
            <div class="course-card-bottom"><div><small>Fees & intake</small><strong>Ask the college</strong></div><button class="course-open-button" type="button" data-course-id="${escapeHtml(course.id)}" aria-label="View ${escapeHtml(course.name)} details">Explore <span aria-hidden="true">→</span></button></div>
          </article>`).join("")}</div>
        <p class="course-empty" hidden>No department or subject matched your search.</p>
        <p class="source-credit">Department and subject summaries are based on institutional information. Confirm current programs and availability before applying.</p>
      </div>`;
    bindInfoViewButtons();
    bindCourseFilters();
    return;
  }

  const content = sectionContent[view];
  if (!content) {
    showChat();
    return;
  }
  const cardMarkup = content.cards.map((card) => `
    <article class="info-card">
      <span class="info-card-icon">${escapeHtml(card.icon)}</span>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(card.body)}</p>
      <button class="info-card-action" type="button" ${card.view ? `data-view="${escapeHtml(card.view)}"` : ""} ${card.question ? `data-ask-question="${escapeHtml(card.question)}"` : ""} ${card.courseId ? `data-course-id="${escapeHtml(card.courseId)}"` : ""}>
        ${escapeHtml(card.action)} <span aria-hidden="true">→</span>
      </button>
    </article>`).join("");
  elements.infoView.innerHTML = `
    <div class="info-page">
      <div class="info-page-heading">
        <span class="eyebrow">${escapeHtml(content.eyebrow)}</span>
        <h1>${escapeHtml(content.title)}</h1>
        <p>${escapeHtml(content.description)}</p>
      </div>
      <div class="${view === "fees" ? "course-grid fee-grid" : "info-card-grid"}">${cardMarkup}</div>
      <div class="catalog-notice"><span aria-hidden="true">✳</span><p>${escapeHtml(content.notice)}</p></div>
      <p class="source-credit">Fees, deadlines, eligibility, and availability can change. Confirm important details with the college office.</p>
    </div>`;
  bindInfoViewButtons();
}

function bindInfoViewButtons() {
  elements.infoView.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => renderSection(button.dataset.view));
  });
  elements.infoView.querySelectorAll("[data-course-id]").forEach((button) => {
    button.addEventListener("click", () => renderSection("courses", button.dataset.courseId));
  });
  elements.infoView.querySelectorAll("[data-ask-question]").forEach((button) => {
    button.addEventListener("click", () => showChat(button.dataset.askQuestion));
  });
}

function bindCourseFilters() {
  const search = elements.infoView.querySelector("#courseSearch");
  const filterButtons = elements.infoView.querySelectorAll("[data-department-filter]");
  const cards = elements.infoView.querySelectorAll("[data-course-department]");
  const emptyState = elements.infoView.querySelector(".course-empty");
  let activeDepartment = "ALL";

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;
    cards.forEach((card) => {
      const matchesDepartment = activeDepartment === "ALL" || card.dataset.courseDepartment === activeDepartment;
      const matchesSearch = card.dataset.courseSearch.includes(query);
      card.hidden = !matchesDepartment || !matchesSearch;
      if (!card.hidden) visibleCount += 1;
    });
    emptyState.hidden = visibleCount > 0;
  }

  search.addEventListener("input", applyFilters);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeDepartment = button.dataset.departmentFilter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      applyFilters();
    });
  });
}

function renderFaqs() {
  const query = elements.faqSearch.value.trim().toLowerCase();
  const matches = faqs.filter((faq) => {
    const searchable = `${faq.question} ${faq.answer} ${faq.category} ${(faq.keywords || []).join(" ")}`.toLowerCase();
    return searchable.includes(query);
  }).slice(0, 8);

  elements.faqList.innerHTML = matches.length
    ? matches.map((faq) => `
      <button class="faq-item" type="button" data-faq-id="${escapeHtml(faq.id)}">
        <span class="faq-category">${escapeHtml(faq.category)}</span>
        ${escapeHtml(faq.question)}
      </button>`).join("")
    : `<div class="no-faqs">${query ? "No matching questions. Try another keyword." : "No FAQs yet. Check back soon."}</div>`;

  elements.faqList.querySelectorAll("[data-faq-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const faq = faqs.find((item) => item.id === button.dataset.faqId);
      if (!faq) return;
      showChat();
      elements.messageInput.value = faq.question;
      updateComposer();
      elements.messageInput.focus();
      elements.sidebar.classList.remove("open");
    });
  });
}

function conversationLabel(conversation) {
  const firstQuestion = conversation.messages.find((message) => message.role === "user");
  return firstQuestion ? firstQuestion.content : "New conversation";
}

function renderHistory() {
  elements.historyCount.textContent = String(conversations.length);
  if (!conversations.length) {
    elements.historyList.innerHTML = '<p class="empty-history">Your conversations will appear here.</p>';
    return;
  }
  elements.historyList.innerHTML = conversations.slice().reverse().map((conversation) => `
    <div class="history-item${conversation.id === activeConversationId ? " active" : ""}" data-conversation-id="${escapeHtml(conversation.id)}">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 5.5h12v9H8l-4 2v-11Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
      </svg>
      <span>${escapeHtml(conversationLabel(conversation))}</span>
      <button class="history-delete" type="button" data-delete-id="${escapeHtml(conversation.id)}" aria-label="Delete conversation">×</button>
    </div>`).join("");

  elements.historyList.querySelectorAll(".history-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest("[data-delete-id]")) return;
      activeConversationId = item.dataset.conversationId;
      showChat();
      renderConversation();
    });
  });
  elements.historyList.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const conversationId = button.dataset.deleteId;
      deleteConversationFromSupabase(conversationId).then(() => {
        conversations = conversations.filter((item) => item.id !== conversationId);
        if (!persist(STORAGE_KEYS.conversations, conversations)) return;
        if (activeConversationId === conversationId) {
          activeConversationId = null;
          elements.conversation.hidden = true;
          elements.welcomeScreen.hidden = false;
        }
        renderHistory();
        renderAdminStats();
        showToast("Conversation deleted.");
      }).catch((error) => {
        console.error("Could not delete the conversation from Supabase.", error);
        showToast("Could not delete the cloud conversation. Please try again.");
      });
    });
  });
}

function renderConversation() {
  const conversation = conversations.find((item) => item.id === activeConversationId);
  if (!conversation) {
    activeConversationId = null;
    elements.conversation.hidden = true;
    elements.welcomeScreen.hidden = false;
    renderHistory();
    return;
  }

  elements.welcomeScreen.hidden = true;
  elements.conversation.hidden = false;
  const firstQuestion = conversation.messages.find((message) => message.role === "user");
  elements.conversationTitle.textContent = firstQuestion
    ? (firstQuestion.content.length > 52 ? `${firstQuestion.content.slice(0, 49)}...` : firstQuestion.content)
    : "Let's figure it out.";
  elements.messageList.innerHTML = conversation.messages.map((message) => `
    <article class="message ${message.role}">
      <div class="message-avatar" aria-hidden="true">${message.role === "user" ? "Y" : "✦"}</div>
      <div class="message-body">
        <div class="message-author">${message.role === "user" ? "You" : "Sitabai Assistant"}</div>
        <div class="message-text">${formatText(message.content)}</div>
        <div class="message-meta">${message.role === "assistant" && message.fallback ? "General guidance · verify with the college office" : ""}</div>
      </div>
    </article>`).join("");
  elements.messageList.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  renderHistory();
}

function createConversation() {
  const conversation = {
    id: createUuid(),
    messages: [],
    createdAt: new Date().toISOString(),
  };
  conversations.push(conversation);
  activeConversationId = conversation.id;
  return conversation;
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}

function findBestFaq(query) {
  const words = tokenize(query).filter((word) => word.length > 1);
  if (!words.length) return null;
  const normalizedQuery = query.toLowerCase().trim();

  const ranked = faqs.map((faq) => {
    const question = faq.question.toLowerCase();
    const answer = faq.answer.toLowerCase();
    const searchable = `${question} ${answer} ${faq.category.toLowerCase()} ${(faq.keywords || []).join(" ").toLowerCase()}`;
    const uniqueWords = new Set(words);
    let score = 0;
    uniqueWords.forEach((word) => {
      if (question.includes(word)) score += 3;
      else if ((faq.keywords || []).some((keyword) => keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase()))) score += 2;
      else if (searchable.includes(word)) score += 1;
    });
    if (normalizedQuery.length > 3 && question.includes(normalizedQuery)) score += 5;
    return { faq, score };
  }).sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].faq : null;
}

function getAnswer(question) {
  const faq = findBestFaq(question);
  if (faq) return { content: faq.answer, fallback: false };
  return {
    content: "I don't have a confirmed answer for that just yet. Try a different keyword or browse the FAQs on the left. Please check with the college office about your question and course details.",
    fallback: true,
  };
}

function appendMessage(conversation, role, content, fallback = false) {
  conversation.messages.push({
    id: createUuid(),
    role,
    content,
    fallback,
    createdAt: new Date().toISOString(),
  });
}

function addTypingIndicator() {
  const article = document.createElement("article");
  article.className = "message";
  article.id = "typingIndicator";
  article.innerHTML = '<div class="message-avatar" aria-hidden="true">✦</div><div class="message-body"><div class="message-author">Sitabai Assistant</div><div class="typing-indicator" aria-label="Finding an answer"><span></span><span></span><span></span></div></div>';
  elements.messageList.append(article);
  article.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateComposer() {
  const length = elements.messageInput.value.length;
  elements.characterCount.textContent = `${length} / 500`;
  elements.sendButton.disabled = elements.messageInput.value.trim().length === 0 || isReplyPending;
  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height = `${Math.min(elements.messageInput.scrollHeight, 130)}px`;
}

async function sendMessage(content) {
  const question = content.trim();
  if (!question || isReplyPending) return;
  let conversation = conversations.find((item) => item.id === activeConversationId);
  if (!conversation) conversation = createConversation();

  appendMessage(conversation, "user", question);
  elements.messageInput.value = "";
  isReplyPending = true;
  updateComposer();
  saveConversations(conversation);
  renderConversation();
  addTypingIndicator();

  try {
    let answer;
    if (cloudReady && supabaseClient) {
      const { data, error } = await supabaseClient.functions.invoke("campus-chat", {
        body: {
          messages: conversation.messages.slice(-16).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
      });
      if (error) throw error;
      if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The AI service returned an invalid response.");
      }
      answer = { content: data.reply.trim(), fallback: false };
      setConnectionStatus(true, "AI assistant + cloud connected");
    } else {
      await new Promise((resolve) => window.setTimeout(resolve, 430));
      answer = getAnswer(question);
    }

    appendMessage(conversation, "assistant", answer.content, answer.fallback);
    saveConversations(conversation);
    if (activeConversationId === conversation.id) renderConversation();
    renderAdminStats();
  } catch (error) {
    console.error("Could not get an AI response.", error);
    if (activeConversationId === conversation.id) {
      renderConversation();
      const article = document.createElement("article");
      article.className = "message assistant error-message";
      article.setAttribute("role", "alert");
      article.innerHTML = '<div class="message-avatar" aria-hidden="true">!</div><div class="message-body"><div class="message-author">Sitabai Assistant</div><div class="message-text"></div></div>';
      let errorMessage = cloudReady
        ? "I couldn't reach the AI just now. Your question is saved—please try sending it again in a moment."
        : "AI chat needs a configured Supabase connection. You can still ask questions from the local FAQ demo.";
      if (error && error.context instanceof Response) {
        try {
          const responseBody = await error.context.clone().json();
          if (typeof responseBody.error === "string") errorMessage = responseBody.error;
        } catch (parseError) {
          console.warn("Could not read the AI service error response.", parseError);
        }
      }
      article.querySelector(".message-text").textContent = errorMessage;
      elements.messageList.append(article);
      article.scrollIntoView({ behavior: "smooth", block: "nearest" });
      if (cloudReady) setConnectionStatus(true, "Cloud connected · AI unavailable");
      showToast(errorMessage);
    }
  } finally {
    isReplyPending = false;
    updateComposer();
  }
}

function saveVoiceTranscript(role, transcript, itemId) {
  const cleanedTranscript = transcript.trim();
  if (!cleanedTranscript || cleanedTranscript.length > 1800) return;
  const seenItems = role === "user" ? voiceInputItems : voiceOutputItems;
  if (itemId && seenItems.has(itemId)) return;
  if (itemId) seenItems.add(itemId);

  let conversation = conversations.find((item) => item.id === activeConversationId);
  if (!conversation) conversation = createConversation();
  appendMessage(conversation, role, cleanedTranscript);
  saveConversations(conversation);
  if (activeConversationId === conversation.id) renderConversation();
  renderAdminStats();
}

function stopVoiceSession(status = "") {
  voiceSessionGeneration += 1;
  const peerConnection = voicePeerConnection;
  const dataChannel = voiceDataChannel;
  const mediaStream = voiceMediaStream;
  const audioElement = voiceAudioElement;
  voicePeerConnection = null;
  voiceDataChannel = null;
  voiceMediaStream = null;
  voiceAudioElement = null;
  isVoiceStarting = false;

  dataChannel?.close();
  peerConnection?.close();
  mediaStream?.getTracks().forEach((track) => track.stop());
  if (audioElement) {
    audioElement.pause();
    audioElement.srcObject = null;
  }

  elements.voiceButton.disabled = false;
  elements.voiceButton.classList.remove("active");
  elements.voiceButton.setAttribute("aria-pressed", "false");
  elements.voiceButton.setAttribute("aria-label", "Start voice conversation");
  elements.voiceButton.title = "Talk to the AI by voice";
  elements.voiceStatus.textContent = status;
}

function handleVoiceEvent(event) {
  if (event.type === "conversation.item.input_audio_transcription.completed") {
    saveVoiceTranscript("user", event.transcript || "", event.item_id);
  } else if (
    event.type === "response.output_audio_transcript.done" ||
    event.type === "response.audio_transcript.done"
  ) {
    saveVoiceTranscript("assistant", event.transcript || "", event.item_id || event.response_id);
  } else if (event.type === "error") {
    const message = event.error?.message || "The voice conversation encountered an error.";
    console.error("Realtime voice session returned an error.", event.error);
    stopVoiceSession(message);
    showToast(message);
  }
}

async function startVoiceSession() {
  if (!cloudReady || !supabaseClient) {
    showToast("Voice chat needs a configured Supabase connection.");
    return;
  }
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
    showToast("This browser does not support microphone access for voice chat.");
    return;
  }

  isVoiceStarting = true;
  const generation = voiceSessionGeneration;
  elements.voiceButton.disabled = true;
  elements.voiceStatus.textContent = "Waiting for microphone permission…";
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (generation !== voiceSessionGeneration) {
      mediaStream.getTracks().forEach((track) => track.stop());
      return;
    }
    voiceMediaStream = mediaStream;
    voicePeerConnection = new RTCPeerConnection();
    const peerConnection = voicePeerConnection;
    voicePeerConnection.onconnectionstatechange = () => {
      if (voicePeerConnection?.connectionState === "failed") {
        const message = "The voice connection was interrupted. Please start a new voice chat.";
        stopVoiceSession(message);
        showToast(message);
      }
    };
    voiceAudioElement = new Audio();
    voiceAudioElement.autoplay = true;
    peerConnection.ontrack = (event) => {
      voiceAudioElement.srcObject = event.streams[0];
      voiceAudioElement.play().catch((error) => {
        console.warn("Could not start voice playback automatically.", error);
        elements.voiceStatus.textContent = "Voice connected. Allow audio playback in your browser.";
      });
    };
    voiceMediaStream.getTracks().forEach((track) => peerConnection.addTrack(track, voiceMediaStream));

    voiceDataChannel = voicePeerConnection.createDataChannel("oai-events");
    voiceInputItems = new Set();
    voiceOutputItems = new Set();
    voiceDataChannel.onopen = () => {
      isVoiceStarting = false;
      elements.voiceButton.disabled = false;
      elements.voiceButton.classList.add("active");
      elements.voiceButton.setAttribute("aria-pressed", "true");
      elements.voiceButton.setAttribute("aria-label", "Stop voice conversation");
      elements.voiceButton.title = "Stop voice conversation";
      elements.voiceStatus.textContent = "Listening — speak naturally. Select the microphone to end.";
    };
    voiceDataChannel.onmessage = (event) => {
      try {
        handleVoiceEvent(JSON.parse(event.data));
      } catch (error) {
        console.error("Could not read a Realtime voice event.", error);
      }
    };
    voiceDataChannel.onerror = (event) => {
      console.error("Realtime voice data channel failed.", event);
      showToast("The voice connection encountered an error.");
    };

    let conversation = conversations.find((item) => item.id === activeConversationId);
    if (!conversation) conversation = createConversation();
    renderConversation();
    saveConversations(conversation);
    elements.voiceStatus.textContent = "Connecting to the voice assistant…";

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    const { data, error } = await supabaseClient.functions.invoke("voice-session", {
      body: {
        sdp: offer.sdp,
        messages: conversation.messages.slice(-16).map((message) => ({
          role: message.role,
          content: message.content,
        })),
      },
    });
    if (error) throw error;
    if (generation !== voiceSessionGeneration) return;
    if (typeof data !== "string" || !data.trim()) {
      throw new Error("The voice service returned an invalid session description.");
    }
    await peerConnection.setRemoteDescription({ type: "answer", sdp: data });
  } catch (error) {
    if (generation !== voiceSessionGeneration) return;
    console.error("Could not start the Realtime voice session.", error);
    let message = error.message || "Could not start voice chat. Check the connection and try again.";
    if (error && error.context instanceof Response) {
      try {
        const responseBody = await error.context.clone().json();
        if (typeof responseBody.error === "string") message = responseBody.error;
      } catch (parseError) {
        console.warn("Could not read the voice service error response.", parseError);
      }
    }
    stopVoiceSession(message);
    showToast(message);
  }
}

function renderAdminStats() {
  elements.faqStat.textContent = String(faqs.length);
  elements.chatStat.textContent = String(conversations.length);
}

function renderAdminFaqs() {
  elements.adminFaqList.innerHTML = faqs.map((faq) => `
    <div class="admin-faq-row">
      <div class="admin-faq-info">
        <strong>${escapeHtml(faq.question)}</strong>
        <span>${escapeHtml(faq.category)}</span>
      </div>
      <button class="row-action" type="button" data-edit-id="${escapeHtml(faq.id)}">Edit</button>
      <button class="row-action delete" type="button" data-remove-id="${escapeHtml(faq.id)}">Delete</button>
    </div>`).join("");
  document.getElementById("manageFaqCount").textContent = `${faqs.length} answer${faqs.length === 1 ? "" : "s"}`;

  elements.adminFaqList.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => beginFaqEdit(button.dataset.editId));
  });
  elements.adminFaqList.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => deleteFaq(button.dataset.removeId));
  });
}

function renderAdmin() {
  renderAdminFaqs();
  renderAdminStats();
}

function beginFaqEdit(id) {
  const faq = faqs.find((item) => item.id === id);
  if (!faq) return;
  elements.faqId.value = faq.id;
  elements.faqQuestion.value = faq.question;
  elements.faqAnswer.value = faq.answer;
  elements.faqCategory.value = faq.category;
  elements.faqKeywords.value = (faq.keywords || []).join(", ");
  elements.faqFormTitle.textContent = "Edit answer";
  elements.saveFaqButton.innerHTML = 'Save changes <span aria-hidden="true">→</span>';
  elements.cancelEditButton.hidden = false;
  elements.faqError.hidden = true;
  elements.faqQuestion.focus();
}

function resetFaqForm() {
  elements.faqForm.reset();
  elements.faqId.value = "";
  elements.faqFormTitle.textContent = "Add an answer";
  elements.saveFaqButton.innerHTML = 'Add to FAQ library <span aria-hidden="true">→</span>';
  elements.cancelEditButton.hidden = true;
  elements.faqError.hidden = true;
}

async function deleteFaq(id) {
  const faq = faqs.find((item) => item.id === id);
  if (!faq || !window.confirm(`Delete "${faq.question}" from the FAQ library?`)) return;
  try {
    await deleteFaqFromSupabase(id);
  } catch (error) {
    console.error("Could not delete the FAQ from Supabase.", error);
    showToast("Could not delete the cloud FAQ. Check admin access and try again.");
    return;
  }
  const updatedFaqs = faqs.filter((item) => item.id !== id);
  if (!persist(STORAGE_KEYS.faqs, updatedFaqs)) return;
  faqs = updatedFaqs;
  if (elements.faqId.value === id) resetFaqForm();
  renderFaqs();
  renderAdmin();
  showToast("FAQ deleted.");
}

function openAdmin() {
  elements.adminModal.hidden = false;
  elements.loginError.hidden = true;
  if (adminSignedIn) {
    elements.loginView.hidden = true;
    elements.dashboardView.hidden = false;
    renderAdmin();
  } else {
    elements.loginView.hidden = false;
    elements.dashboardView.hidden = true;
    document.getElementById("adminEmail").focus();
  }
}

function closeAdmin() {
  elements.adminModal.hidden = true;
  resetFaqForm();
}

elements.newChatButton.addEventListener("click", () => {
  if (voicePeerConnection || isVoiceStarting) stopVoiceSession();
  activeConversationId = null;
  elements.conversation.hidden = true;
  elements.welcomeScreen.hidden = false;
  elements.messageInput.value = "";
  updateComposer();
  renderHistory();
  showChat();
  elements.sidebar.classList.remove("open");
  elements.messageInput.focus();
});

elements.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(elements.messageInput.value);
});

elements.messageInput.addEventListener("input", updateComposer);
elements.messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (!elements.sendButton.disabled) sendMessage(elements.messageInput.value);
  }
});
elements.voiceButton.addEventListener("click", () => {
  if (voicePeerConnection && !isVoiceStarting) {
    stopVoiceSession("Voice conversation ended.");
    return;
  }
  if (!isVoiceStarting) startVoiceSession();
});

document.querySelectorAll(".sidebar-nav-item, .suggestion-card").forEach((button) => {
  button.addEventListener("click", () => {
    renderSection(button.dataset.view);
  });
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  renderSection("home");
});

elements.faqSearch.addEventListener("input", renderFaqs);
elements.mobileMenuButton.addEventListener("click", () => elements.sidebar.classList.toggle("open"));
elements.adminButton.addEventListener("click", openAdmin);
document.getElementById("closeAdminButton").addEventListener("click", closeAdmin);
elements.adminModal.addEventListener("click", (event) => {
  if (event.target === elements.adminModal) closeAdmin();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAdmin();
    elements.sidebar.classList.remove("open");
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.newChatButton.click();
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.faqSearch.focus();
  }
});

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const password = document.getElementById("adminPassword").value;
  if (adminSupabaseClient) {
    try {
      const { data, error } = await adminSupabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user.app_metadata?.role !== "admin") {
        const { error: signOutError } = await adminSupabaseClient.auth.signOut();
        if (signOutError) throw signOutError;
        elements.loginError.textContent = "This account does not have the college admin role.";
        elements.loginError.hidden = false;
        return;
      }
      adminSignedIn = true;
      elements.loginView.hidden = true;
      elements.dashboardView.hidden = false;
      document.getElementById("adminTitle").textContent = "Welcome back.";
      document.getElementById("adminPassword").value = "";
      elements.loginError.hidden = true;
      renderAdmin();
      return;
    } catch (error) {
      console.error("Could not sign in to the Supabase admin account.", error);
      elements.loginError.textContent = error.message || "Could not sign in. Check the connection and try again.";
      elements.loginError.hidden = false;
      return;
    }
  }
  if (email === "admin@campus.edu" && password === "Campus123") {
    adminSignedIn = true;
    elements.loginView.hidden = true;
    elements.dashboardView.hidden = false;
    document.getElementById("adminTitle").textContent = "Welcome back.";
    document.getElementById("adminPassword").value = "";
    elements.loginError.hidden = true;
    renderAdmin();
    return;
  }
  elements.loginError.textContent = "That email and password don't match the demo admin account.";
  elements.loginError.hidden = false;
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  if (adminSupabaseClient) {
    const { error } = await adminSupabaseClient.auth.signOut();
    if (error) {
      console.error("Could not sign out of the Supabase admin account.", error);
      showToast("Could not sign out. Please try again.");
      return;
    }
  }
  adminSignedIn = false;
  closeAdmin();
  elements.loginForm.reset();
  if (adminSupabaseClient) {
    document.getElementById("adminEmail").value = "";
    document.getElementById("adminEmail").placeholder = "Staff email address";
  } else {
    document.getElementById("adminEmail").value = "admin@campus.edu";
  }
  showToast("You have signed out.");
});

elements.faqForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = elements.faqId.value;
  const existing = id ? faqs.find((faq) => faq.id === id) : null;
  if (id && !existing) {
    elements.faqError.textContent = "This FAQ could not be found. Refresh the list and try again.";
    elements.faqError.hidden = false;
    return;
  }

  const faq = {
    id: existing ? existing.id : (adminSupabaseClient ? createUuid() : `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    question: elements.faqQuestion.value.trim(),
    answer: elements.faqAnswer.value.trim(),
    category: elements.faqCategory.value,
    keywords: elements.faqKeywords.value.split(",").map((keyword) => keyword.trim()).filter(Boolean),
  };
  try {
    await saveFaqToSupabase(faq);
  } catch (error) {
    console.error("Could not save the FAQ to Supabase.", error);
    elements.faqError.textContent = "Could not save to the cloud. Check your admin role and database setup, then try again.";
    elements.faqError.hidden = false;
    return;
  }
  const updatedFaqs = existing
    ? faqs.map((item) => item.id === id ? faq : item)
    : [...faqs, faq];
  if (!persist(STORAGE_KEYS.faqs, updatedFaqs)) return;
  faqs = updatedFaqs;
  resetFaqForm();
  renderFaqs();
  renderAdmin();
  showToast(existing ? "FAQ updated." : "FAQ added.");
});

elements.cancelEditButton.addEventListener("click", resetFaqForm);

initializeApp();
