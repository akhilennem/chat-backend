const cluster = require("cluster");
const os = require("os");
const http = require("http");
const path=require('path')


cluster.setupPrimary({
    exec: path.join(__dirname, "index.js"), // Correctly joining paths for cross-platform compatibility
  });


if (cluster.isMaster) {
    const numCPUs = os.cpus().length; // Get the number of CPU cores
    console.log(numCPUs)
    console.log(`Master process ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for worker exit and restart if needed
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Worker processes will run the server
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from Worker ${process.pid}\n`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}
