import IData from "./IData";
import App from "../../core/App";
import SysTalentInfo from "../../main/sys/SysTalentInfo";
import GameEvent from "../../main/GameEvent";
import Session from "../../main/Session";
import { GoldType } from "./HomeData";
import SysTalentCost from "../../main/sys/SysTalentCost";
import Equip from "./Equip";
import { ui } from "../../ui/layaMaxUI";
import SysTalent from "../../main/sys/SysTalent";

export default class TalentData implements IData {
    
    public talentArr:Array<number> = [];
    /**
     * 默认升级0次
     */
    public lvTimes:number = 0;
    
    public imgArr:Array<any> = [];

    public talentLvMap:any = {};

    constructor(){
        this.addData( "tianfu/PTkuang.png" , "tianfu/gongji.png"  , "tianfu/gongzi.png", 1 );
        this.addData( "tianfu/PTkuang.png" , "tianfu/baoji.png" , "tianfu/baozi.png", 2 );
        this.addData( "tianfu/PTkuang.png" , "tianfu/xingyun.png" , "tianfu/xingzi.png", 3 );

        this.addData( "tianfu/JYkuang.png" , "tianfu/fangyu.png" , "tianfu/fangzi.png", 4 );
        this.addData( "tianfu/JYkuang.png" , "tianfu/sudu.png" , "tianfu/yizi.png", 5 );
        this.addData( "tianfu/JYkuang.png" , "tianfu/shengming.png" , "tianfu/shengzi.png", 6 );

        this.addData( "tianfu/SSkuang.png" , "tianfu/tiejiang.png" , "tianfu/tiezi.png", 7 );
        this.addData( "tianfu/SSkuang.png" , "tianfu/jinbi.png" , "tianfu/diaozi.png", 8 );
        this.addData( "tianfu/SSkuang.png" , "tianfu/lixian.png" , "tianfu/lizi.png", 9 );
    }

    private addData( bg:string , logo:string , font:string, id:number ):void{
        this.imgArr.push( { bg:bg , logo:logo , font:font , id:id } );
    }

    public getImgData( id:number ):any{
        return this.imgArr[id-1];
    }

    public setData(data:any):void{
        if( data.talent == null ){
            this.initData(data);
        }
        let arr = data.talent.split(",");
        for( let i:number = 0; i < arr.length; i+=2 ){
            let tId:number = parseInt(arr[i]);
            let tLv:number = parseInt(arr[i+1]);
            this.talentLvMap[tId] = tLv;
        }
        this.lvTimes = (data.lvTimes?data.lvTimes:0);
        this.updateAttribute();
    }

    public saveData(data:any):void{
        let arr:Array<any> = [];
        for( let k in this.talentLvMap ){
            arr.push(k);
            arr.push( this.talentLvMap[k] );
        }
        data.talent = arr.join(",");
        data.lvTimes = this.lvTimes;
    }

    public initData(data:any):void{
        let sysArr:Array<SysTalentInfo> = App.tableManager.getTable( SysTalentInfo.NAME );
        for( let k of sysArr ){
            this.talentLvMap[k.id] = 0;
        }
    }

    public getLv( id:number ):number {
        return this.talentLvMap[id];
    }

    public getTxt( index:number ):string
    {
        // if( index == 0 ){
        //     return this.equip.attack + "";
        // }else if( index == 1 ){
        //     return this.equip.move + "";
        // }else if( index == 2 ){
        //     return this.deadLuck + "";
        // }else if( index == 3 ){
        //     return this.equip.defense + "";
        // }else if( index == 4 ){
        //     return this.equip.hitPoint + "";
        // }else if( index == 5 ){
        //     return this.dropGold + "";
        // }else if( index == 6 ){
        //     return this.equip.crit + "";
        // }else if( index == 7 ){
        //     return this.offLineGold + "";
        // }else if( index == 8 ){
        //     return  this.mergeEquip + "";
        // }
        return "";
    }

    public atk:number = 0;
    public hp:number = 0;
    public def:number = 0;
    
    public equip:Equip = new Equip();

    public updateAttribute():void{
        this.equip.reset0();
        this.equip.atk = this.getAtt( 1 );
        this.equip.hp = this.getAtt( 2 );
        this.equip.def = this.getAtt( 4 );
        this.equip.atkSpeed = this.getAtt( 5 );
        this.addItemhp = this.getAtt(3);
        this.dropLevelhp = this.getAtt(6);
        this.addCompose = this.getAtt(7);
        this.lineGold = this.getAtt(8);
        this.offlineGold = this.getAtt(9);
    }

    public offlineGold:number = 0;
    public lineGold:number = 0;
    public addCompose:number = 0;
    public dropLevelhp:number = 0;
    public addItemhp:number = 0;

    private getAtt( tid:number ):number{
        let lv = this.getLv(tid);
        if( lv == 0 ){
            return 0;
        }
        let sysInfo:SysTalentInfo = App.tableManager.getDataByNameAndId( SysTalentInfo.NAME , tid );
        let sysT:SysTalent = App.tableManager.getDataByNameAndId( SysTalent.NAME , lv );
        return sysT[sysInfo.idName];
    }

    /**
     * 升级天赋
     * @param id 
     */
    public lvUp( id:number ):number{
        let res = this.canLvUp();
        if( res != 0 ){
            return res;
        }
        this.lvTimes++;
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        Session.homeData.changeGold( GoldType.GOLD , -sys.talentCost );
        this.talentLvMap[id] = this.getLv( id ) + 1;
        App.sendEvent( GameEvent.TALENT_UPDATE );
        Session.saveData();
        this.updateAttribute();
        return res;
    }

    public getGold():number{
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        return sys.talentCost;
    }

    public haveGold():boolean{
        let g = Session.homeData.getGoldByType( GoldType.GOLD );
        let sys:SysTalentCost = App.tableManager.getDataByNameAndId( SysTalentCost.NAME , (this.lvTimes + 1) );
        return g >= sys.talentCost;
    }

    public canLvUp():number{
        if( this.haveGold() == false ){
            return -1;
        }
        if( this.lvTimes >= Session.homeData.battleLv ){
            return -2;
        }
        return 0;
    }
}