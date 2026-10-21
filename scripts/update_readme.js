// Regenerates the "Our Software & Tools" table in README.md from repos.json.
// Runs latest-release lookups via `gh`, which carries org-repo read access
// (including private repos) through the ORG_SYNC_TOKEN secret set on this workflow.
const fs = require("fs");
const { execFileSync } = require("child_process");

const ORG = "BenchLab-io";
const HUB_REPO = "BENCHLAB";
const START_MARKER = "<!-- BENCHLAB-REPOS:START -->";
const END_MARKER = "<!-- BENCHLAB-REPOS:END -->";

function ghJson(args) {
  const out = execFileSync("gh", args, { encoding: "utf8" });
  return JSON.parse(out);
}

function repoMeta(repo) {
  return ghJson(["api", `repos/${ORG}/${repo}`]);
}

// Private source repos' own release pages 404 for customers, so the README
// links to this hub repo's mirrored copy (see scripts/mirror_releases.js)
// instead, keyed by the mirror tag's "<slug>-" prefix.
function latestMirroredRelease(slug) {
  try {
    const releases = ghJson([
      "api",
      `repos/${ORG}/${HUB_REPO}/releases`,
      "--paginate",
    ]);
    return (
      releases
        .filter((r) => r.tag_name.startsWith(`${slug}-`))
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0] ||
      null
    );
  } catch {
    return null;
  }
}

function releaseCellFor(slug, label) {
  const release = latestMirroredRelease(slug);
  const link = release
    ? `[${release.tag_name.slice(slug.length + 1)}](${release.html_url})`
    : "_pending_";
  const updated = release ? release.published_at.slice(0, 10) : "-";
  return { line: label ? `${label}: ${link}` : link, updated };
}

function buildRow(entry) {
  const meta = repoMeta(entry.repo);
  const repoUrl = `https://github.com/${ORG}/${entry.repo}`;
  const visibility = meta.private ? "Private source" : "Public source";
  const sourceLink = meta.private
    ? `${visibility}`
    : `[${visibility}](${repoUrl})`;

  const cells = entry.variants
    ? entry.variants.map((v) => releaseCellFor(v.slug, v.label))
    : [releaseCellFor(entry.slug, null)];

  const releaseCell = cells.map((c) => c.line).join("<br>");
  const updated = cells.map((c) => c.updated).join("<br>");

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
