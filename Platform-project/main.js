import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            // this.groundMargin = 30;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            // this.particles = [];
            this.collisions = [];
            // this.floatingMessages = [];
            // this.maxParticles = 50;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 3000000;
            this.gameOver = false;
            this.lives = 3;
            this.player.currentState = this.player.states[1];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // Handle Enemies
            this.addEnemy();
            this.enemies.forEach(enemy =>{
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            // Handle Floating Messages
            // this.floatingMessages.forEach(floatingMessage =>{
            //     floatingMessage.update();
            // });
            // this.floatingMessages = this.floatingMessages.filter(floatingMessage => !floatingMessage.markedForDeletion);
            // Handle Particles
            // this.particles.forEach((particle, index) => {
            //     particle.update();
            // });
            // if(this.particles.length > this.maxParticles) {
            //     this.particles.length = this.maxParticles;
            // }
            // this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            // Handle Collision Sprites
            this.collisions.forEach((collision, index) => {
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
            // this.particles.forEach((particle, index) => {
            //     particle.draw(context);
            // })
            this.collisions.forEach((collision, index) => {
                collision.draw(context);
            })
            // this.floatingMessages.forEach(floatingMessage =>{
            //     floatingMessage.draw(context);
            // });
            this.UI.draw(context);
        }
        addEnemy(){
            // if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            // else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            // this.enemies.push(new FlyingEnemy(this));
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