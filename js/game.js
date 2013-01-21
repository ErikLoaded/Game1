function img_res(path)
{
    var i = new Image();
    i.src = 'img/'+path;

    return i;
}

//Global game object
var global_game = null;

//start game once page has finished loaded
$(function() {
    start_game();
});

function start_game()
{
    var g = new game();

    //store game pointer in a global object
    global_game = g;
    console.log(g);
    g.start();
}

function game()
{
    this.fps = 60;
    this.scale = 50;

    //global array of all objects to manage
    this.game_objects = [];
this.screen_width = $('#canvas').width();
this.screen_height = $('#canvas').height();
    this.points = 0;
    this.to_destroy = [];
    this.time_elapsed = 0;
}

game.prototype.setup = function()
{
    this.ctx = ctx = $('#canvas').get(0).getContext('2d');
    var canvas = $('#canvas');
    this.canvas = canvas;


    //dimensions in metres
    var w = this.screen_width;
    var h = this.screen_height;
        console.log(this.screen_height);

    //the player
    this.player = new player({x : 0, y: 0 , game : this});

    this.game_objects.push(this.player);

    //attach event handlers for key presses
    this.start_handling();

}
game.prototype.start = function()
{
    this.on = true;
    this.total_points = 0;

    this.setup();
    this.is_paused = false;
    console.log('start game');

    //Start the Game Loop - TICK TOCK TICK TOCK TICK TOCK TICK TOCK
    this.tick();
}

game.prototype.tick = function(cnt)
{
        //console.log('game tick');

    if(!this.is_paused && this.on)
    {
        this.time_elapsed += 1;

        //create a random fruit on top
        if(this.time_elapsed % 50 == 0)
        {
            var xc = Math.random() * 8 + this.screen_width/2 - 4;
            var yc = this.screen_height/2 + 2.5;

        }

        //tick all objects, if dead then remove
        for(var i in this.game_objects)
        {

            this.game_objects[i].tick();
        }



        if(!this.is_paused && this.on)
        {
            var that = this;
            //game.fps times in 1000 milliseconds or 1 second
            this.timer = setTimeout( function() { that.tick(); }  , 1000/this.fps);
        }
    }
}
game.prototype.start_handling = function()
{
    var that = this;

    $(document).on('keydown.game' , function(e)
    {
        that.key_down(e);
        return false;
    });

    $(document).on('keyup.game' ,function(e)
    {
        that.key_up(e);
        return false;
    });
}

game.prototype.key_down = function(e)
{
    var code = e.keyCode;
    console.log('key down');

    //LEFT
    if(code == 37)
    {
        this.player.do_move_left = true;


    }
    //UP
    else if(code == 38)
    {
//        this.player.jump();
    }
    //RIGHT
    else if(code == 39)
    {
        this.player.do_move_right = true;


    }
}

game.prototype.key_up = function(e)
{
    var code = e.keyCode;
    console.log(e);
    //UP KEY
    if(code == 38)
    {
        this.player.do_move_up = false;
        this.player.can_move_up = true;
    }
    //LEFT
    else if(code == 37)
    {
        this.player.do_move_left = false;
        this.player.can_move_right = true;



    }
    //RIGHT
    else if(code == 39)
    {
        this.player.do_move_right = false;
        this.player.can_move_left = true;



    }
}
function player(options)
{
    this.height = 10;
    this.width = 10;

    this.x = options.x;
    this.y = options.y;
    this.game = options.game;
    this.age = 0;

    this.do_move_left = false;
    this.do_move_right = false;
    this.max_hor_vel = 2;
    this.max_ver_vel = 4;
    this.can_move_up = true;
    this.can_move_left = true;
    this.can_move_right = true;
    this.img = img_res('monkey.png');
    console.log(this.game);


    this.game.ctx.fillStyle = 'red';
    this.game.ctx.fillRect(this.x, this.y, this.height, this.width);
    this.game.ctx.strokeStyle = 'black';
this.game.ctx.stroke();

        console.log(    );

}

player.prototype.draw = function(x,y)
{
 ctx.save();

//    this.game.ctx.fillStyle = 'red';
   this.game.ctx.translate(0,0);

   this.game.ctx.clearRect(-5, -5, this.game.screen_height+5, this.game.screen_width+5);

ctx.restore();
   this.game.ctx.translate(x ,y);
   this.game.ctx.fillRect(x, y, this.height, this.width);


}
player.prototype.tick = function()
{
  //  var x = ;
    //console.log('player tick');
    if(this.do_move_left && this.can_move_left)
    {

        this.game.player.draw(-1, 0);
        this.can_move_right = false;
        //console.log('z');

    }

    if(this.do_move_right && this.can_move_right)
    {
         this.game.player.draw(1, 0);
         this.can_move_left = false;

    }

    if(this.do_move_up && this.can_move_up)
    {

         this.game.player.draw(0, 6);
        this.can_move_up = false;
    }

    this.age++;
}