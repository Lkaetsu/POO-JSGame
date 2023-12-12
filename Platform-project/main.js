import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { AxeKnightEnemy } from './enemies.js';
import { UI } from './UI.js';

// var music = document.getElementById("audio");
// music.loop = true;
// music.volume = 1; 
// music.play();

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.stages = [1, 2, 3, 4];
            this.currentStage = this.stages[0];
            this.enemies = [];
            this.player = new Player(this);
            this.floorcollisions2D = [];
            this.background = new Background(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
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
            this.music = document.getElementById("audio");
            this.music.loop = true;
            this.music.volume = 1; 
            this.music.play();
            this.music2 = document.getElementById("audio2");
            this.music2.loop = true;
            this.music2.volume = 1; 
        }
        update(deltaTime){
            //Timer
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.player.update(this.input.keys, deltaTime);
            this.background.update();
            // Handle Enemies
            this.enemies.forEach(enemy =>{
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if(this.player.x === this.width*0.5){
                this.setStage();
            }
            // console.log(this.player.x, this.player.y)
        }
        draw(context){
            context.save();
            context.scale(2.2*0.75,2.2*0.75);
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy =>{
                enemy.draw(context);
            });
            if(this.debug === true){
                this.floorcollisions2D.forEach((collision) => {
                    collision.draw(context);
                });
            }
            this.UI.draw(context);
            context.restore()
        }
        setStage(){
            if(this.currentStage !== 4){
                this.currentStage++;
                if(this.currentStage === 4) {
                    this.music.pause();
                    this.music2.play();
                }
            }
            this.floorcollisions2D = [];
            this.enemies = []
            this.background = new Background(this);
            this.player = new Player(this);
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