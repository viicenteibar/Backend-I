const socket = io();
const productContainer = document.getElementById('productContainer');

// Función para renderizar la lista de productos
const renderProducts = (products) => {
    let html = '<ul>';
    products.forEach(product => {
        html += `
            <li>
                <strong>${product.title}</strong> (ID: ${product.id}) - $${product.price}
                <p>Stock: ${product.stock} | Code: ${product.code}</p>
            </li>
        `;
    });
    html += '</ul>';
    productContainer.innerHTML = html;
};


// 2. Escuchar el evento 'updateProducts' que emite el backend
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados por Socket.IO');
    renderProducts(products);
});
