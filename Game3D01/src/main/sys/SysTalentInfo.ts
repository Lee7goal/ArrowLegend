import App from "../../core/App";

export default class SysTalentInfo{
    public static NAME:string = "sys_talentinfo.txt";
    public id:number = 0;
    public idName:string = "";
    public talentName:string = "";
    public talentInfo:string = "";
    public talentSort:number = 0;
    /**
     * 1是数值
     * 2是百分比
     */
    public talentType:number = 0;
    /**
     * 已排序
     */
    public static getSys():Array<SysTalentInfo>{
        let arr:Array<SysTalentInfo> = App.tableManager.getTable(SysTalentInfo.NAME);
        arr.sort( function(a,b){
            return a.talentSort - b.talentSort;
        } );
        return arr;
    }

    public getHou():string{
        if( this.talentType == 1 ){
            return "";
        }else if( this.talentType == 2 ) {
            return "%";
        }
    }
}