import App from "../../core/App";

export default class SysMap {
    static NAME:string = 'sys_stageinfo.txt';

    static dic:any = {};
    constructor() { }

    public id:number = 0;
    public stageId:number = 0;
    public stageGroup:string = '';

    public numEnemy:number = 0;
    public mixEnemy:number = 0;
    public maxEnemy:number = 0;
    public enemyGroup:string = '';


    static getData(chaterId:number,mapId:number):SysMap
    {
        let arr:SysMap[] = SysMap.dic[chaterId];
        let size = arr.length;
        for(var i = 0; i < size; i++)
        {
            if((i + 1) == mapId)
            {
                return arr[i];
            }
        }
        return null;
    }

    static getTotal(chaterId:number):number
    {
        let count:number = 0;
        let arr:SysMap[] =  SysMap.dic[chaterId];
        return arr.length;
    }
}