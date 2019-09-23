import IData from "./IData";
import Session from "../../main/Session";
import { GoldType } from "./HomeData";
export default class TimeGoldData implements IData{         
      /**
     * 当前存储的金币数
     */
    public gold:number = 0;
    public reward_min:number = 0;//已经发金币到第几分钟
    public endTime:number = 0;
    public startTime:number = 0;
    
    public static ONE_DAY:number = 24 * 60 * 60 * 1000;

    constructor(){
        
    }

    public setData(data:any):void{
        this.endTime = data.endTime;
        this.reward_min = data.reward_min;
        this.gold = data.gold;
        this.dataServerFun();
    }
    /**
     * 存储数据
     * @param data 
     */
    public saveData(data:any):void{
        data.endTime = this.endTime;
        data.reward_min = this.reward_min;
        data.gold = this.gold;
    }

    /**
     * 第一次运行初始化数据
     * @param data 
     */
    public initData(data:any):void{
        this.startNewDay();
        this.goldTimeStart();
    }

    /**
     * 初始化数据
     */
    public initFun():void{
        this.startNewDay();
        this.goldTimeStart();
    }

    public loopFun():void{
        let ctime = Math.min( Laya.Browser.now() , this.endTime );
        let now_min_time = this.getMinByTime( ctime );
        if( this.reward_min != now_min_time ){
            this.addGoldOnce();
            this.reward_min = now_min_time;
        }
    }

    /**
     * 游戏开始 开始计算钱
     */
    public dataServerFun():void{
        this.startTime = this.endTime - TimeGoldData.ONE_DAY;
        let nowMin:number = 0;
        if( this.endTime < Laya.Browser.now() ){
            nowMin = this.getMinByTime( this.endTime );
        }else{
            nowMin = this.getMinByTime( Laya.Browser.now() );
        }
        let rgold = ( nowMin - this.reward_min ) * this.getOneGold();
        this.reward_min = nowMin;
        this.setGold( this.gold + rgold );
        this.goldTimeStart();
    }

    public goldTimeStart():void{
        Laya.timer.frameLoop( 1,this,this.loopFun );
    }

    /**
     * 得到所有金币
     */
    public rewardGold( useAd:boolean ):void{
        let agold:number = this.gold;
        if( useAd ){
            agold = this.gold * 3;
        }
        Session.homeData.changeGold( GoldType.GOLD , agold  );
        this.setGold( 0 );
        if( this.endTime <= Laya.Browser.now()  ){
            this.startNewDay();    
        }
        Session.saveData();
    }

    public startNewDay():void{
        this.endTime = Laya.Browser.now() + TimeGoldData.ONE_DAY;
        this.startTime = this.endTime - TimeGoldData.ONE_DAY;
        this.reward_min = 0;
    }

    /**
     * 精确当前时间 是一天中的第几分钟
     */
    public getMinByTime( time:number ):number{
        let t = time - this.startTime;
        return Math.floor( t / ( 60 * 1000 ) );
    }
    
    public getNowTime():Array<number>{
        if( this.endTime < Laya.Browser.now() ){
            return [0,0,0,0];
        }
        let t = this.endTime - Laya.Browser.now();
        let arr = this.getLeft( t , 3600 * 1000 );
        let hour = arr[0];
        arr = this.getLeft( arr[1] , 60 * 1000 ); 
        let min = arr[0];
        arr = this.getLeft( arr[1] , 1000 );
        let second = arr[0];
        arr = this.getLeft( arr[1] , 1 );
        let ms = arr[0];
        return [hour,min,second,ms];
    }
    
    /**
     * 时间到 加一次金币
     */
    public addGoldOnce():void{
        this.setGold( this.gold + this.getOneGold() );
        this.reward_min = this.getMinByTime( Laya.Browser.now() );
        Session.saveData();
    }

    public getOneGold():number{
        let max = Session.homeData.chapterId;
        let addGold = Math.ceil( max / 2 + 1 );
        addGold = 2;
        addGold = addGold * ( 1 + Session.talentData.offlineGold );
        addGold = parseInt( addGold + "" );
        return addGold;
    }

    public setGold( value:number ):void{
        this.gold = value;
    }

    private getLeft( t:number , v:number ):Array<number>{
        let a = parseInt( (t / v) + "" );
        let b = t - a * v;
        return [a,b];
    }
}