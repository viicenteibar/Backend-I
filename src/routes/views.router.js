import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js'; 

const router = Router();
const pm = new ProductManager();
const cm = new CartManager();

// Endpoint principal para productos paginados (Sugiere /products)
router.get('/products', async (req, res) => {
    try {
        // Recibe query params de paginación, filtro y ordenamiento
        const { limit, page, sort, category, status } = req.query;
        
        const query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const result = await pm.getProducts(limit, page, sort, query);
        
        // Función para construir la query string para los links de paginación
        const currentQuery = new URLSearchParams(req.query);

        const getPageLink = (pageNumber) => {
            if (!pageNumber) return null;
            currentQuery.set('page', pageNumber);
            return `/products?${currentQuery.toString()}`;
        }
        
        const productsData = {
            products: result.payload, // Los productos de la página actual
            pagination: {
                page: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: getPageLink(result.prevPage),
                nextLink: getPageLink(result.nextPage),
            }
        };

        // Renderizar la vista 'products.handlebars'
        res.render('products', { 
            title: 'Productos Paginados',
            ...productsData,
            style: 'products.css'
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de productos paginados");
    }
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts(100); // Límite alto para la vista de tiempo real
    res.render('realTimeProducts', { products: products.payload, title: 'Productos en Tiempo Real' });
});


// Vista de Carrito Específico con Populate
router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        // getCartById ahora usa POPULATE y trae los detalles completos del producto
        const cart = await cm.getCartById(cartId); 

        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        
        // La lista 'products' ya contiene los detalles completos del producto (título, precio, etc)
        res.render('cart', {
            title: `Carrito ID: ${cartId}`,
            cart: cart, // Pasar el objeto completo
            products: cart.products, 
            style: 'cart.css'
        });

    } catch (error) {
        res.status(500).send("Error al cargar la vista del carrito");
    }
});

export default router;