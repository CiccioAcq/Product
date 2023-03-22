"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const app = (0, express_1.default)();
const urlProducts = "https://fakestoreapi.com/products";
app.get("/status", (req, res) => res.json({ message: "Server is running" }));
app.use(express_1.default.json());
const isAuth = ({ headers }, res, next) => {
    if (headers.authorization === "pippo") {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
const checkError = (req, res, next) => !(0, express_validator_1.validationResult)(req).
    isEmpty() ? res.status(400).json({ errors: (0, express_validator_1.validationResult)(req).array() }) : next();
const logHttpReq = (req, res) => {
    console.log(req.originalUrl);
};
//products?limit=10&skip=5
app.get("/products", (0, express_validator_1.query)("limit").optional().isInt().toInt(), (0, express_validator_1.query)("skip").optional().isInt().toInt(), (0, express_validator_1.query)("q").optional().isString(), checkError, ({ url, query }, res) => {
    const arr = url.split("?");
    axios_1.default
        .get(`${urlProducts}${arr[1] ? "?" + arr[1] : ""}`)
        .then(({ data }) => {
        if (query.q) {
            res.json(data.filter(({ title, description }) => title.includes(query.q) ||
                description.includes(query.q)));
        }
        if (query.maxMin) {
            const maxRate = Math.max(...data.map((product) => product.rating.rate));
            const minRate = Math.min(...data.map((product) => product.rating.rate));
            const avgRate = data.map((product) => product.rating.rate).reduce((acc, item) => acc + item / data.length, 0);
            res.json({ data, maxRate, minRate, avgRate });
        }
        else {
            res.json(data);
        }
    });
});
app.get("/products/:id", isAuth, (0, express_validator_1.param)("id").exists().isInt({ max: 20 }), checkError, ({ params }, res) => {
    axios_1.default.get(`https://fakestoreapi.com/products/${params.id}`)
        .then(function (response) {
        res.json(response.data);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json();
    });
}, logHttpReq);
//aggiungere query params farci tornare max rate min rate
app.listen(3000, () => {
    console.log("Server is running!");
});
