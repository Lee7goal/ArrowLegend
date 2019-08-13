import HomeData from "../game/data/HomeData";
import MainUI from "./scene/main/MainUI";
import SenderHttp from "../net/SenderHttp";

export default class Session{
    static SKEY:string;

    static gameData:any = {};

    static homeData:HomeData = new HomeData();

    static saveData():void
    {
        Session.gameData.curEnergy = Session.homeData.curEnergy;
        Session.gameData.maxEngergy = Session.homeData.maxEngergy;
        Session.gameData.lastTime = Session.homeData.lastTime;
        Session.gameData.totalEnergy = Session.homeData.totalEnergy;

        SenderHttp.create().send();
    }

    static parseData(str:string):void
    {
        if(str != "")
        {
            Session.gameData = JSON.parse(str);
            Session.homeData.totalEnergy = Session.gameData.totalEnergy;
            Session.homeData.maxEngergy = Session.gameData.maxEngergy;
            Session.homeData.lastTime = Session.gameData.lastTime;
            Session.homeData.curEnergy = Session.gameData.curEnergy;
            if(Date.now() >= Session.homeData.lastTime)
            {
                Session.homeData.curEnergy = Session.homeData.totalEnergy;
            }
            else
            {
                let deltaTime:number = Session.homeData.lastTime - Date.now();
                let time:number = Math.floor(deltaTime / 1000);
                let delta:number = Math.ceil(time / MainUI.TOTAL_TIME);
                Session.homeData.curEnergy = Session.homeData.totalEnergy - delta;

                console.log("Session剩余的时间",time,Session.homeData.curEnergy);
            }
        }
        else
        {
            Session.gameData = {};

            Session.homeData.totalEnergy = MainUI.MAX_ENERGY;
            Session.homeData.maxEngergy = MainUI.MAX_ENERGY;
            Session.homeData.curEnergy = Session.homeData.totalEnergy;
            Session.homeData.lastTime = 0;

            Session.gameData.curEnergy = Session.homeData.curEnergy;
            Session.gameData.maxEngergy = Session.homeData.maxEngergy;
            Session.gameData.lastTime = Session.homeData.lastTime;
            Session.gameData.totalEnergy = Session.homeData.totalEnergy;
        }
    }
}