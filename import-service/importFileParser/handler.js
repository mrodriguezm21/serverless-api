import { createResponse } from "../libs/response.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });
import csv from "csv-parser";
const client = new S3Client({});
const BUCKET = process.env.BUCKET;

export const importFileParser = async (event, context) => {
  const fileName = event.Records[0].s3.object.key;
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
  });
  const parser = csv({ separator: ";" });

  const { Body } = await client.send(command);
  if (!Body) {
    throw new Error("No file body");
  }
  const items = [];

  return new Promise((resolve, reject) => {
    Body.pipe(parser)
      .on("data", (data) => {
        items.push(data);
      })
      .on("end", async () => {
        try {
          for (const item of items) {
            await processData(item);
          }
          resolve(createResponse(200, "All messages sent"));
        } catch (error) {
          console.error(`Failed to send message`, error);
          reject(createResponse(500, "Failed to send messages"));
        }
      });
  });
};

const processData = async (data) => {
  const message = JSON.stringify(data);
  const command = new SendMessageCommand({
    QueueUrl:
      "https://sqs.us-east-1.amazonaws.com/626567425764/catalogItemsQueue",
    MessageBody: message,
  });

  console.log(`Sending message ${message}`);
  await sqs.send(command);
  console.log(`Message sent ${message}`);
};
