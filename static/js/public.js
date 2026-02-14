document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");
  const links = document.querySelectorAll(".nav-link");
  const PAGE_INIT = {
  main: () => {
    lastHeroUpdate = null;
    updateHeroSection();
    loadPreviousEvents();

    if (typeof initPreviousYearAnimations === "function") {
      initPreviousYearAnimations();
    }
  },

  events: loadEventsPage,

  "event-detail": initEventDetailPage,
  "our-team": initOurTeamPage,
  alumni: loadAlumniPublic,
   form: initFormPage,
  certificates: initCertificatesPage,
  "admin-login": bindAdminLogin
};

window.loadSection = async function (page, push = true) {
  try {
    let slug = null;
    if (page.startsWith("form/")) {
      slug = page.split("/")[1];
      console.log("Loading form with slug:", slug);
      page = "form";
    }

    const res = await fetch(`/partials/${page}.html`, { cache: "no-store" });
    if (!res.ok) throw new Error("Partial not found");

    main.innerHTML = await res.text();

    if (PAGE_INIT[page]) {
      PAGE_INIT[page](slug);
    }

    if (push) {
     location.hash = `${page}${slug ? "/" + slug : ""}`;

    }
      links.forEach(l => l.classList.remove("active"));
      document
        .querySelector(`.nav-link[data-page="${page}"]`)
        ?.classList.add("active");

    } catch (err) {
      console.error(err);
      main.innerHTML = `
        <h2 style="padding:60px;text-align:center;">
          Page not found
        </h2>
      `;
    }
  }

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      loadSection(link.dataset.page);
    });
  });

  loadSection("main", false);
});

const overlay = document.getElementById('overlay');
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.getElementById('hamburger');
      const sidebarClose = document.getElementById('sidebarClose');
      const leftLogo = document.getElementById('leftLogo');
      const rightLogo = document.getElementById('rightLogo');
      const sbLeftLogo = document.getElementById('sbLeftLogo');

      function updateMobileUI() {
          const isMobile = window.innerWidth <= 720;
          const hb = document.getElementById('hamburger');
          if (hb) hb.style.display = isMobile ? 'inline-flex' : 'none';
          if (rightLogo) rightLogo.style.display = isMobile ? 'none' : '';
      }
      updateMobileUI();
      window.addEventListener('resize', updateMobileUI);

      function openSidebar() {
          sidebar.classList.add('open');
          overlay.classList.add('show');
          sidebar.setAttribute('aria-hidden', 'false');
          hamburger.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
      }
      function closeSidebar() {
          sidebar.classList.remove('open');
          overlay.classList.remove('show');
          sidebar.setAttribute('aria-hidden', 'true');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
      }
      if (hamburger) hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
      if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
      overlay.addEventListener('click', closeSidebar);

      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
      });

      const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('in-view');
                  obs.unobserve(entry.target);
              }
          });
      }, { threshold: 0.12 });
      document.querySelectorAll('.grid-item, .hero').forEach(el => io.observe(el));
      document.querySelectorAll('.grid-item').forEach(card => {
          const layer = card.querySelector('.ripple-layer');
          card.addEventListener('click', (ev) => {
              const rect = card.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height) * 1.6;
              const ripple = document.createElement('span');

              ripple.style.position = 'absolute';
              ripple.style.borderRadius = '50%';
              ripple.style.pointerEvents = 'none';
              ripple.style.width = ripple.style.height = size + 'px';
              const x = ev.clientX - rect.left - size / 2;
              const y = ev.clientY - rect.top - size / 2;
              ripple.style.left = x + 'px';
              ripple.style.top = y + 'px';
              ripple.style.background = 'radial-gradient(circle at center, rgba(123,97,255,0.28), rgba(74,195,255,0.18) 40%, rgba(74,195,255,0.06) 60%, rgba(255,255,255,0.02) 100%)';
              ripple.style.transform = 'scale(0.2)';
              ripple.style.opacity = '0.95';
              ripple.style.transition = 'transform 600ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease';
              layer.appendChild(ripple);
              requestAnimationFrame(() => {
                  ripple.style.transform = 'scale(1)';
                  ripple.style.opacity = '0';
              });
              setTimeout(() => ripple.remove(), 700);

              card.style.transform = 'translateY(-6px) scale(0.996)';
              setTimeout(() => { card.style.transform = ''; }, 220);
          });

          card.addEventListener('mouseenter', () => card.style.cursor = 'pointer');
      });

      function setLogos(left, right) {
          if (left) { leftLogo.src = left; if (sbLeftLogo) sbLeftLogo.src = left; }
          if (right) rightLogo.src = right;
      }
      window.setLogos = setLogos;
