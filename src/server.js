// server.js (Modificado)
import express from 'express';
// 1. Importar librerías de servidor HTTP y Sockets
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import { engine } from 'express-handlebars'; // Para Handlebars

import morgan from 'morgan';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
// 2. Importar el nuevo Views Router
import viewsRouter from './routes/views.router.js'; 

const app = express();
const PORT = 8080;

// 3. Crear servidor HTTP y servidor Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// 4. Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views'); // Directorio de vistas

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para formularios
app.use(morgan('dev'));
app.use(express.static('public')); // Para archivos estáticos (CSS, JS de cliente)

// 5. Compartir la instancia 'io' con los routers (Solución a la sugerencia del profesor)
app.use((req, res, next) => {
    req.io = io; // Adjuntamos la instancia de Socket.IO al objeto request
    next();
});

// Rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// 6. Montar el Views Router
app.use('/', viewsRouter); 

// Health check y 404 handler (se mantienen)
app.get('/', (req, res) => res.json({ ok: true, service: 'CoderHouse Backend I - Entrega 2' }));
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// 7. El servidor escucha con el httpServer, no con app.listen
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Socket.IO activo en el puerto ${PORT}`);
});

// Lógica de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    
    // Aquí puedes añadir más lógica de sockets (ej: recibir datos de formularios)
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});