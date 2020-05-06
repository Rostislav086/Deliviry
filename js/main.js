"use strict";

// Получаем элементы ==========================================================

const modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  cartButton = document.querySelector("#cart-button"),
  buttonAuth = document.querySelector(".button-auth"),
  modalAuth = document.querySelector(".modal-auth"),
  buttonCloseAuth = document.querySelector(".close-auth"),
  logInForm = document.querySelector("#logInForm"),
  logInInput = document.querySelector("#login"),
  passwordInput = document.querySelector("#password"),
  userName = document.querySelector(".user-name"),
  buttonOut = document.querySelector(".button-out"),
  cardsRestaurants = document.querySelector(".cards-restaurants"),
  containerPromo = document.querySelector(".container-promo"),
  restaurants = document.querySelector(".restaurants"),
  menu = document.querySelector(".menu"),
  logo = document.querySelector(".logo"),
  cardsMenu = document.querySelector(".cards-menu");

// Объявляем переменные =======================================================

let login = localStorage.getItem("Delivery");

// Функции ====================================================================

const toggleModal = () => {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = () => {
  modalAuth.classList.toggle("is-open");
  logInInput.style.border = "";
  passwordInput.style.border = "";
};

const checkAuth = () => {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
};

const authorized = () => {
  console.log("Авторизован");

  const logOut = () => {
    login = null;
    localStorage.removeItem("Delivery");

    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";

    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  };

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
};

const notAuthorized = () => {
  console.log("Не авторизован");

  const logIn = (event) => {
    event.preventDefault();
    login = logInInput.value;

    localStorage.setItem("Delivery", login);

    if (login) {
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      buttonCloseAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      logInInput.style.border = "1px solid red";
      passwordInput.style.border = "1px solid red";
    }
  };

  buttonAuth.addEventListener("click", toggleModalAuth);
  buttonCloseAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
};

const createCardGoods = () => {
  const cardHTML = `
     <div class="card">
      <img
      src="img/pizza-plus/pizza-classic.jpg"
      alt="image"
      class="card-image"
      />
      <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина,
          салями, грибы.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
   </div>
  `;

  cardsMenu.insertAdjacentHTML("afterbegin", cardHTML);
};

const openGoods = (event) => {
  const target = event.target;

  const restaurant = target.closest(".cards-restaurants");

  if (restaurant) {
    if (login) {
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      cardsMenu.textContent = "";

      createCardGoods();
      createCardGoods();
      createCardGoods();
    } else {
      toggleModalAuth();
    }
  }
};

const closeGoods = (event) => {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
};

const createCardRestaurants = () => {
  const card = `
      <a href='#' class="card card-restaurant">
        <img
          src="img/pizza-burger/preview.jpg"
          alt="image"
          class="card-image"
        />
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">PizzaBurger</h3>
            <span class="card-tag tag">45 мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">От 700 ₽</div>
            <div class="category">Пицца</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
};

// Вызов функций ==============================================================

checkAuth();

createCardRestaurants();
createCardRestaurants();
createCardRestaurants();

// Обработчики событий ========================================================

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener("click", openGoods);

logo.addEventListener("click", closeGoods);
