STAGE_WIDTH = 700;
STAGE_HEIGHT = 600;
	
CLOUD_NUM = 6;

window.onload = function () {
	


    //start crafty
    Crafty.init(STAGE_WIDTH, STAGE_HEIGHT);
    //Crafty.canvas.init();
    
    
    
    
    //LOADING SCENE
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function () {
		//load takes an array of assets and a callback when complete
		Crafty.load(["imgs/bullet.png","imgs/cloud1.png","imgs/enemy.png",
		"imgs/forky.png", "imgs/burger_sheet.png", "imgs/main_title.png","imgs/play_button.png",
		"imgs/fireball.png"], function () {
			Crafty.scene("title"); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background("#a3e2ff");
		Crafty.e("2D, DOM, Text").attr({ w: 700, h: 20, x: 0, y: 350 })
				.text("Loading")
				.css({ "text-align": "center" });
	});

	//automatically play the loading scene
	Crafty.scene("loading");


	//TITLE SCENE
	Crafty.scene("title", function () {
		Crafty.e("2D, DOM, Image, Tween").attr({ x: -300, y: -300 }).image("imgs/main_title.png")
			.tween({x:20, y:20}, 80);
		
		Crafty.e("2D, DOM, Image, Mouse").attr({ x: 0, y: 350, z:10 })
					.image("imgs/play_button.png")
					.css({ "cursor": "pointer" })
					.bind('Click', function () {
						Crafty.scene("main");
					});
		generateClouds();
					
	});


	Crafty.sprite(120, "imgs/burger_sheet.png", {burg:[0,0]});
	Crafty.sprite(100, "imgs/fireball.png", {fireball:[0,0]});

	//MAIN GAME
	Crafty.scene("main", function () {
		generateClouds();
		
		forky = Crafty.e("Forky, ForkyBase");
				
		Crafty.e("SimpleEnemyFactory, RealDelay")
			.realDelay(spawnSimpleEnemy, Crafty.math.randomInt(200, 3000));
		

	});
	
	
	
	/*****************
		Helper functions
	*****************/
	
	function generateClouds() {
		for (var cloud=0; cloud < CLOUD_NUM; cloud++) {		
				Crafty.e("2D, DOM, Image")
					.attr({ x: Crafty.math.randomInt(-50, STAGE_WIDTH+50), y: Crafty.math.randomInt(-300, -50), z: 1 })
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
		var e =	Crafty.e("Enemy, 2D, DOM, burg, SpriteAnimation, EnemyBase, RandomMover")
			.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -50, z: 2})		
			.animate("burger", 0, 0, 22)
			.animate("burger", 60, -1);
			//.setSpeed(1.5);
		//e.realDelay(spawnSimpleEnemy, Crafty.math.randomInt(200, 3000));
	}

    
    
};


