const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
require("dotenv").config();

const getOctokit = () => {
  const pem = fs.readFileSync("./jd-poc-2.2021-11-03.private-key.pem", "utf8");

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: Number(process.env.APP_ID),
      privateKey: pem,
      clientId: process.env.CLIENT_ID,
      clienteSecret: process.env.CLIENTE_SECRET,
      installationId: Number(process.env.INSTALLATION_ID),
    },
  });
};

module.exports = getOctokit;
