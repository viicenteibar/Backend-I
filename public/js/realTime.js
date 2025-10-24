// public/js/realTime.js
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

// 1. Renderizar la lista inicial al cargar la página
// Handlebars ya la pasó al renderizar la vista, pero la volvemos a renderizar
// si fuera necesario actualizar.

// 2. Escuchar el evento 'updateProducts' que emite el backend
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados por Socket.IO');
    renderProducts(products);
});

// Opcional: Si quieres un formulario con Sockets (como sugirió el profesor)
// Puedes añadir un formulario en realTimeProducts.handlebars y aquí enviar 
// un socket.emit('newProduct', productData) en lugar de un HTTP POST.