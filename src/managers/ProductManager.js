import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

export default class ProductManager {
  constructor(filePath = PRODUCTS_FILE) {
    this.path = filePath;
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

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const items = await this.#readFile();
    return items.find(p => String(p.id) === String(id)) || null;
  }

  #validateProductFields(prod) {
    const required = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
    const missing = required.filter(k => !(k in prod));
    if (missing.length) {
      const err = new Error(`Faltan campos requeridos: ${missing.join(', ')}`);
      err.status = 400;
      throw err;
    }
    if (typeof prod.title !== 'string' || !prod.title.trim()) {
      const err = new Error('title debe ser string no vacío'); err.status = 400; throw err;
    }
    if (typeof prod.description !== 'string' || !prod.description.trim()) {
      const err = new Error('description debe ser string no vacío'); err.status = 400; throw err;
    }
    if (typeof prod.code !== 'string' || !prod.code.trim()) {
      const err = new Error('code debe ser string no vacío'); err.status = 400; throw err;
    }
    if (typeof prod.price !== 'number' || isNaN(prod.price)) {
      const err = new Error('price debe ser número'); err.status = 400; throw err;
    }
    if (typeof prod.status !== 'boolean') {
      const err = new Error('status debe ser boolean'); err.status = 400; throw err;
    }
    if (typeof prod.stock !== 'number' || isNaN(prod.stock)) {
      const err = new Error('stock debe ser número'); err.status = 400; throw err;
    }
    if (typeof prod.category !== 'string' || !prod.category.trim()) {
      const err = new Error('category debe ser string no vacío'); err.status = 400; throw err;
    }
    if (prod.thumbnails && !Array.isArray(prod.thumbnails)) {
      const err = new Error('thumbnails debe ser un array de strings'); err.status = 400; throw err;
    }
  }

  async addProduct(prod) {
    const items = await this.#readFile();

    // code debe ser único
    if (items.some(p => p.code === prod.code)) {
      const err = new Error('Ya existe un producto con ese code');
      err.status = 400;
      throw err;
    }

    this.#validateProductFields(prod);

    const newProd = {
      id: this.#getNextId(items),
      title: prod.title,
      description: prod.description,
      code: prod.code,
      price: prod.price,
      status: prod.status,
      stock: prod.stock,
      category: prod.category,
      thumbnails: Array.isArray(prod.thumbnails) ? prod.thumbnails : []
    };
    items.push(newProd);
    await this.#writeFile(items);
    return newProd;
  }

  async updateProduct(id, updates) {
    const items = await this.#readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) {
      const err = new Error('Producto no encontrado'); err.status = 404; throw err;
    }

    // No permitir tocar el id
    if ('id' in updates) delete updates.id;

    // Si se intenta cambiar code, validar unicidad
    if (updates.code && items.some(p => p.code === updates.code && String(p.id) !== String(id))) {
      const err = new Error('Ya existe un producto con ese code'); err.status = 400; throw err;
    }

    const updated = { ...items[idx], ...updates };
    items[idx] = updated;
    await this.#writeFile(items);
    return updated;
  }

  async deleteProduct(id) {
    const items = await this.#readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) {
      const err = new Error('Producto no encontrado'); err.status = 404; throw err;
    }
    const [removed] = items.splice(idx, 1);
    await this.#writeFile(items);
    return removed;
  }
}