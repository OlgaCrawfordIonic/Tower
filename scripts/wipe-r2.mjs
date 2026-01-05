import "dotenv/config";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

function getArg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function hasFlag(name) {
  return process.argv.includes(name);
}

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET;

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET) {
  console.error("Missing env vars. Check .env for R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.");
  process.exit(1);
}

const ENDPOINT =
  process.env.R2_ENDPOINT || `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;

const PREFIX = getArg("--prefix");         // optional
const DRY_RUN = hasFlag("--dry-run");      // optional
const YES = hasFlag("--yes");              // optional
const REQUIRE = getArg("--require");       // safety: must match bucket name

if (!YES) {
  console.error(
    "\nSAFETY STOP: This will delete objects from your R2 bucket.\n" +
    "Re-run with --yes to proceed.\n" +
    "Optional safety: add --require <bucketName> to prevent accidents.\n"
  );
  process.exit(2);
}

if (REQUIRE && REQUIRE !== BUCKET) {
  console.error(`Safety check failed: --require "${REQUIRE}" does not match R2_BUCKET "${BUCKET}".`);
  process.exit(3);
}

const s3 = new S3Client({
  region: "auto", // required by AWS SDK, not used by R2
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function wipeBucket() {
  let continuationToken = undefined;
  let totalDeleted = 0;
  let totalListed = 0;

  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Bucket:   ${BUCKET}`);
  if (PREFIX) console.log(`Prefix:   ${PREFIX}`);
  if (DRY_RUN) console.log(`Mode:     DRY RUN (no deletions)`);

  while (true) {
    const listResp = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: PREFIX || undefined,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      })
    );

    const contents = listResp.Contents || [];
    if (contents.length === 0) break;

    const keys = contents
      .map((o) => o.Key)
      .filter((k) => typeof k === "string" && k.length > 0);

    totalListed += keys.length;

    if (DRY_RUN) {
      console.log(`Would delete batch: ${keys.length} objects`);
    } else {
      const delResp = await s3.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: {
            Objects: keys.map((Key) => ({ Key })),
            Quiet: true,
          },
        })
      );

      const deletedCount = (delResp.Deleted || []).length;
      totalDeleted += deletedCount;

      if (delResp.Errors && delResp.Errors.length) {
        console.error("Some deletions failed:");
        for (const e of delResp.Errors.slice(0, 20)) {
          console.error(`- ${e.Key}: ${e.Code} ${e.Message}`);
        }
        if (delResp.Errors.length > 20) {
          console.error(`(and ${delResp.Errors.length - 20} more)`);
        }
        // Keep going; many errors are transient or per-key issues.
      }

      console.log(`Deleted batch: ${deletedCount} objects (listed ${keys.length})`);
    }

    continuationToken = listResp.IsTruncated ? listResp.NextContinuationToken : undefined;
    if (!continuationToken) break;
  }

  console.log(`\nDone.`);
  console.log(`Total listed:  ${totalListed}`);
  console.log(`Total deleted: ${DRY_RUN ? 0 : totalDeleted}`);
}

wipeBucket().catch((err) => {
  console.error("Wipe failed:", err?.name || err);
  console.error(err);
  process.exit(1);
});
//Caution! Will wipe everything from lingoapp backet!!!!

//npm run wipe-r2 -- --yes --require lingoapp
//npm run wipe-r2 -- --yes --dry-run
