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