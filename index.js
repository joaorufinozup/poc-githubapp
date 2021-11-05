const express = require("express");
const getOctokit = require("./githubapp");

const app = express();

app.use(express.json());

app.post("/createCommit", async (req, res) => {
  const { owner, repo } = req.body;
  const octokit = getOctokit();

  try {
    var headMasterRef = "heads/master";
    var masterReference = await octokit.git.getRef({
      owner,
      repo,
      ref: headMasterRef,
    });

    var latestCommit = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: masterReference.data.object.sha,
    });

    const blob = await octokit.git.createBlob({
      owner,
      repo,
      content: "Mudanca de texto",
    });

    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: latestCommit.data.sha,
      tree: [
        {
          path: "readme.md",
          mode: "100644",
          type: "blob",
          sha: blob.data.sha,
        },
      ],
    });

    const commit = await octokit.git.createCommit({
      owner,
      repo,
      message: "github app commit",
      tree: tree.data.sha,
    });

    await octokit.git.updateRef({
      owner,
      repo,
      ref: headMasterRef,
      sha: commit.data.sha,
      force: true,
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(err.status).send(err);
  }
});

app.post("/createRepo", async (req, res) => {
  const { owner, repoName } = req.body;
  const octokit = getOctokit();

  try {
    await octokit.rest.repos.createInOrg({
      org: owner,
      name: repoName,
    });

    await octokit.rest.repos.createWebhook({
      owner,
      repo: repoName,
      config: {
        url: "https://api.catalog-engine.dev.orangestack.com/webhook-github-templates?tenant=ori::tenant::4a1fb966-4795-4d24-aa37-1f1aad7bd2b1",
        content_type: "json",
      },
      events: ["release"],
    });
    res.sendStatus(201);
  } catch (err) {
    res.status(err.status).end(err);
  }
});

app.post("/createPullRequest", async (req, res) => {
  const { owner, repo, head, base, title } = req.body;
  const octokit = getOctokit();

  try {
    await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
    });
    res.sendStatus(201);
  } catch (err) {
    res.status(err.status).send(err);
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
