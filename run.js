(function () {
    'use strict';
    $(function () {
        $('#submit').click(function (e) {
            var text, line;
            text = $('#gcodeText').val();
            line = parse(text);
            drawAll(line);
        });
    });
}());

function parse(data) {
    'use strict';
    var line = [];
    data = data.split("\n");
    data.forEach(function (d) {
        var indexOfComment, part, x, y;

        indexOfComment = d.indexOf(';');
        if (indexOfComment !== -1) {
            d = d.slice(0, d.indexOf(';'));
        }
        
        part = d.split(' ');
        if (part[0] === 'G1' && d.indexOf('X') !== -1 && d.indexOf('Y') !== -1) {
            x = parseFloat(part[1].slice(1));
            y = parseFloat(part[2].slice(1));
            line.push([x, y]);

        } else if (part[0] === 'G0' && d.indexOf('X') !== -1 && d.indexOf('Y') !== -1) {
            x = parseFloat(part[1].slice(1));
            y = parseFloat(part[2].slice(1));
            line.push([x, y]);
        } else if (part[0] === 'M03' || part[0] === 'M05'){
            line.push(part);            
        }
    });
    return line;
}

function genDrawLine(ctx, x1, y1, x2, y2) {

    return function (callback) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        callback(null, [x1, y1, x2, y2]);
    };
}

function runTasks(ctx, tasks) {
    
    var TASK_LIMIT = 1000;
    var INTERVAL_TIME = 500;
    var taskStart = 0;
    
    var interlvalControll = setInterval(function() {
        var partialTasks = tasks.slice(taskStart, taskStart + TASK_LIMIT);
        async.parallel(
            partialTasks, function(err, results) {
                console.log('err =', err, ' done.');
                ctx.stroke();
        });
        
        taskStart += TASK_LIMIT;
        if (taskStart > tasks.length) {
            clearInterval(interlvalControll);
        }
    }, INTERVAL_TIME);    
    
}

function drawAll(line) {
    'use strict';
    
    var OFFSET = 30;
    var SCALE = 10;

    var canvas = $('#myCanvas')[0];
    var ctx = canvas.getContext('2d');    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    var tasks = [], laserOn = false;
    var i, x = -1, y = -1, newX, newY;
    
    for (i = 0; i < line.length; i ++) {        
        
        if (line[i][0] === 'M03') {
            laserOn = true;
        } else if (line[i][0] === 'M05') {
            laserOn = false;
        } else {        
            newX = (line[i][0] + OFFSET) * SCALE;
            newY = (line[i][1] + OFFSET) * SCALE;
            if (laserOn === true && x !== -1 && y !== -1) {
                tasks.push(genDrawLine(ctx, x, y, newX, newY));
            }
            x = newX;
            y = newY;
        }
    }
    
    runTasks(ctx, tasks);
}


