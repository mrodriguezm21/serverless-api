import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const createProduct = async (event, context) => {
  const { title, description, price, count } = JSON.parse(event.body);
  const id = uuidv4();
  const product = {
    id,
    title,
    description,
    price,
  };
  const stock = {
    product_id: id,
    count,
  };
  try {
    const command = new PutCommand({
      TableName: "products",
      Item: product,
    });
    const stockCommand = new PutCommand({
      TableName: "stock",
      Item: stock,
    });
    await docClient.send(stockCommand);
    await docClient.send(command);
    return {
      statusCode: 201,
      body: JSON.stringify({ ...product, stock: count }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
