window.onload = function () {
	var STAGE_WIDTH = 700;
	var STAGE_HEIGHT = 600;
	
	var CLOUD_NUM = 4;


    //start crafty
    Crafty.init(STAGE_WIDTH, STAGE_HEIGHT);
    //Crafty.canvas.init();
    
    
    
    
    //LOADING SCENE
//the loading screen that will display while our assets load
Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete
    Crafty.load(["imgs/forky.png","imgs/cloud1.png"], function () {
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



Crafty.scene("title", function () {
	
	Crafty.e("2D, DOM, Text, Mouse").attr({ w: 700, h: 20, x: 0, y: 350 })
				.text("PLAY GAME")
				.css({ "text-align": "center", "cursor": "pointer" })
				.bind('Click', function () {
					Crafty.scene("main");
				});
});




Crafty.scene("main", function () {
    generateClouds();
	
	Crafty.e("Forky, 2D, DOM, Image, OnJetpack")
	.image("imgs/forky.png")
	.attr({ x: 580, y: 100, z: 2})
	.configMovement(0.1,10);
	//.multiway(5, { UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180 });

});

function generateClouds() {
	for (var cloud=0; cloud < CLOUD_NUM; cloud++) {
		grassType = Crafty.math.randomInt(1, 4);
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



    
    
};


