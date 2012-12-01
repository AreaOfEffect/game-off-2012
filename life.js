function lifeCounterInit(){

// HUD	
		lifeCounter = 5;
		scoreTxt = Crafty.e("LifeCounter, 2D, DOM, Text").attr({x: 650, y: STAGE_HEIGHT-40, w: 300, z:20})
						.textFont({size: '24px'})
						.textColor('#000000')
						.text("x" + lifeCounter);
		Crafty.e("2D, DOM, Image")
			.image("imgs/forky_life_little.png")
			.attr({x: 630, y: STAGE_HEIGHT-60, w:300, z:20});
}