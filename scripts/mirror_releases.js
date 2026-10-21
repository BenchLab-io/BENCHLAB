// Mirrors each product's latest stable release into a public release on this
// repo, so customers without access to the (mostly private) source repos can
// still download installers/firmware. Requires ORG_SYNC_TOKEN (a PAT with
// read access to the source repos) and the default GITHUB_TOKEN for writing
// releases/assets here.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ORG = "BenchLab-io";
const HUB_REPO = `${ORG}/BENCHLAB`;

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", ...opts });
}

function ghJson(args, env) {
  return JSON.parse(sh("gh", args, { env }));
}

// Reading source repos (private) must use ORG_SYNC_TOKEN; writing to this
// hub repo uses the workflow's own GITHUB_TOKEN.
const sourceEnv = { ...process.env, GH_TOKEN: process.env.ORG_SYNC_TOKEN };
const hubEnv = { ...process.env, GH_TOKEN: process.env.GITHUB_TOKEN };

function latestStableRelease(repo, tagPrefix) {
  const releases = ghJson(
    ["api", `repos/${ORG}/${repo}/releases`, "--paginate"],
    sourceEnv
  );
  return (
    releases
      .filter((r) => !r.draft && !r.prerelease)
      .filter((r) => (tagPrefix ? r.tag_name.startsWith(tagPrefix) : true))
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0] ||
    null
  );
}

function mirrorTagExists(mirrorTag) {
  try {
    ghJson(["api", `repos/${HUB_REPO}/releases/tags/${mirrorTag}`], hubEnv);
    return true;
  } catch {
    return false;
  }
}

function downloadAsset(url, destDir) {
  const name = decodeURIComponent(url.split("/").pop());
  const dest = path.join(destDir, name);
  sh("gh", ["api", url, "-H", "Accept: application/octet-stream"], {
    env: sourceEnv,
    stdio: ["ignore", fs.openSync(dest, "w"), "inherit"],
  });
  return dest;
}

function mirrorRelease(sourceRepo, release, mirrorTag, title) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "benchlab-mirror-"));
  const assetPaths = release.assets.map((a) =>
    downloadAsset(
      `repos/${ORG}/${sourceRepo}/releases/assets/${a.id}`,
      tmpDir
    )
  );

  const notes = `Mirrored from [${sourceRepo} ${release.tag_name}](${release.html_url}).`;

  sh(
    "gh",
    [
      "release",
      "create",
      mirrorTag,
      ...assetPaths,
      "--repo",
      HUB_REPO,
      "--title",
      title,
      "--notes",
      notes,
    ],
    { env: hubEnv }
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });
}

function processEntry(repo, slug, label, tagPrefix) {
  const release = latestStableRelease(repo, tagPrefix);
  if (!release) {
    console.log(`[skip] ${label}: no stable release found`);
    return;
  }

  const version = tagPrefix
    ? release.tag_name.slice(tagPrefix.length)
    : release.tag_name;
  const mirrorTag = `${slug}-${version.replace(/\//g, "-")}`;
  if (mirrorTagExists(mirrorTag)) {
    console.log(`[ok] ${label}: ${mirrorTag} already mirrored`);
    return;
  }

  console.log(`[mirror] ${label}: ${release.tag_name} -> ${mirrorTag}`);
  mirrorRelease(repo, release, mirrorTag, `${label} ${release.tag_name}`);
}

function main() {
  const repos = JSON.parse(fs.readFileSync("repos.json", "utf8"));
  for (const entry of repos) {
    if (entry.variants) {
      for (const v of entry.variants) {
        processEntry(entry.repo, v.slug, `${entry.name} (${v.label})`, v.tagPrefix);
      }
    } else {
      processEntry(entry.repo, entry.slug, entry.name, undefined);
    }
  }
}

main();
