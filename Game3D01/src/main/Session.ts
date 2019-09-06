import HomeData from "../game/data/HomeData";
import MainUI, { TopUI } from "./scene/main/MainUI";
import SenderHttp from "../net/SenderHttp";
import Game from "../game/Game";
import TalentData from "../game/data/TalentData";
import IData from "../game/data/IData";
import UserData from "../game/data/UserData";
import TaskData from "../game/data/TaskData";
import GameEvent from "./GameEvent";

export default class Session{
    static SKEY:string;

    static gameData:any = {};

    static homeData:HomeData = new HomeData();
    static talentData:TalentData = new TalentData();
    static userData:UserData = new UserData();
    static taskData:TaskData = new TaskData();

    static IDataArr:Array<IData> = [];

    public static init():void{
        Session.IDataArr.push( Session.talentData );
        Session.IDataArr.push( Session.taskData );
        Session.IDataArr.push( Session.userData );
    }

    static saveData():void
    {
        Session.gameData.curEnergy = Session.homeData.curEnergy;
        Session.gameData.maxEngergy = Session.homeData.maxEngergy;
        Session.gameData.lastTime = Session.homeData.lastTime;
        Session.gameData.totalEnergy = Session.homeData.totalEnergy;
        Session.gameData.chapterId = Session.homeData.chapterId;
        if(Game.battleLoader.index > Session.gameData.mapIndex)
        {
            Session.gameData.mapIndex = Game.battleLoader.index;
            console.log("存储最高层数",Session.gameData.mapIndex);
        }

        Session.gameData.coins += Game.addCoins;
        Session.homeData.coins = Session.gameData.coins;
        Session.gameData.level = Session.homeData.level;

        for( let i of Session.IDataArr ){
            i.saveData( Session.gameData );
        }

        SenderHttp.create().send();
    }

    static parseData(str:string):void
    {
        if(str != "" && str != "0" )
        {
            Session.gameData = JSON.parse(str);

            for( let i of Session.IDataArr ){
                i.setData( Session.gameData );
            }

            Session.homeData.totalEnergy = Session.gameData.totalEnergy;
            Session.homeData.maxEngergy = Session.gameData.maxEngergy;
            Session.homeData.lastTime = Session.gameData.lastTime;
            Session.homeData.curEnergy = Session.gameData.curEnergy;
            Session.homeData.chapterId = Session.gameData.chapterId;
            Session.homeData.mapIndex = Session.gameData.mapIndex;
            Session.homeData.level = Session.gameData.level;
            Session.homeData.coins = Session.gameData.coins;
            if(Date.now() >= Session.homeData.lastTime)
            {
                Session.homeData.curEnergy = Session.homeData.totalEnergy;
            }
            else
            {
                let deltaTime:number = Session.homeData.lastTime - Date.now();
                let time:number = Math.floor(deltaTime / 1000);
                let delta:number = Math.ceil(time / TopUI.TOTAL_TIME);
                Session.homeData.curEnergy = Session.homeData.totalEnergy - delta;

                console.log("Session剩余的时间",time,Session.homeData.curEnergy);
            }
        }
        else
        {
            Laya.stage.once(GameEvent.CONFIG_OVER ,null , Session.configFun );
        }
    }

    private static configFun():void{
        for( let i of Session.IDataArr ){
            i.initData( Session.gameData );
        }
        this.saveData();
    }
}