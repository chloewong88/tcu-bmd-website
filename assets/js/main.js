document.addEventListener("DOMContentLoaded", () => {
  const pageId = document.body.dataset.page || "home";
  const { getLang, t, renderHeader, renderContactSection, renderFooter, renderFacultyCard, renderAchievementCard } = window.BMD_COMPONENTS;
  const DATA = window.BMD_DATA;

  function renderCurrentPage() {
    const lang = getLang();
    document.documentElement.lang = lang === "zh" ? "zh-Hant-TW" : "en";

    renderHeader(pageId);
    renderContactSection();
    renderFooter();

    if (pageId === "home") renderHomePage(lang);
    if (pageId === "introduction") renderIntroductionPage(lang);
    if (pageId === "curriculum") renderCurriculumPage(lang);
    if (pageId === "career-path") renderCareerPage(lang);
    if (pageId === "student-life") renderStudentLifePage(lang);
    if (pageId === "faculty") renderFacultyPage(lang);
    if (pageId === "certificate") renderCertificatePage(lang);
    if (pageId === "fb-forum") renderForumPage(lang);
    if (pageId === "more") renderMorePage(lang);

    bindGlobalEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  function bindGlobalEvents() {
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.onclick = () => {
        const next = getLang() === "en" ? "zh" : "en";
        localStorage.setItem("bmd_lang", next);
        renderCurrentPage();
      };
    }

    const burger = document.getElementById("hamburger-btn");
    const drawer = document.getElementById("mobile-drawer");
    if (burger && drawer) {
      burger.onclick = () => {
        const isOpen = drawer.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(isOpen));
        drawer.setAttribute("aria-hidden", String(!isOpen));
      };
    }

    const contactForm = document.getElementById("bmd-contact-form");
    if (contactForm) {
      contactForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const msg = document.getElementById("contact-message").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const errName = document.getElementById("err-name");
        const errEmail = document.getElementById("err-email");
        const errMsg = document.getElementById("err-message");
        const success = document.getElementById("contact-success");

        let valid = true;
        errName.classList.toggle("visible", name.length < 2);
        if (name.length < 2) valid = false;

        errEmail.classList.toggle("visible", !emailRegex.test(email));
        if (!emailRegex.test(email)) valid = false;

        errMsg.classList.toggle("visible", msg.length < 10);
        if (msg.length < 10) valid = false;

        if (valid) {
          success.classList.add("visible");
          contactForm.reset();
        } else {
          success.classList.remove("visible");
        }
      };
    }

    const newsForm = document.getElementById("newsletter-form");
    if (newsForm) {
      newsForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById("newsletter-email").value.trim();
        const msgEl = document.getElementById("newsletter-msg");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          msgEl.style.color = "#e88b7d";
          msgEl.textContent = t("Please enter a valid email.", "請輸入有效的 Email。");
        } else {
          msgEl.style.color = "#a3b8a8";
          msgEl.textContent = t("Subscribed! Welcome to TCU BMD updates.", "訂閱成功！感謝關注慈大經管系。");
          newsForm.reset();
        }
      };
    }
  }

  let carouselStart = 0;
  function renderHomePage(lang) {
    const dict = DATA.i18n[lang];
    const root = document.getElementById("page-content");
    if (!root) return;

    const overviewCards = DATA.nav.map((n, idx) => {
      const icons = ["compass", "book-open", "briefcase", "award", "users", "shield-check", "message-circle", "layers"];
      return `
        <a href="${n.href}" class="card">
          <div class="icon-box ${idx % 2 === 1 ? "clay" : ""}">
            <i data-lucide="${icons[idx]}" style="width:22px;height:22px;"></i>
          </div>
          <h3 style="font-size:1.15rem;margin-bottom:0.4rem;">${lang === "zh" ? n.zh : n.en}</h3>
          <p style="font-size:0.88rem;color:var(--text-muted);margin-bottom:1rem;">
            ${lang === "zh" ? `前往「${n.zh}」專屬頁面檢視完整官方與系所資訊。` : `Open the dedicated ${n.en} page for complete details.`}
          </p>
          <span style="margin-top:auto;font-weight:600;font-size:0.85rem;color:var(--sage-primary);">
            ${t("Open Page →", "進入頁面 →")}
          </span>
        </a>
      `;
    }).join("");

    const featuredFaculty = DATA.faculty.slice(0, 3).map(renderFacultyCard).join("");

    root.innerHTML = `
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <span class="eyebrow"><i data-lucide="sparkles" style="width:14px;height:14px;"></i> ${dict.heroEyebrow}</span>
            <h1>${dict.heroTitle}</h1>
            <p class="hero-subheadline">${dict.heroSub}</p>
            <p class="hero-desc">${dict.heroDesc}</p>
            <div class="hero-cta">
              <a href="curriculum.html" class="btn btn-primary">${dict.heroBtnPrimary} <i data-lucide="arrow-right" style="width:16px;height:16px;"></i></a>
              <a href="faculty.html" class="btn btn-outline">${dict.heroBtnSecondary}</a>
            </div>
            <div class="hero-stats">
              <div><div class="stat-value">${dict.stat1Val}</div><div class="stat-label">${dict.stat1Label}</div></div>
              <div><div class="stat-value">${dict.stat2Val}</div><div class="stat-label">${dict.stat2Label}</div></div>
              <div><div class="stat-value">${dict.stat3Val}</div><div class="stat-label">${dict.stat3Label}</div></div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="visual-tabs" id="hero-tabs">
              ${DATA.heroVisualTabs.map((tab, i) => `
                <button class="visual-tab ${i === 0 ? "active" : ""}" data-tab-idx="${i}">
                  ${lang === "zh" ? tab.labelZh : tab.labelEn}
                </button>
              `).join("")}
            </div>
            <div class="visual-stage" id="hero-visual-stage"></div>
          </div>
        </div>
      </section>

      <section class="section section-alt">
        <div class="container">
          <div class="section-header">
            <span class="eyebrow">${dict.overviewEyebrow}</span>
            <h2>${dict.overviewTitle}</h2>
            <p>${dict.overviewDesc}</p>
          </div>
          <div class="grid-4">${overviewCards}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2.5rem;">
            <div class="section-header" style="margin-bottom:0;">
              <span class="eyebrow">${dict.lifeEyebrow}</span>
              <h2>${dict.lifeTitle}</h2>
              <p>${dict.lifeDesc}</p>
            </div>
            <div class="carousel-controls">
              <button type="button" id="carousel-prev" class="btn btn-outline btn-sm" aria-label="Previous"><i data-lucide="chevron-left" style="width:18px;height:18px;"></i></button>
              <button type="button" id="carousel-next" class="btn btn-outline btn-sm" aria-label="Next"><i data-lucide="chevron-right" style="width:18px;height:18px;"></i></button>
            </div>
          </div>
          <div class="carousel-grid" id="home-achievements-grid"></div>
        </div>
      </section>

      <section class="section section-alt">
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:2.5rem;">
            <div class="section-header" style="margin-bottom:0;">
              <span class="eyebrow">${dict.facultyPreviewEyebrow}</span>
              <h2>${dict.facultyPreviewTitle}</h2>
            </div>
            <a href="faculty.html" class="btn btn-primary">${dict.facultyPreviewBtn}</a>
          </div>
          <div class="grid-3">${featuredFaculty}</div>
        </div>
      </section>
    `;

    function setHeroTab(idx) {
      const tab = DATA.heroVisualTabs[idx];
      document.querySelectorAll("#hero-tabs .visual-tab").forEach((b, i) => b.classList.toggle("active", i === idx));
      document.getElementById("hero-visual-stage").innerHTML = `
        <div>
          <span class="tag tag-sage" style="background:#fff;margin-bottom:0.9rem;">${lang === "zh" ? tab.badgeZh : tab.badgeEn}</span>
          <h3 style="font-size:1.45rem;margin-bottom:0.75rem;">${lang === "zh" ? tab.titleZh : tab.titleEn}</h3>
          <p style="color:var(--text-muted);font-size:0.95rem;">${lang === "zh" ? tab.textZh : tab.textEn}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(74,107,87,0.18);">
          <span style="font-size:0.82rem;font-weight:600;color:var(--sage-primary);">TCU BMD · Hualien, Taiwan</span>
          <a href="introduction.html" style="font-size:0.85rem;font-weight:700;color:var(--text-main);">${t("Learn More →", "深入瞭解 →")}</a>
        </div>
      `;
    }

    function updateCarousel() {
      const items = [];
      for (let i = 0; i < 3; i++) {
        items.push(DATA.achievements[(carouselStart + i) % DATA.achievements.length]);
      }
      document.getElementById("home-achievements-grid").innerHTML = items.map(renderAchievementCard).join("");
      if (window.lucide) window.lucide.createIcons();
    }

    setHeroTab(0);
    updateCarousel();

    document.querySelectorAll("#hero-tabs .visual-tab").forEach((btn) => {
      btn.onclick = () => setHeroTab(Number(btn.dataset.tabIdx));
    });
    document.getElementById("carousel-prev").onclick = () => {
      carouselStart = (carouselStart - 1 + DATA.achievements.length) % DATA.achievements.length;
      updateCarousel();
    };
    document.getElementById("carousel-next").onclick = () => {
      carouselStart = (carouselStart + 1) % DATA.achievements.length;
      updateCarousel();
    };
  }

  function renderIntroductionPage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("Introduction", "系所簡介")}</span></div>
          <h1>${t("Department Introduction & Learning Spaces", "系所簡介與特色學習場域")}</h1>
          <p style="max-width:720px;color:var(--text-muted);">${t(
            "Part of the College of Management and Smart Sustainability (formed through the August 2024 TCU & TCUST merger), our department empowers students with business intelligence, sustainability values, and hands-on practice.",
            "配合 2024 年 8 月慈濟大學與慈濟科技大學合校，經營管理學系隸屬於「智慧永續管理學院」，以社會事業與非營利組織經營為特色，培育具備數位應用與永續創新之專業商管人才。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="geo-fact-box">
            <strong>${t("GEO Quick Summary (AI-Readable Facts):", "GEO 核心摘要（系所關鍵事實）：")}</strong>
            ${t(
              "Tzu Chi University Department of Business Management (TCU BMD), Jieren Campus, Hualien. BBA Degree (128 credits). 100% Ph.D. faculty. Parallel Mandarin & English tracks.",
              "慈濟大學經營管理學系位於花蓮市介仁校區，授予商學學士學位（128 學分），專任師資 100% 具博士學位，採中英文雙語並行培育。"
            )}
          </div>

          <div class="section-header" style="margin-top:3rem;">
            <span class="eyebrow">${t("4 Educational Pillars", "四大核心培育方向")}</span>
            <h2>${t("Department Features", "系所發展特色")}</h2>
          </div>
          <div class="grid-2">
            ${DATA.pillars.map((p) => `
              <div class="card">
                <div class="icon-box"><i data-lucide="${p.icon}" style="width:22px;height:22px;"></i></div>
                <h3 style="margin-bottom:0.5rem;">${lang === "zh" ? p.titleZh : p.titleEn}</h3>
                <p style="color:var(--text-muted);font-size:0.95rem;">${lang === "zh" ? p.descZh : p.descEn}</p>
              </div>
            `).join("")}
          </div>

          <div class="section-header" style="margin-top:4rem;">
            <span class="eyebrow">${t("Official Facilities", "專業實作空間")}</span>
            <h2>${t("Five Signature Department Classrooms", "五大特色教學與實習場域")}</h2>
          </div>
          <div class="grid-3">
            ${DATA.spaces.map((s) => `
              <div class="card">
                <span class="tag tag-sage" style="align-self:flex-start;margin-bottom:0.75rem;">Jieren Campus</span>
                <h3 style="font-size:1.15rem;margin-bottom:0.5rem;">${lang === "zh" ? s.nameZh : s.nameEn}</h3>
                <p style="color:var(--text-muted);font-size:0.92rem;">${lang === "zh" ? s.descZh : s.descEn}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderCurriculumPage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("Curriculum", "課程規劃")}</span></div>
          <h1>${t("Curriculum & Admission Course Maps", "課程規劃與四年學習地圖")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${lang === "zh" ? DATA.curriculum.overviewZh : DATA.curriculum.overviewEn}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="filter-bar" id="admission-year-tabs">
            ${DATA.curriculum.years.map((yr, i) => `
              <button class="filter-btn ${i === 0 ? "active" : ""}" data-yr="${yr}">
                ${lang === "zh" ? `${yr} 學年度入學課程` : `${yr} Admission Courses`}
              </button>
            `).join("")}
          </div>
          <p id="yr-note" style="margin-bottom:2rem;color:var(--sage-primary);font-weight:600;"></p>

          <div class="grid-2">
            ${DATA.curriculum.yearProgression.map((yp) => `
              <div class="card">
                <h3 style="margin-bottom:0.9rem;color:var(--sage-primary);">${lang === "zh" ? yp.yearZh : yp.yearEn}</h3>
                <ul style="padding-left:1.25rem;color:var(--text-muted);display:flex;flex-direction:column;gap:0.4rem;">
                  ${(lang === "zh" ? yp.coursesZh : yp.coursesEn).map((c) => `<li>${c}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>

          <div class="section-header" style="margin-top:4rem;">
            <span class="eyebrow">${t("Employment Professionalism", "就業職能專業模組")}</span>
            <h2>${t("Three Career-Aligned Curriculum Modules", "三大專業職能模組與職場連結")}</h2>
          </div>
          <div class="grid-3">
            ${DATA.curriculum.modules.map((m) => `
              <div class="card">
                <h3 style="font-size:1.15rem;margin-bottom:0.75rem;">${lang === "zh" ? m.titleZh : m.titleEn}</h3>
                <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:0.8rem;"><strong>${t("Learning Focus:", "學習重點：")}</strong> ${lang === "zh" ? m.purposeZh : m.purposeEn}</p>
                <p style="font-size:0.9rem;color:var(--sage-primary);margin-top:auto;"><strong>${t("Student Relevance:", "職涯連結：")}</strong> ${lang === "zh" ? m.relevanceZh : m.relevanceEn}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    `;

    const yrNote = document.getElementById("yr-note");
    const updateYrNote = (yr) => {
      yrNote.textContent = lang === "zh"
        ? `目前檢視：${yr} 學年度入學適用之四年制學士班課程架構（最低畢業學分 128 學分，含必修 70 學分及全學期實習選項）。`
        : `Currently viewing: Academic Year ${yr} Admission Course Map (128 credits minimum, 70 obligatory, bilingual course & full-semester internship pathways).`;
    };
    updateYrNote("115");
    document.querySelectorAll("#admission-year-tabs .filter-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll("#admission-year-tabs .filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateYrNote(btn.dataset.yr);
      };
    });
  }

  function renderCareerPage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("Career Path", "畢業發展")}</span></div>
          <h1>${t("Career Paths & Graduate Employment", "畢業發展與校友職涯藍圖")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${t(
            "7 out of 20 major job categories on Taiwan's 1111 Job Bank directly align with Business Management—spanning retailing, tourism, hospitality, organic agriculture, deep-sea water industries, and Tzu Chi enterprises.",
            "經營管理人才各行各業皆高度需求！在 1111 人力銀行 20 項工作分類中，有 7 類與本系出路高度相關，涵蓋零售流通、觀光餐旅、有機農業、深層海水與海內外慈濟志業體。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid-3">
            ${DATA.careers.map((c) => `
              <div class="card">
                <div class="icon-box clay"><i data-lucide="briefcase" style="width:20px;height:20px;"></i></div>
                <h3 style="font-size:1.15rem;margin-bottom:0.5rem;">${lang === "zh" ? c.sectorZh : c.sectorEn}</h3>
                <p style="font-size:0.92rem;color:var(--text-muted);">${lang === "zh" ? c.rolesZh : c.rolesEn}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderStudentLifePage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("Student Life", "學習成果")}</span></div>
          <h1>${t("Student Life, Projects & National Honors", "學習成果、實務專題與競賽榮譽")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${t(
            "Explore student capstones, green-tech inventions, Hualien youth revitalization initiatives, and testimonials from our undergraduate cohorts.",
            "瀏覽慈大經管系學生在全國經營管理競賽、創新技術博覽會、花蓮地方創生及蔬食廚藝培訓的真實成果與心得。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid-3">
            ${DATA.achievements.map(renderAchievementCard).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderFacultyPage(lang) {
    const root = document.getElementById("page-content");
    const categories = [
      { id: "all", en: "All Faculty (12)", zh: "全部師資 (12)" },
      { id: "strategy", en: "Strategy & Sustainability", zh: "策略與永續管理" },
      { id: "marketing", en: "Marketing & Service", zh: "行銷與服務管理" },
      { id: "finance", en: "Finance & Accounting", zh: "財務與會計" },
      { id: "tech", en: "Data, IT & Quantitative", zh: "資訊、資料庫與量化" },
      { id: "tourism", en: "Tourism & Hospitality", zh: "觀光與接待業" }
    ];

    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("Faculty", "師資介紹")}</span></div>
          <h1>${t("Full-Time Faculty Directory", "專任師資陣容")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${t(
            "100% Ph.D.-qualified scholars specializing in organizational creativity, digital marketing, circular economy, financial governance, data mining, and sustainable tourism.",
            "本系專任教師 100% 具國內外博士學位，研究專長涵蓋組織創新、數位行銷、循環經濟、公司治理、智慧文字探勘與永續觀光。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="filter-bar" id="faculty-filters">
            ${categories.map((c, i) => `
              <button class="filter-btn ${i === 0 ? "active" : ""}" data-cat="${c.id}">
                ${lang === "zh" ? c.zh : c.en}
              </button>
            `).join("")}
          </div>
          <div class="grid-3" id="faculty-grid">
            ${DATA.faculty.map(renderFacultyCard).join("")}
          </div>
        </div>
      </section>
    `;

    document.querySelectorAll("#faculty-filters .filter-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll("#faculty-filters .filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.cat;
        const list = cat === "all" ? DATA.faculty : DATA.faculty.filter((f) => f.category === cat);
        document.getElementById("faculty-grid").innerHTML = list.map(renderFacultyCard).join("");
        if (window.lucide) window.lucide.createIcons();
      };
    });
  }

  function renderCertificatePage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("Certificate Requirement", "專業證照門檻")}</span></div>
          <h1>${t("Professional Certificate Graduation Threshold (30 Points)", "專業證照畢業門檻辦法（總計 30 點）")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${t(
            "Amended Sep 3, 2025 (114-1 Academic Year). All four-year undergraduate students must accumulate at least 30 points in recognized professional certificates prior to graduation.",
            "依 114 學年度第 1 學期（2025/09/03）修正通過辦法：四技／大學部學生畢業前需取得專業證照累計達 30 點以上（外籍生英文相關證照亦得採計）。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="card" style="background:var(--bg-sage-tint);margin-bottom:2.5rem;">
            <h3 style="margin-bottom:0.75rem;">${t("Interactive 30-Point Tracker", "畢業證照點數試算器")}</h3>
            <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:1rem;">
              ${t("Check the certificates you plan to earn to verify if you meet the 30-point requirement:", "勾選預計考取的證照類別，即時試算是否達到 30 點畢業門檻：")}
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;" id="cert-calc-boxes">
              <label class="filter-btn"><input type="checkbox" value="20" class="cert-chk"> ${t("Class B Skill / Professional Cert (20 pts)", "乙級技術士 / 專業級證照 (20點)")}</label>
              <label class="filter-btn"><input type="checkbox" value="15" class="cert-chk"> ${t("Advanced Digital / ERP / TBSA (15 pts)", "進階數位 / ERP / TBSA (15點)")}</label>
              <label class="filter-btn"><input type="checkbox" value="10" class="cert-chk"> ${t("Class C Skill Test (10 pts)", "丙級技術士檢定 (10點)")}</label>
              <label class="filter-btn"><input type="checkbox" value="10" class="cert-chk"> ${t("Additional Class C / Basic Cert (10 pts)", "第二張丙級 / 基礎證照 (10點)")}</label>
            </div>
            <div id="cert-calc-result" style="font-weight:700;font-size:1.1rem;color:var(--sage-primary);">
              ${t("Total: 0 / 30 points", "目前累計：0 / 30 點")}
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>${t("Category", "證照類別")}</th>
                  <th>${t("Recognized Certificates", "認可證照名稱")}</th>
                  <th>${t("Points", "採計點數")}</th>
                </tr>
              </thead>
              <tbody>
                ${DATA.certificates.map((c) => `
                  <tr>
                    <td><strong>${lang === "zh" ? c.levelZh : c.levelEn}</strong></td>
                    <td>${lang === "zh" ? c.itemsZh : c.itemsEn}</td>
                    <td><span class="tag tag-sage">${c.points} pts</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;

    const chks = document.querySelectorAll(".cert-chk");
    const res = document.getElementById("cert-calc-result");
    chks.forEach((chk) => {
      chk.onchange = () => {
        const total = Array.from(chks).filter((c) => c.checked).reduce((s, c) => s + Number(c.value), 0);
        const passed = total >= 30;
        res.style.color = passed ? "var(--sage-primary)" : "var(--clay-accent)";
        res.textContent = lang === "zh"
          ? `目前累計：${total} / 30 點 ${passed ? "✅ 已達畢業門檻！" : "（尚需 " + (30 - total) + " 點）"}`
          : `Total: ${total} / 30 points ${passed ? "✅ Graduation Threshold Met!" : "(" + (30 - total) + " more points needed)"}`;
      };
    });
  }

  function renderForumPage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("FB Forum", "社群交流")}</span></div>
          <h1>${t("FB Forum & Student Social Channels", "社群交流論壇與官方粉專")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${t(
            "Connect with TCU Business Management students, alumni, and faculty across Facebook, Instagram, and YouTube.",
            "即時追蹤慈濟大學經營管理學系 Facebook 社群、Instagram 官方帳號與 YouTube 頻道，與學長姐及師長交流。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid-3" style="margin-bottom:3rem;">
            <div class="card">
              <div class="icon-box"><i data-lucide="facebook" style="width:22px;height:22px;"></i></div>
              <h3>${t("Official Facebook Forum", "經營管理學系 FB 粉絲團")}</h3>
              <p style="color:var(--text-muted);font-size:0.92rem;margin:0.5rem 0 1.2rem;">${t("Event recaps, competition wins, and alumni networking.", "最新活動花絮、全國競賽捷報與系友交流園地。")}</p>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${t("Visit Facebook →", "前往 Facebook →")}</a>
            </div>
            <div class="card">
              <div class="icon-box clay"><i data-lucide="instagram" style="width:22px;height:22px;"></i></div>
              <h3>${t("Department Instagram (IG)", "系所 Instagram 官方帳號")}</h3>
              <p style="color:var(--text-muted);font-size:0.92rem;margin:0.5rem 0 1.2rem;">${t("Student short reels, Zhizu Café life, and campus moments.", "學生短影音 Reels、知足咖啡館實習日常與校園生活。")}</p>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${t("Follow on IG →", "追蹤 IG 粉專 →")}</a>
            </div>
            <div class="card">
              <div class="icon-box"><i data-lucide="youtube" style="width:22px;height:22px;"></i></div>
              <h3>${t("TCU Official YouTube", "慈濟大學影音頻道")}</h3>
              <p style="color:var(--text-muted);font-size:0.92rem;margin:0.5rem 0 1.2rem;">${t("Capstone video showcases and campus documentaries.", "實務專題成果影片與系所介紹精選影音。")}</p>
              <a href="https://www.youtube.com/@_tcust5687" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${t("Watch Videos →", "觀看頻道 →")}</a>
            </div>
          </div>

          <div class="card">
            <h3 style="margin-bottom:1rem;">${t("Student Q&A Board (Interactive Preview)", "新生與在學生常見問答討論區")}</h3>
            <form id="forum-post-form" style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
              <input id="forum-input" class="form-control" style="flex:1;min-width:240px;" type="text" placeholder="${t("Post a question about internships, Zhizu Cafe, or GEO projects...", "留下關於實習、證照或專題的問題...")}" required>
              <button type="submit" class="btn btn-primary">${t("Post Question", "發佈留言")}</button>
            </form>
            <div id="forum-list" style="display:flex;flex-direction:column;gap:0.9rem;">
              <div style="padding:1rem;background:var(--bg-soft);border-radius:var(--radius-sm);">
                <strong>${t("Senior Student · Class of 2026:", "大四學長姐分享：")}</strong>
                ${t("Tip for juniors: Combine iPAS Net-Zero Carbon (20 pts) + Class C Store Service (10 pts) to easily reach your 30-point threshold!", "建議學弟妹大二、大三可以先考取 iPAS 淨零碳規劃管理師（20點）搭配門市服務丙級（10點），就能輕鬆達標 30 點畢業門檻！")}
              </div>
              <div style="padding:1rem;background:var(--bg-soft);border-radius:var(--radius-sm);">
                <strong>${t("International Cohort:", "外籍生專班同學：")}</strong>
                ${t("The bilingual curriculum and practical capstone projects helped our team win medals at the Taiwan Innotech Expo.", "雙語課程與實作專題讓我們在大學期間就能參與台灣創新技術博覽會並獲得銀牌肯定！")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.getElementById("forum-post-form").onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById("forum-input");
      const val = input.value.trim();
      if (!val) return;
      const item = document.createElement("div");
      item.style.cssText = "padding:1rem;background:var(--bg-sage-tint);border-radius:var(--radius-sm);";
      item.innerHTML = `<strong>${t("Just now · Student Post:", "剛剛 · 同學留言：")}</strong> `;
      item.appendChild(document.createTextNode(val));
      document.getElementById("forum-list").prepend(item);
      input.value = "";
    };
  }

  function renderMorePage(lang) {
    const root = document.getElementById("page-content");
    root.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="breadcrumb"><a href="index.html">${t("Home", "首頁")}</a> / <span>${t("More Resources", "更多資源")}</span></div>
          <h1>${t("University Portals, Industry Partners & P108 GEO Log", "更多資源、產學夥伴與 P108 GEO 專題紀錄")}</h1>
          <p style="max-width:740px;color:var(--text-muted);">${t(
            "Direct access to affiliated Tzu Chi enterprises, Virtual Corporation, and our P108 GEO AI Collaboration & Quality Assurance record.",
            "連結智慧永續管理學院、大愛感恩科技、靜思書軒、HERM 虛擬企業，並公開本網站依據 P108 GEO 專題手冊之 AI 協作紀錄與品質檢核。"
          )}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid-2" style="margin-bottom:4rem;">
            ${DATA.moreLinks.map((m) => `
              <div class="card">
                <h3 style="margin-bottom:0.5rem;">${lang === "zh" ? m.titleZh : m.titleEn}</h3>
                <p style="color:var(--text-muted);font-size:0.94rem;margin-bottom:1.25rem;">${lang === "zh" ? m.descZh : m.descEn}</p>
                <a href="${m.url}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="align-self:flex-start;">
                  ${t("Open Official Resource ↗", "前往官方頁面 ↗")}
                </a>
              </div>
            `).join("")}
          </div>

          <div class="card" style="background:var(--bg-sage-tint);border-color:var(--sage-primary);">
            <span class="eyebrow" style="background:#fff;">P108 GEO Project Handbook · Section 8 & 15</span>
            <h2 style="margin-bottom:1rem;">${t("AI Collaboration Log & GEO Architecture", "AI 協作紀錄與 GEO 網站品質檢核")}</h2>
            <ul style="padding-left:1.25rem;display:flex;flex-direction:column;gap:0.65rem;color:var(--text-main);">
              <li><strong>${t("GEO Readiness:", "GEO 結構化設計：")}</strong> ${t("All pages include semantic HTML5 landmarks, Schema.org EducationalOrganization JSON-LD metadata, and bilingual alignment without mechanical translation.", "全站採用語意化 HTML5 標籤、Schema.org EducationalOrganization JSON-LD 結構化資料與道地中英文雙語對照。")}</li>
              <li><strong>${t("AI Collaboration & Human Judgment:", "AI 協作與人工審查：")}</strong> ${t("AI assisted with responsive CSS grid prototyping and modular JS structure; all 12 faculty credentials, 128-credit rules, and 30-point certificate standards were manually verified against mdm.tcu.edu.tw.", "運用 AI 輔助設計 RWD 響應式版面與模組化 JS 架構，並經人工核對 12 位教師資訊、128 畢業學分與 30 點證照規定。")}</li>
              <li><strong>${t("Maintainability & GitHub Pages:", "可維護性與 GitHub 部署：")}</strong> ${t("Zero build-step modular architecture (data.js + components.js + main.js) allows future cohorts to update faculty or course data in one file.", "採用純靜態模組架構，未來學弟妹僅需更新 data.js 即可同步維護全站資料，完全符合交接 SOP 標準。")}</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  renderCurrentPage();
});