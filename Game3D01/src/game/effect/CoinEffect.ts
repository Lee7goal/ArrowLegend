import Game from "../Game";
import Monster from "../player/Monster";
import FootRotateScript from "../controllerScript/FootRotateScript";
import { ui } from "./../../ui/layaMaxUI";
import Coin from "../player/Coin";
import GamePro from "../GamePro";

export default class CoinEffect{
    static coinsAry:Coin[] = [];
    static hearAry:Coin[] = [];
    constructor() {
     }

     static addEffect(monster:GamePro,goldNum:number,id:number):void
     {
         for(let i = 0; i < goldNum; i++)
         {
            let coin:Coin = Coin.getOne(id);
            coin.setPos(monster,2 * Math.PI / goldNum * i,id);
            if(id == Coin.TYPE_HEART)
            {
                CoinEffect.hearAry.push(coin);
            }
            else
            {
                CoinEffect.coinsAry.push(coin);
            }
         }
     }

     static fly():void
     {
        let len:number = CoinEffect.coinsAry.length;
        if(len > 0)
        {
            Game.playSound("fx_goldget.wav");
        }
         for(let i = 0; i < len; i++)
         {
            let coin:Coin = CoinEffect.coinsAry.shift();
            coin && coin.fly();
         }
     }

     static flyHeart():void
     {
        let len:number = CoinEffect.hearAry.length;
         for(let i = 0; i < len; i++)
         {
            let coin:Coin = CoinEffect.hearAry.shift();
            coin && coin.fly();
         }
     }
}