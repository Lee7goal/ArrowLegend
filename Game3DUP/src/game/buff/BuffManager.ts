import PlayerBuff from "../skill/player/PlayerBuff";
import GamePro from "../GamePro";
import Game from "../Game";
import HeroBullet from "../player/HeroBullet";
import Monster from "../player/Monster";


export default class BuffManager {

    private buffArr: PlayerBuff[] = [];
    constructor() { }

    exe(now: number): void  {
        for (let i = 0; i < this.buffArr.length; i++)  {
            this.buffArr[i].exe(now);
        }
    }

    addBuff(buffId: number, to: GamePro, bullet?: HeroBullet): void  {
        let BUFF = Laya.ClassUtils.getRegClass("BUFF" + buffId);
        let buff: PlayerBuff = new BUFF(buffId);
        buff.to = to;
        this.buffArr.push(buff);
        if (bullet)  {
            buff.bullet = bullet;
            buff.hurtValue = bullet.hurtValue;
            buff.startTime += Game.executor.getWorldNow();

            let buffIndex: number = bullet.buffAry.indexOf(buffId);
            if (buffIndex > -1)  {
                bullet.buffAry.splice(buffIndex, 1);
            }
        }
    }

    removeBuff(buff: PlayerBuff): void  {
        let buffIndex: number = buff.to.buffAry.indexOf(buff.skill.id);
        if (buffIndex != -1)  {
            buff.to.buffAry.splice(buffIndex, 1);
        }

        let index: number = this.buffArr.indexOf(buff);
        if (index > -1)  {
            this.buffArr.splice(index, 1);
        }
    }
}