var http = require('http');
var os = require('os');

var qps = [];

const SECONDS = 5;

var handler = function(request, response) {
  var now = new Date().getTime();

  var total = 0;
  for (var time in qps) {
    if (qps.hasOwnProperty(time)) {
      if (time < now - SECONDS * 1000) {
        qps[time] = null;
      } else {
        total += qps[time];
      }
    }
  }

  var avgQps = total / SECONDS;

  if (request.url == "/metrics") {
    response.writeHead(200);
    response.end("# TYPE qps gauge\nqps " + avgQps + "\n");
    console.log("Received request for /qps: " + avgQps);
    return;
  }

  if (qps[now] == null) {
    qps[now] = 0;
  }
  qps[now]++;

  response.writeHead(200);
  response.end("You've hit " + os.hostname() + ". QPS in last " + SECONDS + " seconds has been " + avgQps + "\n");
};

var www = http.createServer(handler);
www.listen(8080);

