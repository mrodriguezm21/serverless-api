import { createResponse } from "../libs/response.js";
import { PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl }  from "@aws-sdk/s3-request-presigner";

const client = new S3Client({});

export const importProductsFile = async (event, context) => {
  const fileName = event.queryStringParameters.name;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `uploaded/${fileName}`,
    ContentType: "text/csv",
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 15 * 60 });
    // console.log("command", command);
    // const response = await client.send(command);
    // console.log("response", response);
    return createResponse(200, url);
  } catch (err) {
    console.error(err);
  }
};
