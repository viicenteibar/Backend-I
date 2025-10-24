import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true }, // Indexado para facilitar filtros
    thumbnails: { type: [String], default: [] }
});

// Implementar el plugin de paginación
productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);