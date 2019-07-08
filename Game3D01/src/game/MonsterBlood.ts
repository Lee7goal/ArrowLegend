import { ui } from "./../ui/layaMaxUI";
import GameData from "./GameData";
export default class MonsterBlood extends ui.test.Blood2UIUI {
    private gameData: GameData;
    private shape: Laya.Sprite;
    constructor() {
        super();
        super();
        this.shape = new Laya.Sprite();
        this.shape.y = this.bar.y + 2;
    }

    private _rect:Laya.Rectangle = new Laya.Rectangle();
    public init(data:GameData):void{
        this.gameData = data;
        this._rect.x = 0;
        this._rect.y = 0;
        this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
        this._rect.height = 17;
        this.bar.scrollRect = this._rect;
    }

    public update(hurt:number):void
    {
        this.gameData.hp -= hurt;
        this.gameData.hp = Math.max(this.gameData.hp,0);
        this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
        this.bar.scrollRect = this._rect;

        Laya.Tween.clearTween(this.shape);
        this.shape.graphics.clear();
        this.shape.graphics.drawRect(0,0,hurt / this.gameData.maxhp * this.width,13,"#ffffff");
        this.addChild(this.shape);
        this.shape.x = this._rect.width;
        Laya.Tween.to(this.shape,{width:0},300,null,new Laya.Handler(this,this.onCom));

        if(this.gameData.hp == 0)
        {
            this.removeSelf();
        }
    }

    private onCom():void{
        this.shape.removeSelf();
    }
}