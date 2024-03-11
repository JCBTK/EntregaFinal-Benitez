let loggedIn = false;
let products = [];
let cart = [];
let users = [];

//funcion iniciar sesion
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        loggedIn = true;
        document.getElementById("login").style.display = "none";
        document.getElementById("store").style.display = "flex";
    } else {
        alert("Credenciales incorrectas");
    }
}

//funcion de salir de sesion
function logout() {
    loggedIn = false;
    document.getElementById("login").style.display = "flex";
    document.getElementById("store").style.display = "none";
}

//funcion registrarse
function register() {
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    const existingUser = users.find(user => user.username === newUsername);
    if (existingUser) {
        alert("El usuario ya está registrado");
        return;
    }
    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById("newUsername").value = "";
    document.getElementById("newPassword").value = "";
    alert("Registro exitoso, por favor inicia sesión.");
}

//toggle de visivilidad registro de usuario
function showRegisterForm() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "flex";
}

//toggle de visivilidad inicio de sesion
function showLoginForm() {
    document.getElementById("login").style.display = "flex";
    document.getElementById("register").style.display = "none";
}

//funcion editar producto
function editProduct(index) {
    const productName = prompt("Nuevo nombre del producto:");
    const productPrice = prompt("Nuevo precio:");
    const productSize = prompt("Nuevo tamaño:");
    const productDescription = prompt("Nueva descripción:");
    const productStock = prompt("Nuevo stock:"); 
    products[index] = {
        name: productName,
        price: productPrice,
        size: productSize,
        description: productDescription,
        stock: productStock,
    };
    displayProducts();
}
//funcion eliminar producto
function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
}

// funcion agregar producto
function addProduct() {
    if (!loggedIn) {
        alert("Debes iniciar sesión primero");
        return;
    }
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productSize = document.getElementById("productSize").value;
    const productDescription = document.getElementById("productDescription").value;
    let productStock = document.getElementById("productStock").value;
    // verificar si el producto ya existe
    const existingProductIndex = products.findIndex(product => product.name === productName);
    if (existingProductIndex !== -1) {
        alert("Este producto ya existe en el catálogo.");
        return;
    }
    // crear un nuevo producto
    const newProduct = {
        name: productName,
        price: productPrice,
        size: productSize,
        description: productDescription,
        stock: productStock,
    };
    // agregar el nuevo producto al array de productos
    products.push(newProduct);
    // guardar el array de productos actualizado
    localStorage.setItem('products', JSON.stringify(products));
    // mostrar los productos
    displayProducts();
    document.getElementById("searchProduct").style.display = "flex";

}

function addToCart(index, quantity) {
    // Obtener el producto seleccionado
    const productToAdd = products[index];
    // verificar si la cantidad a agregar excede el stock disponible
    if (quantity > productToAdd.stock) {
        alert("No hay suficiente stock disponible");
        return;
    }
    // restar la cantidad del stock
    productToAdd.stock -= quantity;
    if (productToAdd.stock === 0) {
        alert("¡Producto agotado!");
    }
    const productInCartIndex = cart.findIndex(item => item.name === productToAdd.name);
    if (productInCartIndex !== -1) {
        cart[productInCartIndex].quantity += quantity;
    } else {
        cart.push({ ...productToAdd, quantity });
    }   
    displayCart();
    document.getElementById("botonFactura").style.display = "block";
    displayProducts();
    // actualizar el producto en el array de productos
    products[index] = productToAdd;
    // guardar el array de productos actualizado en localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

// funcion carrito
function displayCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        // oculta el carrito si esta vacio
        document.getElementById("cart").style.display = "none";
        // termina la funcion si el carrito esta vacio 
        return; 
    }
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
    // muestra el carrito si es que hay productos
    document.getElementById("cart").style.display = "flex"; 
}

// funcion sacar de carrito
function removeFromCart(index) {
    const removedProduct = cart[index];
    const productIndex = products.findIndex(product => product.name === removedProduct.name);
    if (productIndex !== -1) {
        products[productIndex].stock += removedProduct.quantity;
        localStorage.setItem('products', JSON.stringify(products));
    }
    cart.splice(index, 1);
    displayProducts();
    displayCart();
}

// funcion generar factura de compra
function generateFactura() {
    const invoice = document.createElement("div");
    invoice.classList.add("invoice");
    const title = document.createElement("h2");
    title.textContent = "Factura de Compra";
    invoice.appendChild(title);
    let totalPrice = 0;

    // boton para eliminar la factura
    const deleteInvoiceButton = document.createElement("button");
    deleteInvoiceButton.textContent = "Eliminar Factura";
    deleteInvoiceButton.onclick = function() {
        document.body.removeChild(invoice);
    };

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

        // Actualizar el stock del producto en el array 'products' y en el almacenamiento local
        const productIndex = products.findIndex(prod => prod.name === product.name);
        if (productIndex !== -1) {
            products[productIndex].stock -= product.quantity;
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
        }
    });

    const total = document.createElement("div");
    total.classList.add("invoice-total");
    total.textContent = "Total a pagar: $" + totalPrice.toFixed(2);
    invoice.appendChild(total);
    invoice.appendChild(deleteInvoiceButton);
    document.body.appendChild(invoice);
}


// funcion busqueda de productos
function searchProducts() {
    const searchInput = document.getElementById("searchProduct").value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));
    displayProducts(filteredProducts);
}

// funcion display de productos
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
        const stock = document.createElement("span")
        stock.textContent = product.stock + " Productos en stock";
        card.appendChild(stock)
        const stockInput = document.createElement("input");
        stockInput.type = "number"; 
        stockInput.placeholder = "Stock";
        stockInput.value = product.stock || 0; 
        card.appendChild(stockInput); 
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Agregar al carrito";
        addToCartButton.onclick = () => addToCart(index, parseInt(stockInput.value));
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

//funcion eliminar productos
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
}

window.onload = function() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
    const storedUsers = localStorage.getItem('users'); 
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    displayProducts();
};
