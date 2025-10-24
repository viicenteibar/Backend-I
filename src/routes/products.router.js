import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/products/:pid
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

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const created = await pm.addProduct(req.body);
    
    // ⚠️ EMITIR EVENTO SOCKET DESPUÉS DE LA CREACIÓN
    const io = req.io;
    const products = await pm.getProducts();
    io.emit('updateProducts', products); // Notifica a todos los clientes
    
    res.status(201).json(created);
  } catch (err) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error al crear producto' });
 }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
 try {
  const deleted = await pm.deleteProduct(req.params.pid);

    // ⚠️ EMITIR EVENTO SOCKET DESPUÉS DE LA ELIMINACIÓN
    const io = req.io;
    const products = await pm.getProducts();
    io.emit('updateProducts', products); // Notifica a todos los clientes

  res.json({ deleted });
 } catch (err) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error al eliminar producto' });
 }
});

export default router;