function initFormPage() {
  const titleEl = document.getElementById("form-title");
  const container = document.getElementById("form-container");

  if (!titleEl || !container) {
    console.error("Form DOM not loaded");
    return;
  }
  fetch("https://gist.githubusercontent.com/umeshyenugula/23ea3eef4e382a18d0e25e275a702f01/raw/Form.json")
    .then(res => res.json())
    .then(data => {
      if (data.embed_code) {
        titleEl.textContent = "Registration Form";
        container.innerHTML = data.embed_code; 
      } else {
        titleEl.textContent = "Form not found";
      }
    })
    .catch(err => {
      console.error(err);
      titleEl.textContent = "Failed to load form";
    });
}
let lastHeroUpdate = null;

async function updateHeroSection() {
  const res = await fetch("https://gist.githubusercontent.com/umeshyenugula/7b353db043d2684141157f03ab63e153/raw/HeroSection.json");
  const data = await res.json();

  if (data.status === "not_modified") return;

  if (data.updated_at) {
    lastHeroUpdate = data.updated_at;
  }

  const heroTitle = document.querySelector("#heroTitle");
  const heroImg = document.querySelector("#heroImage");

  if (heroTitle && data.hero_title) {
    heroTitle.textContent = data.hero_title;
  }

  const btn1 = document.getElementById("heroBtn1");
  if (!btn1 || !data.btn1_link) return;

  btn1.replaceWith(btn1.cloneNode(true));
  const newBtn1 = document.getElementById("heroBtn1");
  newBtn1.textContent = data.btn1_label;
  newBtn1.onclick = (e) => {
    e.preventDefault();
    loadSection("form"); 
  };

  if (heroImg && data.hero_image_url) {
    heroImg.src = data.hero_image_url;
  }
}
setInterval(() => {
  const currentPage = history.state?.page;
  if (currentPage === "main") {
    updateHeroSection();
  }
}, 5000);

let allEvents = [];
async function loadEventsPage() {
    const grid = document.getElementById("eventsGrid");
    if (!grid) return;

    const res = await fetch("https://gist.githubusercontent.com/umeshyenugula/839ad668e9f22399d3a599e96cf13add/raw/CompleteEvents.json");
    const data = await res.json();

    grid.innerHTML = "";
    allEvents = data.events || [];

    allEvents.forEach((ev, index) => {
        grid.innerHTML += `
            <div class="event-card">
                <div class="event-image">
                    <img src="${ev.image_url}">
                </div>
                <div class="event-info">
                    <h3>${ev.title}</h3>
                    <p class="date">${ev.date}</p>
                    <a href="/pages/event-detail?index=${index}" 
                        class="btn btn-see-more event-link"
                             data-index="${index}">
                            See More
                      </a>
                </div>
            </div>
        `;
    });
}
document.addEventListener("click", (e) => {
  const link = e.target.closest(".event-link");
  if (!link) return;
  e.preventDefault();
  const index = link.dataset.index;
  const ev = allEvents[index];
  if (!ev) return;
  sessionStorage.setItem("selectedEvent", JSON.stringify(ev));
  loadSection("event-detail", null, true);
});
 function initPreviousYearAnimations() {
          const items = document.querySelectorAll(".grid-item");
          items.forEach(item => {
              item.addEventListener("mouseenter", () => item.classList.add("hovered"));
              item.addEventListener("mouseleave", () => item.classList.remove("hovered"));
          });

          if (typeof gsap !== "undefined") {
              gsap.from(".grid-item", {
                  opacity: 0,
                  y: 30,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out"
              });
          }
      }
