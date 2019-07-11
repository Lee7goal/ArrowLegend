import { ui } from "../../../ui/layaMaxUI";
import ShakeUtils from "../../../core/utils/ShakeUtils";
import GameBG from "../../../game/GameBG";
    export default class MainUI extends ui.test.mainUIUI {
        private bottomUI:BottomUI;
        constructor(){
            super();
            this.bottomUI = new BottomUI();
            this.addChild(this.bottomUI);
            this.height = GameBG.height;
            this.bottomUI.bottom = 0;

            this.mouseThrough = true;
        }

        public get selectIndex():number
        {
            return this.bottomUI.selectIndex;
        }
    }

    export class BottomUI extends Laya.Box
    {
        private bgBox:Laya.Sprite = new Laya.Sprite();
        private curBg:Laya.Image = new Laya.Image();
        private btnBox:Laya.Sprite = new Laya.Sprite();
        private bgs:Laya.Image[] = [];
        private btns:Laya.Button[] = [];

        private ww1:number = 127;
        private ww2:number = 242;

        private _selectIndex:number = 2;

        private opens:number[] = [0,1,-1,1,-1,1];
        constructor(){
            super();
            this.addChild(this.bgBox);
            this.curBg.skin = 'main/dazhao.png';
            this.addChild(this.curBg);
            this.addChild(this.btnBox);
            for(let i = 1; i < 6; i++)
            {
                let bg:Laya.Image = new Laya.Image();
                bg.skin = 'main/xiaobiao.png';
                bg.width = this.ww1;
                this.bgBox.addChild(bg);
                bg.x = (i - 1) * bg.width;
                this.bgs.push(bg);
                let btn:Laya.Button = new Laya.Button();
                btn.tag = this.opens[i];
                if(this.opens[i] == 1)
                {
                    btn.stateNum = 2;
                    btn.width = 108;
                    btn.skin = 'main/bottom_' + i + '.png';
                }
                else{
                    btn.stateNum = 1;
                    btn.width = 38;
                    btn.skin = 'main/suo.png';
                }
                
                this.btnBox.addChild(btn);
                btn.x = bg.x + (bg.width - btn.width) * 0.5;
                btn.clickHandler = new Laya.Handler(this,this.onClick,[btn]);
                this.btns.push(btn);
            }

            this.onClick(this.btns[this._selectIndex]);
        }

        private onClick(clickBtn:Laya.Button):void
        {
            if(clickBtn.tag == -1)
            {
                ShakeUtils.execute(clickBtn,300,2);
                return;
            }
            var ww:number = 0;
            let tmp:Laya.Image;
            for(let i = 0; i < this.btns.length; i++)
            {
                let btn:Laya.Button = this.btns[i];
                let bg:Laya.Image = this.bgs[i];
                bg.skin = 'main/xiaobiao.png';
                bg.width = this.ww1;
                btn.selected = false;
                btn.y = btn.tag == -1 ? 25 : 0;
                if(btn == clickBtn)
                {
                    btn.y = -25;
                    btn.selected = true;
                    bg.skin = 'main/dabiao.png';
                    bg.width = this.ww2;
                    this._selectIndex = i;
                    tmp = bg;
                }
                bg.x = ww;
                ww += bg.width;
                btn.x = bg.x + (bg.width - btn.width) * 0.5;
            }
            Laya.Tween.to(this.curBg,{x:tmp.x},500,Laya.Ease.cubicInOut);
            Laya.stage.event("switchView");
        }

        public get selectIndex():number
        {
            return this._selectIndex;
        }
    }