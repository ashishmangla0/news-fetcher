const apiKey = "15755ba8036b47a08aad54985e7666a1";
const main = document.querySelector("main");
const sourceSelector = document.querySelector("#sourceSelector");
const defaultSource = "the-washington-post";

// register service worker on window load
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => console.log("Service Worker registered"))
      .catch((err) => "SW registration failed")
  );
}

window.addEventListener("load", (e) => {
  // show news from selected source
  sourceSelector.addEventListener("change", (evt) => updateNews(evt.target.value));

  // initially show news from default source
  populateSources().then(() => {
    sourceSelector.value = defaultSource;
    updateNews();
  });
});

// only update news when online
window.addEventListener("online", () => updateNews(sourceSelector.value));

// fetch the news from selected source
const updateNews = async (source = defaultSource) => {
  const res = await fetch(
    `http://newsapi.org/v2/everything?sources=${source}&apiKey=${apiKey}`
  );
  const json = await res.json();

  main.innerHTML = json.articles.map(createArticle).join("\n");
};

// add sources to the drop-down menu
const populateSources = async () => {
  const res = await fetch(`
    https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await res.json();

  sourceSelector.innerHTML = json.sources
    .map((src) => `<option value="${src.id}">${src.name}</option>`)
    .join("\n");
};

// create basic container for the article
const createArticle = (article) => {
  return `
    <div class="article">
        <a href="${article.url}">
            <h2>${article.title}</h2>
            <img src="${article.urlToImage}" alt="News Image">
            <p>${article.description}</p>
        </a>
    </div>
    `;
};
