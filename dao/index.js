import mongoose from 'mongoose';
import CartModel from './models/CartModel.js';
import ProductModel from './models/ProductModel.js';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://cliente-1:<soycliente>@e-commerce.3hwzoj5.mongodb.net/?retryWrites=true&w=majority');
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err.message);
        process.exit(1);
    }
};

export const disconnectAndReconnect = () => {
    mongoose.disconnect(() => {
        connectDB();
    });
};

export { CartModel, ProductModel };