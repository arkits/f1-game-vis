let motion_data = [];
let npc_motion = [];
let motion_map_viewport_size = 600;

$(document).ready(function () {
    // Setup Socket IO
    setup_sio();

    draw_motion_chart();
});

function setup_sio() {
    namespace = '';
    display_logs = false;

    var socket = io(namespace);

    socket.on('aux_event', function (msg) {
        $('#logs').prepend(
            '<br>' +
                $('<div/>')
                    .text('aux_event >> ' + JSON.stringify(msg))
                    .html()
        );
    });

    socket.on('motion_data', function (msg) {
        // Update player_motion_data
        motion_data.push(msg);

        // Update npc_motion
        npc_motion = msg.npc_motion;

        draw_motion_chart();
    });

    socket.on('player_car_telemetry', function (msg) {
        if (display_logs) {
            $('#logs').prepend(
                '<br>' +
                    $('<div/>')
                        .text('player_car_telemetry >> ' + JSON.stringify(msg))
                        .html()
            );
        }

        if ('speed' in msg) {
            $('#speed').text(msg.speed);
        }

        if ('engineRPM' in msg) {
            $('#engineRPM').text(msg.engineRPM);
        }

        if ('gear' in msg) {
            $('#gear').text(msg.gear);
        }

        if ('drs' in msg) {
            if (msg.drs === 0) {
                $('#drs-badge').attr('class', 'badge');
            } else {
                $('#drs-badge').attr('class', 'badge badge-success');
            }
        }

        if ('revLightsPercent' in msg) {
            $('#revLightsPercent').css('width', msg.revLightsPercent + '%');
        }

        if ('throttle' in msg) {
            $('#throttle-progress').css('width', msg.throttle * 100 + '%');
        }

        if ('brake' in msg) {
            $('#brake-progress').css('width', msg.brake * 100 + '%');
        }

        if ('steer' in msg) {
            var steer_value = ((msg.steer + 1) / 2) * 100;
            $('#steer-progress').css('width', steer_value + '%');
        }
    });

    socket.on('player_car_status', function (msg) {
        if ('ersDeployMode' in msg) {
            if (msg.ersDeployMode === 0) {
                $('#ers-badge').attr('class', 'badge');
            } else if (msg.ersDeployMode === 1) {
                $('#ers-badge').attr('class', 'badge badge-success');
            } else {
                $('#ers-badge').attr('class', 'badge badge-secondary');
            }
        }
    });

    socket.on('player_lap_data', function (msg) {
        if ('currentLapTime' in msg) {
            $('#current-lap-time').text(msg.currentLapTime.toFixed(3));
        }
        if ('carPosition' in msg) {
            $('#position').text(msg.carPosition);
        }
        if ('bestLapTime' in msg) {
            $('#best-lap-time').text(msg.bestLapTime.toFixed(3));
        }
        if ('lastLapTime' in msg) {
            $('#last-lap-time').text(msg.lastLapTime.toFixed(3));
        }
    });

    // Calculate and display latency
    socket.on('test_pong', function () {
        var latency = new Date().getTime() - start_time;
        ping_pong_times.push(latency);
        ping_pong_times = ping_pong_times.slice(-30); // keep last 30 samples
        var sum = 0;
        for (var i = 0; i < ping_pong_times.length; i++) sum += ping_pong_times[i];
        $('#ping-pong').text(Math.round((10 * sum) / ping_pong_times.length) / 10);
    });

    var ping_pong_times = [];
    var start_time;

    window.setInterval(function () {
        start_time = new Date().getTime();
        socket.emit('test_ping');
    }, 1000);
}

function draw_motion_chart() {
    // Margin sizes for the chart
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };

    // Default chart width and height
    var width = 700;
    var height = 700;

    // Set the chart ranges
    var x = d3.scaleLinear().domain([-motion_map_viewport_size, motion_map_viewport_size]).range([0, width]);
    var y = d3.scaleLinear().domain([-motion_map_viewport_size, motion_map_viewport_size]).range([height, 0]);

    // Remove the old element and recreate it
    d3.select('#motion-map').remove();
    d3.select('#motion-map-container').append('svg').attr('id', 'motion-map');

    var svg = d3
        .select('#motion-map')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Add the racing line
    svg.append('path')
        .datum(motion_data)
        .attr('fill', 'none')
        .attr('stroke', '#33b5e5')
        .attr('stroke-width', 1.5)
        .attr(
            'd',
            d3
                .line()
                .x(function (d) {
                    return x(d.player_motion.worldPositionX);
                })
                .y(function (d) {
                    return y(d.player_motion.worldPositionZ);
                })
        );

    // Add the player potion marker
    svg.selectAll('player-dot')
        .data([motion_data[motion_data.length - 1]])
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', function (d) {
            return x(d.player_motion.worldPositionX);
        })
        .attr('cy', function (d) {
            return y(d.player_motion.worldPositionZ);
        })
        .attr('stroke', '#ff9800')
        .attr('fill', '#ff9800')
        .attr('stroke-width', 1.5);

    // Add the potion markers for the NPCs
    svg.selectAll('npc-dot')
        .data(npc_motion)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', function (d) {
            return x(d.worldPositionX);
        })
        .attr('cy', function (d) {
            return y(d.worldPositionZ);
        })
        .attr('stroke', '#33b5e5')
        .attr('stroke-width', 1.5);
}
