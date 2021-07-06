// JavaScript Document
const agregarCarrito = document.querySelectorAll(".agregar");
agregarCarrito.forEach((cargarBoton) => {
  cargarBoton.addEventListener("click", comprarBoton);
});

const shoppingCartItemsContainer = document.querySelector(
  ".shoppingCartItemsContainer"
);

function comprarBoton(event) {
  let itemsDelCarrito = JSON.parse(localStorage.getItem("itemsDelCarrito"));
  let existeElemento = false;

  const boton = event.target;
  const item = boton.closest(".item");

  const itemId = item.querySelector("span.item-id").textContent;
  const itemTitulo = item.querySelector(".item-titulo").textContent;
  const itemPrecio = item.querySelector(".item-precio > span").textContent;
  const itemImg = item.querySelector(".item-img-carrito").src;

  // Datos del articulo que el usuario desea comprar
  let itemDelCarrito = {
    id: itemId,
    nombre: itemTitulo,
    precio: itemPrecio,
    imagen: itemImg,
    cantidad: 1,
  };

  // Haciendo la misma comprobacion, pero con .filter()
  let nuevoArreglo, otrosArticulos, alLocalStorage;
  if (itemsDelCarrito.length > 0) {
    nuevoArreglo = itemsDelCarrito.filter(
      (item) => item.id === itemDelCarrito.id
    );

    otrosArticulos = itemsDelCarrito.filter(
      (item) => item.id !== itemDelCarrito.id
    );

    if (nuevoArreglo[0]) {
      nuevoArreglo[0].cantidad = nuevoArreglo[0].cantidad + 1;
      // let arreglo = ["Jacinto", "Acosta", "Gonzalez"]; arreglo.length (resultado = 3)
      // ...arreglo = "Jacinto", "Acosta", "Gonzalez";
      alLocalStorage = [...nuevoArreglo, ...otrosArticulos];
    } else {
      alLocalStorage = [itemDelCarrito, ...otrosArticulos];
    }

    console.log("Arreglo que vamos a guardar en el localStorage");
    console.log(alLocalStorage);
    // Usamos el metodo JSON.stringify() para convertir todos los valores del arreglo
    // en strings.
    localStorage.setItem("itemsDelCarrito", JSON.stringify(alLocalStorage));
  } else {
    alLocalStorage = [itemDelCarrito];
    localStorage.setItem("itemsDelCarrito", JSON.stringify(alLocalStorage));
  }

  calculateCartItems();
  itemTienda(itemTitulo, itemPrecio, itemImg);
}

function itemTienda(itemTitulo, itemPrecio, itemImg) {
  const shoppingCartRow = document.createElement("div");
  const shoppingCartContent = `
 <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImg} width=50 class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitulo}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrecio}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
  shoppingCartRow.innerHTML = shoppingCartContent;
  shoppingCartItemsContainer.append(shoppingCartRow);
}

/**  Carga taoda la informacion del localStorage en variables para manipularla luego.*/
const prepareCartData = () => {
  const cartData = JSON.parse(localStorage.getItem("itemsDelCarrito"));
  const formulario = document.querySelector(".formulario");

  if (cartData.length > 0) {
    cartData.forEach((cartItem) => {
      const itemDiv = createCartItem(cartItem);
      formulario.append(itemDiv);
    });
  } else {
    let infoP = document.createElement("p");
    infoP.setAttribute("class", "info-p");

    infoP.innerHTML = `No tiene productos en su carrito actualmente`;
    formulario.append(infoP);
  }

  calculateTotalAmount(cartData);
  calculateCartItems();
};

const createCartItem = (data) => {
  let wrapperDiv = document.createElement("div");
  wrapperDiv.setAttribute("class", "cart-item");

  const cartItemHTML = `
    <div class="articulos">
      <img src="${data.imagen}" alt="${data.nombre}" class="product-img">
    </div>
      <div class="articulos">
        <p>${data.nombre}</p>
      </div>
    <div class="articulos">
      <p>${data.cantidad}</p>
    </div>
    <div class="articulos">
      <p>${data.precio}</p>
    </div>
  `;

  // Creamos el boton de eliminar producto
  let deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "btn-delete");
  deleteBtn.addEventListener("click", function (e) {
    deleteItem(e, data.id);
  });

  let iconSpan = document.createElement("span");
  let icon = document.createElement("i");
  icon.setAttribute("class", "fas fa-trash");

  iconSpan.append(icon);
  deleteBtn.append(iconSpan);

  // Añadimos todos los elementos creados al contenedor
  wrapperDiv.innerHTML = cartItemHTML;
  wrapperDiv.append(deleteBtn);

  return wrapperDiv;
};

const deleteItem = (event, itemId) => {
  const formulario = document.querySelector(".formulario");
  const totalAmountP = document.querySelector(".total > p");
  totalAmountP.remove();
  // Borramos el div que contiene el boton presionado
  event.target.parentElement.remove();

  const cartItems = JSON.parse(localStorage.getItem("itemsDelCarrito"));
  const newCartItems = cartItems.filter((item) => item.id !== itemId);

  localStorage.setItem("itemsDelCarrito", JSON.stringify(newCartItems));
  calculateTotalAmount(newCartItems);

  if (newCartItems.length === 0) {
    let infoP = document.createElement("p");
    infoP.setAttribute("class", "info-p");

    infoP.innerHTML = `No tiene productos en su carrito actualmente`;
    formulario.append(infoP);
  }
};

const calculateTotalAmount = (itemsData) => {
  let totalAmount = 0;
  const totalDiv = document.querySelector(".total");
  let totalP = document.createElement("p");

  itemsData.forEach((item) => {
    totalAmount = totalAmount + parseFloat(item.precio * item.cantidad);
  });
  totalP.innerHTML = `TOTAL: ${totalAmount.toFixed(3)}`;

  totalDiv.append(totalP);
};

calculateCartItems = () => {
  let totalCartItems = 0;
  const cartItems = JSON.parse(localStorage.getItem("itemsDelCarrito"));
  const itemsBadge = document.querySelector(".cart-badge");

  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      totalCartItems += parseInt(item.cantidad);
    });

    itemsBadge.classList.add("show-badge");
    itemsBadge.innerHTML = totalCartItems;
  } else {
    itemsBadge.classList.remove("show-badge");
  }
};