function initEventDetailPage() {
  const raw = sessionStorage.getItem("selectedEvent");
  if (!raw) return;
  const ev = JSON.parse(raw);
  document.getElementById("eventTitle").textContent = ev.title || "";
  document.getElementById("eventDate").textContent = ev.date || "";
  document.getElementById("eventParticipants").textContent =
    ev.participants ?? "-";
  document.getElementById("eventTeams").textContent =
    ev.teams ?? "-";
  document.getElementById("eventDescription").textContent =
    ev.description || "";
  const hero = document.querySelector(".event-hero");
  if (hero && ev.image_url) {
    hero.style.backgroundImage = `url('${ev.image_url}')`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
  }
  gsap.from(".event-hero .hero-content", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".stat-card", {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.3,
    ease: "back.out(1.4)"
  });

  gsap.from(".event-description", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.6,
    ease: "power2.out"
  });
}
async function initOurTeamPage() {
  console.log("INIT OUR TEAM PAGE");

  const facultyGrid = document.querySelector(".faculty-grid");
  const coreGrid = document.querySelector(".core-grid");

  if (!facultyGrid && !coreGrid) {
    console.warn("Team grids not found");
    return;
  }

  try {
    const res = await fetch("https://gist.githubusercontent.com/umeshyenugula/e2a79f3456cb40ca8252e8b46e3aa575/raw/teams.json");
    const data = await res.json();

    console.log("TEAM DATA FROM GIST:", data);

    const members = data.members || [];

    if (facultyGrid) facultyGrid.innerHTML = "";
    if (coreGrid) coreGrid.innerHTML = "";

    members.forEach(m => {

      if (m.category === "faculty" && facultyGrid) {
        facultyGrid.insertAdjacentHTML("beforeend", `
          <div class="faculty-card">
            <div class="faculty-photo">
              <img src="${m.image_url || 'https://www.srit.ac.in/wp-content/uploads/2022/01/csi-logo.png'}">
            </div>
            <h4>${m.name}</h4>
            <p class="designation">
              ${m.role}${m.department ? `, ${m.department}` : ""}
            </p>
          </div>
        `);
      }

      if (m.category === "core" && coreGrid) {
        coreGrid.insertAdjacentHTML("beforeend", `
          <div class="core-card">
            <div class="core-photo">
              <img src="${m.image_url || 'https://www.srit.ac.in/wp-content/uploads/2022/01/csi-logo.png'}">
            </div>
            <h4>${m.name}</h4>
            <p class="role">${m.role}</p>
            <div class="socials">
              ${m.linkedin ? `<a href="${m.linkedin}" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a>` : ""}
              ${m.instagram ? `<a href="${m.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>` : ""}
            </div>
          </div>
        `);
      }

    });

    animateOurTeam(); // ✅ CORRECT FUNCTION

  } catch (err) {
    console.error("Our Team load failed:", err);
  }
}
async function loadAlumniPublic() {
  const grid = document.getElementById("alumniGrid");
  if (!grid) return;
  const res = await fetch("https://gist.githubusercontent.com/umeshyenugula/83810d66e3f7ed8b9884240984beb5d4/raw/Alumni.json");
  const data = await res.json();

  grid.innerHTML = "";
  data.alumni.forEach(a => {
    grid.innerHTML += `
      <div class="alumni">
        <img src="${a.image_url || 'https://www.srit.ac.in/wp-content/uploads/2022/01/csi-logo.png'}">
        <div class="overlay">
          <h3>${a.name}</h3>
        </div>
      </div>
    `;
  });
}
function initCertificatesPage() {
  const certYear = document.getElementById("certYear");
  const certEvent = document.getElementById("certEvent");
  const certName = document.getElementById("certName");
  const suggestionsBox = document.getElementById("nameSuggestions");

  const previewBtn = document.getElementById("previewCertBtn");
  const previewSection = document.getElementById("certificatePreviewSection");

  const previewName = document.getElementById("certPreviewName");
  const previewEvent = document.getElementById("certPreviewEvent");
  const previewPosition = document.getElementById("certPreviewPosition");
  const previewYear = document.getElementById("certPreviewYear");

  if (!certYear) return; // SPA safety

  let certData = {};
  let participantsData = {}; // Store participants data grouped by event ID
  let currentNames = [];
  let selectedEventId = null;

  /* -------- LOAD YEARS & EVENTS -------- */
  fetch("https://gist.githubusercontent.com/umeshyenugula/3b104579d9f120900fa91e76597e1a02/raw/ListCert.json") // Replace with actual URL to the ListCert JSON
    .then(res => res.json())
    .then(data => {
      certData = data;
      certYear.innerHTML = `<option value="">Select Year</option>`;

      Object.keys(certData).sort().reverse().forEach(year => {
        certYear.innerHTML += `<option value="${year}">${year}</option>`;
      });
    });

  certYear.addEventListener("change", () => {
    const year = certYear.value;
    certEvent.innerHTML = `<option value="">Select Event</option>`;
    certName.value = "";
    suggestionsBox.innerHTML = "";
    previewSection.style.display = "none";

    if (!certData[year]) return;

    certData[year].forEach(ev => {
      certEvent.innerHTML += `<option value="${ev.id}">${ev.name}</option>`;
    });
  });

  /* -------- LOAD PARTICIPANTS (Single JSON File for All Events) -------- */
  fetch("https://gist.githubusercontent.com/umeshyenugula/ffd82aa452399c95b933882a6b7048d8/raw/students.json") // Single JSON file for all participants
    .then(res => res.json())
    .then(data => {
      participantsData = data; // Store participants data grouped by event ID
    });

  certEvent.addEventListener("change", () => {
    selectedEventId = certEvent.value;
    certName.value = "";
    suggestionsBox.innerHTML = "";
    previewSection.style.display = "none";

    if (!selectedEventId) return;

    // Get the participants for the selected event ID
    const eventParticipants = participantsData[selectedEventId] || [];

    // Extract the names of the participants for autocomplete
    currentNames = eventParticipants;
  });

  /* -------- AUTOCOMPLETE -------- */
  certName.addEventListener("input", () => {
    const val = certName.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!val) {
      suggestionsBox.style.display = "none";
      return;
    }

    const matches = currentNames.filter(n =>
      n.toLowerCase().includes(val)
    );

    if (!matches.length) {
      suggestionsBox.style.display = "none";
      return;
    }

    matches.forEach(name => {
      const div = document.createElement("div");
      div.textContent = name;
      div.onclick = () => {
        certName.value = name;
        suggestionsBox.style.display = "none";
      };
      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".autocomplete")) {
      suggestionsBox.style.display = "none";
    }
  });

  /* -------- PREVIEW CERTIFICATE -------- */
  previewBtn.addEventListener("click", () => {
    const year = certYear.value;
    const eventId = certEvent.value;
    const name = certName.value.trim();

    if (!year || !eventId || !name) {
      alert("Please select year, event and name");
      return;
    }

    // Check if the name is in the list of participants for the selected event
    const eventParticipants = participantsData[eventId] || [];
    const isValidParticipant = eventParticipants.includes(name);

    if (!isValidParticipant) {
      alert("Invalid participant name. Please select a valid name.");
      previewSection.style.display = "none";
      return;
    }

    // Default position text
    const position = "Certificate of Participation"; // Default, can be customized
    const isWinner = ["first", "second", "third", "1", "2", "3"].includes(position);

    previewPosition.innerText = isWinner
      ? "Certificate of Appreciation"
      : "Certificate of Participation";

    previewName.innerText = name;
    previewEvent.innerText = certEvent.options[certEvent.selectedIndex].text;
    previewYear.innerText = year;

    // Show the preview section
    previewSection.style.display = "block";
    previewSection.scrollIntoView({ behavior: "smooth" });
  });
}
function loadCertificateTemplate() {
  const year = document.getElementById("certYear")?.value;
  const eventSelect = document.getElementById("certEvent");
  const name = document.getElementById("certName")?.value;

  // Check if year, event, and name are selected
  if (!year || !eventSelect?.value || !name) {
    alert("Year, Event, and Name are mandatory");
    return;
  }

  const eventName = eventSelect.options[eventSelect.selectedIndex].text;
  const eventId = eventSelect.value;

  // Fetch the certificate template content
  fetch("certificate-template.html")  // Path to your certificate template HTML file
    .then(res => res.text())
    .then(data => {
      // Inject the fetched content into a specific section of the page
      const certificateSection = document.getElementById("certificateSection");

      // Modify the template content with the selected participant details
      let certificateContent = data;
      certificateContent = certificateContent.replace("{{name}}", name);
      certificateContent = certificateContent.replace("{{event}}", eventName);
      certificateContent = certificateContent.replace("{{year}}", year);

      // Populate the section with the modified template
      certificateSection.innerHTML = certificateContent;

      // Optionally scroll into view if needed
      certificateSection.scrollIntoView({ behavior: "smooth" });

      // Enable download button after injecting the certificate content
      const downloadBtn = document.getElementById("downloadCertificateBtn");
      downloadBtn.style.display = "block";
    })
    .catch(err => {
      console.error("Error fetching certificate template:", err);
      alert("Failed to load certificate template.");
    });
}

// Function to download the certificate as a PDF and redirect to another page
function downloadCertificate() {
  const year = document.getElementById("certYear").value;
  const eventSelect = document.getElementById("certEvent");
  const name = document.getElementById("certName").value;

  // Check if year, event, and name are selected
  if (!year || !eventSelect?.value || !name) {
    alert("Year, Event, and Name are mandatory");
    return;
  }

  const eventName = eventSelect.options[eventSelect.selectedIndex].text;
  const eventId = eventSelect.value;

  // Create the URL for the new window with the necessary query parameters
  const url = `certificate-template.html?name=${encodeURIComponent(name)}&event=${encodeURIComponent(eventName)}&year=${encodeURIComponent(year)}&event_id=${encodeURIComponent(eventId)}`;

  // Open the certificate-template page in a new window
  window.open(url, "_blank");
}
function bindAdminLogin() {
          const form = document.querySelector(".admin-login-form");
          if (!form) {
              console.warn("Admin login form not found.");
              return;
          }

          form.addEventListener("submit", async (e) => {
              e.preventDefault();

              const username = document.getElementById("adminUser").value.trim();
              const password = document.getElementById("adminPass").value.trim();

              if (!username || !password) {
                  alert("Please fill all fields");
                  return;
              }

              try {
                  console.log("Sending fetch to /admin/login...");

                  const res = await fetch("/admin/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username, password })
                  });

                  const data = await res.json();
                  console.log("Response:", data);

                  if (data.status === "success") {
                      window.location.href = data.redirect;
                  } else {
                      alert(data.message);
                  }
              } catch (err) {
                  console.error("Fetch error:", err);
              }
          });
      }
async function loadPreviousEvents() {
  const grid = document.getElementById("grid2x2");
  if (!grid) return;

  grid.innerHTML = ""; // clear static leftovers

  try {
    const res = await fetch("https://gist.githubusercontent.com/umeshyenugula/6b4f8a0a81f09f902d56bcd087916b35/raw/LatestEvents.json");
    const data = await res.json();

    if (data.status !== "success" || !data.events.length) {
      grid.innerHTML = "<p>No previous events available.</p>";
      return;
    }

    data.events.forEach(ev => {
      grid.insertAdjacentHTML("beforeend", `
        <div class="grid-item" data-title="${ev.title}">
          <div class="ripple-layer"></div>
          <img src="${ev.image_url || '/static/images/event-placeholder.jpg'}"
               alt="${ev.title}">
          <div class="title-bg"></div>
          <div class="title-wrap">
            <span>${ev.title}</span>
          </div>
          <div class="underline"></div>
        </div>
      `);
    });

  } catch (err) {
    console.error("Previous events load failed", err);
  }
}
function loadFromHash() {
  const hash = location.hash.replace("#", "");
  loadSection(hash || "main", false);
}

window.addEventListener("hashchange", loadFromHash);
window.addEventListener("DOMContentLoaded", loadFromHash);

