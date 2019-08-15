import App from "../../core/App";

export default class SysLevel{
    static NAME:string = 'sys_rolelevel.txt';
    constructor() {}
    public id:number = 0;
    public roleExp:number = 0;


    public static getMaxExpByLv(lv:number):number
    {
        var sys:SysLevel = App.tableManager.getDataByNameAndId(SysLevel.NAME,lv);
        sys.roleExp = 50;
        return sys == null ? 0 : sys.roleExp;
    }

    public static getLv(exp:number):number
    {
        var sum:number = 0;
        for(var i = 1; i <= 60; i++)
        {
            var sys:SysLevel = App.tableManager.getDataByNameAndId(SysLevel.NAME,i);
            sys.roleExp = 50;
            sum += sys.roleExp;
            if(exp < sum)
            {
                return sys.id;
            }
        }
        return 1;
    }

    public static getExpSum(lv:number):number
    {
        var sum:number = 0;
        for(var i = 1; i <= lv; i++)
        {
            sum += SysLevel.getMaxExpByLv(i);
        }
        return sum;
    }
}