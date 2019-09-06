import IData from "./IData";
import App from "../../core/App";
import SysTalentInfo from "../../main/sys/SysTalentInfo";

export default class TalentData implements IData {
    public talentArr:Array<number> = [];

    constructor(){
        
    }

    setData(data:any):void{
        if( data.talent == null ){
            this.initData(data);
        }
        let arr = data.talent.split(",");
        for( let k of arr ){
            this.talentArr.push( parseInt(k) );
        }
    }

    saveData(data:any):void{
        data.talent = this.talentArr.join(",");
    }

    initData(data:any):void{
        let sysArr:Array<SysTalentInfo> = App.tableManager.getTable( SysTalentInfo.NAME );
        for( let k of sysArr ){
            this.talentArr.push(0);
        }
    }

    public lvUp( id:number ):void{
        let lv = this.talentArr[id-1];
    }
}