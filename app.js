import express from 'express';
import expressHandlebars from 'express-handlebars';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { connectDB, disconnectAndReconnect as _ } from '../src/dao/index.js';
import ProductModel from '../src/dao/models/ProductModel.js';
import CartModel from '../src/dao/models/CartModel.js';
import { ProductManager } from './ProductManager.js';
import { default as productRouter } from './productRouter.js';



connectDB();

const app = express();
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'home',
    layoutsDir: path.join(new URL('.', import.meta.url).pathname, 'views/layouts'),

}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views'); // Cambiado a 'src/views'

app.use(session({
    secret: 'miClaveSecreta',
    resave: false,
    saveUninitialized: true,
}));

const productManager = new ProductManager();
const cartManager = new CartModel();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.use('/products', productRouter(productManager, io)); // Agregado 'io'

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = {
            email: 'adminCoder@coder.com',
            role: 'admin',
        };
    } else {
        req.session.user = {
            email,
            role: 'usuario',
        };
    }

    res.redirect('/products');
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/real-time-products', (req, res) => {
    res.render('layouts/realTimeProducts', { user: req.session.user });
});

server.listen(8899, () => {
    console.log('Servidor Express corriendo en el puerto 8899');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

export default app;