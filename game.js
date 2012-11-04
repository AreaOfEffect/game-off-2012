window.onload = function () {
    //start crafty
    Crafty.init(700, 600);
    //Crafty.canvas.init();
    
    
    
    
    //LOADING SCENE
//the loading screen that will display while our assets load
Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete
    Crafty.load(["sprites.png"], function () {
        Crafty.scene("main"); //when everything is loaded, run the main scene
    });

    //black background with some loading text
    Crafty.background("#000");
    Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
            .text("Loading")
            .css({ "text-align": "center" });
});

//automatically play the loading scene
Crafty.scene("loading");


Crafty.scene("main", function () {
    generateWorld();

});

//turn the sprite map into usable components
Crafty.sprite(16, "sprites.png", {
    grass1: [0, 0],
    grass2: [1, 0],
    grass3: [2, 0],
    grass4: [3, 0],
    flower: [0, 1],
    bush1: [0, 2],
    bush2: [1, 2],
    player: [0, 3],
    enemy: [0, 3],
    banana: [4, 0],
    empty: [4, 0]
});


//method to generate the map
function generateWorld() {
    //loop through all tiles
    for (var i = 0; i < 25; i++) {
        for (var j = 0; j < 21; j++) {

            //place grass on all tiles
            grassType = Crafty.math.randomInt(1, 4);
            Crafty.e("2D, DOM, grass" + grassType)
                .attr({ x: i * 16, y: j * 16, z:1 });
                
            //create a fence of bushes
if(i === 0 || i === 24 || j === 0 || j === 20)
    Crafty.e("2D, DOM, solid, bush" + Crafty.math.randomInt(1, 2))
    .attr({ x: i * 16, y: j * 16, z: 2 });
    
    //generate some nice flowers within the boundaries of the outer bushes
if (i > 0 && i < 24 && j > 0 && j < 20
        && Crafty.math.randomInt(0, 50) > 30
        && !(i === 1 && j >= 16)
        && !(i === 23 && j <= 4)) {
    var f = Crafty.e("2D, DOM, flower, solid, SpriteAnimation, explodable")
            .attr({ x: i * 16, y: j * 16, z: 1000 })
            .animate("wind", 0, 1, 3)
            .animate('wind', 40, -1)
            .bind('explode', function() {
                this.destroy();
            });
}
 //grid of bushes
            if((i % 2 === 0) && (j % 2 === 0)) {
                Crafty.e("2D, DOM, solid, bush1")
                    .attr({x: i * 16, y: j * 16, z: 2000})
            }
        }
    }
}
    
    
};


