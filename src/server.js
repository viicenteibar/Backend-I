import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';

import morgan from 'morgan';

// ----------------------------------------------------
// 1. Importación de Routers
// ----------------------------------------------------
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'; 

const app = express();
const PORT = 8080;
const MONGODB_URI = 'mongodb+srv://vicenteibarzabal_db_user:A2RWswguok5rFAFR@cluster-coder.5tvtw8y.mongodb.net/ecommerceDB?appName=cluster-coder';
// ----------------------------------------------------
// 2. CONEXIÓN A MONGOOSE
// ----------------------------------------------------
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Conexión a MongoDB (ecommerceDB) exitosa'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));
    
// ----------------------------------------------------
// 3. CONFIGURACIÓN DE SERVIDORES HTTP Y SOCKET.IO
// ----------------------------------------------------
const httpServer = createServer(app);
const io = new Server(httpServer);

// ----------------------------------------------------
// 4. CONFIGURACIÓN DE HANDLEBARS
// ----------------------------------------------------
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views'); 

// ----------------------------------------------------
// 5. MIDDLEWARES
// ----------------------------------------------------
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); 
app.use(express.static('public'));

// ----------------------------------------------------
// 6. INYECCIÓN DE SOCKET.IO A LOS REQUESTS
// ----------------------------------------------------
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ----------------------------------------------------
// 7. RUTAS BASE
// ----------------------------------------------------
// Rutas API REST
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// Rutas de Vistas
app.use('/', viewsRouter); 

// Health check
app.get('/health', (req, res) => res.json({ ok: true, service: 'Ecommerce Backend' }));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ----------------------------------------------------
// 8. LÓGICA DE CONEXIÓN DE SOCKET.IO
// ----------------------------------------------------
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// ----------------------------------------------------
// 9. INICIO DEL SERVIDOR
// ----------------------------------------------------
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Socket.IO activo en el puerto ${PORT}`);
});