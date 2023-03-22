import express, { NextFunction, Request, Response } from "express";
import { products } from "./products";
const app = express();

app.use(express.json());

const checkIdIsNumber = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "id is not a number" });
  }
  res.locals.id = id;
  next();
};

const getProductById = (req: Request, res: Response, next: NextFunction) => {
  let product = products.find((item) => item.id === res.locals.id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  res.locals.product = product;
  next();
};

const checkIfBodyIsRight = (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  if (body.name && body.price && body.typology) {
    next();
  }
  res
    .status(400)
    .json({ message: 'missing fields: "price" or "typology" or "name"' });
};

const logHttpReq = (req: Request, res: Response) => {
  console.log(req.originalUrl);
};

const isAuth = ({ headers }: Request, res: Response, next: NextFunction) => {
  if (headers.authorization === "pippo") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.delete("/products/:id", isAuth, checkIdIsNumber, (req, res) => {
  const productIndex = products.findIndex((item) => item.id === res.locals.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "product not found" });
  }
  products.splice(productIndex, 1);
  res.json({ message: "item deleted" });
});

app.post("/products", isAuth, checkIfBodyIsRight, ({ body }, res) => {
    const maxId = products.reduce(
        (acc, item) => (acc > item.id ? acc : item.id),
        0
    );
  // Math.max(...products.map(item => item.id));
  let product = {
    id: maxId + 1,
    name: body.name,
    price: body.price,
    typology: body.typology,
  };
  products.push(product);
  res.json(product);
});

app.put(
  "/products/:id",
  isAuth,
  checkIdIsNumber,
  getProductById,
  checkIfBodyIsRight,
  ({ body }, res) => {
    res.locals.product.name = body.name;
    res.locals.product.price = body.price;
    res.locals.product.typology = body.typology;
    res.json(res.locals.product);
    //
  }
);

app.get(
  "/products/:id",
  checkIdIsNumber,
  getProductById,
  (req, res, next) => {
    res.json(res.locals.product);
    next();
  },
  logHttpReq
);

app.get(
  "/products",
  (req, res, next) => {
    res.json(products);
    next();
  },
  logHttpReq
);

app.listen(3000, () => {
  console.log("Server is running!");
});