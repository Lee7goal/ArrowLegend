import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";
import SoundManager from "./manager/SoundManager";
import SdkManager from "./manager/SdkManager";

export default class App{
    static top:number = 10;

    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager = new LayerManager();
    static tableManager:TableManager = new TableManager();
    static soundManager:SoundManager = new SoundManager();
    static sdkManager:SdkManager = new SdkManager();
    
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