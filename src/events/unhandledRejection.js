import { config, github } from "../main.js";

export default {
  class: "Process",
  async execute(error, promise) {
    await console.error(error);

    const { owner, repo } = config.github;
    await github.request(`POST /repos/${owner}/${repo}/issues/`, {
      owner,
      repo,
      title: error.message || "Ada error nih (ᗒᗩᗕ)",
      body: `${error.cause}`,
      labels: [
        "error"
      ]
    })
  }
};
