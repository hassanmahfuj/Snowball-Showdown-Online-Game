var player1;
var player2;

var snowball1 = [];
var snowball2 = [];

var action1Cooldown = 0;
var action2Cooldown = 0;

var score1 = 0;
var score2 = 0;

function startGame() {
    player1 = new component(30, 30, "red", 10, 120);
    player2 = new component(30, 30, "blue", 440, 120);

    score1text = new component("20px", "Consolas", "black", 8, 20, "text");
    score2text = new component("20px", "Consolas", "black", 460, 20, "text");

    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
                crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;

    player1.speedX = 0;
    player1.speedY = 0;
    player2.speedX = 0;
    player2.speedY = 0;

    if (myGameArea.keys && myGameArea.keys[87]) {
        if(player1.y > 0) player1.speedY = -2;
    }
    if (myGameArea.keys && myGameArea.keys[83]) {
        if(player1.y < 270 - player1.height) player1.speedY = 2;
    }
    if (myGameArea.keys && myGameArea.keys[70] && myGameArea.frameNo > action1Cooldown+30) {
        snowball1.push(new component(15, 15, "red", 20, player1.y+8));
        action1Cooldown = myGameArea.frameNo;
    }

    if (myGameArea.keys && myGameArea.keys[38]) {
        if(player2.y > 0) player2.speedY = -2;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        if(player2.y < 270 - player2.height) player2.speedY = 2;
    }
    if (myGameArea.keys && myGameArea.keys[37] && myGameArea.frameNo > action2Cooldown+30) {
        snowball2.push(new component(15, 15, "blue", 440, player2.y+8));
        action2Cooldown = myGameArea.frameNo;
    }

    for (i = 0; i < snowball1.length; i++) {
        snowball1[i].x += 3;
        snowball1[i].update();
        if(snowball1[i].crashWith(player2)) {
            score1++;
            snowball1.shift();
        } else if(snowball1[i].x > 470) {
            snowball1.shift();
        }
    }
    for (j = 0; j < snowball2.length; j++) {
        snowball2[j].x -= 3;
        snowball2[j].update();
        if(snowball2[j].crashWith(player1)) {
            score2++;
            snowball2.shift();
        } else if(snowball2[j].x < 0) {
            snowball2.shift();
        }
    }


    score1text.text = score1;
    score2text.text = score2;
    score1text.update();
    score2text.update();

    player1.newPos();
    player1.update();
    player2.newPos();
    player2.update();
}