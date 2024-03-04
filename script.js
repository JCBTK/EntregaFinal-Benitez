let loggedIn = false;
let products = [];
let cart = [];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "usuario" && password === "contraseña") {
        loggedIn = true;
        document.getElementById("login").style.display = "none";
        document.getElementById("store").style.display = "block";
        document.getElementById("cart").style.display = "block";
    } else {
        alert("Credenciales incorrectas");
    }
}

function addProduct() {
    if (!loggedIn) {
        alert("Debes iniciar sesión primero");
        return;
    }
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productSize = document.getElementById("productSize").value;
    const productDescription = document.getElementById("productDescription").value;
    const productQuantity = document.getElementById("productQuantity").value;
    products.push({
        name: productName,
        price: productPrice,
        size: productSize,
        description: productDescription,
        quantity: productQuantity,
    });
    displayProducts();
}

function displayProducts() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const productName = document.createElement("h3");
        productName.textContent = product.name;
        card.appendChild(productName);
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
        card.appendChild(productDescription);
        const price = document.createElement("span");
        price.classList.add("price");
        price.textContent = "$" + product.price;
        card.appendChild(price);
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.placeholder = "Cantidad";
        quantityInput.value = product.quantity || 1; 
        card.appendChild(quantityInput);
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Agregar al carrito";
        addToCartButton.onclick = () => addToCart(index, parseInt(quantityInput.value));
        card.appendChild(addToCartButton);
        productList.appendChild(card);
    });
}

function addToCart(index, quantity) {
    const productToAdd = { ...products[index], quantity };
    cart.push(productToAdd);
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    cart.forEach((product, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        const productName = document.createElement("h4");
        productName.textContent = product.name;
        cartItem.appendChild(productName);
        const productPrice = document.createElement("span");
        productPrice.textContent = "$" + product.price;
        cartItem.appendChild(productPrice);
        const productQuantity = document.createElement("span");
        productQuantity.textContent = "Cantidad: " + product.quantity;
        cartItem.appendChild(productQuantity);
        cartItems.appendChild(cartItem);
    });
}

function generateFactura() {
    const invoice = document.createElement("div");
    invoice.classList.add("invoice");
    const title = document.createElement("h2");
    title.textContent = "Factura de Compra";
    invoice.appendChild(title);
    let totalPrice = 0;
    cart.forEach((product, index) => {
        const item = document.createElement("div");
        item.classList.add("invoice-item");
        const productName = document.createElement("span");
        productName.textContent = product.name;
        item.appendChild(productName);
        const productPrice = document.createElement("span");
        productPrice.textContent = "Precio: $" + product.price;
        item.appendChild(productPrice);
        const productQuantity = document.createElement("span");
        productQuantity.textContent = "Cantidad: " + product.quantity;
        item.appendChild(productQuantity);
        const itemTotal = parseFloat(product.price) * parseInt(product.quantity);
        totalPrice += itemTotal;
        const itemTotalElement = document.createElement("span");
        itemTotalElement.textContent = "Total: $" + itemTotal.toFixed(2);
        item.appendChild(itemTotalElement);
        invoice.appendChild(item);
    });
    const total = document.createElement("div");
    total.classList.add("invoice-total");
    total.textContent = "Total a pagar: $" + totalPrice.toFixed(2);
    invoice.appendChild(total);
    document.body.appendChild(invoice);
}

