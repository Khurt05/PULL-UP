document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector(".booking-form");

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      fullname: bookingForm.fullname.value.trim(),
      email: bookingForm.email.value.trim(),
      phone: bookingForm.phone.value.trim(),
      car: bookingForm.car.value,
      pickup_date: bookingForm.pickup_date.value,
      return_date: bookingForm.return_date.value,
      pickup_location: bookingForm.pickup_location.value.trim(),
      notes: bookingForm.notes.value.trim()
    };


    if (!formData.fullname || !formData.email || !formData.phone || !formData.car ||
        !formData.pickup_date || !formData.return_date || !formData.pickup_location) {
      alert("Please fill in all required fields.");
      return;
    }

    const pickUp = new Date(formData.pickup_date);
    const returnDate = new Date(formData.return_date);
    if (pickUp > returnDate) {
      alert("Return date cannot be earlier than the pick-up date!");
      return;
    }
    localStorage.setItem("bookingInfo", JSON.stringify(formData));

    alert("Booking Successful! Redirecting to payment page...");

    window.location.href = "payment.html";
  });
});
