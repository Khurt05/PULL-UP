document.addEventListener("DOMContentLoaded", () => {
  const paymentSelect = document.getElementById("payment-method");
  const gcashInfo = document.getElementById("gcash-info");
  const cardInfo = document.getElementById("card-info");
  const paypalInfo = document.getElementById("paypal-info");

  paymentSelect.addEventListener("change", () => {
    // Hide all first
    gcashInfo.classList.add("hidden");
    cardInfo.classList.add("hidden");
    paypalInfo.classList.add("hidden");

    const selected = paymentSelect.value;
    if (selected === "gcash") gcashInfo.classList.remove("hidden");
    if (selected === "credit-card") cardInfo.classList.remove("hidden");
    if (selected === "paypal") paypalInfo.classList.remove("hidden");
  });
});
