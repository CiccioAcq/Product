import express, { Request, Response, NextFunction } from "express";
import { products } from "./products";
import { param, body, validationResult } from 'express-validator';
const app = express();



app.use(express.json());

const isAuth = ({ headers }: Request, res: Response, next: NextFunction) => {
  if (headers.authorization === "pippo") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const logHttpReq = (req: Request, res: Response) => {
  console.log(req.originalUrl);
};



const getProductById = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  let product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  res.locals.product = product;
  next();
};

//ritorna
app.get(
  "/products/:id",
  getProductById,
  param("id").exists().isNumeric(),
  (req, res, next) => {
    res.json(res.locals.product);
    next();
  }
);

app.get(
  "/products",
  (req, res, next) => {
    res.json(products);
    next();
  },
  logHttpReq
);


//aggiunge
app.post("/products",
  isAuth,
  body("name").exists().isString(),
  body("typology").exists().isString(),
  body("price").exists().isString(),
  ({ body }: express.Request, res: express.Response) => {
    const maxId = products.reduce(
      (acc, item) => (acc > item.id ? acc : item.id),
      0
    );
    let product = {
      id: maxId + 1,
      name: body.name,
      typology: body.typology,
      price: body.price
    };
    products.push(product);
    res.json(product);
  });

//modifica
app.put(
  "/products/:id",
  getProductById,
  param("id").exists().isNumeric(),
  body('name').isString(),
  body('typology').isString(),
  body('price').isString(),
  ({ body }: express.Request, res: express.Response) => {
    res.locals.product.name = body.name;
    res.locals.product.price = body.price;
    res.locals.product.typology = body.typology;
    res.json(res.locals.product);
  }
);

app.delete("/products/:id", getProductById, (req, res) => {
  const productIndex = products.findIndex((item) => item.id === res.locals.product.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "product not found" });
  }
  products.splice(productIndex, 1);
  res.json({ message: "item deleted" });
});

 app.listen(3000, () => {
   console.log("Server is running!");
 });


