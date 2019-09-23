import Session from "../Session";
import App from "../../core/App";

export default class SysHero{
    static NAME:string = 'sys_hero.txt';
    public id:number = 0;
    public roleExp:number = 0;



    static getNewLv(exp:number):number[]
    {
        let oldExp:number = Session.homeData.playerExp;
        let oldLv:number = Session.homeData.playerLv;

        let newExp:number = oldExp + exp;
        let newLv:number = oldLv;
        while( true ){
            let sys:SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME , oldLv );    
            if( newExp >= sys.roleExp  ){
                let nowLv = oldLv + 1;
                if( App.tableManager.getDataByNameAndId(SysHero.NAME ,oldLv ) == null ){
                    //等级已经到头了
                    break;
                }
                newLv = nowLv;
                newExp -= sys.roleExp;
            }else{
                break;
            }
        }
        console.log("加经验后的等级",newLv,newExp);
        return [newLv,newExp];
    }
}