STAGE_WIDTH = 700;
STAGE_HEIGHT = 600;
	
CLOUD_NUM = 6;

SKY_BG_SPEED = 0.5;

window.onload = function () {

    //start crafty
    Crafty.init(STAGE_WIDTH, STAGE_HEIGHT);
    //Crafty.canvas.init();    
    
    //LOADING SCENE
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function () {
		//load takes an array of assets and a callback when complete
		Crafty.load(["imgs/bullet.png","imgs/cloud1.png",
		"imgs/forky_ss.png", "imgs/burger_sheet.png", "imgs/main_title.png","imgs/play_button.png", "imgs/play_button_on.png",
		"imgs/fireball.png", "imgs/minifork.png", "imgs/bacon2.png", "imgs/peppermint.png",
		"imgs/onion_ss.png", "imgs/egg_ss.png", "imgs/sky_bg.png"], function () {
			Crafty.scene("title"); //when everything is loaded, run the main scene
		});

		Crafty.background("#a3e2ff");
		Crafty.e("2D, DOM, Text").attr({ w: 700, h: 20, x: 0, y: 350 })
				.text("Loading")
				.css({ "text-align": "center" });
	});

	//automatically play the loading scene
	Crafty.scene("loading");


	//TITLE SCENE
	Crafty.scene("title", function () {
		Crafty.e("2D, DOM, Image, Tween").attr({ x: -300, y: -300, z: 2}).image("imgs/main_title.png")
			.tween({x:20, y:20}, 80);
		
		Crafty.e("2D, DOM, Image, Mouse").attr({ x: 0, y: 350, z:10 })
					.image("imgs/play_button.png")
					.css({ "cursor": "pointer" })
					.bind('MouseOver', function() {
						this.image("imgs/play_button_on.png");
					})
					.bind('MouseOut', function() {
						this.image("imgs/play_button.png");
					})
					.bind('Click', function () {
						Crafty.scene("main");
					});
					
		sky();
		generateClouds();
					
	});
	
	Crafty.sprite(76, 173, "imgs/forky_ss.png", {forkysprite:[0,0]});
	Crafty.sprite(20, 80, "imgs/bacon2.png", {firebacon:[0,0]});
	Crafty.sprite(120, "imgs/burger_sheet.png", {burg:[0,0]});
	Crafty.sprite(100,91, "imgs/egg_ss.png", {egg:[0,0]});
	Crafty.sprite(120,107, "imgs/onion_ss.png", {onion:[0,0]});
	Crafty.sprite(100, "imgs/fireball.png", {fireball:[0,0]});
	Crafty.sprite(39,36, "imgs/peppermint.png", {peppermint:[0,0]});

	//MAIN GAME
	Crafty.scene("main", function () {
		sky();
		generateClouds();
		
		forky = Crafty.e("Forky, ForkyBase");
				
		simpleEnemyGen = Crafty.e("SimpleEnemyFactory, RealDelay");
			simpleEnemyGen.realDelay(spawnSimpleEnemy, Crafty.math.randomInt(200, 3000));
		
		powerUpGen = Crafty.e("PowerupFactory, RealDelay");
			powerUpGen.realDelay(spawnPowerup, Crafty.math.randomInt(1000,5000));
			
		gameScore = 0;
		gameScoreTxt = 0;
		scoreTxt = Crafty.e("Score, 2D, DOM, Text").attr({x: 10, y: STAGE_HEIGHT-50, w: 300, z:20})
						.textFont({family: 'Impact', size: '24px'})
						.textColor('#000000')
						.bind("EnterFrame", function () {
							if (gameScore > gameScoreTxt) {
								if (gameScore - gameScoreTxt > 10)
									gameScoreTxt += 10;
								else 
									gameScoreTxt += (gameScore - gameScoreTxt);
								
								this.text("Score: " + gameScoreTxt);
							}
						});
	});
    
};

/*****************
	Helper functions
*****************/
function sky() {
	Crafty.e("2D, DOM, Image")
		.attr({x:0, y:0, z:0})
		.image("imgs/sky_bg.png")
		.bind("EnterFrame", function() {
			this.y += SKY_BG_SPEED;
			if (this.y > STAGE_HEIGHT)
				this.y = -639;
		});
	Crafty.e("2D, DOM, Image")
		.attr({x:0, y:-647, z:0})
		.image("imgs/sky_bg.png")
		.bind("EnterFrame", function() {
			this.y += SKY_BG_SPEED;
			if (this.y > STAGE_HEIGHT)
				this.y = -639;
		});
}

function generateClouds() {
	for (var cloud=0; cloud < CLOUD_NUM; cloud++) {		
			Crafty.e("2D, DOM, Image")
				.attr({ x: Crafty.math.randomInt(-50, STAGE_WIDTH+50), y: Crafty.math.randomInt(-300, -50), z: 2 })
				.image("imgs/cloud1.png")
				.bind('EnterFrame', function () {
					this.y += 2;
					if (this.y > STAGE_HEIGHT) {
						this.y = Crafty.math.randomInt(-300, -50);
						this.x = Crafty.math.randomInt(-50, STAGE_WIDTH+50);
					}
				});
	}
}

function spawnSimpleEnemy() {
	Crafty.e("Enemy, 2D, DOM, onion, SpriteAnimation, EnemyBase, SimpleEnemy")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -50, z: 2})		
		.animate("idle", 0, 0, 4)
		.animate("idle", 60, -1)
		.setSpeed(1.5);
		
	Crafty.e("Enemy, 2D, DOM, egg, SpriteAnimation, EnemyBase, SimpleEnemy")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -50, z: 2})		
		.animate("idle", 0, 0, 3)
		.animate("idle", 60, -1)
		.setSpeed(1.5);
		
		
	simpleEnemyGen.realDelay(spawnSimpleEnemy, Crafty.math.randomInt(200, 3000));
}

function spawnBurger() {
	Crafty.e("Enemy, 2D, DOM, burg, SpriteAnimation, EnemyBase, RandomMover")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -100, z: 2})		
		.animate("burger", 0, 0, 22)
		.animate("burger", 60, -1);
}

function spawnPowerup() {
	Crafty.e("Powerup, 2D, DOM, peppermint, SpriteAnimation")
				.animate("spin", 0 , 0, 13)
				.animate("spin", 40, -1)
				.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH-20), y: -50, z: 2})
				.bind("EnterFrame", function () {
					this.y += 5;
					if (this.y > STAGE_HEIGHT)
						this.destroy();
				});
	powerUpGen.realDelay(spawnPowerup, Crafty.math.randomInt(1000,5000));
}
