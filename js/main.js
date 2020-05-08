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
  cardsMenu = document.querySelector(".cards-menu"),
  restaurantTitle = document.querySelector(".restaurant-title"),
  rating = document.querySelector(".rating"),
  minPrice = document.querySelector(".price"),
  category = document.querySelector(".category"),
  inputSearch = document.querySelector(".input-search"),
  modalBody = document.querySelector(".modal-body"),
  modalPricetag = document.querySelector(".modal-pricetag"),
  clearCart = document.querySelector(".clear-cart");

// Объявляем переменные =======================================================

let login = localStorage.getItem("Delivery");

const cart = [];
// Функции ====================================================================

const getData = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка запроса ${url}, статус ошибки ${response.status} `);
  }

  return await response.json();
};

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
    cartButton.style.display = "";

    buttonOut.removeEventListener("click", logOut);

    closeGoods();
    checkAuth();
  };

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";

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

const createCardRestaurants = (restaurant) => {
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery,
  } = restaurant;

  const card = `
      <a href='#' class="card card-restaurant" data-product="${products}" 
      data-info="${[name, price, stars, kitchen]}">
        <img
          src="${image}"
          alt="image"
          class="card-image"
        />
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery}</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
};

const createCardGoods = (goods) => {
  const { description, id, image, name, price } = goods;

  const cardHTML = `
     <div class="card" >
      <img
      src="${image}"
      alt="image"
      class="card-image"
      />
      <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price ">${price} ₽</strong>
      </div>
    </div>
   </div>
  `;

  cardsMenu.insertAdjacentHTML("afterbegin", cardHTML);
};

const openGoods = (event) => {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card-restaurant");

    if (restaurant) {
      const info = restaurant.dataset.info.split(",");

      const [name, price, stars, kitchen] = info;

      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} р`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.dataset.product}`).then((data) => {
        data.forEach(createCardGoods);
      });

      cardsMenu.textContent = "";
    }
  } else {
    toggleModalAuth();
  }
};

const closeGoods = (event) => {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
};

const searchKeyDown = (event) => {
  if (event.keyCode === 13) {
    const target = event.target;

    const value = target.value.toLowerCase().trim();

    target.value = "";

    if (!value) {
      target.style.background = "tomato";
      setTimeout(() => {
        target.style.background = "";
      }, 2000);
      return;
    }

    const goods = [];

    getData("./db/partners.json").then((data) => {
      const products = data.map((item) => {
        return item.products;
      });

      products.forEach((product) => {
        getData(`./db/${product}`)
          .then((data) => {
            goods.push(...data);

            const searchGoods = goods.filter((item) => {
              return item.name.toLowerCase().includes(value);
            });

            cardsMenu.textContent = "";
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            restaurantTitle.textContent = `Результат поиска`;
            rating.textContent = "";
            minPrice.textContent = ``;
            category.textContent = ``;

            return searchGoods;
          })
          .then((data) => {
            data.forEach(createCardGoods);
          });
      });
    });
  }
};

const addToCart = (event) => {
  const target = event.target;
  const buttonAddToCart = target.closest(".button-add-cart");

  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;

    const food = cart.find((item) => {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        cost,
        title,
        count: 1,
      });
    }
  }
};

const renderCart = () => {
  modalBody.textContent = "";

  cart.forEach((item) => {
    const { id, title, cost, count } = item;

    const itemCard = `
			<div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${cost}</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id=${id}>-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id=${id}>+</button>
				</div>
			</div>
	  `;
    modalBody.insertAdjacentHTML("afterbegin", itemCard);
  });

  const totalPrice = cart.reduce((result, item) => {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPricetag.textContent = totalPrice + " P";
};

const changeCount = (event) => {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains("counter-plus")) food.count++;
    renderCart();
  }
};

const init = () => {
  getData("./db/partners.json").then((data) => {
    data.forEach(createCardRestaurants);
  });

  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener("click", closeGoods);

  inputSearch.addEventListener("keydown", searchKeyDown);

  cardsMenu.addEventListener("click", addToCart);

  modalBody.addEventListener("click", changeCount);

  clearCart.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
  });

  checkAuth();
};

// Вызов функций ==============================================================

init();

// Обработчики событий ========================================================
