// Regenerates the "Our Software & Tools" table in README.md from repos.json.
// Runs latest-release lookups via `gh`, which carries org-repo read access
// (including private repos) through the ORG_SYNC_TOKEN secret set on this workflow.
const fs = require("fs");
const { execFileSync } = require("child_process");

const ORG = "BenchLab-io";
const START_MARKER = "<!-- BENCHLAB-REPOS:START -->";
const END_MARKER = "<!-- BENCHLAB-REPOS:END -->";

function ghJson(args) {
  const out = execFileSync("gh", args, { encoding: "utf8" });
  return JSON.parse(out);
}

function latestRelease(repo, tagPrefix) {
  try {
    if (!tagPrefix) {
      return ghJson(["api", `repos/${ORG}/${repo}/releases/latest`]);
    }
    // `releases/latest` ignores tag prefixes, so when a repo hosts multiple
    // products (e.g. benchlab1/* and benchlab2/* firmware tags) we have to
    // list releases and pick the newest one matching this entry's prefix.
    const releases = ghJson([
      "api",
      `repos/${ORG}/${repo}/releases`,
      "--paginate",
    ]);
    return (
      releases
        .filter((r) => r.tag_name.startsWith(tagPrefix))
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0] || null
    );
  } catch {
    return null;
  }
}

function repoMeta(repo) {
  return ghJson(["api", `repos/${ORG}/${repo}`]);
}

function buildRow(entry) {
  const meta = repoMeta(entry.repo);
  const release = latestRelease(entry.repo, entry.tagPrefix);
  const repoUrl = `https://github.com/${ORG}/${entry.repo}`;
  const visibility = meta.private ? "Private source" : "Public source";
  const sourceLink = meta.private
    ? `${visibility}`
    : `[${visibility}](${repoUrl})`;
  const releasesUrl = entry.tagPrefix
    ? `${repoUrl}/releases?q=${encodeURIComponent(entry.tagPrefix)}`
    : `${repoUrl}/releases`;
  const releaseCell = release
    ? `[${release.tag_name}](${release.html_url})`
    : `[Releases](${releasesUrl})`;
  const updated = release
    ? release.published_at.slice(0, 10)
    : "-";

  return `| **${entry.name}** | ${entry.description} | ${sourceLink} | ${releaseCell} | ${updated} |`;
}

function main() {
  const repos = JSON.parse(fs.readFileSync("repos.json", "utf8"));
  const rows = repos.map(buildRow);

  const table = [
    "| Project | Description | Source | Latest release | Updated |",
    "|---|---|---|---|---|",
    ...rows,
  ].join("\n");

  const readme = fs.readFileSync("README.md", "utf8");
  const start = readme.indexOf(START_MARKER);
  const end = readme.indexOf(END_MARKER);
  if (start === -1 || end === -1) {
    throw new Error("README markers not found");
  }

  const updated =
    readme.slice(0, start + START_MARKER.length) +
    "\n\n" +
    table +
    "\n\n" +
    readme.slice(end);

  fs.writeFileSync("README.md", updated);
}

main();
