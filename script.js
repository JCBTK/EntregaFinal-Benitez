let loggedIn = false;
let products = [];
let cart = [];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "usuario" && password === "contraseña") {
        loggedIn = true;
        document.getElementById("login").style.display = "none";
        document.getElementById("store").style.display = "flex";
        
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
    document.getElementById("cart").style.display = "block";
    document.getElementById("searchProduct").style.display = "flex";
}

function editProduct(index) {
    const productName = prompt("Nuevo nombre del producto:");
    const productPrice = prompt("Nuevo precio:");
    const productSize = prompt("Nuevo tamaño:");
    const productDescription = prompt("Nueva descripción:");
    const productQuantity = prompt("Nueva cantidad:");
    products[index] = {
        name: productName,
        price: productPrice,
        size: productSize,
        description: productDescription,
        quantity: productQuantity,
    };
    displayProducts();
}

function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
}

function addToCart(index, quantity) {
    const productToAdd = { ...products[index], quantity };
    cart.push(productToAdd);
    displayCart();
    document.getElementById("botonFactura").style.display = "block";
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
        const deleteFromCartButton = document.createElement("button");
        deleteFromCartButton.textContent = "Eliminar del carrito";
        deleteFromCartButton.onclick = () => removeFromCart(index);
        cartItem.appendChild(deleteFromCartButton);
        cartItems.appendChild(cartItem);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
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

function searchProducts() {
    const searchInput = document.getElementById("searchProduct").value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));
    displayProducts(filteredProducts);
}

function displayProducts(productsArray = products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    productsArray.forEach((product, index) => {    
        const card = document.createElement("div");
        card.classList.add("card");
        const productName = document.createElement("h3");
        productName.textContent = product.name;
        card.appendChild(productName);
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
        card.appendChild(productDescription);
        const productPrice = document.createElement("span");
        productPrice.textContent = "$" + product.price;
        card.appendChild(productPrice);
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
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = () => editProduct(index);
        card.appendChild(editButton);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteProduct(index);
        card.appendChild(deleteButton);
    });
}
