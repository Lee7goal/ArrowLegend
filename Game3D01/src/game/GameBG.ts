import Image = Laya.Image;
import GameConfig from "../GameConfig";
    
export default class GameBG extends Laya.Sprite{

    static wnum:number = 12;
    static hnum:number = 48;

    static width:number = 750;
    //static height:number = 1000;
    static height:number = 1334;
    static ww:number = GameBG.width/GameBG.wnum;
    static orthographicVerticalSize:number = GameBG.wnum*GameBG.height/GameBG.width;
    static gameBG:GameBG;

    private bgh:number = 0;

    public getBgh():number{
        return this.bgh;
    }

    constructor(){
        super();
        GameBG.orthographicVerticalSize = GameBG.wnum*Laya.stage.height/Laya.stage.width;
        GameBG.gameBG = this;
    }

    public drawR():void{
        var img:Image;
        var k:number = 0;
        var ww:number =GameBG.ww;
        //GameBG.orthographicVerticalSize
        for (let j = 0; j < GameBG.hnum; j++) {
            this.bgh += ww;
            for (let i = 0; i < GameBG.wnum+1; i++) {
                img = new Image();
                img.skin = (k%2==0)?"comp/g256h.jpg":"comp/g256l.jpg";
                this.addChild(img);
                img.x = i * ww - (ww/2);
                img.y = j * ww;
                k++;
            }
        }
       // this.bgh = Laya.stage.height - this.bgh;
    }
}