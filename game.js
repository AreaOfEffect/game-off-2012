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
		Crafty.load(["imgs/*.png"], function () {
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
		
		Crafty.e("2D, DOM, Text, Mouse, Color").attr({ w: 700, h: 20, x: 0, y: 350 })
					.text("PLAY GAME")
					.css({ "text-align": "center", "cursor": "pointer" })
					.bind('Click', function () {
						Crafty.scene("main");
					});
					
	});


	
	Crafty.sprite(64, "imgs/explosion.png", {exp: [0,0]});

	//MAIN GAME
	Crafty.scene("main", function () {
		generateClouds();
		
		Crafty.e("Forky, 2D, DOM, Image, OnJetpack")
		.image("imgs/forky.png")
		.attr({ x: 580, y: 100, z: 2})
		.configMovement(0.1,10);
		
		Crafty.e("SimpleEnemyFactory, Delay")
			.delay(function () {
				spawnSimpleEnemy();
				this.delay();
			}, Crafty.math.randomInt(200, 3000));
		

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
		Crafty.e("Enemy, 2D, DOM, Image, SimpleEnemy")
		.image("imgs/enemy.png")
		.attr({ x: Crafty.math.randomInt(20, STAGE_WIDTH), y: -50, z: 2})
		.setSpeed(1.5);
		//this.delay(arguments.callee, Crafty.math.randomInt(200, 3000));
	}

    
    
};


