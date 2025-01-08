class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this.total = 0;
    this.updateCartCount();
    this.calculateTotal();
  }

  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      // kae path img
      if (window.location.pathname.includes("/pages/")) {
        product.image = product.image.replace("../", "/");
      }
      this.items.push(product);
    }

    this.saveCart();
    this.updateCartCount();
    this.calculateTotal();
    console.log("Added item:", product);
    console.log("Current cart:", this.items);
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
    this.calculateTotal();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.removeItem(productId);
      }
    }
    this.saveCart();
    this.calculateTotal();
    this.renderCartItems();
    // this.refreshPage();
  }
  refreshPage(){
    location.reload();
  }
  // dak local
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  updateCartCount() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    const countElements = document.querySelectorAll(".count");
    countElements.forEach((element) => {
      element.textContent = count;
    });
  }

  // Calculate total price
  calculateTotal() {
    this.total = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");

    if (subtotalElement) {
      subtotalElement.textContent = `$${this.total.toFixed(2)}`;
    }
    if (totalElement) {
      totalElement.textContent = `$${this.total.toFixed(2)}`;
    }

    return this.total;
  }
  renderCartItems() {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;

    if (this.items.length === 0) {
      cartContainer.innerHTML = `
              <tr>
                  <td colspan="6" class="text-center">Your cart is empty</td>
              </tr>
          `;
      return;
    }

    cartContainer.innerHTML = this.items
      .map(
        (item) => `
              <tr>
                  <td class="product-thumbnail">
                      <img src="${item.image}" alt="${
          item.name
        }" class="img-fluid" style="max-width: 100px;">
                  </td>
                  <td class="product-name">
                      <h2 class="h5 text-black">${item.name}</h2>
                  </td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>
                      <div class="input-group mb-3" style="max-width: 120px;">
                          <div class="input-group-prepend">
                              <button class="btn btn-outline-primary js-btn-minus" type="button" 
                                  onclick="cart.updateQuantity('${item.id}', ${
          item.quantity - 1
        })">&minus;</button>
                          </div>
                          <input type="text" class="form-control text-center" value="${
                            item.quantity
                          }" 
                              onchange="cart.updateQuantity('${
                                item.id
                              }', this.value)">
                          <div class="input-group-append">
                              <button class="btn btn-outline-primary js-btn-plus" type="button"
                                  onclick="cart.updateQuantity('${item.id}', ${
          item.quantity + 1
        })">&plus;</button>
                          </div>
                      </div>
                  </td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                      <button class="btn btn-primary btn-sm" onclick="cart.removeItem('${
                        item.id
                      }')">X</button>
                  </td>
              </tr>
          `
      )
      .join("");
  }

  renderCheckoutItems() {
    const checkoutTable = document.querySelector(
      ".site-block-order-table tbody"
    );
    if (!checkoutTable) return;

    if (this.items.length === 0) {
      checkoutTable.innerHTML = `
              <tr>
                  <td colspan="2" class="text-center">Your cart is empty</td>
              </tr>
          `;
      return;
    }
    let html = "";
    this.items.forEach((item) => {
      html += `
              <tr>
                  <td>${item.name} <strong class="mx-2">×</strong> ${
        item.quantity
      }</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
          `;
    });
    html += `
          <tr>
              <td class="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
              <td class="text-black">$${this.total.toFixed(2)}</td>
          </tr>
      `;
    html += `
          <tr>
              <td class="text-black font-weight-bold"><strong>Order Total</strong></td>
              <td class="text-black font-weight-bold"><strong>$${this.total.toFixed(
                2
              )}</strong></td>
          </tr>
      `;

    checkoutTable.innerHTML = html;
  }
}

// create new cart
const cart = new Cart();
document.querySelectorAll(".buy-now").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const productContainer = e.target.closest(".site-section");
    if (!productContainer) return;

    const quantity = 1;
    const imgElement = productContainer.querySelector(".img-fluid");
    let imagePath = "";
    if (imgElement) {
      imagePath = imgElement.getAttribute("src");
      console.log("Image path found:", imagePath);
    }

    const product = {
      id: window.location.pathname.split("/").pop().replace(".html", ""),
      name: productContainer.querySelector("h2").textContent.trim(),
      price: parseFloat(
        productContainer
          .querySelector(".text-primary")
          .textContent.replace("$", "")
      ),
      image: imagePath,
      quantity: quantity,
    };
    // merl item
    console.log("Adding product:", product);

    cart.addItem(product);
    // window.location.href = window.location.pathname.includes("/pages/")
    //   ? "../cart.html"
    //   : "cart.html";
  });
});
if (window.location.pathname.includes("cart.html")) {
  console.log("Rendering cart items...");
  console.log("Current cart contents:", cart.items);
  cart.renderCartItems();
}
if (window.location.pathname.includes("checkout.html")) {
  console.log("Rendering checkout items...");
  cart.renderCheckoutItems();
}
if (document.getElementById("paypal-button-container")) {
  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: cart.total.toFixed(2),
              },
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          localStorage.removeItem("cart");
          cart.items = [];
          cart.updateCartCount();
          window.location.href = "thankyou.html";
        });
      },
    })
    .render("#paypal-button-container");
}
