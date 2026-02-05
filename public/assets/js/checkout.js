//   // Fetch cart items from localStorage
//   const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

//   // Function to update the order summary
//   function updateOrderSummary() {
//     const orderItemsContainer = document.getElementById('order-items');
//     const subtotalElement = document.getElementById('subtotal');
//     let subtotal = 0;

//     // Clear the order items container before updating
//     orderItemsContainer.innerHTML = '';

//     // Loop through cart items and display them in the order summary
//     cartItems.forEach(item => {
//       const itemElement = document.createElement('div');
//       itemElement.classList.add('order-item');
      
//       // Create HTML structure for each order item
//       itemElement.innerHTML = `
//         <div class="item-info">
//           <div class="item-name">${item.name}</div>
//           <div class="item-quantity">Quantity: ${item.quantity}</div>
//         </div>
//         <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
//       `;

//       // Append each item to the order summary
//       orderItemsContainer.appendChild(itemElement);     

//       // Update the subtotal
//       subtotal += item.price * item.quantity;
//     });

//     // Update the subtotal text
//     subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
//   }

//   // Update the order summary when the page loads
//   window.onload = updateOrderSummary;

// Fetch cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the order summary
function updateOrderSummary() {
  const orderItemsContainer = document.getElementById('order-items');
  const subtotalElement = document.getElementById('subtotal');
  const taxElement = document.getElementById('tax');
  const shippingElement = document.getElementById('shipping');
  const totalElement = document.getElementById('total');
  
  let subtotal = 0;
  
  // Clear the order items container before updating
  orderItemsContainer.innerHTML = '';
  
  // Loop through cart items and display them in the order summary
  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('order-item');
    
    // Calculate item total
    const itemTotal = item.price * item.quantity;
    
    // Create HTML structure for each order item
    itemElement.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-quantity">Quantity: ${item.quantity}</div>
      </div>
      <div class="item-price">$${itemTotal.toFixed(2)}</div>
    `;
    
    // Append each item to the order summary
    orderItemsContainer.appendChild(itemElement);
    
    // Update the subtotal
    subtotal += itemTotal;
  });
  
  // Calculate tax, shipping and total
  const taxRate = 0.08; // 8% tax rate
  const shipping = 5.99;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shipping;
  
  // Update the summary values
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
  
  // Update the hidden input with the complete order data
  const orderData = {
    items: cartItems,
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: total
  };
  
  const orderDataInput = document.getElementById('order-data');
  if (orderDataInput) {
    orderDataInput.value = JSON.stringify(orderData);
  }
}

// Update the order summary when the page loads
document.addEventListener('DOMContentLoaded', function() {
  updateOrderSummary();
  
  // Add event listener for payment form submission
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(event) {
      // Prevent form submission if the cart is empty
      if (cartItems.length === 0) {
        event.preventDefault();
        alert('Your cart is empty. Please add items before checkout.');
        return;
      }
      
      // Add additional validation if needed
      // ...
    });
  }
});

// Function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}