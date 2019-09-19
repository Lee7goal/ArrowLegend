import { ui } from "../../../../ui/layaMaxUI";
import SdkManager from "../../../../core/manager/SdkManager";
import App from "../../../../core/App";
import Session from "../../../Session";

export default class RankDialog extends ui.test.paihangUI{
    constructor(){
        super();
        this.list.vScrollBarSkin = "";
        this.tab.selectHandler = new Laya.Handler( this,this.selectFun );
        this.tab.selectedIndex = -1;
        this.tab.selectedIndex = 0;
        this.list.renderHandler = new Laya.Handler( this,this.renderFun );
        this.list.selectEnable = true;
        this.list.selectHandler = new Laya.Handler( this,this.listSelectFun );
        if( Laya.Browser.onMiniGame == false ){
            return;
        }
        if( App.sdkManager.haveRight ){
            return;    
        }else{
            this.tab.disabled = true;
            Laya.timer.callLater( this,this.shouQuan );
        }
    }

    public shouQuan():void{
        App.sdkManager.addUserInfoBtn( <any>this.tab , new Laya.Handler(this,this.useFun ) );
    }

    /**
     * 授权成功
     */
    public useFun():void {
        Session.rankData.saveWorldRank();
        this.tab.disabled = false;
        this.tab.selectedIndex = 1;
    }

    public listSelectFun(index:number):void{
        if( index == -1 ){
            return;
        }
        // let obj = this.dialog.list.getItem(index);
        // App.dialog( MyGameInit.RANK_INFO , false , obj );
        // this.dialog.list.selectedIndex = -1;
    }

    public rankSkin:Array<string> = ["paihang/yiming.png","paihang/erming.png","paihang/sanming.png"];

    public renderFun(cell:ui.test.paihang1UI , index:number):void{
        let obj = this.list.getItem(index);
        cell.goldFc.value = parseInt( obj.score + "" ) + "";
        cell.mingzi.text = obj.name;
        let rank = parseInt( obj.rank );
        cell.touxiang.skin = obj.url;
        if( rank < 3 ){
            cell.fc1.visible = false;
            cell.paiming.visible = true;
            cell.paiming.skin = this.rankSkin[rank];
        }else{
            cell.fc1.visible = true;
            cell.paiming.visible = false;
            cell.fc1.value = (rank + 1) + "";
        }
    }

    public selectFun( index:number ):void{
        if( index == -1 ){
            return;
        }
        this["tab" + index]();
    }

    public tab0():void {
        this.wxOpen.visible = true;
        this.list.visible = false;
        this.myText.visible = false;
        if( Laya.Browser.onMiniGame == false ){
            return;
        }
        var obj:any = {};
        obj.type = 0;
        obj.openId = Session.SKEY;
        Laya.Browser.window.wx.getOpenDataContext().postMessage(obj);
    }

    public tab1():void {
        this.list.array = [];
        this.wxOpen.visible = false;
        this.list.visible = true;
        this.myText.visible = true;
        Session.rankData.getRank(  this, this.rankFun  );
    }

    public rankFun( str:string ):void{
        if( this.tab.selectedIndex != 1 ){
            return;
        }
        let obj = JSON.parse( str );
        let myobj = obj.my;
        let arr:Array<any> = obj.list;
        this.list.array = arr;
        let rank = parseInt(myobj.rank) + 1;
        this.myText.text = "当前排名:" + rank;
    }

    public sortList( arr:Array<any> ):void{
        arr.sort( this.sortFun );
        for( let i:number = 0; i < arr.length; i++ ){
            arr[i].rank = i;
        }
    }

    private sortFun( a , b ):number{
        return parseInt(b.score) - parseInt(a.score);
    }
}