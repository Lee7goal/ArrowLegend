import { HeroLvType } from "../../game/data/HeroData";
import App from "../../core/App";
import { GoldType } from "../../game/data/HomeData";

export default class SysRoleUp{
    public static NAME:string = 'sys_roleup.txt';
    public id:number = 0;
    public roleLevel:number = 0;
    public roleId:number = 0;
    public addAtk:number = 0;
    public costAtk:number = 0;
    public addHp:number = 0;
    public costHp:number = 0;

    public getCost( type:HeroLvType ):number{
        if( type == HeroLvType.ATK ){
            return this.costAtk;
        }else if( type == HeroLvType.HP ){
            return this.costHp;
        }
    }

    public getCostType( type:HeroLvType ):number{
        if( type == HeroLvType.ATK ){
            return GoldType.BLUE_DIAMONG;
        }else if( type == HeroLvType.HP ){
            return GoldType.RED_DIAMONG;
        }
    }

    public getValue(type:HeroLvType):number{
        if( type == HeroLvType.ATK ){
            return this.addAtk;
        }else if( type == HeroLvType.HP ){
            return this.addHp;
        }
    }

    public static getSysRole( roleId:number , lv:number ):SysRoleUp{
        let sysArr = App.tableManager.getTable( SysRoleUp.NAME );
        for( let k of sysArr ){
            if( k.roleId == roleId && k.roleLevel == lv ){
                return k;
            }
        }
        return null;
    }
}