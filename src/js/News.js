export default class News {
  constructor(element) {
    this.parentElement = element;
    this.buttonReload = this.parentElement.querySelector(".news_reload");
    this.newsListElement = this.parentElement.querySelector(".news_list");
    this.url = "https://ahj-workers-backend-x5ki.onrender.com/";
  }

  init() {
    this.requestNews();
    this.buttonReload.addEventListener("click", () => this.requestNews());
  }

  requestNews() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${this.url}news/`);
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const newsList = [];
        for (const news of JSON.parse(xhr.response)) {
          newsList.push(this.addNews(news));
        }
        this.reloadNews(newsList);
      } else {
        this.disconnect();
      }
    });
    xhr.addEventListener("error", () => this.disconnect());
    this.preloader();
    xhr.send();
  }

  addNews(data) {
    const newsElement = document.createElement("li");
    newsElement.classList.add("news_item");
    const dateElement = document.createElement("div");
    dateElement.classList.add("news_date");
    const dateFormat = new Date(data.received);
    dateElement.innerText = dateFormat.toLocaleDateString("ru-RU");
    const contentElement = document.createElement("div");
    contentElement.classList.add("news_content");
    const imageContainerElement = document.createElement("div");
    imageContainerElement.classList.add("news_image");
    const imageElement = document.createElement("img");
    imageElement.src = data.image;
    const textElement = document.createElement("div");
    textElement.classList.add("news_text");
    textElement.innerText = data.body;
    imageContainerElement.append(imageElement);
    contentElement.append(imageContainerElement, textElement);
    newsElement.append(dateElement, contentElement);
    return newsElement;
  }

  reloadNews(newsList) {
    this.newsListElement.innerHTML = "";
    newsList.forEach((news) => this.newsListElement.append(news));
  }

  preloader() {
    this.newsListElement.innerHTML = "";
    const newsElement = document.createElement("li");
    newsElement.classList.add("news_item");
    newsElement.innerHTML = `
      <div class="news_preloader_date"></div>
      <div class="news_content">
        <div class="news_preloader_image"></div>
        <div class="news_preloader_container">
          <div class="news_preloader_text"></div>
          <div class="news_preloader_text"></div>
          <div class="news_preloader_text"></div>
        </div>
      </div>`;

    for (let i = 0; i < 5; i += 1) {
      const preloaderElement = newsElement.cloneNode(true);
      this.newsListElement.append(preloaderElement);
    }
  }

  disconnect() {
    const disconnectElement = document.createElement("div");
    disconnectElement.classList.add("news_disconnect");
    disconnectElement.innerHTML =
      "Не удалось загрузить данные<br>Проверьте подключение и обновите страницу";
    this.parentElement.append(disconnectElement);
  }
}
