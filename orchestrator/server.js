const LISTENING_PORT = process.env.LISTENING_PORT || 3500;

var ON_DEATH = require("death")({ debug: true });
var app = require("express")();
var server = require("http").createServer(app);
var orchestrator = require("./orchestrator");

orchestrator.injectMetricsRoute(app);
orchestrator.init(server);

// healthcheck endpoint
app.get("/health", (req, res) => {
  res.send("Healthy");
});

server.listen(LISTENING_PORT, () => {
  console.log(`Server listening on port ${LISTENING_PORT}`);
});

ON_DEATH((signal, err) => {
  console.log("ON_DEATH signal detected");
  console.error(err);
	let exitCode = 0;
	switch (signal) {
		case "SIGINT":
			exitCode = 130;
			break;
		case "SIGQUIT":
			exitCode = 131;
			break;
		case "SIGTERM":
			exitCode = 143;
			break;
		default:
			exitCode = 1;
			break;
	}
	process.exit(exitCode);
});
