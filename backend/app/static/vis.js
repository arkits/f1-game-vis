let motion_data = [];

$(document).ready(function () {
  // Setup Socket IO
  setup_sio();

  draw_motion_chart();
});

function setup_sio() {
  namespace = "";
  display_logs = false;

  var socket = io(namespace);

  socket.on("aux_event", function (msg) {
    $("#logs").prepend(
      "<br>" +
        $("<div/>")
          .text("aux_event >> " + JSON.stringify(msg))
          .html()
    );
  });

  socket.on("car_motion_data", function (msg) {
    motion_data.push(msg);
    draw_motion_chart();
  });

  socket.on("player_car_telemetry", function (msg) {
    if (display_logs) {
      $("#logs").prepend(
        "<br>" +
          $("<div/>")
            .text("player_car_telemetry >> " + JSON.stringify(msg))
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
  });

  // Calculate and display latency
  socket.on("test_pong", function () {
    var latency = new Date().getTime() - start_time;
    ping_pong_times.push(latency);
    ping_pong_times = ping_pong_times.slice(-30); // keep last 30 samples
    var sum = 0;
    for (var i = 0; i < ping_pong_times.length; i++) sum += ping_pong_times[i];
    $("#ping-pong").text(Math.round((10 * sum) / ping_pong_times.length) / 10);
  });

  var ping_pong_times = [];
  var start_time;

  window.setInterval(function () {
    start_time = new Date().getTime();
    socket.emit("test_ping");
  }, 1000);
}

function draw_motion_chart() {
  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  };

  var width = 700;
  var height = 500;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // Scale the range of the data
  x.domain(
    d3.extent(motion_data, function (d) {
      return d.worldPositionX;
    })
  );

  y.domain(
    d3.extent(motion_data, function (d) {
      return d.worldPositionY;
    })
  );

  // define the line
  var valueline = d3
    .line()
    .x(function (d) {
      return x(d.worldPositionX);
    })
    .y(function (d) {
      return y(d.worldPositionY);
    });

  d3.select("#motion-map").remove();
  d3.select("#motion-map-container").append("svg").attr("id", "motion-map");

  // append the svg object to the body of the page
  var svg = d3
    .select("#motion-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add the trendline
  svg
    .append("path")
    .data([motion_data])
    .attr("class", "line")
    .attr("d", valueline)
    .attr("stroke", "#32CD32")
    .attr("stroke-width", 2)
    .attr("fill", "#FFFFFF");

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g").call(
    d3.axisLeft(y).tickFormat(function (d) {
      return d;
    })
  );
}
