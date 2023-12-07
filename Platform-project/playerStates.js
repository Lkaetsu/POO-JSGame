const states = {
    IDLE_LEFT: 0,
    IDLE_RIGHT: 1,
    RUNNING_LEFT: 2,
    RUNNING_RIGHT: 3,
    JUMPING_LEFT: 4,
    JUMPING_RIGHT: 5,
    FALLING_LEFT: 6,
    FALLING_RIGHT: 7,
    HIT: 8,
    ATTACKING: 9
};

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
    handleInput(input){
        if(input.includes('q')){
            this.game.player.setState(states.ATTACKING);
        }
        this.game.player.setDirection(input);
    }
}

export class IdleLeft extends State {
    constructor(game){
        super('IDLE_LEFT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 6;
    }
    handleInput(input){
        super.handleInput(input);
        if(input.includes('d')){
            this.game.player.setState(states.RUNNING_RIGHT);
        }
        else if(input.includes('a')){
            this.game.player.setState(states.RUNNING_LEFT);
        }
        if(input.includes('w')){
            this.game.player.setState(states.JUMPING_LEFT);
        }
    }
}

export class IdleRight extends State {
    constructor(game){
        super('IDLE_RIGHT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 5;
    }
    handleInput(input){
        super.handleInput(input);
        if(input.includes('d')){
            this.game.player.setState(states.RUNNING_RIGHT);
        }
        else if(input.includes('a')){
            this.game.player.setState(states.RUNNING_LEFT);
        }
        if(input.includes('w')){
            this.game.player.setState(states.JUMPING_RIGHT);
        }
    }
}

export class RunningLeft extends State {
    constructor(game){
        super('RUNNING_LEFT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 10;
    }
    handleInput(input){
        super.handleInput(input);
        if(!input.includes('a')){
            this.game.player.setState(states.IDLE_LEFT);
        }
        else if(input.includes('d')){
            this.game.player.setState(states.RUNNING_RIGHT);
        }
        else if(input.includes('w')){
            this.game.player.setState(states.JUMPING_LEFT);
        }
    }
}

export class RunningRight extends State {
    constructor(game){
        super('RUNNING_RIGHT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 9;
    }
    handleInput(input){
        super.handleInput(input);
        if(!input.includes('d')){
            this.game.player.setState(states.IDLE_RIGHT);
        }
        else if(input.includes('a') && !input.includes('d')){
            this.game.player.setState(states.RUNNING_LEFT);
        }
        else if(input.includes('w')){
            this.game.player.setState(states.JUMPING_RIGHT);
        }
    }
}

export class JumpingLeft extends State {
    constructor(game){
        super('JUMPING_LEFT', game);
    }
    enter(){
        if(this.game.player.onGround()) this.game.player.vy -= this.game.player.maxVy;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 1;
        this.game.player.frameY = 8;
    }
    handleInput(input){
        super.handleInput(input);
        if(this.game.player.vy > this.game.player.weight){
            this.game.player.setState(states.FALLING_LEFT);
        } else if (input.includes('d') && !input.includes('a')) {
            this.game.player.setState(states.JUMPING_RIGHT);
        }
    }
}

export class JumpingRight extends State {
    constructor(game){
        super('JUMPING_RIGHT', game);
    }
    enter(){
        if(this.game.player.onGround()) this.game.player.vy -= this.game.player.maxVy;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 1;
        this.game.player.frameY = 7;
    }
    handleInput(input){
        super.handleInput(input);
        if(this.game.player.vy > this.game.player.weight){
            this.game.player.setState(states.FALLING_RIGHT);
        } else if (input.includes('a') && !input.includes('d')) {
            this.game.player.setState(states.JUMPING_LEFT);
        }
    }
}

export class FallingLeft extends State {
    constructor(game){
        super('FALLING_LEFT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 1;
        this.game.player.frameY = 4;
    }
    handleInput(input){
        super.handleInput(input);
        if(this.game.player.onGround()){
            this.game.player.setState(states.IDLE_LEFT);
        }
    }
}

export class FallingRight extends State {
    constructor(game){
        super('FALLING_RIGHT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 1;
        this.game.player.frameY = 3;
    }
    handleInput(input){
        super.handleInput(input);
        if(this.game.player.onGround()){
            this.game.player.setState(states.IDLE_RIGHT);
        }
    }
}

export class Hit extends State {
    constructor(game){
        super('HIT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 3;
        this.game.player.frameY = 12;
    }
    handleInput(input){
        if(this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING_RIGHT);
        } else if(this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING_RIGHT);
        }
    }
}

export class Attacking extends State {
    constructor(game){
        super('ATTACKING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 11;
        if(this.game.player.spriteDirection === this.game.player.directions[0])
            this.game.player.frameY = 1;
        else if(this.game.player.spriteDirection === this.game.player.directions[1])
            this.game.player.frameY = 0;
    }
    handleInput(input){
        if(this.game.player.spriteDirection === this.game.player.directions[0]){
            if(this.game.player.frameX >= 11 && this.game.player.onGround()){
                this.game.player.setState(states.IDLE_LEFT);
            } 
            else if(this.game.player.frameX >= 11 && !this.game.player.onGround()){
                this.game.player.setState(states.FALLING_LEFT);
            }
        } else if(this.game.player.spriteDirection === this.game.player.directions[1]){
            if(this.game.player.frameX >= 11 && this.game.player.onGround()){
                this.game.player.setState(states.IDLE_RIGHT);
            } 
            else if(this.game.player.frameX >= 11 && !this.game.player.onGround()){
                this.game.player.setState(states.FALLING_RIGHT);
            }
        }
        if(input.includes('w') && this.game.player.onGround()){
            this.game.player.vy -= this.game.player.maxVy;
        }
        else if(input.includes('d') && this.game.player.onGround()){
            this.game.player.vx += this.game.player.maxVx * 0.5;
        }
        else if(input.includes('a') && this.game.player.onGround()){
            this.game.player.vx -= this.game.player.maxVx * 0.5;
        }
    }
}