(function () {
    'use strict';
    $(function () {
        $('#submit').click(function (e) {
            var text, line;
            text = $('#gcodeText').val();
            line = parse(text);
            draw(line);
            console.log(line);
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
        if (d.indexOf('X') === -1 || d.indexOf('Y') === -1) {
            return;
        }
        
        part = d.split(' ');
        if (part[0] === 'G1') {
            x = parseFloat(part[1].slice(1));
            y = parseFloat(part[2].slice(1));
            line.push([x, y]);

        } else if (part[0] === 'G0') {
            x = parseFloat(part[1].slice(1));
            y = parseFloat(part[2].slice(1));
            line.push([x, y]);
        }
    });
    return line;
}

function draw(line) {
    'use strict';
    
    var OFFSET = 30;
    var SCALE = 10;

    var ctx = $('#myCanvas')[0].getContext('2d'), i;
    for (i = 0; i < line.length; i += 2) {
        var x1, y1, x2, y2;
        x1 = (line[i][0] + OFFSET) * SCALE;
        y1 = (line[i][1] + OFFSET) * SCALE;

        x2 = (line[i+1][0] + OFFSET) * SCALE;
        y2 = (line[i+1][1] + OFFSET) * SCALE;
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        console.log(x1, y1, x2, y2);
    }
}


