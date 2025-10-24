# Backend-I: Proyecto Final E-commerce 🚀

## CoderHouse - Programación Backend I

Este repositorio contiene el proyecto final del curso, un backend completo para un e-commerce. La aplicación está construida con **Node.js** y **Express**, e implementa una **API RESTful** para la gestión de productos y carritos, un sistema de **vistas en tiempo real** con Handlebars y Socket.IO, y persistencia de datos robusta utilizando **MongoDB**.

---

## Stack de Tecnologías 💻

-   **Servidor:** Node.js, Express
-   **Base de Datos:** MongoDB (con Mongoose)
-   **Motor de Vistas:** Handlebars
-   **Tiempo Real:** Socket.IO (WebSockets)
-   **Paginación:** `mongoose-paginate-v2`
-   **Utilidades:** Morgan (Logger)

---

## 🚀 Puesta en Marcha

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/](https://github.com/)[TU_USUARIO]/[TU_REPOSITORIO].git
    cd Backend-I
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar la Base de Datos:**
    El proyecto está configurado para conectarse a una base de datos de MongoDB Atlas. Asegúrate de actualizar la variable `MONGODB_URI` dentro de `src/server.js` con tu propia cadena de conexión.

4.  **Ejecutar el servidor:**
    ```bash
    npm run dev
    ```

El servidor se iniciará en `http://localhost:8080`.

---

## 📦 API Endpoints (RESTful)

### Productos (`/api/products`)

-   **`GET /`**: Lista todos los productos con **paginación, filtros y ordenamiento**.
    -   *Query Params*: `limit` (default 10), `page` (default 1), `sort` ('asc'/'desc' por precio), `query` (por `category` o `status`).
    -   *Respuesta*: Objeto de paginación con `status`, `payload`, `totalPages`, `prevLink`, `nextLink`, etc.

-   **`GET /:pid`**: Trae un producto por su `_id` de MongoDB.
-   **`POST /`**: Crea un nuevo producto en la base de datos.
-   **`PUT /:pid`**: Actualiza un producto por su `_id`.
-   **`DELETE /:pid`**: Elimina un producto por su `_id`.

### Carritos (`/api/carts`)

-   **`POST /`**: Crea un nuevo carrito vacío en la base de datos.
-   **`GET /:cid`**: Lista los productos de un carrito. Utiliza **`populate`** para traer los detalles completos de cada producto.
-   **`POST /:cid/product/:pid`**: Agrega un producto (`pid`) al carrito (`cid`). Si ya existe, incrementa la `quantity`.
-   **`PUT /:cid`**: Actualiza el carrito completo con un nuevo arreglo de productos. (Recibe `[{ product: ID, quantity: N }, ...]`).
-   **`PUT /:cid/product/:pid`**: Actualiza **solo** la cantidad de un producto específico dentro del carrito. (Recibe `{ "quantity": N }`).
-   **`DELETE /:cid/products/:pid`**: Elimina un producto específico del carrito.
-   **`DELETE /:cid`**: Vacía completamente el carrito (elimina todos sus productos).

---

## 🖥️ Vistas (Handlebars)

El servidor también renderiza vistas del lado del servidor:

-   **`/products`**: Una vista paginada de todos los productos, con controles para navegar entre páginas y filtros. Incluye un botón "Agregar al Carrito".
-   **`/carts/:cid`**: Muestra el detalle de un carrito específico, listando los productos (obtenidos con `populate`) y sus cantidades.
-   **`/realtimeproducts`**: Una vista (de la Entrega 2) que utiliza **WebSockets** para mostrar una lista de productos que se actualiza automáticamente en tiempo real cuando se crea o elimina un producto usando la API.

---

## ⚡ Lógica de WebSockets (Socket.IO)

-   **Evento (Emit):** `updateProducts`
    -   El servidor emite este evento (a través de `req.io`) cada vez que se ejecuta un `POST` o `DELETE` en `/api/products`.
-   **Evento (Listen):** `updateProducts`
    -   El cliente (en la vista `/realtimeproducts`) escucha este evento y vuelve a renderizar la lista de productos en el DOM sin necesidad de recargar la página.

---

## 🗂 Estructura Final del Proyecto

.
├── node_modules/       <-- (Ignorada por Git)
├── public/             <-- Archivos estáticos (CSS, JS del cliente)
│   └── js/
│       └── realTime.js <-- (Lógica de Socket.IO)
├── src/
│   ├── data/           <-- (Persistencia antigua, Entrega 1)
│   │   ├── carts.json
│   │   └── products.json
│   ├── managers/       <-- Lógica de negocio (Servicios)
│   │   ├── CartManager.js
│   │   └── ProductManager.js
│   ├── models/         <-- Esquemas de Mongoose (DB)
│   │   ├── cart.model.js
│   │   └── product.model.js
│   ├── routes/         <-- Routers de Express (Endpoints)
│   │   ├── carts.router.js
│   │   ├── products.router.js
│   │   └── views.router.js
│   ├── views/            <-- Plantillas Handlebars
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── cart.handlebars
│   │   ├── home.handlebars
│   │   ├── products.handlebars
│   │   └── realTimeProducts.handlebars
│   └── server.js         <-- Servidor principal (Express, Sockets, DB)
├── .gitignore
├── package-lock.json
├── package.json
└── README.md