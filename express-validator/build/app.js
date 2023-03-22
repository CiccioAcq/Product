"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("./products");
const express_validator_1 = require("express-validator");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const isAuth = ({ headers }, res, next) => {
    if (headers.authorization === "pippo") {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
const logHttpReq = (req, res) => {
    console.log(req.originalUrl);
};
const getProductById = (req, res, next) => {
    const id = Number(req.params.id);
    let product = products_1.products.find((item) => item.id === id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }
    res.locals.product = product;
    next();
};
//ritorna
app.get("/products/:id", getProductById, (0, express_validator_1.param)("id").exists().isNumeric(), (req, res, next) => {
    res.json(res.locals.product);
    next();
});
app.get("/products", (req, res, next) => {
    res.json(products_1.products);
    next();
}, logHttpReq);
//aggiunge
app.post("/products", isAuth, (0, express_validator_1.body)("name").exists().isString(), (0, express_validator_1.body)("typology").exists().isString(), (0, express_validator_1.body)("price").exists().isString(), ({ body }, res) => {
    const maxId = products_1.products.reduce((acc, item) => (acc > item.id ? acc : item.id), 0);
    let product = {
        id: maxId + 1,
        name: body.name,
        typology: body.typology,
        price: body.price
    };
    products_1.products.push(product);
    res.json(product);
});
//modifica
app.put("/products/:id", getProductById, (0, express_validator_1.param)("id").exists().isNumeric(), (0, express_validator_1.body)('name').isString(), (0, express_validator_1.body)('typology').isString(), (0, express_validator_1.body)('price').isString(), ({ body }, res) => {
    res.locals.product.name = body.name;
    res.locals.product.price = body.price;
    res.locals.product.typology = body.typology;
    res.json(res.locals.product);
});
//cancella
// app.delete("/products/:id", 
// getProductById,
// param("id").exists().isNumeric(),
//  (req, res) => {
//   const productIndex = products.findIndex((item) => item.id === res.locals.id);
//   if (productIndex === -1) {
//     return res.status(404).json({ message: "product not found" });
//   }
//   products.splice(productIndex, 1);
//   res.json({ message: "item deleted" });
// });
app.delete("/products/:id", getProductById, (req, res) => {
    const productIndex = products_1.products.findIndex((item) => item.id === res.locals.product.id);
    if (productIndex === -1) {
        return res.status(404).json({ message: "product not found" });
    }
    products_1.products.splice(productIndex, 1);
    res.json({ message: "item deleted" });
});
app.listen(3000, () => {
    console.log("Server is running!");
});
