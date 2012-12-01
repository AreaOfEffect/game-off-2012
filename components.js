function createFireball(x,y) {
	Crafty.e("2D, DOM, fireball, SpriteAnimation")
					.attr({x: x, y: y, z: 10})
					.animate("boom", 0, 0, 7)
					.animate("boom", 20, 0)
					.bind("AnimationEnd", function(reelId) {
						this.destroy();
					});
}


// PROJECTILES
Crafty.c("HurtForky" , {
	init: function () {
		this.requires("Collision")
			.onHit("Forky", function() {
				createFireball(this.x-50, this.y-50);
				this.destroy();
			});
	}
});
Crafty.c("StraightBullets", {	
	
	setSpeed: function(speedX, speedY, rot) {
		this.bind('EnterFrame', function () {
			this.y += speedY;
			this.x += speedX;
			this.rotation += rot;
			if (this.y > STAGE_HEIGHT || this.y < (0-this.h) || this.x < (0-this.w) || this.x > STAGE_WIDTH)
				this.destroy();
		});
		
		return this;
	}
});
Crafty.c("LockingMissles", {
	sluggishSpeed: 0.05,
	maxSpeed: 4,
	
	init: function () {
		this.requires("HurtForky");
	},
	
	setSpeed: function(speedX, speedY) {
		this.speedX = speedX;
		this.speedY = speedY;
		
		this.bind("EnterFrame", function () {
			if (forky.attr('x') > this.x) 
				this.speedX += this.sluggishSpeed;
			else
				this.speedX -= this.sluggishSpeed;
			
			// bullets won't come back from bottom of screen
			// if (forky.attr('y') > this.y)
// 				this.speedY += this.sluggishSpeed;
// 			else
// 				this.speedY -= this.sluggishSpeed;
			
			if (this.speedX > this.maxSpeed)
				this.speedX = this.maxSpeed;
			if (this.speedY > this.maxSpeed)
				this.speedY = this.maxSpeed;
			this.x += this.speedX;
			this.y += this.speedY;
			
			if (this.y > STAGE_HEIGHT || this.y < 0 || this.x < 0 || this.x > STAGE_WIDTH)
				this.destroy();
			
		});
		return this;
	}
});

// ENEMIES
Crafty.c("EnemyBase", {
	init: function () {
		enemiesAlive++;
		
		this.health = 100;
		this.requires("Collision")
			.onHit("ForkyBullet", function () {
				if (this.health > 0) {
					var fork = this.hit('ForkyBullet')[0].obj;
					createFireball(fork.x-25,fork.y-25);
					//destroy fork bullet
					fork.destroy()
					this.health -= forkDamage;
					if (this.health <= 0) {
						enemiesAlive--;
						this.animate("death",50,0);
						this.bind('AnimationEnd', function () {
							this.destroy();
							gameScore += this.scoreForKill;
						});					
					}
				}
			})
			.onHit("Forky", function() {
				console.log("ouch, bullet");
			});
		
		this.requires("2D").requires("DOM")
			.bind('EnterFrame' , function () {
				if (this.y > STAGE_HEIGHT) {
					enemiesAlive--;
					this.destroy();
				}
			});
	}
});
Crafty.c("SimpleEnemy", {	
	init: function () {
		this.requires("EnemyBase");
		this.requires("RealDelay");
		this.realDelay(this.fireWeapon, 3000);
		
		this.scoreForKill = 100;
	},
	
	setSpeed: function(speed) {
		this.bind('EnterFrame', function () {
			this.y += speed;
		});
		return this;
	},
	
	fireWeapon: function() {
		Crafty.e("Bullet, 2D, DOM, eggbullet, SpriteAnimation, StraightBullets, HurtForky")
				.animate("go", 0, 0, 4)
				.animate("go", 20, -1)
				.attr({ x: this.x+(this.w/2), y: this.y+(this.h/2), z: 4, rotation: Crafty.math.randomInt(0, 360)})
				.setSpeed(0,5,Crafty.math.randomInt(1, 5))
				.origin("center");
		this.realDelay(this.fireWeapon, 3000);
	}
});
Crafty.c("MediumEnemy", {
	init: function () {
		this.requires("EnemyBase");
		this.requires("RealDelay");
		this.realDelay(this.blink, Crafty.math.randomInt(3000, 5000));
		this.realDelay(this.fireWeapon, 3000);
		
		this.scoreForKill = 200;
	},
	setSpeed: function(speed) {
		this.bind('EnterFrame', function () {
			this.y += speed;
		});
		return this;
	},
	blink: function () {
		this.animate("blink", 30, 0);
		this.bind("AnimationEnd", function() {
			this.animate("idle", 30, 0);
		});
		this.realDelay(this.blink, Crafty.math.randomInt(3000, 5000));
	},
	fireWeapon: function() {
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets, HurtForky")
				.image("imgs/onion_peel.png")
				.attr({ x: this.x+(this.w/2), y: this.y+(this.h/2), z: 4, rotation: Crafty.math.randomInt(0, 360)})
				.setSpeed(0,5,Crafty.math.randomInt(1, 5))
				.origin("center");
		this.realDelay(this.fireWeapon, 3000);
	}

});
Crafty.c("HardEnemy", {	
	init: function () {
		this.requires("EnemyBase");
		this.requires("RealDelay");
		this.realDelay(this.fireWeapon, 2500);
		this.realDelay(this.blink, Crafty.math.randomInt(3000, 5000));
		
		this.scoreForKill = 300;
		
		this.yStop = Crafty.math.randomInt(50, STAGE_HEIGHT/2-100);
	},
	
	setSpeed: function(speed) {
		this.bind('EnterFrame', function () {
			if (this.y < this.yStop)
				this.y += speed;
		});
		return this;
	},
	blink: function () {
		this.animate("blink", 30, 0);
		this.bind("AnimationEnd", function() {
			this.animate("idle", 30, 0);
		});
		this.realDelay(this.blink, Crafty.math.randomInt(3000, 5000));
	},
	fireWeapon: function() {
		Crafty.e("Bullet, 2D, DOM, Image, StraightBullets, HurtForky")
				.image("imgs/icecube.png")
				.attr({ x: this.x+(this.w/2), y: this.y+(this.h/2), z: 4, rotation: Crafty.math.randomInt(0, 360)})
				.setSpeed(0,5,Crafty.math.randomInt(1, 5))
				.origin("center");
		this.realDelay(this.fireWeapon, 2500);
	}
});
Crafty.c("Boss", {
	init: function () {
		this.requires("RealDelay");
		this.requires("Tween");
		
		this.realDelay(this.nextLocation, 1000);
		
		// fire bullets 100 ms after moving to new position
		this.bind("TweenEnd", function () {
			this.realDelay(this.fireWeapon, 100);
		});
		
		this.requires("EnemyBase");
		this.scoreForKill = 1000;
	},
	
	nextLocation: function() {
		this.tween({x: Crafty.math.randomInt(50, STAGE_WIDTH), y: Crafty.math.randomInt(10, STAGE_HEIGHT/2-100)}, 40);
		this.realDelay(this.nextLocation, 3000);		
	},
	
	fireWeapon: function () {
		// 3 bullet spread
		Crafty.e("Bullet, 2D, DOM, firebacon, SpriteAnimation, LockingMissles")
				.attr({ x: this.x, y: this.y, z: 4})
				.animate("baconani", 0, 0, 3)
				.animate("baconani", 20, -1)
				.setSpeed(0,5);
		Crafty.e("Bullet, 2D, DOM, firebacon, SpriteAnimation, LockingMissles")
				.attr({ x: this.x, y: this.y, z: 4})
				.animate("baconani", 0, 0, 3)
				.animate("baconani", 20, -1)
				.setSpeed(2,5);
		Crafty.e("Bullet, 2D, DOM, firebacon, SpriteAnimation, LockingMissles")
				.attr({ x: this.x, y: this.y, z: 4})
				.animate("baconani", 0, 0, 3)
				.animate("baconani", 20, -1)
				.setSpeed(-2,5);
	}
	
});


