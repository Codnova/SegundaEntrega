let socket = io();

console.log('Hi from index.js')

socket.on('newProduct', (products) => { //When products are added, deleted, or updated, refresh the table

  let tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = ""; // Clear the table body

  products.forEach((product) => {
    let newRow = `<tr>
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>$${product.price}</td>
                    <td>${product.code}</td>
                    <td>${product.stock}</td>
                    <td>${product.status}</td>
                  </tr>`;
    tableBody.innerHTML += newRow;
  });
});