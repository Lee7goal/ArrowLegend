import App from "../../core/App";

export default class SysMap {
    static NAME:string = 'sys_stageinfo.txt';
    constructor() { }

    public id:number = 0;
    public stageId:number = 0;
    public stageGroup:string = '';


    static getData(chaterId:number,mapId:number):SysMap
    {
        let arr:SysMap[] = App.tableManager.getTable(SysMap.NAME);
        let size = arr.length;
        for(var i = 0; i < size; i++)
        {
            if(arr[i].id == mapId && arr[i].stageId == chaterId)
            {
                return arr[i];
            }
        }
        return null;
    }

    static getTotal(chaterId:number):number
    {
        let count:number = 0;
        let arr:SysMap[] = App.tableManager.getTable(SysMap.NAME);
        let size = arr.length;
        for(var i = 0; i < size; i++)
        {
            if(arr[i].stageId == chaterId)
            {
                count++;
            }
        }
        count--;
        return count;
    }
}