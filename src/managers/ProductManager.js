import { ProductModel } from '../models/product.model.js';

export default class ProductManager {
    async getProducts(limit = 10, page = 1, sort = null, query = {}) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null, 
            lean: true,
        };

        const filter = {};
        if (query.category) {
            filter.category = query.category;
        }
        if (query.status) {
            filter.status = query.status === 'true'; 
        }

        try {
            const result = await ProductModel.paginate(filter, options);

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: null,
                nextLink: null, 
            };
        } catch (error) {
            console.error(error);
            return { status: 'error', payload: 'Error al obtener productos' };
        }
    }
    
    async getProductById(id) {
        return ProductModel.findById(id).lean(); 
    }
    async addProduct(product) {
        return ProductModel.create(product);
    }
    async updateProduct(id, updates) {
        return ProductModel.findByIdAndUpdate(id, updates, { new: true });
    }
    async deleteProduct(id) {
        return ProductModel.findByIdAndDelete(id);
    }
}