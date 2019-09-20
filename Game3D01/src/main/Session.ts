import HomeData from "../game/data/HomeData";
import SenderHttp from "../net/SenderHttp";
import Game from "../game/Game";
import TalentData from "../game/data/TalentData";
import IData from "../game/data/IData";
import UserData from "../game/data/UserData";
import TaskData from "../game/data/TaskData";
import GameEvent from "./GameEvent";
import HeroData from "../game/data/HeroData";
import Monster from "../game/player/Monster";
import TimeGoldData from "../game/data/TimeGoldData";
import RankData from "../game/data/RankData";

export default class Session{
    static SKEY:string;

    // static isGuide:boolean;
    static guideId:number;

    static gameData:any = {};

    static homeData:HomeData = null;
    static talentData:TalentData = null;
    static userData:UserData = null;
    static taskData:TaskData = null;
    static heroData:HeroData = null;
    static timeGoldData:TimeGoldData = null;
    static rankData:RankData = null;

    static IDataArr:Array<IData> = [];

    public static init():void{
        Session.homeData = new HomeData();
        Session.talentData = new TalentData();
        Session.taskData = new TaskData();
        Session.userData = new UserData();
        Session.heroData = new HeroData();
        Session.timeGoldData = new TimeGoldData();
        Session.rankData = new RankData();
        
        Session.IDataArr.push( Session.homeData );
        Session.IDataArr.push( Session.talentData );
        Session.IDataArr.push( Session.taskData );
        Session.IDataArr.push( Session.userData );
        Session.IDataArr.push( Session.heroData );
        Session.IDataArr.push( Session.timeGoldData );
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
            for( let i of Session.IDataArr ){
                i.initData( Session.gameData );
            }
            Session.saveData();
        }
    }

    private static configFun():void{
        for( let i of Session.IDataArr ){
            i.initData( Session.gameData );
        }
        Session.saveData();
    }
}