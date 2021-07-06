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

/**  Carga taoda la informacion del localStorage en variables para manipularla luego.*/
const prepareCartData = () => {
  const cartData = JSON.parse(localStorage.getItem("itemsDelCarrito"));
  const formulario = document.querySelector(".formulario");

  if (cartData) {
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
};

const createCartItem = (data) => {
  let wrapperDiv = document.createElement("div");
  wrapperDiv.setAttribute("class", "cart-item");

  // Creamos el div que contiene la imagen del producto
  let imageDiv = document.createElement("div");
  imageDiv.setAttribute("class", "articulos");
  let productImage = document.createElement("img");
  productImage.setAttribute("src", `${data.imagen}`);
  productImage.setAttribute("alt", `${data.nombre}`);
  productImage.setAttribute("class", "product-img");

  imageDiv.append(productImage);

  // Creamos el div que contiene el nombre del producto
  let articleDiv = document.createElement("div");
  articleDiv.setAttribute("class", "articulos");
  let articleP = document.createElement("p");

  articleP.innerHTML = `${data.nombre}`;
  articleDiv.append(articleP);

  // Creamos el div que contiene la cantidad del producto
  let amountDiv = document.createElement("div");
  amountDiv.setAttribute("class", "articulos");
  let amountP = document.createElement("p");

  amountP.innerHTML = `${data.cantidad}`;
  amountDiv.append(amountP);

  // Creamos el div que contiene el precio del producto
  let priceDiv = document.createElement("div");
  priceDiv.setAttribute("class", "articulos");
  let priceP = document.createElement("p");

  priceP.innerHTML = `${data.precio}`;
  priceDiv.append(priceP);

  // Creamos el boton de eliminar producto
  let deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "btn-delete");
  deleteBtn.addEventListener("click", function () {
    deleteItem(data.id);
  });

  let iconSpan = document.createElement("span");
  let icon = document.createElement("i");
  icon.setAttribute("class", "fas fa-trash");

  iconSpan.append(icon);
  deleteBtn.append(iconSpan);

  // Añadimos todos los elementos creados al contenedor
  wrapperDiv.append(imageDiv);
  wrapperDiv.append(articleDiv);
  wrapperDiv.append(amountDiv);
  wrapperDiv.append(priceDiv);
  wrapperDiv.append(deleteBtn);

  return wrapperDiv;
};

const deleteItem = (itemId) => {
  console.log(itemId);
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
