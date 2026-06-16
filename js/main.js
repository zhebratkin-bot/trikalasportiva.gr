// SVG Logo with 4 balls (tennis, volleyball, football, basketball) and text
const LOGO_SVG = `
<div class="logo-area">
  <div class="logo-balls">
    <!-- Tennis Ball -->
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" title="Τένις">
      <circle cx="50" cy="50" r="46" fill="#a3e635" stroke="#121938" stroke-width="3"/>
      <path d="M 20,30 Q 50,60 80,30 M 20,70 Q 50,40 80,70" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    </svg>
    <!-- Volleyball -->
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" title="Βόλεϊ">
      <circle cx="50" cy="50" r="46" fill="#38bdf8" stroke="#121938" stroke-width="3"/>
      <path d="M 50,4 C 50,30 30,50 4,50 M 96,50 C 70,50 50,70 50,96" fill="none" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
      <path d="M 15,15 Q 50,40 85,15 M 15,85 Q 50,60 85,85" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <!-- Football (Soccer) -->
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" title="Ποδόσφαιρο">
      <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#121938" stroke-width="3"/>
      <polygon points="50,32 65,43 60,60 40,60 35,43" fill="#121938"/>
      <path d="M 50,32 L 50,4 M 65,43 L 90,32 M 60,60 L 78,82 M 40,60 L 22,82 M 35,43 L 10,32" stroke="#121938" stroke-width="3"/>
      <path d="M 50,4 L 70,10 L 90,32 L 85,55 L 78,82 L 50,96 L 22,82 L 15,55 L 10,32 L 30,10 Z" fill="none" stroke="#121938" stroke-width="3"/>
    </svg>
    <!-- Basketball -->
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" title="Μπάσκετ">
      <circle cx="50" cy="50" r="46" fill="#f97316" stroke="#121938" stroke-width="3"/>
      <path d="M 4,50 L 96,50 M 50,4 L 50,96" stroke="#121938" stroke-width="4"/>
      <path d="M 18,18 Q 50,50 18,82 M 82,18 Q 50,50 82,82" fill="none" stroke="#121938" stroke-width="4" stroke-linecap="round"/>
    </svg>
  </div>
  <a href="index.html" class="logo-text">trikalasportiva</a>
</div>
`;

// Social Media Icons Helper
const SOCIAL_ICONS = {
  facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V2h-3c-3 0-5 2-5 5v1z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.56v.07c-.88.39-1.83.65-2.82.77 1.02-.61 1.8-1.57 2.17-2.72-.95.56-2 .97-3.12 1.19-.9-.96-2.17-1.56-3.59-1.56-2.72 0-4.92 2.2-4.92 4.92 0 .39.04.76.13 1.12-4.09-.2-7.71-2.17-10.14-5.14-.42.73-.67 1.58-.67 2.48 0 1.71.87 3.21 2.19 4.1-.8-.03-1.56-.25-2.22-.61v.06c0 2.38 1.7 4.38 3.95 4.83-.41.11-.85.17-1.3.17-.32 0-.63-.03-.94-.09.62 1.95 2.43 3.38 4.59 3.42-1.68 1.32-3.8 2.11-6.1 2.11-.4 0-.79-.02-1.18-.07 2.18 1.39 4.77 2.21 7.55 2.21 9.05 0 14-7.5 14-14 0-.21 0-.43-.02-.64.96-.69 1.8-1.56 2.46-2.54z"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2-.0-2.8.2-.7 1.3-5.4 1.3-5.4s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.8 1.5 1.7 0 1-.6 2.5-1 3.9-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.5 3 7.5 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4 0 0-.6 2.3-.8 2.9-.3 1-1.1 2.2-1.6 3.1 1.1.3 2.3.5 3.5.5 5.5 0 10-4.5 10-10S17.5 2C12 2z"/></svg>`,
  google: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.794 0-8.678-3.884-8.678-8.678s3.884-8.678 8.678-8.678c2.254 0 4.187.828 5.677 2.245L21 1.235C18.666-.94 15.617-2 12.24-2c-6.76 0-12.24 5.48-12.24 12.24s5.48 12.24 12.24 12.24c6.488 0 12.24-4.636 12.24-12.24 0-.828-.083-1.614-.24-2.355H12.24z"/></svg>`
};

