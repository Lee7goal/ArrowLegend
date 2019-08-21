import Game from "../Game";
import Monster from "../player/Monster";
import FootRotateScript from "../controllerScript/FootRotateScript";
import { ui } from "./../../ui/layaMaxUI";
import Coin from "../player/Coin";

export default class CoinEffect{
    static coinsAry:Coin[] = [];
    constructor() {
     }

     static addEffect(monster:Monster,goldNum:number):void
     {
         for(let i = 0; i < goldNum; i++)
         {
            setTimeout(() => {
                let coin:Coin = Coin.getOne();
                coin.setPos(monster)
                CoinEffect.coinsAry.push(coin);
            }, i * 50);
         }
     }

     static fly():void
     {
        let len:number = CoinEffect.coinsAry.length;
         for(let i = 0; i < len; i++)
         {
            let coin:Coin = CoinEffect.coinsAry.shift();
            coin && coin.fly();
            // setTimeout(() => {
                
            // }, 10 * i);
         }
     }
}