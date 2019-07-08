import HeroBlood from "./HeroBlood";
import MonsterBlood from "./MonsterBlood";
import GameData from "./GameData";
import GameProType from "./GameProType";

export default class Blood extends Laya.Sprite {
    private ui:HeroBlood;
    private ui2:MonsterBlood;
    private _data:GameData;
    constructor() { 
        super(); 
    }

    public init(data:GameData):void{
        this._data = data;
        if(this._data.proType == GameProType.Hero)
        {
            if(!this.ui)
            {
                this.ui = new HeroBlood();
            }
            this.ui.init(this._data);
            this.addChild(this.ui);
        }
        else if(this._data.proType == GameProType.RockGolem_Blue)
        {
            if(!this.ui2)
            {
                this.ui2 = new MonsterBlood();
            }
            this.ui2.init(this._data);
            this.addChild(this.ui2);
        }
    }

    public update(hurt:number):void
    {
        if(this._data.proType == GameProType.Hero)
        {
            this.ui.update(hurt);
        }
        else if(this._data.proType == GameProType.RockGolem_Blue)
        {
            this.ui2.update(hurt);
        }
    }
}