document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');
      addToCart(productId);
    });
  });

  function addToCart(productId) {
    const cartId = '6577ad616076d24fea73553e'; // Hardcoded cart ID
    const url = `http://localhost:3000/api/carts/${cartId}/product/${productId}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: productId, quantity: 1 }) // Modify quantity
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Product added to cart!');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
});