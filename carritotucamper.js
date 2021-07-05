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
  // let nuevoArreglo, nuevaCantidad, otrosArticulos, alLocalStorage;
  // if (itemsDelCarrito) {
  //   nuevoArreglo = itemsDelCarrito.filter(
  //     (item) => item.id === itemDelCarrito.id
  //   );

  //   if (nuevoArreglo[0]) {
  //     nuevoArreglo[0].cantidad = nuevoArreglo[0].cantidad + 1;
  //   }

  //   otrosArticulos = itemsDelCarrito.filter(
  //     (item) => item.id !== itemDelCarrito.id
  //   );

  //   // let arreglo = ["Jacinto", "Acosta", "Gonzalez"]; arreglo.length (resultado = 3)
  //   // ...arreglo = "Jacinto", "Acosta", "Gonzalez";
  //   alLocalStorage = [...nuevoArreglo, ...otrosArticulos];

  //   console.log("Arreglo que vamos a guardar en el localStorage");
  //   console.log(alLocalStorage);
  // }

  // Compruebo si el articulo se guardo previamente, y de ser asi, actualizo la
  // la cantidad de articulos.
  if (itemsDelCarrito) {
    itemsDelCarrito.forEach((item) => {
      if (item.id === itemDelCarrito.id) {
        existeElemento = true;

        // Actualizamos la cantidad de articulos en funcion a los encontrados en el
        // array.
        let cantidadAnterior = parseInt(item.cantidad);
        let nuevaCantidad = cantidadAnterior + 1;
        item.cantidad = nuevaCantidad;
      }
    });
  }

  if (!existeElemento) {
    if (itemsDelCarrito === null) {
      itemsDelCarrito = [];
      itemsDelCarrito.push(itemDelCarrito);
    } else {
      itemsDelCarrito.push(itemDelCarrito);
    }
  }
  console.log("Items almacenados hasta ahora:");
  console.log(itemsDelCarrito);

  // Usamos el metodo JSON.stringify() para convertir todos los valores del arreglo
  // en strings.
  localStorage.setItem("itemsDelCarrito", JSON.stringify(itemsDelCarrito));

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

/**
 * Cargamos los elementos del carrito que tenemos almacenados en el localStorage
 */
const prepareCartValues = () => {
  const formDiv = document.querySelector(".formulario");
  console.log(formDiv);

  // Creamos el elemento que contiene la informacion del carrito
  const cartData = JSON.parse(localStorage.getItem("itemsDelCarrito"));
  console.log(cartData);

  cartData.forEach((cartItem) => {
    const itemDiv = createCartItem(cartItem);
    formDiv.append(itemDiv);
  });

  addCartTotal();
};

const createCartItem = (data) => {
  let itemDiv = document.createElement("div");
  itemDiv.setAttribute("class", "cart-item");

  // Div con informacion del articulo
  let articleDiv = document.createElement("div");
  articleDiv.setAttribute("class", "articulos");

  let p = document.createElement("p");
  p.innerHTML = `${data.nombre}`;

  articleDiv.append(p);

  // Div con informacion de la cantidad de articulos
  let amountDiv = document.createElement("div");
  amountDiv.setAttribute("class", "articulos");

  let p2 = document.createElement("p");
  p2.innerHTML = `${data.cantidad}`;

  amountDiv.append(p2);

  // Div con informacion del precio de los articulos
  let priceDiv = document.createElement("div");
  priceDiv.setAttribute("class", "articulos");

  let p3 = document.createElement("p");
  p3.innerHTML = `${data.precio}`;

  priceDiv.append(p3);

  // Boton para eliminar articulos
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "btn-delete");
  deleteButton.addEventListener("click", function () {
    deleteCartItem(data.id);
  });

  let iconSpan = document.createElement("span");
  let icon = document.createElement("i");
  icon.setAttribute("class", "fas fa-trash");

  iconSpan.append(icon);
  deleteButton.append(iconSpan);

  // Añadimos todos los elementos al div correspondiente
  itemDiv.append(articleDiv);
  itemDiv.append(amountDiv);
  itemDiv.append(priceDiv);
  itemDiv.append(deleteButton);

  return itemDiv;
};

const deleteCartItem = (itemId) => {
  console.log(itemId);
};

const addCartTotal = () => {
  let totalPrice = 0;
  const cartData = JSON.parse(localStorage.getItem("itemsDelCarrito"));

  cartData.forEach((item) => {
    totalPrice = totalPrice + parseFloat(item.precio * item.cantidad);
  });

  const totalDiv = document.querySelector(".total");
  console.log(totalDiv);
  let p = document.createElement("p");
  p.innerHTML = `TOTAL: ${totalPrice.toFixed(3)}`;
  totalDiv.append(p);
};
