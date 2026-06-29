// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready(); // Сообщаем TG, что приложение загрузилось
tg.expand(); // Расширяем приложение на весь экран

// Если приложение запущено внутри TG, добавляем класс для стилей
if (tg.initData) {
  document.body.classList.add("tg");
}

const API_KEY = "7f81564ebd4fe2264dd9cb9462d69795"; // Сюда нужно вставить ключ

// Элементы UI
const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

// Навешиваем клики на все кнопки городов
document.querySelectorAll(".btn-city").forEach((button) => {
  button.addEventListener("click", () => {
    const city = button.getAttribute("data-city");
    const cityRu = button.textContent;
    getWeather(city, cityRu);
  });
});

async function getWeather(city, cityRu) {
  // Включаем легкую тактильную отдачу (вибрацию) при нажатии, если мы в TG
  if (tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred("light");
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`,
    );

    if (!response.ok) throw new Error("Ошибка сети");

    const data = await response.json();

    // Заполняем данные в карточку
    cityNameEl.textContent = cityRu;
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    descEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${data.wind.speed} м/с`;

    // Показываем карточку с плавной анимацией
    weatherCard.classList.remove("hidden");
  } catch (error) {
    console.error("Ошибка получения погоды:", error);
    alert("Не удалось загрузить погоду. Проверьте API ключ.");
  }
}
