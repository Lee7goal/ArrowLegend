import Game from "../../../game/Game";

export default class GameRube{
    static TAG:string = "GameRube";
    public box:Laya.Sprite3D;

    static arr:GameRube[] = [];
    constructor() {
        this.box = Laya.Sprite3D.instantiate(Game.box);
        this.box.transform.scale = Game.cameraCN.boxscale0;
    }

    setPos(v3:Laya.Vector3):void
    {
        this.box.transform.position = v3;
        Game.layer3d.addChild(this.box);
    }

    static recover():void
    {
        while(GameRube.arr.length > 0)
        {
            let rube:GameRube =  GameRube.arr.shift();
            rube.box.removeSelf();
            Laya.Pool.recover(GameRube.TAG,rube);
        }
        GameRube.arr.length = 0;
    }


    static getOne(v3:Laya.Vector3):GameRube
    {
        let rube:GameRube = Laya.Pool.getItemByClass(GameRube.TAG, GameRube);
        rube.setPos(v3);
        GameRube.arr.push(rube);
        return rube;
    }
}