const usernamePassword = 'mrodriguezm21=TEST_PASSWORD';
const base64Credentials = Buffer.from(usernamePassword, 'utf-8').toString('base64');
console.log(base64Credentials);