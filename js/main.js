const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day 1 -----------------------------------------------------------------------

const buttonAuth = document.querySelector(".button-auth"),
  modalAuth = document.querySelector(".modal-auth"),
  buttonCloseAuth = document.querySelector(".close-auth"),
  logInForm = document.querySelector("#logInForm"),
  logInInput = document.querySelector("#login"),
  passwordInput = document.querySelector("#password"),
  userName = document.querySelector(".user-name"),
  buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("Delivery");

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

checkAuth();
