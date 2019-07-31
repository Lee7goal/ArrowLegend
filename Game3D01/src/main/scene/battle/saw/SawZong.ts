import { ui } from "./../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
import GameHitBox from "../../../../game/GameHitBox";
import Game from "../../../../game/Game";
import GamePro from "../../../../game/GamePro";
import { LineData } from "./Saw";
export default class SawZong extends ui.test.SawZongUI {
    public line:LineData = new LineData();
    constructor(xx:number,yy:number,vv:number) {
        super();
        this.bg.height = vv;
        this.pos(xx,yy);

        this.line.startX = xx;
        this.line.startY = yy;
        this.line.endX = xx;
        this.line.endY = yy + vv;
    }
}

export class ZongJu extends ui.test.ZongjuUI
{
    public hbox:GameHitBox = new GameHitBox(35,70);
    private ww:number;
    private startY:number;
    private cd:number = 0;
    constructor(xx:number,yy:number,vv:number){
        super();
        this.ww = vv;
        this.ww -= GameBG.ww;
        this.pos(xx + GameBG.ww2,yy + GameBG.ww2);
        this.startY = this.y;
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onUnDis():void
    {
        this.clearTimer(this, this.onLoop);
        this.shudianju.stop();
        this.shuhuoxing.stop();
    }

    private onDis(): void {
        this.shudianju.play();
        this.shuhuoxing.play();
        this.frameLoop(1,this,this.onLoop);
    }

    private status: number = 0;
    private onLoop(): void {
        if (this.status == 0)  {
            this.y += 4;
        }
        else  {
            this.y -= 4;
        }

        if (this.y >= this.startY + this.ww)  {
            this.status = 1;
            this.scaleY = -1;
        }
        else if (this.y <= this.startY )  {
            this.status = 0;
            this.scaleY = 1;
        }
        this.hbox.setXY(this.x,this.y);

        this.checkHero();
    }

    checkHero():void
    {
        if(Game.executor.getWorldNow() >= this.cd)
        {
            if (GameHitBox.faceToLenth(this.hbox, Game.hero.hbox) < GameBG.ww2) {
                if (Game.hero.hbox.linkPro_) {
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit,Game.bg.saw.pro);
                    this.cd = Game.executor.getWorldNow() + 1000;
                }
            }
        }
    }
}