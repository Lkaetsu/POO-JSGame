class Layer {
    constructor(game, width, height,  image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if((this.game.player.vy !== 0 || this.game.player.vx !== 0)){
            this.x -= this.game.player.x + this.x;
            this.y -= this.game.player.y + this.y;
            }
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = 846;
        this.height = 530;
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