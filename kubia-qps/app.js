var http = require('http');
var os = require('os');

var qps = [];

const MS_PER_MINUTE = 60000;

var handler = function(request, response) {
  var now = new Date().getTime();

  var totalRequestsLastMinute = 0;
  for (var time in qps) {
    if (qps.hasOwnProperty(time)) {
      if (time < now - MS_PER_MINUTE) {
        qps[time] = null;
      } else {
        totalRequestsLastMinute += qps[time];
      }
    }
  }

  if (request.url == "/qps") {
    response.writeHead(200);
    response.end("# TYPE qps gauge\nqps " + (totalRequestsLastMinute / 60) + "\n");
    console.log("Received request for /qps: " + (totalRequestsLastMinute / 60));
    return;
  }

  if (qps[now] == null) {
    qps[now] = 0;
  }
  qps[now]++;

  response.writeHead(200);
  response.end("You've hit " + os.hostname() + ". QPS is " + (totalRequestsLastMinute / 60) + "\n");
};

var www = http.createServer(handler);
www.listen(8080);

