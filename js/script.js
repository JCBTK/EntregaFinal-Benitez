let loggedIn = false;
let products = [];
let cart = [];
let users = [];

window.onload = () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
};

function login() {
    const username = getValue("username");
    const password = getValue("password");
    clearValue("username");
    clearValue("password");
    if (!username.trim() || !password.trim()) {
        showError("Debes ingresar un usuario y contraseña!");
    }
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        loggedIn = true;
        showSuccess("Has iniciado sesion correctamente!");
        toggleDisplay("login", "store");
    } else {
        showError("Credenciales Incorrectas!");
    }
}

function register() {
    const newUsername = getValue("newUsername");
    const newPassword = getValue("newPassword");
    const existingUser = users.find(user => user.username === newUsername);
    if (existingUser) {
        showError("El usuario ya está registrado!");
        return;
    }
    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem('users', JSON.stringify(users));
    clearValue("newUsername");
    clearValue("newPassword");
    showSuccess("Te has registrado exitosamente, por favor inicia sesión!");
}

function logout() {
    confirmAction('¿Estás seguro?', () => {
        loggedIn = false;
        toggleDisplay("login", "store");
        showSuccess("Tu sesión ha sido cerrada correctamente.");
    });
}

function showRegisterForm() {
    toggleDisplay("login", "register");
}

function showLoginForm() {
    toggleDisplay("register", "login");
}

function addToCart(index) {
    const productToAdd = products[index];
    Swal.fire({
        title: 'Selecciona la cantidad',
        input: 'number',
        inputAttributes: {
            min: 1,
            max: productToAdd.stock,
            step: 1
        },
        inputValue: 1,
        showCancelButton: true,
        confirmButtonText: 'Agregar al carrito',
        showLoaderOnConfirm: true,
        preConfirm: (quantity) => {
            return new Promise((resolve) => {
                if (quantity > productToAdd.stock) {
                    Swal.showValidationMessage(`La cantidad excede el stock disponible (${productToAdd.stock})`);
                    resolve();
                } else {
                    resolve(quantity);
                }
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            const quantity = parseInt(result.value);
            productToAdd.stock -= quantity;
            if (productToAdd.stock === 0) {
                Swal.fire({
                    title: "Buen Trabajo!",
                    text: "Producto Agotado!",
                    icon: "warning"
                });
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
            localStorage.setItem('products', JSON.stringify(products));
        }
    });
}

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        document.getElementById("cart").style.display = "none";
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
    document.getElementById("cart").style.display = "flex"; 
}

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

function generateFactura() {
    const invoice = document.createElement("div");
    invoice.classList.add("invoice");
    const title = document.createElement("h2");
    title.textContent = "Factura de Compra";
    invoice.appendChild(title);
    let totalPrice = 0;
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

function searchProducts() {
    const searchInput = getValue("searchProduct").toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));
    displayProducts(filteredProducts);
}

function displayProducts(productsArray = products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    productsArray.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const productImage = document.createElement('img');
        productImage.src = product.img;
        card.appendChild(productImage);
        const productName = document.createElement("h3");
        productName.textContent = product.name;
        card.appendChild(productName);
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
        card.appendChild(productDescription);
        const productSize = document.createElement("span");
        productSize.textContent = "Talle: " + product.size;
        card.appendChild(productSize);
        const productPrice = document.createElement("span");
        productPrice.textContent = "$" + product.price;
        card.appendChild(productPrice);
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Agregar al carrito";
        addToCartButton.onclick = () => addToCart(index, parseInt());
        card.appendChild(addToCartButton);
        productList.appendChild(card);
    });
}

window.onload = () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    fetch('./db/db.json')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            displayProducts();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
};

function getValue(id) {
    return document.getElementById(id).value;
}

function clearValue(id) {
    document.getElementById(id).value = "";
}

function showError(message) {
    Swal.fire({
        title: "Ocurrio un ERROR",
        text: message,
        icon: "Error"
    });
}

function showSuccess(message) {
    Swal.fire({
        title: "Bienvenido",
        text: message,
        icon: "success"
    }).then(() => {
        document.getElementById("login").style.display = "none";
        document.getElementById("store").style.display = "flex";
    });
}

function toggleDisplay(showId, hideId) {
    document.getElementById(showId).style.display = "flex";
    document.getElementById(hideId).style.display = "none";
}

function confirmAction(title, callback) {
    Swal.fire({
        title: title,
        text: "Estás a punto de realizar una acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Volver atrás'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}
