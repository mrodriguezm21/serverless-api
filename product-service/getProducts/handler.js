import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { createResponse } from "../libs/index.js";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getProductsList = async (event, context) => {
  try {
    const products = new ScanCommand({
      ProjectionExpression: "id, title, price, description",
      TableName: "products",
    });
    const productsResponse = await docClient.send(products);
    const stock = new ScanCommand({
      ProjectionExpression: "product_id, #cnt",
      ExpressionAttributeNames: {
        "#cnt": "count",
      },
      TableName: "stock",
    });
    const stockResponse = await docClient.send(stock);
    const productsWithStock = productsResponse.Items.map((product) => {
      const { count } = stockResponse.Items.find(
        (item) => item.product_id === product.id
      );
      return { ...product,  count };
    });
    return createResponse(200, productsWithStock);
  } catch (error) {
    return createResponse(500, error);
  }
};
