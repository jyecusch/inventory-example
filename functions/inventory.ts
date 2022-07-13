import {
  inventoryApi,
  products,
  imageBucket,
  inventoryPub,
} from "../common/resources";
import { v4 as uuid } from "uuid";

// Define our profile contents
interface Product {
  name: string;
  description: string;
  image: string;
}

// Create product with post method
inventoryApi.post("/products", async (ctx) => {
  let id = uuid();
  const product: Product = {
    name: ctx.req.json().name,
    description: ctx.req.json().description,
    image: null,
  };

  // Create the new product
  await products.doc(id).set(product);

  // Notify
  const subject = `New product in inventory`;
  const template = `<!DOCTYPE html PUBLIC>
  <html lang="en">
      <title>Product added to inventory</title>
      </head>
      <body>
          {{ name }}<br>
          {{ description }}<br>
          {{ url }}
      </body>
  </html>`;

  await inventoryPub.publish({
    payload: {
      recipient: process.env.SYS_ADMIN_EMAIL,
      subject: subject,
      template: template,
      data: product,
    },
  });

  // Return the id
  ctx.res.json({
    status: "created",
    id,
  });
});

// Retrieve profile with get method
inventoryApi.get("/products/:id", async (ctx) => {
  const { id } = ctx.req.params;

  try {
    const image = imageBucket.file(`images/${id}/photo.png`);
    const product = await products.doc(id).get();
    return ctx.res.json({
      ...product,
      image: await image.getDownloadUrl(),
    });
  } catch (error) {
    ctx.res.status = 404;
    ctx.res.body = `Product [${id}] not found.`;
  }
});

// Retrieve all products with get method
inventoryApi.get("/products", async (ctx) => {
  const results = await products.query().fetch();

  return ctx.res.json({
    products: results.documents.map((result) => {
      const { image, ...product } = result.content;
      return {
        id: result.id,
        ...product,
      };
    }),
  });
});

inventoryApi.get("/products/:id/image/upload", async (ctx) => {
  const id = ctx.req.params["id"];

  // Return a signed url reference for upload
  const image = imageBucket.file(`images/${id}/photo.png`);

  ctx.res.json({
    url: await image.getUploadUrl(),
  });
});
