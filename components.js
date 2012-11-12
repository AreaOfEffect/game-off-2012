// PROJECTILES
Crafty.c("StraightBullets", {
	init: function() {
		this.requires("Collision")
			.onHit("Forky", function() {
				Crafty.e("2D, DOM, fireball, SpriteAnimation")
					.attr({x: this.x, y: this.y, z: 10})
					.animate("boom", 0, 0, 7)
					.animate("boom", 20, 0)
					.bind("AnimationEnd", function(reelId) {
						this.destroy();
					});
				this.destroy();
			});
	},
	
	setSpeed: function(speedX, speedY) {
		this.bind('EnterFrame', function () {
			this.y += speedY;
			this.x += speedX;
			if (this.y > STAGE_HEIGHT || this.y < 0 || this.x < 0 || this.x > STAGE_WIDTH)
				this.destroy();
		});
	}
});

// ENEMIES
Crafty.c("SimpleEnemy", {	
	init: function () {
		this.requires("RealDelay");
		this.realDelay(this.fireWeapon, 1000);
		this.requires("Collision")
			.onHit("Forky", function() {
				console.log("ouch, bullet");
			});
	},
	
	setSpeed: function(speed) {
		this.bind('EnterFrame', function () {
			this.y += speed;
			
			if (this.y > STAGE_HEIGHT) {
				this.destroy();
			}
		});
		return this;
	},
	
	fireWeapon: function() {
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets")
				.image("imgs/bullet.png")
				.attr({ x: this.x, y: this.y, z: 4})
				.setSpeed(0,5);
		this.realDelay(this.fireWeapon, 1000);
	}
});
Crafty.c("RandomMover", {
	init: function () {
		this.requires("RealDelay");
		this.requires("Tween");
		
		this.realDelay(this.nextLocation, 1000);
		
		// kill Forky on hit
		this.requires("Collision")
			.onHit("Forky", function() {
				console.log("ouch, bullet");
			});
		
		// fire bullets 100 ms after moving to new position
		this.bind("TweenEnd", function () {
			this.realDelay(this.fireWeapon, 100);
		});
	},
	
	nextLocation: function() {
		this.tween({x: Crafty.math.randomInt(10, STAGE_WIDTH), y: Crafty.math.randomInt(10, STAGE_HEIGHT/2)}, 40);
		this.realDelay(this.nextLocation, 3000);		
	},
	
	fireWeapon: function () {
		// 3 bullet spread
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets")
				.image("imgs/bullet.png")
				.attr({ x: this.x, y: this.y, z: 4})
				.setSpeed(0,5);
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets")
				.image("imgs/bullet.png")
				.attr({ x: this.x, y: this.y, z: 4})
				.setSpeed(-2,5);
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets")
				.image("imgs/bullet.png")
				.attr({ x: this.x, y: this.y, z: 4})
				.setSpeed(2,5);
	}
	
});



// MOVEMENT
Crafty.c("OnJetpack", {
	init: function () {
		this.requires('Keyboard');
		this.movingRight = false;
		this.movingLeft = false;
		this.movingUp = false;
		this.movingDown = false;
		
		this.speedX = this.speedY = 0;		
	},

	configMovement: function(acell, maxSpeed) {
		this.bind('KeyDown', function () { 
			if (this.isDown('LEFT_ARROW') || this.isDown('A')) {
				this.movingRight = false; 
				this.movingLeft = true;
			}
			else if (this.isDown('RIGHT_ARROW') || this.isDown('D')) {
				this.movingRight = true;	
				this.movingLeft = false;
			}
			
			if (this.isDown('UP_ARROW') || this.isDown('W')) {
				this.movingUp = true;
				this.movingDown = false;
			}
			else if (this.isDown('DOWN_ARROW') || this.isDown('S')) {
				this.movingDown = true;
				this.movingUp = false;
			}
		});
		
		this.bind('KeyUp', function () {
			if (!this.isDown('LEFT_ARROW') && !this.isDown('A')) {
				this.movingLeft = false;
			} 
			
			if (!this.isDown('RIGHT_ARROW') && !this.isDown('D')) {
				this.movingRight = false;
			}
			
			if (!this.isDown('UP_ARROW') && !this.isDown('W')) {
				this.movingUp = false;
			}
			
			if (!this.isDown('DOWN_ARROW') && !this.isDown('S')) {
				this.movingDown = false;
			}
		});
		
		this.bind('EnterFrame', function () {
			if (this.movingLeft)
				this.speedX -= acell;
			else if (this.movingRight)
				this.speedX += acell;
			else {
				if (this.speedX < 0) {
					if ((0 - this.speedX) > acell)
						this.speedX += acell;
					else
						this.speedX = 0;
				} else if (this.speedX > 0) {
					if ((this.speedX - 0) > acell)
						this.speedX -= acell;
					else
						this.speedX = 0;
				}		
			}
			
			if (this.movingUp)
				this.speedY -= acell;
			else if (this.movingDown)
				this.speedY += acell;
			else {
				if (this.speedY < 0) {
					if ((0 - this.speedY) > acell)
						this.speedY += acell;
					else
						this.speedY = 0;
				} else if (this.speedY > 0) {
					if ((this.speedY - 0) > acell)
						this.speedY -= acell;
					else
						this.speedY = 0;
				}				
			}
			
			if (this.speedX > maxSpeed)
				this.speedX = maxSpeed;
			if (this.speedY > maxSpeed)
				this.speedY = maxSpeed;
			
			this.x += this.speedX;
			this.y += this.speedY;
		});
	
		return this;
	}
});