import Game from "../../../game/Game";

export default class GameCube{
    static TAG:string = "GameCube_";
    public box:Laya.Sprite3D;
    public type:number;
    static arr:GameCube[] = [];
    constructor() {
        
    }

    init(type:number):void
    {
        if(!this.box)
        {
            this.box = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/wall/"+type+"/monster.lh"));
            if(type != 3000 && type != 3500 && type != 4000)
            {
                this.box.transform.scale = Game.cameraCN.boxscale;
            }
        }
        Game.layer3d.addChild(this.box);
    }

    static recover():void
    {
        while(GameCube.arr.length > 0)
        {
            let rube:GameCube =  GameCube.arr.shift();
            rube.box.removeSelf();
            Laya.Pool.recover(GameCube.TAG + rube.type,rube);
        }
        GameCube.arr.length = 0;
    }

    static getOne(v3:Laya.Vector3,type:number):GameCube
    {
        type = GameCube.getType(type);
        let tag:string = GameCube.TAG + type;
        Game.poolTagArr[tag] = tag;
        let rube:GameCube = Laya.Pool.getItemByClass(tag, GameCube);
        rube.init(type);
        rube.box.transform.position = v3;
        GameCube.arr.push(rube);
        return rube;
    }

    static getType(type:number):number
    {
        if(type == 1 || (type >= 1000 && type < 1500))
        {
            return 1000;
        }
        if(type == 2 || (type >= 1500 && type < 2000))
        {
            return 1500;
        }
        if(type == 3 || (type >= 2000 && type < 2500))
        {
            return 2000;
        }
        if(type == 4 || (type >= 2500 && type < 3000))
        {
            return 2500;
        }
        if(type == 5 || (type >= 3000 && type < 3500))
        {
            return 3000;
        }
        if(type == 6 || (type >= 3500 && type < 4000))
        {
            return 3500;
        }
        if(type == 7 || (type >= 4000 && type < 4500))
        {
            return 4000;
        }
        if(type == 8 || (type >= 4500 && type < 5000))
        {
            return 4500;
        }
        if(type == 9 || (type >= 5000 && type < 5500))
        {
            return 5000;
        }
        if(type == 10 || (type >= 5500 && type < 6000))
        {
            return 5500;
        }
    }

}