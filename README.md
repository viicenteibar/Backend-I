# CoderHouse - Programación Backend I — Entrega 1

API de **Productos** y **Carritos** con persistencia en el sistema de archivos (`products.json` y `carts.json`).

- **Node.js + Express**
- **Persistencia en FS** (sin DB)
- **Routers**: `/api/products` y `/api/carts`
- **Puerto**: `8080`

---

## 🚀 Cómo correr

```bash
npm install
npm run dev
```

Servidor en `http://localhost:8080`

---

## 📦 Endpoints

### Products `/api/products`
- `GET /` → Lista todos los productos
- `GET /:pid` → Trae un producto por id
- `POST /` → Crea producto (campos: `title, description, code, price, status, stock, category, thumbnails[]`)  
  > `id` se autogenera
- `PUT /:pid` → Actualiza por id (no permite cambiar/eliminar `id`)
- `DELETE /:pid` → Elimina por id

### Carts `/api/carts`
- `POST /` → Crea carrito `{ id, products: [] }`
- `GET /:cid` → Lista productos del carrito
- `POST /:cid/product/:pid` → Agrega producto al carrito (si existe incrementa `quantity`)

---

## 🧪 Body de ejemplo `POST /api/products`
```json
{
  "title": "Teclado Mecánico",
  "description": "Teclado 60% con switches rojos",
  "code": "KB-60R",
  "price": 79999,
  "status": true,
  "stock": 25,
  "category": "perifericos",
  "thumbnails": ["imgs/teclado-1.png", "imgs/teclado-2.png"]
}
```

## 🧪 Agregar producto a carrito `POST /api/carts/:cid/product/:pid`
Sin body (agrega de a uno).

---

## 🗂 Estructura
```
src/
  server.js
  routes/
    products.router.js
    carts.router.js
  managers/
    ProductManager.js
    CartManager.js
  data/
    products.json
    carts.json
```

---

## ✍️ Notas
- Los IDs se autogeneran utilizando un contador basado en el máximo ID actual (formato numérico).
- Validaciones básicas de campos en `ProductManager`.
- Se incluyen mensajes de error claros con status HTTP acordes.
- Proyecto listo para subir a **GitHub** (sin `node_modules`).# Backend-I
