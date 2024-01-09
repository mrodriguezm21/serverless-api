export const basicAuthorizer = async (event, context, callback) => {
  console.log("Event: ", event);

  const encodedCreds = event.authorizationToken.split(" ")[1];
  const buff = Buffer.from(encodedCreds, "base64");
  const [username, password] = buff.toString("utf-8").split(":");

  console.log(`username: ${username} and password: ${password}`);

  const storedUserPassword = process.env[username];

  const effect =
    !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: "*",
      },
    ],
  };

  const authResponse = {
    principalId: username,
    policyDocument,
  };

  callback(null, authResponse);
};
