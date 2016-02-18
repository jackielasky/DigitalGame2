window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
    // Load an image and sprites
    //game.load.image( 'skyLayer', 'assets/background.png' );
    game.load.image('skyLayer','assets/africa.png')
        game.load.image('ball','assets/cutmypic.png');
    game.load.spritesheet('lion','assets/LionSprite3.png',43,83,5);
    game.load.spritesheet('giraffe','assets/giraffeSprite.png',43,83,5);
    game.load.spritesheet('elephant','assets/elephantSprite.png',43,83,5);
    game.load.spritesheet('monkey','assets/monkeySprite.png',43,83,5);
    game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
    game.load.spritesheet('dude', 'assets/dude.png', 50, 48);
    game.load.image('water', 'assets/water.png');
    game.load.audio('music','assets/audio/lionKing.mp3')
    }
    
    var sprite;
    var orb;
    var orb1;
    var orb2;
    var orb3;    
    var player;
    var score = 0;
    var scoreText;
    var stateText;
    var water;
    var cursors, animals, waters;
    var music;
        
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.

        //ball image
         game.add.sprite(0, 0, 'skyLayer');      
         sprite = game.add.sprite(400, 300, 'ball');
         sprite.anchor.setTo(0.5, 0.5);
        
        //music
        music = game.add.audio('music');
        music.play();
        
        water = game.add.sprite(400,300,'water');
        water.anchor.setTo(0.5,0.5);
        waters = game.add.group();
        waters.enableBody = true;
        waters.add(water);
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.startSystem(Phaser.Physics.ARCADE);
        orb = game.add.sprite(400,300,'lion');
        orb.anchor.setTo(0.5);
        orb.pivot.x = 140;
        //orb.body.collideWorldBounds = true;
        
        orb1 = game.add.sprite(400,300,'monkey');
        orb1.anchor.setTo(0.5);
        orb1.pivot.x = 152;
        
        orb2 = game.add.sprite(400,300,'giraffe');
        orb2.anchor.setTo(0.5);
        orb2.pivot.x = 164;
        
        orb3 = game.add.sprite(400,300,'elephant');
        orb3.anchor.setTo(0.5);
        orb3.pivot.x = 150;
        
        animals = game.add.group();
        animals.enableBody = true;
        animals.add(orb);
        animals.add(orb1);
        animals.add(orb2);
        animals.add(orb3);
        
         //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        
        // The player and its settings
        player = game.add.sprite(200,600,'dude');
            
        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.4;
        player.body.gravity.y = 250;
        //player.body.allowGravity = false;
        // Set an initial motion
        //player.body.velocity.x = 400;
        
        
        player.body.collideWorldBounds = true;

                      
        //rain phaser example
        var emitter = game.add.emitter(game.world.centerX, 0, 400);
        emitter.width = game.world.width;
        // emitter.angle = 30; // uncomment to set an angle for the rain.
        emitter.makeParticles('rain');
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.5;
        emitter.setYSpeed(300, 500);
        emitter.setXSpeed(-5, 5);
        emitter.minRotation = 0;
        emitter.maxRotation = 0;
        emitter.start(false, 1600, 5, 0);
           
        //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //  Text game over example phaser
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
           
    }
    
    function update() {
         
        orb.rotation += 0.08;
        orb1.rotation += 0.04;
        orb2.rotation += 0.03;
        orb3.rotation += 0.01;
        
        sprite.angle += 1;
       
//    player.body.gravity = new Phaser.Point(sprite.body.x - player.body.x, sprite.body.y - player.body.y);
//    // Normalize and multiply by actual strength of gravity desired
//    player.body.gravity = player.body.gravity.normalize().multiply(300, 300);
        
        
       // score += 1;
        scoreText.text = score + ' ounces of water';
        
      //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else if (cursors.up.isDown)
        {
            player.body.velocity.y = -350;
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
        
        //run collision
      game.physics.arcade.overlap(player, animals, enemyHitsPlayer, null, this);

     game.physics.arcade.overlap(player, water, collectWater, null, this);
  }
    
    function preRender(){
        orb.x = sprite.x;
        orb.y = sprite.y;
        
        orb1.x = sprite.x;
        orb1.y = sprite.y;
        
        orb2.x = sprite.x;
        orb2.y = sprite.y;
        
        orb3.x = sprite.x;
        orb3.y = sprite.y;
    }
    function render(){
         game.debug.spriteInfo(sprite, 32, 32);
         game.debug.soundInfo(music,20,32);
    }
        
    function enemyHitsPlayer (player,animals) {
        stateText.text=" You were eaten! GAME OVER \n Click to restart";
        stateText.visible = true;
        game.input.onTap.addOnce(restart,this);
    }
   
  function restart () {    
    //resets the score count   
      score = 0;
      stateText.visible = false;
  }
    
function collectWater (player, star) {
    
    //  Add and update the score
    score += 15;
    scoreText.text = score + ' ounces of water';

}
    
};