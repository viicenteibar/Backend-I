// src/routes/views.router.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager();

// Endpoint para 'home.handlebars' (Lista estática)
router.get('/home', async (req, res) => {
    try {
        const products = await pm.getProducts();
        // Renderizar la vista 'home' y pasarle el array de productos
        res.render('home', {
            products: products,
            style: 'home.css', // Opcional, si usas un archivo CSS
            title: 'Lista de Productos'
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de productos");
    }
});

// Endpoint para 'realTimeProducts.handlebars' (Lista dinámica con Sockets)
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await pm.getProducts();
        // Renderizar la vista 'realTimeProducts'
        res.render('realTimeProducts', {
            products: products,
            style: 'realTimeProducts.css', // Opcional
            title: 'Productos en Tiempo Real'
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista en tiempo real");
    }
});

export default router;