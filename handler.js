const { mockProducts } = require("./libs/mockProducts");

const getProducts = () => Promise.resolve(mockProducts);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

const getProductsList = async (event, context) => {
  try {
    const products = await getProducts();
    if (!products) {
      return createResponse(404, { error: "Products not found" });
    }
    return createResponse(200, products);
  } catch (error) {
    return createResponse(500, error);
  }
};

const getProductById = async (event, context) => {
  const {productId} = event.pathParameters;
  try {
    const products = await getProducts();
    const product = products.find(
      (product) => product.id === Number(productId)
    );
    if (!product) {
      return createResponse(404, { error: "Product not found" });
    }
    return createResponse(200, product);
  } catch (error) {
    return createResponse(500, error);
  }
};

module.exports = {
  getProductsList,
  getProductById,
};
