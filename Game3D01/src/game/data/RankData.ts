import IData from "./IData";
import App from "../../core/App";
import Session from "../../main/Session";
export default class RankData implements IData{
    constructor(){
        
    }

    public setData(data:any):void{
        
    }

    public saveData(data:any):void{
        
    }
    
    public initData(data:any):void{
        
    }

    /**
     * 存储世界排行榜
     */
    public saveWorldRank():void
    {
        let obj:any = {};
        obj.skey = Session.SKEY;
        obj.name = "荒野女枪";
        obj.scorestr = Session.homeData.chapterId;
        obj.url = "chengjiu/xiao.png";
        obj.item = 0;
        if( Laya.Browser.onMiniGame == false ){
            App.http( App.serverIP + "gamex3/saveRank" , obj , "post" );
            return;
        }
        if( App.sdkManager.haveRight == false ){
            return;
        }
        obj.name = App.sdkManager.wxName;
        obj.url = App.sdkManager.wxHead;
        App.http( App.serverIP + "gamex3/saveRank" , obj , "post" );
    }

    public getRank( caller:any  , listener:Function  ):void {
        App.http( App.serverIP + "gamex3/getRank" , "skey=" + Session.SKEY + "&st=0&et=50", "GET",caller , listener );
    }

    /**
     * 存储好友排行榜
     */
    public saveFriendRank():void{
        if( Laya.Browser.onMiniGame == false ){
            return;
        }
        var obj:any = {};
        var o1:any = {};
        o1.key = "stageNum";
        o1.value = Session.homeData.chapterId + "";
        obj["KVDataList"] = [o1];
        obj.success = (res)=>{
            console.log("存储好友排行榜成功" , res );
        }
        obj.fail = (res)=>{
            console.log("存储好友排行榜失败", res );
        }
        Laya.Browser.window.wx.setUserCloudStorage(obj);
    }
}