"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("./products");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const checkIdIsNumber = (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "id is not a number" });
    }
    res.locals.id = id;
    next();
};
const getProductById = (req, res, next) => {
    let product = products_1.products.find((item) => item.id === res.locals.id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }
    res.locals.product = product;
    next();
};
const checkIfBodyIsRight = ({ body }, res, next) => {
    if (body.name && body.price && body.typology) {
        next();
    }
    res
        .status(400)
        .json({ message: 'missing fields: "price" or "typology" or "name"' });
};
const logHttpReq = (req, res) => {
    console.log(req.originalUrl);
};
const isAuth = ({ headers }, res, next) => {
    if (headers.authorization === "pippo") {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
app.delete("/products/:id", isAuth, checkIdIsNumber, (req, res) => {
    const productIndex = products_1.products.findIndex((item) => item.id === res.locals.id);
    if (productIndex === -1) {
        return res.status(404).json({ message: "product not found" });
    }
    products_1.products.splice(productIndex, 1);
    res.json({ message: "item deleted" });
});
app.post("/products", isAuth, checkIfBodyIsRight, ({ body }, res) => {
    const maxId = products_1.products.reduce((acc, item) => (acc > item.id ? acc : item.id), 0);
    // Math.max(...products.map(item => item.id));
    let product = {
        id: maxId + 1,
        name: body.name,
        price: body.price,
        typology: body.typology,
    };
    products_1.products.push(product);
    res.json(product);
});
app.put("/products/:id", isAuth, checkIdIsNumber, getProductById, checkIfBodyIsRight, ({ body }, res) => {
    res.locals.product.name = body.name;
    res.locals.product.price = body.price;
    res.locals.product.typology = body.typology;
    res.json(res.locals.product);
    //
});
app.get("/products/:id", checkIdIsNumber, getProductById, (req, res, next) => {
    res.json(res.locals.product);
    next();
}, logHttpReq);
app.get("/products", (req, res, next) => {
    res.json(products_1.products);
    next();
}, logHttpReq);
app.listen(3000, () => {
    console.log("Server is running!");
});
