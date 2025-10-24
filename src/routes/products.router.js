import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager();

// GET /api/products/ (Con paginación, filtros y ordenamiento)
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, category, status } = req.query;
        
        const query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const result = await pm.getProducts(limit, page, sort, query);
        
        const buildLink = (pageNumber) => {
            if (!pageNumber) return null;
            const params = new URLSearchParams(req.query);
            params.set('page', pageNumber);
            return `/api/products?${params.toString()}`; 
        };

        const finalResponse = {
            ...result,
            prevLink: buildLink(result.prevPage),
            nextLink: buildLink(result.nextPage),
        };
        
        res.json(finalResponse);
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// GET /api/products/:pid (Obtener producto por ID)
router.get('/:pid', async (req, res) => {
    try {
        const prod = await pm.getProductById(req.params.pid);
        if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(prod);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});


// POST /api/products (Crear producto)
router.post('/', async (req, res) => {
    try {
        const created = await pm.addProduct(req.body);
        
        //  Socket.IO: Emitir evento cuando se crea un producto
        const io = req.io;
        const products = await pm.getProducts(100); // Obtener lista actualizada (o solo el nuevo)
        io.emit('updateProducts', products.payload); // Notifica a todos los clientes
        
        res.status(201).json(created);
    } catch (err) {
        // Mongoose 'code: 11000' es error de duplicado (ej: 'code' único)
        if (err.code === 11000) {
            return res.status(400).json({ error: 'El "code" del producto ya existe.' });
        }
        // Usa el status del manager si existe (ej: 400 por validación)
        res.status(err.status || 500).json({ error: err.message || 'Error al crear producto' });
    }
});


// PUT /api/products/:pid (Actualizar producto)
router.put('/:pid', async (req, res) => {
    try {
        const updated = await pm.updateProduct(req.params.pid, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar.' });
        }
        
        // Socket.IO: Emitir evento cuando se actualiza un producto
        const io = req.io;
        const products = await pm.getProducts(100);
        io.emit('updateProducts', products.payload);
        
        res.json(updated);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Error al actualizar producto' });
    }
});

// DELETE /api/products/:pid (Eliminar producto)
router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await pm.deleteProduct(req.params.pid);
        if (!deleted) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar.' });
        }

        // Socket.IO: Emitir evento cuando se elimina un producto
        const io = req.io;
        const products = await pm.getProducts(100);
        io.emit('updateProducts', products.payload);

        res.json({ message: 'Producto eliminado', deleted });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Error al eliminar producto' });
    }
});

export default router;