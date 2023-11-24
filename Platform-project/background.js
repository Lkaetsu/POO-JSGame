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
        if(this.x < -this.width) this.x = 0;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = 1692;
        this.height = 1060;
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