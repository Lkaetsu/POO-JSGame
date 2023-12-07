class Layer {
    constructor(game, width, height,  image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.image = image;
        this.x = 0;
        this.y = 0;
        this.cameraScale = 0.6;
        this.cameraWidth = this.width * this.cameraScale;
        this.cameraHeight = this.height * this.cameraScale;
        this.cameraX = 0;
        this.cameraY = 0;
    }
    update(){
        // Camera Movement
        this.cameraX = -this.game.width * 0.4 + this.game.player.x;
        this.cameraY = -this.game.height * 0.4 + this.game.player.y;
        // Camera Boundaries
        if(this.cameraX < 0) this.cameraX = 0;
        if(this.cameraX > this.width - this.cameraWidth) this.cameraX = this.width - this.cameraWidth;
        // if(this.cameraY < 0) this.cameraY = 0;
        if(this.cameraY > this.height - this.cameraHeight) this.cameraY = this.height - this.cameraHeight;
    }
    draw(context){
        // context.save();
        // context.translate(this.cameraX, this.cameraY);
        context.drawImage(this.image, this.cameraX, this.cameraY, this.cameraWidth, this.cameraHeight, this.x, this.y, this.width, this.height);
        // context.restore();
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.layer1Image = document.getElementById('background');
        this.layer1 = new Layer(this.game, this.width, this.height, this.layer1Image);
        this.backgroundLayers = [this.layer1];
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