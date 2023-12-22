const { mockProducts } = require("./libs/mockProducts");

const getProducts = () => Promise.resolve(mockProducts);

const getProductsList = async (event, context) => {
  try {
    const products = await getProducts();
    if (!products) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Products not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const getProductById = async (event, context) => {
  try {
    const products = await getProducts();
    const product = products.find(
      (product) => product.id === Number(event.pathParameters.id)
    );
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Product not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = {
  getProductsList,
  getProductById,
};