// Insert Common Header
function initHeader(activeCategory = "") {
  const headerContainer = document.getElementById("header-placeholder");
  if (!headerContainer) return;

  const menuItems = [
    { name: "Αρχική", key: "home", url: "index.html" },
    { name: "Ποδόσφαιρο", key: "football", url: "category.html?c=football" },
    { name: "Μπάσκετ", key: "basketball", url: "category.html?c=basketball" },
    { name: "Βόλεϊ", key: "volleyball", url: "category.html?c=volleyball" },
    { name: "Άλλα Αθλήματα", key: "othersports", url: "category.html?c=othersports" }
  ];

  let menuHtml = "";
  menuItems.forEach(item => {
    const isActive = activeCategory === item.key ? "active" : "";
    menuHtml += `<li class="nav-item ${isActive}"><a href="${item.url}">${item.name}</a></li>`;
  });

  headerContainer.innerHTML = `
    <header class="header">
      <div class="container header__content">
        ${LOGO_SVG}
        <nav class="nav-menu">
          <ul class="nav-list">
            ${menuHtml}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

// Insert Common Footer
function initFooter() {
  const footerContainer = document.getElementById("footer-placeholder");
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a href="index.html" class="logo-text">trikalasportiva</a>
            <p class="footer-about-text">
              Η εγκυρότερη αθλητική πύλη των Τρικάλων. Όλες οι ειδήσεις για τον Α.Ο. Τρίκαλα, τα Τρίκαλα Basket, τον Ασκληπιό και τον τοπικό αθλητισμό με την υπογραφή της έμπειρης δημοσιογραφικής μας ομάδας.
            </p>
            <div class="footer-socials">
              <a href="#" class="footer-social-link" title="Facebook">${SOCIAL_ICONS.facebook}</a>
              <a href="#" class="footer-social-link" title="Twitter">${SOCIAL_ICONS.twitter}</a>
              <a href="#" class="footer-social-link" title="Pinterest">${SOCIAL_ICONS.pinterest}</a>
            </div>
          </div>
          
          <div class="footer-widget">
            <h3 class="footer-widget-title">Κατηγορίες</h3>
            <ul class="footer-links">
              <li><a href="category.html?c=football">Ποδόσφαιρο</a></li>
              <li><a href="category.html?c=basketball">Μπάσκετ</a></li>
              <li><a href="category.html?c=volleyball">Βόλεϊ</a></li>
              <li><a href="category.html?c=othersports">Άλλα Αθλήματα</a></li>
            </ul>
          </div>
          
          <div class="footer-widget">
            <h3 class="footer-widget-title">Επικοινωνία</h3>
            <div class="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>Βύρωνος 12, Τρίκαλα, 42100</span>
            </div>
            <div class="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>info@trikalasportiva.gr</span>
            </div>
            <div class="footer-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <span>+30 24310 77123</span>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 trikalasportiva.gr. Όλα τα δικαιώματα διατηρούνται. Σχεδιασμός Mobile First.</p>
        </div>
      </div>
    </footer>
  `;
}

