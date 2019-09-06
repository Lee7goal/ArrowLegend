import HomeData from "../game/data/HomeData";
import MainUI, { TopUI } from "./scene/main/MainUI";
import SenderHttp from "../net/SenderHttp";
import Game from "../game/Game";
import TalentData from "../game/data/TalentData";
import IData from "../game/data/IData";
import UserData from "../game/data/UserData";
import TaskData from "../game/data/TaskData";
import GameEvent from "./GameEvent";
import HeroData from "../game/data/HeroData";

export default class Session{
    static SKEY:string;

    static gameData:any = {};

    static homeData:HomeData = new HomeData();
    static talentData:TalentData = new TalentData();
    static userData:UserData = new UserData();
    static taskData:TaskData = new TaskData();
    static heroData:HeroData = new HeroData();

    static IDataArr:Array<IData> = [];

    public static init():void{
        Session.IDataArr.push( Session.talentData );
        Session.IDataArr.push( Session.taskData );
        Session.IDataArr.push( Session.userData );
        Session.IDataArr.push( Session.heroData );
    }

    static saveData():void{
        for( let i of Session.IDataArr ){
            i.saveData( Session.gameData );
        }
        SenderHttp.create().send();
    }

    static parseData(str:string):void{
        if(str != "" && str != "0" ){
            Session.gameData = JSON.parse(str);
            for( let i of Session.IDataArr ){
                i.setData( Session.gameData );
            }
        } else {
            Laya.stage.once(GameEvent.CONFIG_OVER , null , Session.configFun );
        }
    }

    private static configFun():void{
        for( let i of Session.IDataArr ){
            i.initData( Session.gameData );
        }
        Session.saveData();
    }
}