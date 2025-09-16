import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(morgan('dev'));

// Rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Health check
app.get('/', (req, res) => res.json({ ok: true, service: 'CoderHouse Backend I - Entrega 1' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});