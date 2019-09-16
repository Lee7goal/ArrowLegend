import Game from "../../../game/Game";

export default class GameFence{
    static TAG:string = "GameFence";
    public box:Laya.Sprite3D;

    static arr:GameFence[] = [];
    constructor() {
        this.box = Laya.Sprite3D.instantiate(Game.fence);
    }

    setPos(v3:Laya.Vector3):void
    {
        this.box.transform.position = v3;
        Game.layer3d.addChild(this.box);
    }

    static recover():void
    {
        while(GameFence.arr.length > 0)
        {
            let rube:GameFence =  GameFence.arr.shift();
            rube.box.removeSelf();
            Laya.Pool.recover(GameFence.TAG,rube);
        }
        GameFence.arr.length = 0;
    }

    static getOne(v3:Laya.Vector3):GameFence
    {
        let rube:GameFence = Laya.Pool.getItemByClass(GameFence.TAG, GameFence);
        rube.setPos(v3);
        GameFence.arr.push(rube);
        return rube;
    }
}