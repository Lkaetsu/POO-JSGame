import { IdleLeft, IdleRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight, Hit, Attacking } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

export class Player {
    constructor(game){
        this.game = game;
        this.width = 160;
        this.height = 111;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.weight = 1;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 8;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.vx = 0;
        this.maxVx = 10;
        this.maxVy = 20;
        this.states = [new IdleLeft(this.game), new IdleRight(this.game), new RunningLeft(this.game), new RunningRight(this.game), new JumpingLeft(this.game), new JumpingRight(this.game), new FallingLeft(this.game), new FallingRight(this.game), new Hit(this.game), new Attacking(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        // Horizontal Movement
        this.x += this.vx;
        if(input.includes('d') && this.currentState !== this.states[9]) this.vx = this.maxVx;
        else if(input.includes('a') &&  this.currentState !== this.states[9]) this.vx = -this.maxVx;
        else this.vx = 0;
        // Horizontal Boundaries
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // Vertical Movement
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        // Vertical Boundaries
        if(this.y > this.game.height - this.height) this.y = this.game.height - this.height;
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
        if(this.game.debug) context.strokeRect(this.x + this.width * 0.4, this.y + this.height * 0.5, this.width * 0.25, this.height * 0.5);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height;
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if( enemy.x < this.x + this.width * 0.4 + this.width * 0.25 &&
                enemy.x + enemy.width > this.x + this.width * 0.4 &&
                enemy.y < this.y + this.height * 0.4 + this.height * 0.5 &&
                enemy.y + enemy.height > this.y + this.height * 0.5)
            {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if( this.currentState === this.states[9]){
                        this.game.score++;
                        // this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 120, 50));
                    } else {
                        this.setState(6, 0);
                        this.game.score--;
                        // this.game.floatingMessages.push(new FloatingMessage('-1', enemy.x, enemy.y, 120, 50));
                        this.game.lives--;
                        if(this.game.lives <= 0) this.game.gameOver = true;
                    }
            }
        })
    }
}