// Utility to get query parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// News Card Builder Utility
function createNewsCard(article) {
  return `
    <article class="news-card">
      <div class="news-card__img-wrapper">
        <a href="article.html?id=${article.id}">
          <img src="${article.image}" alt="${article.title}" loading="lazy">
        </a>
      </div>
      <div class="news-card__content">
        <div class="news-card__date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>${article.date}</span>
        </div>
        <h3 class="news-card__title">
          <a href="article.html?id=${article.id}">${article.title}</a>
        </h3>
        <p class="news-card__excerpt">${article.excerpt}</p>
        <div class="news-card__footer">
          <a href="article.html?id=${article.id}" class="news-card__more">
            Διαβάστε περισσότερα
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

// Generate Pagination HTML Left Aligned
// 1  2  3  ...  5  >
function generatePaginationHTML(currentPage, totalPages, targetCategory = null) {
  if (totalPages <= 1) return "";
  
  let html = `<div class="pagination">`;
  const urlPrefix = targetCategory ? `category.html?c=${targetCategory}&page=` : `?page=`;

  // Always show Prev arrow if not on first page
  if (currentPage > 1) {
    html += `<a href="${urlPrefix}${currentPage - 1}" class="pagination-item" title="Προηγούμενη">&lt;</a>`;
  }

  // If total pages is small, show all pages
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      html += `<a href="${urlPrefix}${i}" class="pagination-item ${currentPage === i ? 'active' : ''}">${i}</a>`;
    }
  } else {
    // We have more than 5 pages
    if (currentPage <= 3) {
      // Near start
      for (let i = 1; i <= 3; i++) {
        html += `<a href="${urlPrefix}${i}" class="pagination-item ${currentPage === i ? 'active' : ''}">${i}</a>`;
      }
      html += `<span class="pagination-item dots">...</span>`;
      html += `<a href="${urlPrefix}${totalPages}" class="pagination-item">${totalPages}</a>`;
    } else if (currentPage >= totalPages - 2) {
      // Near end
      html += `<a href="${urlPrefix}1" class="pagination-item">1</a>`;
      html += `<span class="pagination-item dots">...</span>`;
      for (let i = totalPages - 2; i <= totalPages; i++) {
        html += `<a href="${urlPrefix}${i}" class="pagination-item ${currentPage === i ? 'active' : ''}">${i}</a>`;
      }
    } else {
      // In mid-range
      html += `<a href="${urlPrefix}1" class="pagination-item">1</a>`;
      html += `<span class="pagination-item dots">...</span>`;
      html += `<a href="${urlPrefix}${currentPage - 1}" class="pagination-item">${currentPage - 1}</a>`;
      html += `<a href="${urlPrefix}${currentPage}" class="pagination-item active">${currentPage}</a>`;
      html += `<a href="${urlPrefix}${currentPage + 1}" class="pagination-item">${currentPage + 1}</a>`;
      html += `<span class="pagination-item dots">...</span>`;
      html += `<a href="${urlPrefix}${totalPages}" class="pagination-item">${totalPages}</a>`;
    }
  }

  // Next Arrow
  if (currentPage < totalPages) {
    html += `<a href="${urlPrefix}${currentPage + 1}" class="pagination-item" title="Επόμενη">&gt;</a>`;
  } else {
    html += `<span class="pagination-item disabled">&gt;</span>`;
  }

  html += `</div>`;
  return html;
}

// Render dynamic elements based on active page script
document.addEventListener("DOMContentLoaded", () => {
  // Determine which page is loading
  const path = window.location.pathname;
  const fileName = path.substring(path.lastIndexOf("/") + 1);

  if (fileName === "index.html" || fileName === "") {
    setupHomePage();
  } else if (fileName === "category.html") {
    setupCategoryPage();
  } else if (fileName === "article.html") {
    setupArticlePage();
  } else if (fileName === "404.html") {
    setup404Page();
  }
});

// Setup Home Page
function setupHomePage() {
  initHeader("home");
  initFooter();

  // Load Hero News (4 articles: 1 large, 3 small)
  const heroArticles = sportsNewsStore.getHeroArticles();
  const heroGridContainer = document.getElementById("hero-news-grid");
  
  if (heroGridContainer && heroArticles.length >= 4) {
    const largeArticle = heroArticles[0];
    const smallArticles = heroArticles.slice(1, 4);

    let smallColHtml = "";
    smallArticles.forEach(art => {
      smallColHtml += `
        <article class="news-card-hero">
          <img src="${art.image}" alt="${art.title}">
          <div class="news-card-hero__overlay"></div>
          <div class="news-card-hero__info">
            <span class="news-card-hero__category">${art.categoryName}</span>
            <h3 class="news-card-hero__title">
              <a href="article.html?id=${art.id}">${art.title}</a>
            </h3>
            <div class="news-card-hero__date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>${art.date}</span>
            </div>
          </div>
        </article>
      `;
    });

    const largeCardHtml = `
      <article class="news-card-hero large-card">
        <img src="${largeArticle.image}" alt="${largeArticle.title}">
        <div class="news-card-hero__overlay"></div>
        <div class="news-card-hero__info">
          <span class="news-card-hero__category">${largeArticle.categoryName}</span>
          <h3 class="news-card-hero__title">
            <a href="article.html?id=${largeArticle.id}">${largeArticle.title}</a>
          </h3>
          <div class="news-card-hero__date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${largeArticle.date}</span>
          </div>
        </div>
      </article>
    `;

    heroGridContainer.innerHTML = `
      <div class="hero-small-column">
        ${smallColHtml}
      </div>
      ${largeCardHtml}
    `;
  }

  // Setup Category blocks on Home Page: Football, Basketball, Volleyball, Other sports, Latest News
  setupCategoryBlockOnHome("latest", "Τελευταία Νέα", sportsNewsStore.getLatestNewsExceptHero(3));
  setupCategoryBlockOnHome("football", "Ποδόσφαιρο", sportsNewsStore.getByCategory("football").slice(0, 3));
  setupCategoryBlockOnHome("basketball", "Μπάσκετ", sportsNewsStore.getByCategory("basketball").slice(0, 3));
  setupCategoryBlockOnHome("volleyball", "Βόλεϊ", sportsNewsStore.getByCategory("volleyball").slice(0, 3));
  setupCategoryBlockOnHome("othersports", "Άλλα Αθλήματα", sportsNewsStore.getByCategory("othersports").slice(0, 3));
}

// Setup a single Category Block on the Homepage
function setupCategoryBlockOnHome(catKey, catTitle, articles) {
  const container = document.getElementById(`cat-block-${catKey}`);
  if (!container) return;

  if (articles.length === 0) {
    container.style.display = "none";
    return;
  }

  let cardsHtml = "";
  articles.forEach(art => {
    cardsHtml += createNewsCard(art);
  });

  const loadMoreUrl = catKey === "latest" ? "category.html?c=all" : `category.html?c=${catKey}`;

  container.innerHTML = `
    <div class="category-header">
      <span class="category-badge">${catTitle}</span>
      <div class="category-line"></div>
    </div>
    <div class="news-grid" id="grid-${catKey}">
      ${cardsHtml}
    </div>
    <div class="load-more-container">
      <button class="btn-load-more" onclick="handleLoadMoreClick('${catKey}', '${loadMoreUrl}')">
        Φόρτωση περισσότερων
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 13l-7 7-7-7m14-6l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </button>
    </div>
  `;
}

// Handles the load more button on homepage
// It will load the next batch of articles (if any exist in database) or navigate to Category page
function handleLoadMoreClick(category, redirectUrl) {
  const grid = document.getElementById(`grid-${category}`);
  if (!grid) return;

  // Let's check how many articles are currently shown
  const currentCount = grid.children.length;

  let allArticles = [];
  if (category === "latest") {
    allArticles = sportsNewsStore.getLatestNewsExceptHero(20);
  } else {
    allArticles = sportsNewsStore.getByCategory(category);
  }

  // Get the next 3 articles
  const nextArticles = allArticles.slice(currentCount, currentCount + 3);

  if (nextArticles.length > 0) {
    nextArticles.forEach(art => {
      const cardHtml = createNewsCard(art);
      grid.insertAdjacentHTML("beforeend", cardHtml);
    });

    // If we've reached the end of the available mock data, hide the load more button
    if (grid.children.length >= allArticles.length) {
      const parent = grid.parentElement;
      const loadBtnContainer = parent.querySelector(".load-more-container");
      if (loadBtnContainer) {
        loadBtnContainer.innerHTML = `<p style="text-align:center; color:var(--color-text-light); font-size:0.9rem;">Δεν υπάρχουν άλλα άρθρα</p>`;
      }
    }
  } else {
    // Fallback if no more articles in local database: redirect to Category Archive
    window.location.href = redirectUrl;
  }
}

// Setup Category Page
function setupCategoryPage() {
  const catKey = getQueryParam("c") || "all";
  let page = parseInt(getQueryParam("page")) || 1;
  if (page < 1) page = 1;

  initHeader(catKey);
  initFooter();

  let categoryTitle = "";
  let articles = [];

  if (catKey === "all") {
    categoryTitle = "Όλα τα Νέα";
    articles = sportsNewsStore.getAll();
  } else if (catKey === "football") {
    categoryTitle = "Ποδόσφαιρο";
    articles = sportsNewsStore.getByCategory("football");
  } else if (catKey === "basketball") {
    categoryTitle = "Μπάσκετ";
    articles = sportsNewsStore.getByCategory("basketball");
  } else if (catKey === "volleyball") {
    categoryTitle = "Βόλεϊ";
    articles = sportsNewsStore.getByCategory("volleyball");
  } else if (catKey === "othersports") {
    categoryTitle = "Άλλα Αθλήματα";
    articles = sportsNewsStore.getByCategory("othersports");
  } else {
    // Invalid category, redirect to 404
    window.location.href = "404.html";
    return;
  }

  // Setup Title
  const titleEl = document.getElementById("cat-page-title");
  if (titleEl) titleEl.textContent = categoryTitle;

  // Setup Breadcrumbs
  const breadcrumbsEl = document.getElementById("breadcrumbs-placeholder");
  if (breadcrumbsEl) {
    breadcrumbsEl.innerHTML = `
      <a href="index.html">Αρχική</a>
      <span class="breadcrumbs-separator">&gt;</span>
      <span class="breadcrumbs-current">${categoryTitle}</span>
    `;
  }

  // Paginate: 6 articles per page
  const itemsPerPage = 6;
  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / itemsPerPage) || 1;
  
  if (page > totalPages) page = totalPages;

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const gridEl = document.getElementById("category-news-grid");
  if (gridEl) {
    if (paginatedArticles.length === 0) {
      gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 3rem 0; color: var(--color-text-muted);">Δεν βρέθηκαν άρθρα σε αυτή την κατηγορία.</p>`;
    } else {
      let cardsHtml = "";
      paginatedArticles.forEach(art => {
        cardsHtml += createNewsCard(art);
      });
      gridEl.innerHTML = cardsHtml;
    }
  }

  // Setup Pagination Links (Left-aligned)
  const paginationContainer = document.getElementById("pagination-placeholder");
  if (paginationContainer) {
    paginationContainer.innerHTML = generatePaginationHTML(page, totalPages, catKey);
  }
}

