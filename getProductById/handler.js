import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { createResponse } from "../libs/index.js";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
export const getProductById = async (event, context) => {
  const { productId } = event.pathParameters;
  console.log("productId", productId);
  console.log(typeof productId);
  try {
    const product = new GetCommand({
      TableName: "products",
      Key: { id: productId },
    });
    const productResponse = await docClient.send(product);
    if (!productResponse.Item) {
      return createResponse(404, { message: "Product not found" });
    }
    const stock = new GetCommand({
      TableName: "stock",
      Key: { product_id: productId },
    });
    const stockResponse = await docClient.send(stock);
    const response = {
      ...productResponse.Item,
      count: stockResponse.Item.count,
    };
    return createResponse(200, response);
  } catch (error) {
    return createResponse(500, error);
  }
};
