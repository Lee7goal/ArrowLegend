import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";
import SoundManager from "./manager/SoundManager";
import SdkManager from "./manager/SdkManager";
import DialogManager from "./manager/DialogManager";

export default class App{
    static top:number = 10;

    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager = null;
    static tableManager:TableManager = null;
    static soundManager:SoundManager = null;
    static sdkManager:SdkManager = null;
    static eventManager:Laya.EventDispatcher = new Laya.EventDispatcher();
    static dialogManager:DialogManager = new DialogManager();

    static init():void{
        App.layerManager = new LayerManager();
        App.tableManager = new TableManager();
        App.soundManager = new SoundManager();
        App.sdkManager = new SdkManager();        
    }

    static sendEvent( event:string ):void{
        Laya.stage.event( event );
    }

     /**
     * 是否是在模拟器
     */
    public static isSimulator():Boolean {
        if( Laya.Browser.onMiniGame ){
            return Laya.Browser.window.wx.getSystemInfoSync().brand == "devtools";
        }else{
            return false;
        }
    }

    
    public static RandomByArray( arr:Array<any> , deleteArr:boolean = false ):any{
        let value = Math.random() * arr.length;
        let index = Math.floor(value);
        let resvalue = arr[index];
        if( deleteArr ) {
            arr.splice( index,1);
        }
        return resvalue;
    }
}