// Setup Single Article Page
function setupArticlePage() {
  const articleId = getQueryParam("id");
  if (!articleId) {
    window.location.href = "404.html";
    return;
  }

  const article = sportsNewsStore.getById(articleId);
  if (!article) {
    window.location.href = "404.html";
    return;
  }

  initHeader(article.category);
  initFooter();

  // 1. Breadcrumbs
  const breadcrumbsEl = document.getElementById("breadcrumbs-placeholder");
  if (breadcrumbsEl) {
    breadcrumbsEl.innerHTML = `
      <a href="index.html">Αρχική</a>
      <span class="breadcrumbs-separator">&gt;</span>
      <a href="category.html?c=${article.category}">${article.categoryName}</a>
      <span class="breadcrumbs-separator">&gt;</span>
      <span class="breadcrumbs-current">${article.title}</span>
    `;
  }

  // 2. Hashtags
  const hashtagsEl = document.getElementById("article-tags");
  if (hashtagsEl) {
    let tagsHtml = "";
    article.tags.forEach(tag => {
      tagsHtml += `<a href="#" class="article-tag">${tag}</a>`;
    });
    hashtagsEl.innerHTML = tagsHtml;
  }

  // 3. Titles, Date, Image, Content
  const titleEl = document.getElementById("article-title");
  if (titleEl) titleEl.textContent = article.title;

  const dateEl = document.getElementById("article-date");
  if (dateEl) {
    dateEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      <span>Δημοσιεύθηκε: ${article.date}</span>
    `;
  }

  const imageEl = document.getElementById("article-image");
  if (imageEl) {
    imageEl.innerHTML = `<img src="${article.image}" alt="${article.title}">`;
  }

  const contentEl = document.getElementById("article-content");
  if (contentEl) {
    contentEl.innerHTML = article.content;
  }

  // 4. Social Sharing Bars (Top and Bottom)
  const shareBarTop = document.getElementById("share-bar-top");
  const currentUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.title);

  if (shareBarTop) {
    shareBarTop.innerHTML = `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank" class="share-btn share-btn--fb" title="Μοιραστείτε στο Facebook">${SOCIAL_ICONS.facebook}</a>
      <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}" target="_blank" class="share-btn share-btn--tw" title="Μοιραστείτε στο Twitter">${SOCIAL_ICONS.twitter}</a>
    `;
  }

  const shareBarBottom = document.getElementById("share-bar-bottom");
  if (shareBarBottom) {
    shareBarBottom.innerHTML = `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank" class="share-btn-large share-btn--fb">
        ${SOCIAL_ICONS.facebook} Facebook
      </a>
      <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}" target="_blank" class="share-btn-large share-btn--tw">
        ${SOCIAL_ICONS.twitter} Twitter
      </a>
      <a href="https://pinterest.com/pin/create/button/?url=${currentUrl}&media=${encodeURIComponent(article.image)}&description=${shareTitle}" target="_blank" class="share-btn-large share-btn--pin">
        ${SOCIAL_ICONS.pinterest} Pinterest
      </a>
      <a href="https://plus.google.com/share?url=${currentUrl}" target="_blank" class="share-btn-large share-btn--google">
        ${SOCIAL_ICONS.google} Google
      </a>
    `;
  }

  // 5. Sidebar Popular Posts Widget
  const sidebarGrid = document.getElementById("popular-posts-widget");
  if (sidebarGrid) {
    // Show 4 popular posts (just other articles from data)
    const popular = sportsNewsStore.getAll().filter(item => item.id !== article.id).slice(0, 4);
    let popularHtml = "";
    popular.forEach(pop => {
      popularHtml += `
        <div class="popular-post-item">
          <div class="popular-post-img">
            <a href="article.html?id=${pop.id}"><img src="${pop.image}" alt="${pop.title}"></a>
          </div>
          <div class="popular-post-info">
            <a href="article.html?id=${pop.id}" class="popular-post-title">${pop.title}</a>
            <span class="popular-post-date">${pop.date}</span>
          </div>
        </div>
      `;
    });
    sidebarGrid.innerHTML = popularHtml;
  }

  // 6. Related Articles (3-column grid)
  const relatedContainer = document.getElementById("related-articles-grid");
  if (relatedContainer) {
    const related = sportsNewsStore.getRelated(article.id, article.category, 3);
    if (related.length === 0) {
      // If no related articles in same category, show latest
      const fallbackRelated = sportsNewsStore.getAll().filter(item => item.id !== article.id).slice(0, 3);
      let relatedHtml = "";
      fallbackRelated.forEach(rel => {
        relatedHtml += createNewsCard(rel);
      });
      relatedContainer.innerHTML = relatedHtml;
    } else {
      let relatedHtml = "";
      related.forEach(rel => {
        relatedHtml += createNewsCard(rel);
      });
      relatedContainer.innerHTML = relatedHtml;
    }
  }
}

// Setup 404 Page
function setup404Page() {
  initHeader();
  initFooter();
}
