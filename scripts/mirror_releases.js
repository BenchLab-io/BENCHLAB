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

function repoMeta(repo) {
  return ghJson(["api", `repos/${ORG}/${repo}`], sourceEnv);
}

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

// Minimal glob: '*' matches any run of characters, everything else is literal.
function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function filterAssets(assets, allowlist) {
  const patterns = allowlist.map(globToRegExp);
  return assets.filter((a) => patterns.some((p) => p.test(a.name)));
}

function downloadAsset(repo, asset, destDir) {
  const dest = path.join(destDir, asset.name);
  sh(
    "gh",
    [
      "api",
      `repos/${ORG}/${repo}/releases/assets/${asset.id}`,
      "-H",
      "Accept: application/octet-stream",
    ],
    {
      env: sourceEnv,
      stdio: ["ignore", fs.openSync(dest, "w"), "inherit"],
    }
  );
  return dest;
}

function mirrorRelease(sourceRepo, release, assets, mirrorTag, title) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "benchlab-mirror-"));
  const assetPaths = assets.map((a) => downloadAsset(sourceRepo, a, tmpDir));

  const notes = [
    `Mirrored from [${sourceRepo} ${release.tag_name}](${release.html_url}).`,
    "",
    "> **Note:** the auto-generated \"Source code (zip)\" / \"Source code (tar.gz)\" links below are GitHub's standard archive of this BENCHLAB hub repo at this tag (README/scripts only) — not this product's source.",
  ].join("\n");

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

function processEntry(repo, slug, label, tagPrefix, assetAllowlist) {
  const meta = repoMeta(repo);
  // Private repos must declare an explicit asset allowlist in repos.json —
  // without one we refuse to guess, since release assets (sdists, source
  // zips) can contain the very source code the repo is private to protect.
  if (meta.private && !assetAllowlist) {
    throw new Error(
      `${label}: repo ${repo} is private but has no assetAllowlist configured in repos.json`
    );
  }

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

  const assets = assetAllowlist
    ? filterAssets(release.assets, assetAllowlist)
    : release.assets;

  if (assets.length === 0) {
    throw new Error(
      `${label}: ${release.tag_name} has no assets matching assetAllowlist ${JSON.stringify(
        assetAllowlist
      )}`
    );
  }

  console.log(
    `[mirror] ${label}: ${release.tag_name} -> ${mirrorTag} (${assets
      .map((a) => a.name)
      .join(", ")})`
  );
  mirrorRelease(repo, release, assets, mirrorTag, `${label} ${release.tag_name}`);
}

function main() {
  const repos = JSON.parse(fs.readFileSync("repos.json", "utf8"));
  for (const entry of repos) {
    if (entry.variants) {
      for (const v of entry.variants) {
        processEntry(
          entry.repo,
          v.slug,
          `${entry.name} (${v.label})`,
          v.tagPrefix,
          entry.assetAllowlist
        );
      }
    } else {
      processEntry(entry.repo, entry.slug, entry.name, undefined, entry.assetAllowlist);
    }
  }
}

main();
