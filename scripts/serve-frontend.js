const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = portIndex >= 0 ? Number(args[portIndex + 1]) : 3000;

const projectRoot = path.resolve(__dirname, "..");
const buildDir = path.join(projectRoot, "frontend", "build");
const indexFile = path.join(buildDir, "index.html");

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".map", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function safeJoin(base, requestPath) {
  const normalized = path.posix
    .normalize("/" + requestPath)
    .replace(/^\/+/, "");
  const candidate = path.join(base, normalized);
  const resolvedBase = path.resolve(base) + path.sep;
  const resolvedCandidate = path.resolve(candidate);
  if (!resolvedCandidate.startsWith(resolvedBase)) return null;
  return resolvedCandidate;
}

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function streamFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes.get(ext) || "application/octet-stream";
  const stream = fs.createReadStream(filePath);
  stream.on("error", () =>
    send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "Error")
  );
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    return send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
  }

  const url = new URL(req.url, "http://localhost");
  const requestPath = decodeURIComponent(url.pathname);

  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(
      res,
      405,
      { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" },
      "Method Not Allowed"
    );
  }

  const candidate = safeJoin(buildDir, requestPath);
  if (!candidate) {
    return send(res, 403, { "Content-Type": "text/plain; charset=utf-8" }, "Forbidden");
  }

  fs.stat(candidate, (err, stat) => {
    if (!err && stat.isFile()) {
      return streamFile(res, candidate);
    }

    fs.stat(indexFile, (indexErr, indexStat) => {
      if (!indexErr && indexStat.isFile()) {
        return streamFile(res, indexFile);
      }
      return send(
        res,
        500,
        { "Content-Type": "text/plain; charset=utf-8" },
        "Missing frontend build. Run: cd frontend && npm run build"
      );
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Serving frontend build from ${buildDir}`);
  // eslint-disable-next-line no-console
  console.log(`Open: http://localhost:${port}`);
});

