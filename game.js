STAGE_WIDTH = 700;
STAGE_HEIGHT = 600;
	
CLOUD_NUM = 6;

SKY_BG_SPEED = 0.5;

window.onload = function () {

    //start crafty
    Crafty.init(STAGE_WIDTH, STAGE_HEIGHT);
    //Crafty.canvas.init();    
    
    
    Crafty.sprite(76, 173, "imgs/forky_ss.png", {forkysprite:[0,0]});
	Crafty.sprite(20, 80, "imgs/bacon2.png", {firebacon:[0,0]});
	Crafty.sprite(120, "imgs/burger_sheet.png", {burg:[0,0]});
	Crafty.sprite(100,91, "imgs/egg_ss.png", {egg:[0,0]});
	Crafty.sprite(30,38, "imgs/eggbullet.png", {eggbullet:[0,0]});
	Crafty.sprite(80,71, "imgs/onion_ss.png", {onion:[0,0]});
	Crafty.sprite(100, "imgs/fireball.png", {fireball:[0,0]});
	Crafty.sprite(100,82, "imgs/peppermint_glow.png", {peppermint:[0,0]});
	Crafty.sprite(120,144, "imgs/drink.png", {drink:[0,0]});
	
	
	
	
	
    
    //LOADING SCENE
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function () {
		//load takes an array of assets and a callback when complete
		Crafty.load(["imgs/cloud1.png",
		"imgs/forky_ss.png", "imgs/burger_sheet.png", "imgs/main_title.png","imgs/play_button.png", "imgs/play_button_on.png",
		"imgs/fireball.png", "imgs/minifork.png", "imgs/bacon2.png", "imgs/peppermint.png",
		"imgs/onion_ss.png", "imgs/egg_ss.png", "imgs/eggbullet.png", "imgs/sky_bg.png",
		"imgs/space_bar.png","imgs/arrow_keys.png","imgs/icecube.png","imgs/drink.png",
		"imgs/rainbow_starburst.png"], function () {
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
		Crafty.e("Title, 2D, DOM, Image, Tween").attr({ x: -300, y: -300, z: 2}).image("imgs/main_title.png")
			.tween({x:20, y:20}, 80);
		
		Crafty.e("2D, DOM, Image, Mouse").attr({ x: STAGE_WIDTH/2-94, y: 350, z:10 })
					.image("imgs/play_button.png")
					.css({ "cursor": "pointer" })
					.bind('MouseOver', function() {
						this.image("imgs/play_button_on.png");
					})
					.bind('MouseOut', function() {
						this.image("imgs/play_button.png");
					})
					.bind('Click', function () {
						this.destroy();
						Crafty("Title").destroy();
						showInstructions();
					});
					
		sky();
		generateClouds();					
	});
	
	

	//MAIN GAME
	Crafty.scene("main", function () {
		difficultyLvl = 0;
		waveNum = 1;
		enemiesAlive = 0;
		
		enemiesPerWave = 2;
		forkDamage = 100;
		
		sky();
		generateClouds();
		
		forky = Crafty.e("Forky, 2D, DOM, forkysprite, SpriteAnimation, ForkyBase")
			.attr({ x: STAGE_WIDTH/2, y: STAGE_HEIGHT/2+50, z: 2})
			.animate("idle", 0, 0, 0)
			.animate("blink", 0, 0, 4)
			.animate("idle", 20, -1)
			.configMovement(1,10);
				
		 simpleEnemyGen = Crafty.e("SimpleEnemyFactory, RealDelay");
 			simpleEnemyGen.realDelay(spawnEnemies, 3000);
		
		powerUpGen = Crafty.e("PowerupFactory, RealDelay");
			powerUpGen.realDelay(spawnPowerup, Crafty.math.randomInt(1000,5000));
		
		// HUD	
		gameScore = 0;
		gameScoreTxt = 0;
		scoreTxt = Crafty.e("Score, 2D, DOM, Text").attr({x: 10, y: STAGE_HEIGHT-40, w: 300, z:20})
						.textFont({size: '24px'})
						.textColor('#000000')
						.text("Score: 0")
						.bind("EnterFrame", function () {
							if (gameScore > gameScoreTxt) {
								if (gameScore - gameScoreTxt > 10)
									gameScoreTxt += 10;
								else 
									gameScoreTxt += (gameScore - gameScoreTxt);
								
								this.text("Score: " + gameScoreTxt);
							}
						});
		cornerLevelTxt = Crafty.e("cornerLevel, 2D, DOM, Text").attr({x: 10, y: 10, w: 300, z:20})
						.textColor('#000000')
						.css({"font-size": '10px'});
		
		//start level 1
		upgradeDiffcultyLvl();
	});
    
};

function upgradeDiffcultyLvl() {
	difficultyLvl++;
	enemiesPerWave++;
	forkDamage = forkDamage/2;
	
	cornerLevelTxt.text("Level " + difficultyLvl);
	Crafty.e("2D, DOM, Text, Tween").attr({x: STAGE_WIDTH/2-20, y: STAGE_HEIGHT/2, w: 500, z:20})
						.css({"font-size": '64px',"color":"#fff", "text-shadow":"2px 2px 20px black"})
						.text("Level "+difficultyLvl)
						.tween({alpha: 0}, 150)
						.bind("TweenEnd", function () {
							this.destroy();
						});
}

function spawnEnemies() {
	if (enemiesAlive == 0) {
		if (waveNum == 5) {
			waveNum = 1;
			upgradeDiffcultyLvl();
		}
		switch (waveNum) {
			case 1:
				for (var num=0; num < enemiesPerWave; num++)
					spawnSimpleEnemy();
				break;
			case 2:
				for (var num=0; num < enemiesPerWave; num++)
					spawnMediumEnemy();
				break;
			case 3:
				for (var num=0; num < enemiesPerWave; num++)
					spawnHardEnemy();
				break;
			case 4:
				spawnBurger();
				break;
		}
		waveNum++;
	} 
	
	simpleEnemyGen.realDelay(spawnEnemies, 1000);
}

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

function showInstructions() {
		Crafty.e("2D, DOM, Image").attr({ x: 50, y: 350, z: 5}).image("imgs/space_bar.png");
		Crafty.e("2D, DOM, Image").attr({ x: 60, y: 150, z: 5}).image("imgs/arrow_keys.png");
		
		Crafty.e("2D, DOM, Text").attr({x: 500, y: 200, w: 200, z:20})
						.textFont({family: 'Impact', size: '48px'})
						.css({"text-align:": "center" })
						.textColor('#000000')
						.text("Move");
		Crafty.e("2D, DOM, Text").attr({x: 70, y: 500, w: 700, z:20})
						.textFont({family: 'Impact', size: '20px'})
						.css({"text-align:": "center" })
						.textColor('#000000')
						.text("Press SPACE to start the game");
		Crafty.e("2D, DOM, Text, Keyboard").attr({x: 500, y: 370, w: 200, z:20})
						.textFont({family: 'Impact', size: '48px'})
						.css({"text-align:": "center" })
						.textColor('#000000')
						.text("Shoot")
						.bind('EnterFrame', function () {
							if (this.isDown("SPACE"))
								Crafty.scene("main");
						});
		
}

function spawnSimpleEnemy() {
	Crafty.e("Enemy, 2D, DOM, egg, SpriteAnimation, SimpleEnemy")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH-20), y: -Crafty.math.randomInt(50, 500), z: 2})		
		.animate("idle", 0, 0, 3)
		.animate("death", 4, 0, 8)
		.animate("idle", 20, -1)
		.setSpeed(0.5);
	
}

