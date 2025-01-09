class PayPalHandler {
  constructor() {
    this.clientId =
      "AcR-LZfAveBFvOXORz7RUe_TAx0a6dkdDWorVbXXRi-7BHI1W2OvLNugPRES29lxk5to7NTY23rvZEM-";
    this.loadPayPalScript();
  }

  loadPayPalScript() {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD`;
    script.async = true;
    script.onload = () => this.initializePayPalButton();
    document.body.appendChild(script);
  }

  initializePayPalButton() {
    const paypalButtonContainer = document.getElementById(
      "paypal-button-container"
    );
    if (!paypalButtonContainer) return;

    paypal
      .Buttons({
        createOrder: (data, actions) => {
          const cartTotal = cart.calculateTotal();
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: cartTotal.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            localStorage.removeItem("cart");
            cart.items = [];
            cart.updateCartCount();
            window.location.href = "thankyou.html";
          });
        },
        onError: (err) => {
          console.error("PayPal Error:", err);
          alert(
            "There was an error processing your payment. Please try again."
          );
        },
      })
      .render("#paypal-button-container");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const paypalHandler = new PayPalHandler();
});
