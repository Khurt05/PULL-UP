document.addEventListener('DOMContentLoaded', function() {
    // Generate a random booking ID
    function generateBookingId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `PUR${timestamp}${random}`;
    }

    // Format date to a more readable format
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Try to get booking details from local storage or URL parameters
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
    const bookingId = generateBookingId();

    // Update the confirmation page with booking details
    document.getElementById('booking-id').textContent = bookingId;
    document.getElementById('customer-name').textContent = bookingDetails.fullname || 'N/A';
    document.getElementById('car-model').textContent = bookingDetails.carName || 'N/A';
    document.getElementById('car-quantity').textContent = bookingDetails.quantity || '1';
    document.getElementById('pickup-date').textContent = bookingDetails.pickupDate ? formatDate(bookingDetails.pickupDate) : 'N/A';
    document.getElementById('return-date').textContent = bookingDetails.returnDate ? formatDate(bookingDetails.returnDate) : 'N/A';
    document.getElementById('pickup-location').textContent = bookingDetails.pickupLocation || 'N/A';
    document.getElementById('total-amount').textContent = bookingDetails.totalPrice ? 
        `₱${bookingDetails.totalPrice.toLocaleString()}` : 'N/A';

    // Add animation for success icon
    const successIcon = document.querySelector('.success-animation i');
    successIcon.style.opacity = '0';
    setTimeout(() => {
        successIcon.style.opacity = '1';
    }, 100);

    // Clear the booking details from storage
    localStorage.removeItem('bookingDetails');
});