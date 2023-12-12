import { Idle, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight, Hit, Attacking } from "./playerStates.js";
import { collision } from "./utils.js";

export class Player {
    constructor(game){
        this.game = game;
        this.spriteWidth = 160;
        this.spriteHeight = 111;
        this.scale = 0.75;
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.weight = 0.65;
        this.jumpHeightModifier = 0;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 8;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.vx = 0;
        this.maxVx = 2.5;
        this.maxVy = 8;
        this.attackSpeed = 3;
        this.states = [new Idle(this.game), new RunningLeft(this.game), new RunningRight(this.game), new JumpingLeft(this.game), new JumpingRight(this.game), new FallingLeft(this.game), new FallingRight(this.game), new Hit(this.game), new Attacking(this.game)];
        this.currentState = null;
        this.directions = ['left','right'];
        this.spriteDirection = this.directions[1];
        this.hitbox = {
            x: this.x + this.width * 0.4,
            y: this.y + this.height * 0.4,
            width: this.width * 0.25,
            height: this.height * 0.55,
        }
    }
    update(input, deltaTime){
        console.log(this.onGround());
        this.checkEnemyCollision();
        this.currentState.handleInput(input);
        // Horizontal Movement
        this.x += this.vx;
        this.hitbox.x = this.x + this.width * 0.4;
        if(input.includes('d') && this.currentState !== this.states[9]) this.vx = this.maxVx;
        else if(input.includes('a') &&  this.currentState !== this.states[9]) this.vx = -this.maxVx;
        else this.vx = 0;
        // Vertical Movement
        this.y += this.vy;
        this.hitbox.y = this.y + this.height * 0.4;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        if(input.includes ('w') && (this.currentState === this.states[4] || this.currentState === this.states[5])){
            if(this.jumpHeightModifier >= this.weight * 0.60){
                this.jumpHeightModifier = this.weight * 0.60;
            }
            this.vy -= this.jumpHeightModifier;
            this.jumpHeightModifier += 0.05;
        } else this.jumpHeightModifier = 0;
        // Collision box Movement
        this.game.floorcollisions2D.forEach(collisionBlock => {
            collisionBlock.update();
            if (input.includes('d')) {
                collisionBlock.vx = -this.maxVx;
            } else if(input.includes('a')){
                collisionBlock.vx = this.maxVx;
            } else  collisionBlock.vx = 0;
            this.handleObjectCollisions(collisionBlock);
        });
        // Attack Speed
        if(this.currentState === this.states[9]) {
            this.frameInterval = 1000/(this.fps * this.attackSpeed);
        }
        else this.frameInterval = 1000/this.fps;
        // Sprite Animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.hitbox.x , this.hitbox.y, this.hitbox.width, this.hitbox.height);
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    onGround(){
        let groundCollision = false;
        this.game.floorcollisions2D.forEach(collisionBlock => {
            if(collision({object1: this.hitbox, object2: collisionBlock}) && this.vy >= 0){
                groundCollision = true;
            }
        });
        return groundCollision;
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    setDirection(input){
        if(input.includes('a')){
            this.spriteDirection = this.directions[0];
        }
        else if(input.includes('d')){
            this.spriteDirection = this.directions[1];
        }
    }
    checkEnemyCollision(){
        this.game.enemies.forEach(enemy => {
            if( enemy.x < this.hitbox.x + this.hitbox.width &&
                enemy.x + enemy.width > this.hitbox.x &&
                enemy.y < this.hitbox.y + this.hitbox.height &&
                enemy.y + enemy.height > this.hitbox.x)
            {
                enemy.markedForDeletion = true;
                if( this.currentState === this.states[9]){
                        this.game.score++;
                    } else {
                        this.setState(8, 0);
                        this.game.score--;
                        this.game.lives--;
                        if(this.game.lives <= 0) this.game.gameOver = true;
                    }
            }
        })
    }
    handleObjectCollisions(collisionBlock) {
        if(collision({object1: this.hitbox, object2: collisionBlock})){
            if(this.vy > 0){
                this.vy = 0;
                const offset = this.hitbox.y - this.y + this.hitbox.height;
                this.y = collisionBlock.y - offset - 0.5;
            }
            if(this.vy < 0){
                this.vy = 0;
                const offset = this.hitbox.y - this.y;
                this.y = collisionBlock.y - collisionBlock.height - offset + 0.5;
            }
            // if(this.vx > 0){
            //     this.vx = 0;
            //     const offset = this.hitbox.x - this.x + this.hitbox.width;
            //     this.x = collisionBlock.x - offset - 0.001;
            // }
            // if(this.vx < 0){
            //     this.vx = 0;
            //     const offset = this.hitbox.x - this.x;
            //     this.x = collisionBlock.x + collisionBlock.width - offset + 0.001;
            // }
        }
    }
}