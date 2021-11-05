const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const getOctokit = () => {
  const pem = fs.readFileSync("./jd-poc-2.2021-11-03.private-key.pem", "utf8");

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: 149373,
      privateKey: pem,
      clientId: "Iv1.ca365a2d1513307a",
      clienteSecret: "d080e5ca5a27eccbc312c3356e972eb626083d42",
      installationId: 20485655,
    },
  });
};

module.exports = getOctokit;
