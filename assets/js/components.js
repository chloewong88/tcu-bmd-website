window.BMD_COMPONENTS = (() => {
  const getLang = () => localStorage.getItem("bmd_lang") || "en";

  function t(enText, zhText) {
    return getLang() === "zh" ? zhText : enText;
  }

  function renderHeader(activePageId) {
    const lang = getLang();
    const { brand, nav, i18n } = window.BMD_DATA;
    const dict = i18n[lang];

    const navHtml = nav
      .map(
        (item) => `
        <li>
          <a href="${item.href}" class="${item.id === activePageId ? "active" : ""}">
            ${lang === "zh" ? item.zh : item.en}
          </a>
        </li>`
      )
      .join("");

    const mobileHtml = nav
      .map(
        (item) => `
        <li>
          <a href="${item.href}" class="${item.id === activePageId ? "active" : ""}">
            ${lang === "zh" ? item.zh : item.en}
          </a>
        </li>`
      )
      .join("");

    const headerEl = document.getElementById("site-header");
    if (!headerEl) return;

    headerEl.innerHTML = `
      <div class="container nav-wrapper">
        <a href="index.html" class="brand-logo" aria-label="Tzu Chi University Department of Business Management Home">
          <div class="brand-mark">
            <img src="${brand.logoUrl}" alt="TCU Emblem" onerror="this.style.display='none'; this.parentElement.textContent='TCU';">
          </div>
          <div class="brand-text">
            <span class="brand-title">${lang === "zh" ? brand.uniZh : brand.uniEn}</span>
            <span class="brand-sub">${lang === "zh" ? brand.deptZh : brand.deptEn}</span>
          </div>
        </a>

        <nav aria-label="Main Navigation">
          <ul class="nav-links">
            ${navHtml}
          </ul>
        </nav>

        <div class="nav-actions">
          <button type="button" id="lang-toggle-btn" class="lang-toggle" aria-label="Switch Language">
            <i data-lucide="languages" style="width:16px;height:16px;"></i>
            <span>${lang === "zh" ? "EN / 中文" : "中文 / EN"}</span>
          </button>
          <button type="button" id="hamburger-btn" class="hamburger-btn" aria-label="Toggle Menu" aria-expanded="false">
            <i data-lucide="menu" style="width:22px;height:22px;"></i>
          </button>
        </div>
      </div>

      <div id="mobile-drawer" class="mobile-drawer" aria-hidden="true">
        <ul class="mobile-nav-list">
          <li><a href="index.html" class="${activePageId === "home" ? "active" : ""}">${dict.home}</a></li>
          ${mobileHtml}
        </ul>
      </div>
    `;
  }

  function renderContactSection() {
    const lang = getLang();
    const dict = window.BMD_DATA.i18n[lang];
    const target = document.getElementById("contact-section");
    if (!target) return;

    target.innerHTML = `
      <div class="container">
        <div class="grid-2" style="align-items: start; gap: 3rem;">
          <div>
            <span class="eyebrow"><i data-lucide="mail" style="width:14px;height:14px;"></i> ${dict.contactEyebrow}</span>
            <h2 style="font-size: clamp(1.8rem, 3vw, 2.4rem); margin-bottom: 1rem;">${dict.contactTitle}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">${dict.contactDesc}</p>

            <div class="card" style="background: var(--bg-soft);">
              <div style="display:flex; flex-direction:column; gap:1rem; font-size:0.95rem;">
                <div style="display:flex; gap:0.75rem; align-items:center;">
                  <i data-lucide="map-pin" style="width:18px;height:18px;color:var(--sage-primary);flex-shrink:0;"></i>
                  <span>${lang === "zh" ? window.BMD_DATA.brand.addressZh : window.BMD_DATA.brand.addressEn}</span>
                </div>
                <div style="display:flex; gap:0.75rem; align-items:center;">
                  <i data-lucide="phone" style="width:18px;height:18px;color:var(--sage-primary);flex-shrink:0;"></i>
                  <span>${window.BMD_DATA.brand.phone}</span>
                </div>
                <div style="display:flex; gap:0.75rem; align-items:center;">
                  <i data-lucide="at-sign" style="width:18px;height:18px;color:var(--sage-primary);flex-shrink:0;"></i>
                  <a href="mailto:${window.BMD_DATA.brand.email}" style="text-decoration:underline;">${window.BMD_DATA.brand.email}</a>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <form id="bmd-contact-form" novalidate>
              <div class="form-group">
                <label class="form-label" for="contact-name">${dict.fieldName} *</label>
                <input class="form-control" type="text" id="contact-name" name="name" placeholder="${lang === "zh" ? "例：林小明" : "e.g., Alex Chen"}" required />
                <div class="form-error" id="err-name">${lang === "zh" ? "請輸入至少 2 個字元的姓名。" : "Please enter your name (at least 2 characters)."}</div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-email">${dict.fieldEmail} *</label>
                <input class="form-control" type="email" id="contact-email" name="email" placeholder="student@gms.tcu.edu.tw" required />
                <div class="form-error" id="err-email">${lang === "zh" ? "請輸入有效的電子郵件格式。" : "Please enter a valid email address."}</div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-message">${dict.fieldMessage} *</label>
                <textarea class="form-control" id="contact-message" name="message" rows="4" placeholder="${lang === "zh" ? "想詢問課程、證照門檻或入學資訊..." : "Tell us about your interest in Business Management..."}" required></textarea>
                <div class="form-error" id="err-message">${lang === "zh" ? "訊息內容需至少 10 個字元。" : "Please enter a message of at least 10 characters."}</div>
              </div>

              <button type="submit" class="btn btn-primary" style="width:100%;">
                <i data-lucide="send" style="width:16px;height:16px;"></i>
                <span>${dict.sendMsg}</span>
              </button>

              <div id="contact-success" class="alert-success" role="status">
                <i data-lucide="check-circle-2" style="width:20px;height:20px;flex-shrink:0;"></i>
                <span>${dict.contactSuccess}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const lang = getLang();
    const { brand, nav, i18n } = window.BMD_DATA;
    const dict = i18n[lang];
    const footerEl = document.getElementById("site-footer");
    if (!footerEl) return;

    const firstHalf = nav.slice(0, 4);
    const secondHalf = nav.slice(4);

    footerEl.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <h3 class="footer-title">${lang === "zh" ? `${brand.uniZh} ${brand.deptZh}` : `${brand.uniEn} · BMD`}</h3>
            <p style="font-size:0.9rem; color:#b7bdb9; margin-bottom:1rem;">${dict.footerDesc}</p>
            <p style="font-size:0.84rem; color:#9da49f;">${lang === "zh" ? brand.addressZh : brand.addressEn}<br>${brand.phone} · ${brand.email}</p>
            <div class="social-row">
              <a class="social-pill" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">
                <i data-lucide="facebook" style="width:17px;height:17px;"></i>
              </a>
              <a class="social-pill" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
                <i data-lucide="instagram" style="width:17px;height:17px;"></i>
              </a>
              <a class="social-pill" href="https://www.youtube.com/@_tcust5687" target="_blank" rel="noopener" aria-label="YouTube">
                <i data-lucide="youtube" style="width:17px;height:17px;"></i>
              </a>
              <a class="social-pill" href="https://mdm.tcu.edu.tw/?Lang=en" target="_blank" rel="noopener" aria-label="Official Website">
                <i data-lucide="globe" style="width:17px;height:17px;"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 class="footer-title">${dict.footerQuick}</h4>
            <ul class="footer-links">
              ${firstHalf.map((n) => `<li><a href="${n.href}">${lang === "zh" ? n.zh : n.en}</a></li>`).join("")}
            </ul>
          </div>

          <div>
            <h4 class="footer-title">${dict.footerPortals}</h4>
            <ul class="footer-links">
              ${secondHalf.map((n) => `<li><a href="${n.href}">${lang === "zh" ? n.zh : n.en}</a></li>`).join("")}
            </ul>
          </div>

          <div>
            <h4 class="footer-title">${dict.footerNews}</h4>
            <p style="font-size:0.86rem; color:#b7bdb9;">${dict.footerNewsDesc}</p>
            <form id="newsletter-form" class="newsletter-form" novalidate>
              <input type="email" id="newsletter-email" placeholder="${lang === "zh" ? "輸入 Email" : "Enter your email"}" required />
              <button type="submit" class="btn btn-primary btn-sm">${dict.subscribe}</button>
            </form>
            <p id="newsletter-msg" style="font-size:0.82rem; margin-top:0.5rem; color:#a3b8a8; min-height:1.2em;"></p>
          </div>
        </div>

        <div class="footer-bottom">
          <span>${dict.copyright}</span>
          <span>${lang === "zh" ? "為人類閱讀設計，亦為 AI 搜尋理解（GEO）打造" : "Human-Readable & AI-Understandable (GEO Ready)"}</span>
        </div>
      </div>
    `;
  }

  function renderFacultyCard(prof) {
    const lang = getLang();
    const initials = prof.nameEn.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join("");
    const tags = (lang === "zh" ? prof.expertiseZh : prof.expertiseEn)
      .map((tag) => `<span class="tag tag-sage">${tag}</span>`)
      .join("");

    return `
      <article class="card faculty-card" data-category="${prof.category}">
        <div class="faculty-photo-wrap">
          ${
            prof.photo
              ? `<img src="${prof.photo}" alt="${prof.nameEn} (${prof.nameZh})" loading="lazy"
                   onerror="this.outerHTML='<div class=\\'faculty-fallback\\'>${initials}</div>'">`
              : `<div class="faculty-fallback">${initials}</div>`
          }
        </div>
        <div class="faculty-body">
          <div class="faculty-role">${lang === "zh" ? prof.roleZh : prof.roleEn}</div>
          <h3 class="faculty-name">${lang === "zh" ? prof.nameZh : `${prof.nameEn} · ${prof.nameZh.split(" ")[0]}`}</h3>
          <p class="faculty-meta">${lang === "zh" ? prof.phdZh : prof.phdEn}</p>
          <div class="faculty-tags">${tags}</div>
          <div class="faculty-footer">
            <span><i data-lucide="mail" style="width:13px;height:13px;vertical-align:middle;margin-right:4px;"></i>${prof.email}</span>
            <span><i data-lucide="phone" style="width:13px;height:13px;vertical-align:middle;margin-right:4px;"></i>${prof.phone}</span>
            <a href="${prof.pureUrl}" target="_blank" rel="noopener" style="color:var(--sage-primary);font-weight:600;margin-top:0.25rem;">
              ${t("Pure Scholar Profile →", "Pure 專家人才庫 →")}
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderAchievementCard(item) {
    const lang = getLang();
    return `
      <article class="card">
        <img class="achievement-img" src="${item.photo}" alt="${lang === "zh" ? item.titleZh : item.titleEn}" loading="lazy"
             onerror="this.style.display='none'">
        <span class="tag tag-sage" style="align-self:flex-start;margin-bottom:0.7rem;">${lang === "zh" ? item.badgeZh : item.badgeEn}</span>
        <h3 style="font-size:1.15rem;margin-bottom:0.5rem;">${lang === "zh" ? item.titleZh : item.titleEn}</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:0.9rem;">${lang === "zh" ? item.descZh : item.descEn}</p>
        <blockquote style="margin-top:auto;padding-top:0.85rem;border-top:1px solid var(--sand-border);font-size:0.86rem;font-style:italic;color:var(--sage-primary);">
          ${lang === "zh" ? item.quoteZh : item.quoteEn}
        </blockquote>
      </article>
    `;
  }

  return { getLang, t, renderHeader, renderContactSection, renderFooter, renderFacultyCard, renderAchievementCard };
})();