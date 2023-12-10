import { IdleLeft, IdleRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight, Hit, Attacking } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";

export class Player {
    constructor(game){
        this.game = game;
        this.spriteWidth = 160;
        this.spriteHeight = 111;
        this.scale = 1;
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;;
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.weight = 0.8;
        this.jumpHeightModifier = 0;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 8;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.vx = 0;
        this.maxVx = 5;
        this.maxVy = 12;
        this.attackSpeed = 3;
        this.states = [new IdleLeft(this.game), new IdleRight(this.game), new RunningLeft(this.game), new RunningRight(this.game), new JumpingLeft(this.game), new JumpingRight(this.game), new FallingLeft(this.game), new FallingRight(this.game), new Hit(this.game), new Attacking(this.game)];
        this.currentState = null;
        this.directions = ['left','right'];
        this.spriteDirection = this.directions[1];
        this.hitboxX = this.x + this.width * 0.25;
        this.hitboxY = this.y + this.height * 0.25;
        this.hitboxWidth = this.width * 0.4;
        this.hitboxHeight = this.height * 0.75;
    }
    update(input, deltaTime){
        this.checkEnemyCollision();
        this.currentState.handleInput(input);
        // Horizontal Movement
        this.x += this.vx;
        if(input.includes('d') && this.currentState !== this.states[9]) this.vx = this.maxVx;
        else if(input.includes('a') &&  this.currentState !== this.states[9]) this.vx = -this.maxVx;
        else this.vx = 0;
        // Vertical Movement
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        if(input.includes ('w') && (this.currentState === this.states[4] || this.currentState === this.states[5])){
            if(this.jumpHeightModifier >= this.weight * 0.60){
                this.jumpHeightModifier = this.weight * 0.60;
            }
            this.vy -= this.jumpHeightModifier;
            this.jumpHeightModifier += 0.05;
        } else this.jumpHeightModifier = 0;
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
        if(this.game.debug) context.strokeRect(this.x + this.width * 0.25 , this.y + this.height * 0.25, this.width * 0.4, this.height * 0.75);
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height;
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
            if( enemy.x < this.hitboxX + this.hitboxWidth &&
                enemy.x + enemy.width > this.hitboxX &&
                enemy.y < this.hitboxY + this.hitboxHeight &&
                enemy.y + enemy.height > this.hitboxY)
            {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
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
    // checkForObjectCollisions() {
    //     for (let i = 0; i < this.collisionBlocks.length; i++) {
    //       const collisionBlock = this.collisionBlocks[i]
    
    //       if (
    //         collision({
    //           object1: this.hitbox,
    //           object2: collisionBlock,
    //         })
    //       ) {
    //         if (this.velocity.x > 0) {
    //           this.velocity.x = 0
    
    //           const offset =
    //             this.hitbox.position.x - this.position.x + this.hitbox.width
    
    //           this.position.x = collisionBlock.position.x - offset - 0.01
    //           break
    //         }
    
    //  if (this.velocity.x < 0) {
    //           this.velocity.x = 0
    
    //           const offset = this.hitbox.position.x - this.position.x
    
    //           this.position.x =
    //             collisionBlock.position.x + collisionBlock.width - offset + 0.01
    //           break
    //         }
    //       }
    //     }
    //   }
}