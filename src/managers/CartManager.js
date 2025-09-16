import { promises as fs } from 'fs';
import path from 'path';
import ProductManager from './ProductManager.js';

const DATA_DIR = path.resolve('src', 'data');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');

export default class CartManager {
  constructor(filePath = CARTS_FILE) {
    this.path = filePath;
    this.productManager = new ProductManager();
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        await this.#writeFile([]);
        return [];
      }
      throw err;
    }
  }

  async #writeFile(data) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
  }

  #getNextId(items) {
    const maxId = items.reduce((max, it) => Math.max(max, Number(it.id) || 0), 0);
    return String(maxId + 1);
  }

  async createCart() {
    const carts = await this.#readFile();
    const newCart = { id: this.#getNextId(carts), products: [] };
    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.#readFile();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.#readFile();
    const cartIdx = carts.findIndex(c => String(c.id) === String(cid));
    if (cartIdx === -1) {
      const err = new Error('Carrito no encontrado'); err.status = 404; throw err;
    }

    // validar que exista el producto
    const product = await this.productManager.getProductById(pid);
    if (!product) {
      const err = new Error('Producto no encontrado'); err.status = 404; throw err;
    }

    const cart = carts[cartIdx];
    const prodIdx = cart.products.findIndex(p => String(p.product) === String(pid));
    if (prodIdx === -1) {
      cart.products.push({ product: String(pid), quantity: 1 });
    } else {
      cart.products[prodIdx].quantity += 1;
    }

    carts[cartIdx] = cart;
    await this.#writeFile(carts);
    return cart;
  }
}