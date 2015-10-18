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

    return function () {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        console.log('line done.');
    };
}

function runTasks(tasks) {
    
    var TASK_LIMIT = 1000;
    var INTERVAL_TIME = 500;
    var taskStart = 0;
    
    setInterval(function() {
        async.parallel(tasks.slice(taskStart, taskStart + TASK_LIMIT), function() {
            console.log('done');        
        });
        taskStart += TASK_LIMIT;
    }, INTERVAL_TIME);    
    
}

function drawAll(line) {
    'use strict';
    
    var OFFSET = 30;
    var SCALE = 10;

    var ctx = $('#myCanvas')[0].getContext('2d'), i;
    
    var tasks = [], laserOn = false;
    var x = -1, y = -1, newX, newY;
    
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
    
    runTasks(tasks);
}


