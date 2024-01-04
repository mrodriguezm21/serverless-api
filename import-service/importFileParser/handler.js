import { createResponse } from "../libs/response.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

  Body.pipe(parser)
    .on("data", (data) => {
      console.log(data);
    })
    .on("end", async () => {
      console.log("End of file parsing");
    });

  return createResponse(200, "ok");
};
