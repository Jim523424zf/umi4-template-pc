const ftp = require("basic-ftp");
const path = require("path");
const { readdirSync, statSync } = require("fs");

const config = {
  localDir: "./dist",
  remoteDir: "/site/wwwroot",
  connect: {
    host: "waws-prod-hk1-023.ftp.azurewebsites.windows.net",
    user: "testpub\\$testpub",
    password: "jDloa1GdfkBJnmG7x8qqcFTi3MZ9cCrCguYos2WpA3dveQdQ1ZFCJwvDlr5P",
    secure: true,
  },
};

(async (config) => {
  const localDir = path.resolve(process.cwd(), config.localDir);
  const remoteDir = config.remoteDir;
  const client = new ftp.Client();

  await client.access(config.connect);

  console.log("Connected to FTP server");

  await client.ensureDir(remoteDir);
  await client.cd(remoteDir);

  console.log(`Changed working directory to ${remoteDir}`);

  const files = walkSort(walkDir(localDir));
  const totalBytes = files.reduce((total, file) => total + statSync(file).size, 0);

  const remotePathMap = new Map();

  for (const file of files) {
    const localPath = file;
    const remotePath = path.posix.join(remoteDir, file.replace(localDir, "").replace(/\\/g, "/"));

    let retry = 0;
    while (true) {
      try {
        const size = statSync(localPath).size;
        const time = statSync(localPath).mtime;

        const remoteSize = await client.size(remotePath).catch(() => 0);
        const remoteTime = await client
          .lastMod(remotePath)
          .then((lastMod) => lastMod.getTime())
          .catch(() => -1);

        if (remoteSize !== size || remoteTime < time.getTime()) {
          if (!remotePathMap.has(remotePath)) {
            remotePathMap.set(remotePath, true);
            await client.ensureDir(path.posix.join(remotePath, ".."));
          }
          await client.uploadFrom(localPath, remotePath);
          const uploadedBytes =
            files.slice(0, files.indexOf(file)).reduce((total, file) => total + statSync(file).size, 0) + size;
          const percent = Math.round((uploadedBytes / totalBytes) * 100);
          console.log(`${percent}% Uploaded ${file}`);
        } else {
          const uploadedBytes =
            files.slice(0, files.indexOf(file)).reduce((total, file) => total + statSync(file).size, 0) + size;
          const percent = Math.round((uploadedBytes / totalBytes) * 100);
          console.log(`${percent}% Skipped ${file}`);
        }

        break;
      } catch (error) {
        retry++;
        if (retry >= 5) {
          console.error("File Upload Error", localPath, remotePath, error);
          throw error;
        }
        console.error("File Upload Error, retry=" + retry, remotePath);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await client.access(config.connect);
      }
    }
  }

  console.log(`Uploaded files from ${localDir} to ${remoteDir}`);

  await client.close();

  console.log("Disconnected from FTP server");
})(config);

function walkDir(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.resolve(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function walkSort(files) {
  return files.sort((a, b) => {
    const aName = path.basename(a);
    const bName = path.basename(b);

    if (aName === "index.html") {
      return 1;
    } else if (bName === "index.html") {
      return -1;
    } else {
      return aName.localeCompare(bName);
    }
  });
}

