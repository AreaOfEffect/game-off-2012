// PROJECTILES
Crafty.c("StraightBullets", {
	init: function() {
		this.requires("Collision")
			.onHit("Forky", function() {
				Crafty.e("2D, DOM, exp, SpriteAnimation")
					.attr({x: this.x, y: this.y, z: 10})
					.animate("boom", [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[1,3],[2,3],[3,3]])
					.animate("boom", 60, 0)
					.bind("AnimationEnd", function(reelId) {
						this.destroy();
					});
				this.destroy();
			});
	},
	
	setSpeed: function(speed) {
		this.bind('EnterFrame', function () {
			this.y += speed;
			if (this.y > STAGE_HEIGHT)
				this.destroy();
		});
	}
});

// ENEMIES
Crafty.c("SimpleEnemy", {	
	init: function () {
		this.timeout(function() {
             this.fireWeapon();
			}, 1000);
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
	},
	
	fireWeapon: function() {
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets")
				.image("imgs/bullet.png")
				.origin("center")
				.attr({ x: this.x, y: this.y, z: 4})
				.setSpeed(5);
		this.timeout(function() {
             this.fireWeapon();
			}, 1000);
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
	}
});