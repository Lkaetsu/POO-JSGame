class Enemy {
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        // Movement
        this.x -= this.speedX;
        this.hitbox.x = this.x;
        this.y += this.speedY;
        this.hitbox.y = this.y;
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        if(this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.hitbox.width, this.hitbox.height);
    }
    playerIsDetected(){
        return this.game.player.x <= this.x + this.detectionRange;
    }
    playerWithinReach(){
        return this.game.player.x <= this.x + this.attackReach || this.game.player.x <= this.x + this.attackReach;
    }
}

export class CrowEnemy extends Enemy {
    constructor(game, x, y){
        super();
        this.game = game;
        this.width = 128,4;
        this.height = 128;
        this.x = x - 50;
        this.y = y - 80;
        this.speedX = Math.random() - 1.5;
        this.speedY = 0;
        this.maxFrame = 4;
        this.image = document.getElementById('enemy_crow');
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
        this.hitbox = {
            x: this.x,
            y: this.y,
            width: this.width * 0.5,
            height: this.height * 0.5,
        };
    }
    update(deltaTime){
        super.update(deltaTime);
        console.log(this.speedX, this.speedY);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class AxeKnightEnemy extends Enemy {
    constructor(game, x, y){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = x;
        this.y = y;
        this.image = document.getElementById('');
        this.speedX = 0;
        this.speedY = 0;
        this.attackFrame = 1;
        this.maxAttackFrame = 6;
        this.detectionRange = this.width * 3;
        this.attackReach = this.width;
        this.maxFrame = 4;
    }
    update(deltaTime){
        super.update(deltaTime);
        if(this.playerWithinReach){
            this.frameY = this.AttackFrame;
            this.maxFrame = this.maxAttackFrame;
        }
    }
}

// export class ClimbingEnemy extends Enemy {
//     constructor(game){
//         super();
//         this.game = game;
//         this.width = 120;
//         this.height = 144;
//         this.x = this.game.width;
//         this.y = Math.random() * this.game.height * 0.5;
//         this.image = document.getElementById('enemy_spider_big');
//         this.speedX = 0;
//         this.speedY = Math.random() > 0.5 ? 1 : -1;
//         this.maxFrame = 5;
//     }
//     update(deltaTime){
//         super.update(deltaTime);
//         if(this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
//         if(this.y < -this.height) this.markedForDeletion = true;
//     }
//     draw(context){
//         super.draw(context);
//         context.beginPath();
//         context.moveTo(this.x + this.width * 0.5, 0);
//         context.lineTo(this.x + this.width * 0.5, this.y + 50);
//         context.stroke();
//     }
// }