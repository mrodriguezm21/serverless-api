import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const sns = new SNSClient();
const docClient = DynamoDBDocumentClient.from(client);

export const catalogBatchProcess = async (event, context) => {
  for (const record of event.Records) {
    const { title, description, price, count } = JSON.parse(record.body);
    if (!title || !description || !price || !count) {
      console.error("Invalid record", record.body);
      continue;
    }
    const id = uuidv4();

    const product = {
      id,
      title,
      description,
      price: Number(price),
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

      await docClient.send(command);
      await docClient.send(stockCommand);

      const message = `Product has been created:
        id: ${id}, title: ${title}, description: ${description}, price: ${price}, count: ${count}`;
      const publishCommand = new PublishCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: message,
      });
      await sns.send(publishCommand);
    } catch (error) {
      console.error(`Failed to process record ${record.body}`, error);
    }
  }
};
