import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js'; 

export default class CartManager {
    
    // 1. Crear un carrito
    async createCart() {
        return CartModel.create({});
    }

    // 2. Obtener carrito por ID (con POPULATE)
    async getCartById(cid) {
        return CartModel.findById(cid).populate('products.product').lean();
    }

    // 3. Agregar producto al carrito (o incrementar cantidad)
    async addProductToCart(cid, pid) {
        // Validación de IDs
        const cart = await CartModel.findById(cid);
        if (!cart) {
            const err = new Error('Carrito no encontrado'); err.status = 404; throw err;
        }
        const productExists = await ProductModel.findById(pid);
        if (!productExists) {
            const err = new Error('Producto no encontrado'); err.status = 404; throw err;
        }
        
        // Buscar si el producto ya existe en el array del carrito
        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        
        if (existingProduct) {
            // Si existe, incrementa la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si no existe, lo agrega con quantity: 1
            cart.products.push({ product: pid, quantity: 1 });
        }
        
        await cart.save();
        return cart;
    }

    // 4. DELETE Eliminar producto del carrito
    async removeProductFromCart(cid, pid) {
        const result = await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } }, 
            { new: true } // Devuelve el documento después de la actualización
        );
        if (!result) {
            const err = new Error('Carrito no encontrado'); err.status = 404; throw err;
        }
        return result;
    }

    // 5. PUT Actualizar todos los productos del carrito
    async updateAllProducts(cid, productsArray) {
        const result = await CartModel.findByIdAndUpdate(
            cid,
            { products: productsArray }, // Reemplaza completamente el array 'products'
            { new: true }
        );
        if (!result) {
            const err = new Error('Carrito no encontrado'); err.status = 404; throw err;
        }
        return result;
    }

    // 6. PUT Actualizar SÓLO la cantidad de un producto
    async updateProductQuantity(cid, pid, quantity) {
        const result = await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
        if (!result) {
            // Error más específico si no se encuentra el carrito o el producto dentro del carrito
            const err = new Error('Carrito o Producto no encontrado en el carrito'); err.status = 404; throw err;
        }
        return result;
    }

    // 7. DELETE Eliminar todos los productos del carrito
    async clearCart(cid) {
        const result = await CartModel.findByIdAndUpdate(
            cid,
            { $set: { products: [] } }, // Establece el array 'products' como vacío
            { new: true }
        );
        if (!result) {
            const err = new Error('Carrito no encontrado'); err.status = 404; throw err;
        }
        return result;
    }
}