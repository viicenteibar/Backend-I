import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cm = new CartManager();

// POST /api/carts (Crear carrito)
router.post('/', async (req, res) => {
    try {
        const cart = await cm.createCart();
        res.status(201).json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Error al crear carrito' });
    }
});

// GET /api/carts/:cid (Listar productos del carrito con POPULATE)
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cm.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        
        res.json({ status: 'success', payload: cart.products }); 
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Error al obtener carrito' });
    }
});

// POST /api/carts/:cid/product/:pid (Agregar/Incrementar producto)
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cm.addProductToCart(req.params.cid, req.params.pid);
        res.status(201).json({ status: 'success', payload: cart });
    } catch (err) {
        // Usa err.status para 404 de carrito/producto no encontrado
        res.status(err.status || 500).json({ status: 'error', error: err.message || 'Error al agregar producto al carrito' });
    }
});

// DELETE api/carts/:cid/products/:pid: Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cm.removeProductFromCart(cid, pid);
        res.json({ status: 'success', payload: cart, message: 'Producto eliminado del carrito.' });
    } catch (err) {
        res.status(err.status || 500).json({ status: 'error', error: err.message });
    }
});

// PUT api/carts/:cid: Actualizar TODOS los productos del carrito con un arreglo
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; 
        
        if (!Array.isArray(products)) {
             return res.status(400).json({ status: 'error', error: 'El cuerpo de la petición debe ser un array de productos.' });
        }
        
        const cart = await cm.updateAllProducts(cid, products);
        res.json({ status: 'success', payload: cart, message: 'Productos del carrito actualizados.' });
    } catch (err) {
        res.status(err.status || 500).json({ status: 'error', error: err.message });
    }
});

// PUT api/carts/:cid/products/:pid: Actualizar SÓLO la cantidad
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ status: 'error', error: 'La cantidad debe ser un número positivo.' });
        }
        
        const cart = await cm.updateProductQuantity(cid, pid, quantity);
        res.json({ status: 'success', payload: cart, message: 'Cantidad actualizada.' });
    } catch (err) {
        res.status(err.status || 500).json({ status: 'error', error: err.message });
    }
});

// DELETE api/carts/:cid: Eliminar TODOS los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cm.clearCart(cid);
        res.json({ status: 'success', payload: cart, message: 'Carrito vaciado.' });
    } catch (err) {
        res.status(err.status || 500).json({ status: 'error', error: err.message });
    }
});

export default router;