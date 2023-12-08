import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { AxeKnightEnemy } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1600;         //846
    canvas.height = 320;         //530

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.collisions = [];
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 300000;
            this.gameOver = false;
            this.lives = 3;
            this.player.currentState = this.player.states[1];
            this.player.currentState.enter();
        }
        update(deltaTime){
            //Timer
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.player.update(this.input.keys, deltaTime);
            this.background.update();
            // Handle Enemies
            // this.addEnemy();
            this.enemies.forEach(enemy =>{
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.collisions.forEach((collision) => {
                collision.update(deltaTime);
                this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            });
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy =>{
                enemy.draw(context);
            });
            this.collisions.forEach((collision, index) => {
                collision.draw(context);
            })
            this.UI.draw(context);
        }
        addEnemy(x, y){
            this.enemies.push(new AxeKnightEnemy(this, x, y));
        }
    }
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});