/******* Forky's Components ********/
Crafty.c("ForkyBase", {
	bulletSpeed: 3,
	init: function () {
		this.canFire = true;
		this.fireTimeout = 200;
		
		this.requires("OnJetpack").requires("Keyboard").requires("RealDelay")
			.bind('EnterFrame', function () {
				if (this.isDown("SPACE") && this.canFire) {
					this.canFire = false;
					this.realDelay(function(){this.canFire = true;},this.fireTimeout); // fire weapon timeout
					this.fireBaseWeapon();
				}
			});
		this.realDelay(this.blink, Crafty.math.randomInt(3000, 5000));
		
	},
	blink: function () {
		this.animate("blink", 30, 0);
		this.bind("AnimationEnd", function() {
			this.animate("idle", 30, 0);
		});
		this.realDelay(this.blink, Crafty.math.randomInt(3000, 5000));
	},
	fireBaseWeapon: function() {
		Crafty.e("ForkyBullet, 2D, DOM, Image, StraightBullets")
				.image("imgs/minifork.png")
				.attr({ x: this.x+(forky.w/2), y: this.y, z: 4})
				.setSpeed(0,-this.bulletSpeed);
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
				this.movingLeft = true;
			}
			if (this.isDown('RIGHT_ARROW') || this.isDown('D')) {
				this.movingRight = true;	
			}
			
			if (this.isDown('UP_ARROW') || this.isDown('W')) {
				this.movingUp = true;
			}
			if (this.isDown('DOWN_ARROW') || this.isDown('S')) {
				this.movingDown = true;
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
			if (this.movingLeft) {
				this.speedX -= acell;
			
			}
			else if (this.movingRight) {
				this.speedX += acell;
				
			}
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
			if (this.speedX < -maxSpeed)
				this.speedX = -maxSpeed;
			if (this.speedY > maxSpeed)
				this.speedY = maxSpeed;
			if (this.speedY < -maxSpeed)
				this.speedY = -maxSpeed;
			
			this.x += this.speedX;
			this.y += this.speedY;
			if (this.x > STAGE_WIDTH-this.w) {
				this.x = STAGE_WIDTH-this.w;
				this.speedX = 0;
			}
			else if (this.x < 0) {
				this.x = 0;
				this.speedX = 0;
			}
			if (this.y > STAGE_HEIGHT-this.h) {
				this.y = STAGE_HEIGHT-this.h;
				this.speedY = 0;
			}
			else if (this.y < 0) {
				this.y = 0;
				this.speedY = 0;
			}
		});
	
		return this;
	}
});