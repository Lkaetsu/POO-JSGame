import { loadStageCollisions } from './collisionBlocks.js';

class Layer {
    constructor(game, width, height,  image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.image = image;
        this.x = 0;
        this.y = 0;
        this.cameraWidth = this.width;
        this.cameraHeight = this.height;
        this.cameraX = 0;
        this.cameraY = 0;
        loadStageCollisions(this.game);
    }
    update(){
        // Camera Movement
        this.cameraX = -this.game.width * 0.0001 + this.game.player.x ;
        this.cameraY = -this.game.height * 0.0001 + this.game.player.y;
        // Camera Boundaries
        if(this.cameraX < 0) this.cameraX = 0;
        // if(this.cameraX > this.width - this.cameraWidth) this.cameraX = this.width - this.cameraWidth;
        if(this.cameraY < 0) this.cameraY = 0;
        if(this.cameraY > this.height - this.cameraHeight) this.cameraY = this.height - this.cameraHeight;
    }
    draw(context){
        context.drawImage(this.image, this.cameraX , this.cameraY + 80, this.cameraWidth, this.cameraHeight, this.x, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.layerImage = document.getElementById('map' + this.game.currentStage);
        this.layer = new Layer(this.game, this.width, this.height, this.layerImage);
        this.backgroundLayers = [this.layer];
    }
    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}