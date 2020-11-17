#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { Log } = require("./log");

const log = Log("envs");

const findFiles = async (patter) =>
  new Promise((resolve, reject) =>
    glob(patter, { ignore: ["**/node_modules/**"] }, (err, files) =>
      err ? reject(err) : resolve(files)
    )
  );

const process = async () => {
  const rootPath = path.resolve(__dirname, "..");
  log.debug(`rootPath= ${rootPath}`);

  const rawFiles = await findFiles(`${rootPath}/**/.env*`);
  log.debug(`${rawFiles.length} files found`);

  const filesCmd = rawFiles.map((filePath) => {
    const shortPath = `.${filePath.replace(rootPath, "")}`;
    const content = fs.readFileSync(filePath, "utf-8");
    return `tee ${shortPath} <<EOF\n${content}EOF`;
  });
  filesCmd.forEach((cmd) => {
    console.log(`${cmd}\n`);
  });
};

process();
