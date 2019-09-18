import { HeroLvType } from "./HeroData";

export default class HeroBaseData{
    public id:number = 0;
    public hpLv:number = 0;
    public atkLv:number = 0;
    /**
     * 升级技能是有cd的
     */
    public hpTime:number = 0;
    public atkTime:number = 0;
    
    constructor(){
        
    }

    public getString():string{
        return [this.id,this.hpLv,this.atkLv,this.hpTime,this.atkTime].join(",");
    }

    public setString( str:string ):void{
        let arr = str.split(",");
        this.id = parseInt( arr[0] ); 
        this.hpLv = parseInt( arr[1] );
        this.atkLv = parseInt( arr[2] );
        this.hpTime = parseInt( arr[3] );
        this.atkTime = parseInt( arr[4] );
    }

    public initData():void{
        this.hpLv = 1;
        this.atkLv = 1;
    }

    public getLv(type:HeroLvType):number{
        if( type == HeroLvType.ATK ){
            return this.atkLv;
        }
        if( type == HeroLvType.HP ){
            return this.hpLv;
        }
    }

    public setLv( type:HeroLvType , lv:number ):void{
        if( type == HeroLvType.ATK ){
            this.atkLv = lv;
        }
        if( type == HeroLvType.HP ){
            this.hpLv = lv;
        }
    }
}