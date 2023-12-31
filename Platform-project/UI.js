export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = 'Algerian';
        this.livesImage = document.getElementById('lives');
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'gray';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // Score
        context.fillText('Score: ' + this.game.score, 10, 20);
        // Timer
        // context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(2), 100, 20);
        // Lives
        for(let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 10 * i + 15, 25, 15, 15);
        }
        // Game Over Message
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > this.game.winningScore){
                context.fillText('You won!!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Your time was: ' + (this.game.time * 0.001).toFixed(2), this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText('You lost', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Better luck next time!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
}