function spawnMediumEnemy() {
	Crafty.e("Enemy, 2D, DOM, onion, SpriteAnimation, MediumEnemy")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -Crafty.math.randomInt(50, 500), z: 2})		
		.animate("idle", 4, 0, 0)
		.animate("blink", 0, 0, 4)
		.animate("death", 5, 0, 9)
		.animate("idle", 30, -1)
		.setSpeed(0.5);

}

function spawnHardEnemy() {
	Crafty.e("Enemy, 2D, DOM, drink, SpriteAnimation, HardEnemy")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH-20), y: -Crafty.math.randomInt(50, 500), z: 2})		
		.animate("idle", 0, 0, 9)
		.animate("death", 0, 0, 9)
		.animate("idle", 70, -1)
		.setSpeed(3);

}


function spawnBurger() {
	Crafty.e("Enemy, 2D, DOM, burg, SpriteAnimation, Boss")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -100, z: 2})		
		.animate("burger", 0, 0, 22)
		.animate("death", 0, 0, 22)
		.animate("burger", 60, -1);
}

function spawnPowerup() {
	Crafty.e("Powerup, 2D, DOM, peppermint, SpriteAnimation, Collision")
				.animate("spin", 0 , 0, 13)
				.animate("spin", 40, -1)
				.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH-20), y: -50, z: 2})
				.bind("EnterFrame", function () {
					this.y += 5;
					if (this.y > STAGE_HEIGHT)
						this.destroy();
				})
				.onHit("Forky", function() {
					rainbowStarburst();
					this.destroy();
				});
	powerUpGen.realDelay(spawnPowerup, Crafty.math.randomInt(1000,5000));
}
function rainbowStarburst() {
	Crafty.e("2D, DOM, Tween, Image")
		.image("imgs/rainbow_starburst.png")
		.origin("center")
		.attr({x: 5000, y: 5000, z: 1, alpha: 0})
		.tween({rotation: 360, alpha: 0.8}, 40)
		.bind("TweenEnd", function () {
			this.tween({rotation: -270, alpha: 0}, 75);
			this.bind("TweenEnd", function () {
				this.destroy();
			});
		})
		.bind("EnterFrame", function () {
			this.x = forky.attr('x')-110;
			this.y = forky.attr('y')-150;
		});
}
