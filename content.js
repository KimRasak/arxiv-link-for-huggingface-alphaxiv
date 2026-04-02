(() => {
  const COPY_SVG_WHITE = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"/></svg>';
  const CHECK_SVG_WHITE = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';
  const COPY_SVG_COLOR = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"/></svg>';
  const CHECK_SVG_COLOR = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';

  function copyText(text) {
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
  }

  // ========== HuggingFace Papers ==========
  function processHF() {
    const articles = document.querySelectorAll("article");
    if (!articles.length) return;

    articles.forEach((article) => {
      if (article.dataset.arxivDone) return;

      const links = article.querySelectorAll('a[href*="/papers/"]');
      let arxivId = null;
      let thumbLink = null;

      for (const a of links) {
        const href = a.getAttribute("href") || "";
        const m = href.match(/\/papers\/(\d{4}\.\d{4,5})/);
        if (!m) continue;
        if (!arxivId) arxivId = m[1];
        if (!thumbLink && a.parentElement === article) {
          thumbLink = a;
        }
      }

      if (!arxivId) return;
      article.dataset.arxivDone = "1";

      const arxivUrl = "https://arxiv.org/abs/" + arxivId;

      if (thumbLink) {
        thumbLink.href = arxivUrl;
        thumbLink.target = "_blank";
        thumbLink.rel = "noopener noreferrer";
        thumbLink.style.position = "relative";

        const badge = document.createElement("span");
        badge.className = "arxiv-badge";
        badge.title = "Click to copy: " + arxivUrl;
        badge.innerHTML = COPY_SVG_WHITE + '<span style="color:white">arXiv</span>';

        badge.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          copyText(arxivUrl);
          badge.classList.add("copied");
          badge.innerHTML = CHECK_SVG_WHITE + '<span style="color:white">Copied!</span>';
          setTimeout(() => {
            badge.classList.remove("copied");
            badge.innerHTML = COPY_SVG_WHITE + '<span style="color:white">arXiv</span>';
          }, 1500);
          return false;
        }, true);

        thumbLink.appendChild(badge);
      }
    });
  }

  // ========== alphaXiv ==========
  function processAlphaXiv() {
    // Each paper card is a div.rounded-xl with a link to /abs/XXXX.XXXXX
    const cards = document.querySelectorAll('div[class*="rounded-xl"][class*="border"]');
    if (!cards.length) return;

    cards.forEach((card) => {
      if (card.dataset.arxivDone) return;

      const link = card.querySelector('a[href*="/abs/"]');
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const m = href.match(/\/abs\/(\d{4}\.\d{4,5})/);
      if (!m) return;

      const arxivId = m[1];
      const arxivUrl = "https://arxiv.org/pdf/" + arxivId;
      card.dataset.arxivDone = "1";

      // Find the bottom action bar: div with "mt-auto" containing the scrollable button row
      const actionBar = card.querySelector('div[class*="mt-auto"] div[class*="scrollbar-hide"]');
      if (!actionBar) return;

      const btn = document.createElement("button");
      btn.className = "arxiv-copy-pill";
      btn.title = "Copy: " + arxivUrl;
      btn.innerHTML = COPY_SVG_COLOR + '<span>arXiv PDF</span>';

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        copyText(arxivUrl);
        btn.classList.add("copied");
        btn.innerHTML = CHECK_SVG_COLOR + '<span>Copied!</span>';
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = COPY_SVG_COLOR + '<span>arXiv PDF</span>';
        }, 1500);
      });

      actionBar.appendChild(btn);
    });
  }

  // ========== Dispatcher ==========
  const isAlphaXiv = location.hostname.includes("alphaxiv.org");
  const process = isAlphaXiv ? processAlphaXiv : processHF;

  process();

  let timer = null;
  new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(process, 400);
  }).observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(process, 1000);
  setTimeout(process, 3000);
})();
