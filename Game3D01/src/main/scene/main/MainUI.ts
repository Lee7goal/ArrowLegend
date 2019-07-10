import { ui } from "../../../ui/layaMaxUI";
    export default class MainUI extends ui.test.mainUIUI {
        private bottomUI:BottomUI;
        constructor(){
            super();
            this.bottomUI = new BottomUI();
            this.addChild(this.bottomUI);
            this.bottomUI.y = this.height - 121;
        }
    }

    export class BottomUI extends Laya.Sprite
    {
        static BTN_SHOP:number = 1;
        static BTN_EQUIP:number = 2;
        static BTN_WORLD:number = 3;
        static BTN_TALENT:number = 4;
        static BTN_SETTING:number = 5;

        private ids:number[] = [BottomUI.BTN_SHOP,BottomUI.BTN_EQUIP,BottomUI.BTN_WORLD,BottomUI.BTN_TALENT,BottomUI.BTN_SETTING];
        private btns:BottomBtn[] = [];
        constructor(){
            super();
            var ww:number = 0;
            for(let i = 0; i < this.ids.length; i++)
            {
                let btn:BottomBtn = new BottomBtn(this.ids[i],new Laya.Handler(this,this.onClick,[this.ids[i]]));
                this.addChild(btn);
                this.btns.push(btn);
                if(this.ids[i] == BottomUI.BTN_WORLD)
                {
                    btn.setBg(true);
                }
                btn.x = ww;
                ww += btn.ww;
            }
        }

        private onClick(id:number):void
        {
            for(let i = 0; i < this.btns.length; i++)
            {
                let btn:BottomBtn = this.btns[i];
                btn.setBg(btn.id == id);
            }
        }
    }

    export class BottomBtn extends Laya.Sprite
    {
        private bg:Laya.Image = new Laya.Image();
        private btn:Laya.Button = new Laya.Button();
        public id:number;
        public ww:number;
        constructor(id:number,clickHandler:Laya.Handler){
            super();
            this.id = id;
            this.addChild(this.bg);
            this.btn.stateNum = 2;
            this.btn.skin = 'main/bottom_' + id + '.png';
            this.addChild(this.btn);
            this.btn.clickHandler = clickHandler;
            this.setBg(false);
        }

        public setBg(isSelect:boolean):void
        {
            if(isSelect)
            {
                this.bg.skin = 'main/dabiao.png';
                this.bg.width = 242;
                this.bg.height = 122;
            }
            else
            {
                this.bg.skin = 'main/xiaobiao.png';
                this.bg.width = 127;
                this.bg.height = 121;
            }
            this.btn.x = (this.bg.width - this.btn.width) >> 1;
            this.ww = this.bg.width;
        }
    }