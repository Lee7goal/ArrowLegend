import App from "../../core/App";
import { HeroLvType } from "../../game/data/HeroData";

export default class SysRoleBase{
    static NAME:string = 'sys_rolebase.txt';
    public id:number = 0;
    public roleName:string = "";
    public baseAtk:number = 0;
    public baseHp:number = 0;
    public baseSpeed:number = 0;
    public baseCrit:number = 0;
    public baseCritHurt:number = 0;
    public baseDodge:number = 0;
    public baseMove:number = 0;
    public baseSkill:number = 0;	
    public addExp:number = 0;
    public addSpeed:number = 0;
    public addAttack:number = 0;

    public static getSys(id:number):SysRoleBase{
        let arr = App.tableManager.getTable( SysRoleBase.NAME );
        for( let k of arr ){
            if( k.id == id ){
                return k;
            }
        }
        return null;
    }

    public getValue( v:HeroLvType ):number{
        if( v == HeroLvType.ATK ){
            return this.baseAtk;
        }else if( v == HeroLvType.HP ){
            return this.baseHp;
        }
    }
}