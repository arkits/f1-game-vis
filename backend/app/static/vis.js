$(document).ready(function () {
  namespace = "";

  show_logs = false;

  var socket = io(namespace);

  socket.on("aux_event", function (msg, cb) {
    $("#logs").prepend(
      "<br>" +
        $("<div/>")
          .text("aux_event >> " + JSON.stringify(msg))
          .html()
    );
    if (cb) cb();
  });

  socket.on("telemetry", function (msg, cb) {
    if (show_logs) {
      $("#logs").prepend(
        "<br>" +
          $("<div/>")
            .text("telemetry >> " + JSON.stringify(msg))
            .html()
      );
    }

    if ("speed" in msg) {
      $("#speed").text(msg.speed);
    }

    if ("engineRPM" in msg) {
      $("#engineRPM").text(msg.engineRPM);
    }

    if ("gear" in msg) {
      $("#gear").text(msg.gear);
    }

    if ("revLightsPercent" in msg) {
      var value = msg.revLightsPercent + "%";
      $("#revLightsPercent").css("width", value);
    }

    if (cb) cb();
  });

  // Interval function that tests message latency by sending a "ping"
  // message. The server then responds with a "pong" message and the
  // round trip time is measured.
  var ping_pong_times = [];
  var start_time;
  window.setInterval(function () {
    start_time = new Date().getTime();
    socket.emit("test_ping");
  }, 1000);

  // Handler for the "pong" message. When the pong is received, the
  // time from the ping is stored, and the average of the last 30
  // samples is average and displayed.
  socket.on("test_pong", function () {
    var latency = new Date().getTime() - start_time;
    ping_pong_times.push(latency);
    ping_pong_times = ping_pong_times.slice(-30); // keep last 30 samples
    var sum = 0;
    for (var i = 0; i < ping_pong_times.length; i++) sum += ping_pong_times[i];
    $("#ping-pong").text(Math.round((10 * sum) / ping_pong_times.length) / 10);
  });
});
