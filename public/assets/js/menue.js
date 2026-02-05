// First, create CSS styles for the notification
const cartNotificationStyles = document.createElement('style');
cartNotificationStyles.innerHTML = `
  .cart-notification {
    position: fixed;
    bottom: -100px;
    right: 20px;
    background-color: #ffffff;
    border-left: 4px solid #4CAF50;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    padding: 16px;
    display: flex;
    align-items: center;
    width: 300px;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  
  .cart-notification.show {
    bottom: 20px;
    opacity: 1;
  }
  
  .notification-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 12px;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    margin: 0 0 5px 0;
    font-weight: 600;
    color: #333;
    font-size: 16px;
  }
  
  .notification-text {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
  
  .notification-close {
    background: transparent;
    border: none;
    color: #999;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
  }
`;
document.head.appendChild(cartNotificationStyles);

// Function to show notification
function showNotification(item) {
  // Remove any existing notification
  const existingNotification = document.querySelector('.cart-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  
  // Set notification content with item details
  notification.innerHTML = `
    <img class="notification-image" src="${item.image || '/api/placeholder/50/50'}" alt="${item.name}">
    <div class="notification-content">
      <h4 class="notification-title">Added to Cart</h4>
      <p class="notification-text">${item.name} - $${item.price.toFixed(2)}</p>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  // Add notification to body
  document.body.appendChild(notification);
  
  // Add event listener for close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Show notification with animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Automatically hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Update the event listeners for each food menu button
document.querySelectorAll(".food-menu-btn").forEach(button => {
  button.addEventListener("click", () => {
    const item = {
      id: button.getAttribute("data-id"),
      name: button.getAttribute("data-name"),
      price: parseFloat(button.getAttribute("data-price")),
      image: button.getAttribute("data-image"),
      quantity: 1
    };
    
    // Get existing cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if item already exists in the cart
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      // If already in cart, increase quantity
      existingItem.quantity += 1;
    } else {
      // Else, add new item
      cart.push(item);
    }
    
    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Show fancy notification instead of alert
    showNotification(item);
  });
});