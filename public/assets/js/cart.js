document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0; // Initialize total price variable

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Check if we've already sent cart items to MongoDB
  const sentToMongo = localStorage.getItem("sentToMongo");

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    // Calculate total price
    totalPrice += item.price * item.quantity;

    itemDiv.innerHTML = `
      <img src="${item.image}" width="100" />
      <div class="cart-details">
        <h3>${item.name}</h3>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    cartContainer.appendChild(itemDiv);

    // Send to MongoDB only if not already sent
    if (!sentToMongo) {
      fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Saved to MongoDB:', data);
        localStorage.setItem("sentToMongo", "true"); // Mark as sent
      })
      .catch(err => console.error('Error saving to MongoDB:', err));
    }
  });

  // Add the total price at the end of the cart
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  totalDiv.innerHTML = `Total Price: $${totalPrice}`;
  cartContainer.appendChild(totalDiv);

  // Delete item functionality
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      cart.splice(index, 1); // Remove the item from the cart array
      localStorage.setItem("cart", JSON.stringify(cart)); // Update the cart in localStorage

      // Optional: also remove from MongoDB (not implemented here)
      localStorage.removeItem("sentToMongo"); // Allow resending on next visit if needed

      location.reload(); // Reload the page to reflect the changes
    });
  });
});
