import GameBG from "../../../game/GameBG";
import GameConfig from "../../../GameConfig";
import App from "../../../core/App";
import SysMap from "../../sys/SysMap";
import SysEnemy from "../../sys/SysEnemy";
import GridType from "../../../game/bg/GridType";
import SysBullet from "../../sys/SysBullet";
import { ui } from "../../../ui/layaMaxUI";
import BattleScene from "./BattleScene";
import Game from "../../../game/Game";
import MonsterShader from "../../../game/player/MonsterShader";
import CoinEffect from "../../../game/effect/CoinEffect";
import Session from "../../Session";
import BoomEffect from "../../../game/effect/BoomEffect";
import DieEffect from "../../../game/effect/DieEffect";
import HitEffect from "../../../game/effect/HitEffect";
import MonsterBoomEffect from "../../../game/effect/MonsterBoomEffect";
import Coin from "../../../game/player/Coin";
import Monster from "../../../game/player/Monster";
import Hero from "../../../game/player/Hero";
import { GameAI } from "../../../game/ai/GameAI";
import GameFence from "./GameFence";
import GameEvent from "../../GameEvent";
import MonsterBullet from "../../../game/player/MonsterBullet";

export default class BattleLoader {
    constructor() { 
        
    }

    private _mapId: number;
    private _index: number = 1;
    private resAry: string[] = [];
    private pubResAry: string[] = [];
    private isLoadPub: boolean = false;
    private _isHeroLoaded: boolean = false;
    private _isMonsterLoaded: boolean = false;
     /**当前关怪物需要的资源 */
     private monsterRes: any = {};
    _configId: number;
    monsterId: number = 0;
    /**退出再进来数据 */
    continueRes:any;
    monsterGroup:string[];
    curBoTimes:number = 0;
    maxBoTimes:number = 0;
    sysMap: SysMap;
    private _loading: ui.test.LoadingUI;


    public get index(): number {
        return this._index;
    }

    public set index(v: number) {
        this._index = v;
    }

    public get mapId(): number {
        return this._mapId;
    }

    onRelease():void
    {
        console.log("释放资源了");
    }

    clearMonster(): void  {
        for (let key in MonsterShader.map)  {
            let shader: MonsterShader = MonsterShader.map[key];
            if (shader)  {
                // shader.clearShader();
                delete MonsterShader.map[key];
            }
        }
        for (let key in this.monsterRes)//母体
        {
            if (key != '')  {
                let sp: Laya.Sprite3D = Laya.loader.getRes(key);
                if (sp)  {
                    sp.destroy(true);
                }
            }
        }

        //清除对象池
        let tagArr:string[] = [BoomEffect.TAG,Monster.TAG,MonsterBullet.TAG];
        for(let i = 0; i < tagArr.length; i++)
        {   
            let arr = Laya.Pool.getPoolBySign(tagArr[i]);

            for(let j = 0; j < arr.length;j++)
            {
                let sp3d:Laya.Sprite3D = arr[j].sp3d;
                sp3d && sp3d.destroy(true);
            }

            if(arr.length > 0)
            {
                Laya.Pool.clearBySign(tagArr[i]);
            }
            arr = Laya.Pool.getPoolBySign(tagArr[i]);
        }

        // Game.monsterResClones.length = 0;
        Laya.Resource.destroyUnusedResources();
        console.log("释放显存");
    }

    
    public load(res?:any): void {
        this.continueRes = res;
        Game.scenneM.battle && Game.scenneM.battle.up(null);

        Game.ro && Game.ro.removeSelf();
        if (!this._loading) {
            this._loading = new ui.test.LoadingUI();
        }

        App.layerManager.alertLayer.addChild(this._loading);
        Game.bg && Game.bg.clear();
        this._loading.txt.text = "0%";

        if(this.continueRes)
        {
            this._mapId = this.continueRes.mapId;
            this._index  = this.continueRes.index;
            this._configId = this.continueRes.configId;
            Game.battleCoins = this.continueRes.coins;
        }
        else
        {
            if (this._index > 10) {
                this._index = 1;
            }
            this._mapId = Session.homeData.chapterId * 1000 + this._index;
            this.sysMap = SysMap.getData(Session.homeData.chapterId, this._mapId);
            this.curBoTimes = 0;
            this.maxBoTimes = this.sysMap.numEnemy;
            this.monsterGroup = this.sysMap.enemyGroup.split(",");
            let configArr: string[] = this.sysMap.stageGroup.split(',');
            let configId: number = Number(configArr[Math.floor(configArr.length * Math.random())]);
            this._configId = configId;
        }
        this._configId = 101401;
        console.log("当前地图", this._mapId, this._configId);
        Laya.loader.load("h5/mapConfig/" + this._configId + ".json", new Laya.Handler(this, this.loadBg));
    }

    public preload():void
    {
        let arr:string[] = [
            "res/atlas/xiongmao.atlas",
            "res/atlas/shengli.atlas",
            "res/atlas/icons/skill.atlas",
            "res/atlas/bg.atlas",
            "res/atlas/map_1.atlas",
            "res/atlas/jiesuan.atlas"
        ];
        Laya.loader.load(arr,Laya.Handler.create(this,this.onCompletePre));
    }

    private onCompletePre():void
    {
        console.log("2D资源加载完毕");
        this.loadHeroRes();
    }

    private loadHeroRes(): void  {
        let pubRes = [
            "h5/wall/1000/monster.lh",
            "h5/wall/1500/monster.lh",
            "h5/wall/2000/monster.lh",
            "h5/wall/2500/monster.lh",
            "h5/wall/3000/monster.lh",
            "h5/wall/3500/monster.lh",
            "h5/wall/4000/monster.lh",
            "h5/wall/4500/monster.lh",
            "h5/wall/5000/monster.lh",
            "h5/wall/5500/monster.lh",
            "h5/effects/monsterDie/monster.lh","h5/coins/monster.lh","h5/effects/boom/monster.lh",
            "h5/tong/wall.lh","h5/wall/wall.lh","h5/zhalan/hero.lh","h5/effects/door/monster.lh",
            "h5/effects/foot/hero.lh", "h5/effects/head/monster.lh",
            "h5/bullets/skill/5009/monster.lh","h5/bulletsEffect/20000/monster.lh", "h5/bullets/20000/monster.lh", "h5/hero/hero.lh"//主角
        ];
        Laya.loader.create(pubRes, Laya.Handler.create(this, this.onCompleteHero),new Laya.Handler(this,this.onProgress));
    }

    private onCompleteHero(): void  {
        console.log("主角所需资源加载完毕");
        this._isHeroLoaded = true;
        this.allLoadCom();
    }

    private bgRes:any = {};
    private loadBg():void
    {
        let map = Laya.loader.getRes("h5/mapConfig/" + this._configId + ".json");
        GameBG.MAP_ROW = map.rowNum;
        GameBG.MAP_COL = map.colNum;

        GameBG.MAP_ROW2 = Math.floor(GameBG.MAP_ROW * 0.5);
        GameBG.MAP_COL2 = Math.floor(GameBG.MAP_COL * 0.5);


        GameBG.bgId = map.bgId;
        GameBG.bgWW = map.bgWidth;
        GameBG.bgHH = map.bgHeight;
        GameBG.bgCellWidth = map.cellWidth;

        GameBG.arr0 = map.arr;
        let bgType = map.bgType ? map.bgType : 1;
        bgType = Math.max(bgType, 1);
        GameBG.BG_TYPE_NUM = bgType;
        GameBG.BG_TYPE = "map_" + bgType;
        Laya.loader.clearRes("h5/mapConfig/" + this._configId + ".json");//清理map.json

        if(this.bgRes[GameBG.BG_TYPE_NUM])
        {
            this.onBgComplete();
        }
        else
        {
            Laya.loader.load("h5/mapbg/"+GameBG.BG_TYPE_NUM+".jpg",Laya.Handler.create(this,this.onBgComplete));
        }
    }

    private onBgComplete():void
    {
        this.bgRes[GameBG.BG_TYPE_NUM] = GameBG.BG_TYPE_NUM;
        this.onLoadMonster();
    }

    private onLoadMonster(): void {
        this.resAry.length = 0;
        this.monsterRes = {};
        let res: string;

        if(this.continueRes)
        {
            this.onCompleteMonster();
            return;
        }

        
        //怪
        let k: number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                let type: number = GameBG.arr0[k];
                if (k < GameBG.arr0.length) {
                    if (GridType.isMonster(type)) {
                        this.getMonsterRes(type);
                    }
                }
                k++;
            }
        }

        for (let key in this.monsterRes)  {
            if (key != '')  {
                this.resAry.push(key);
            }
        }

        //怪的资源
        if(this.resAry.length > 0){

            let pubResAry:string[] = [];
            for(let j = 0; j < pubResAry.length; j++)
            {
                res = pubResAry[j];
                this.monsterRes[res] = res;
                this.resAry.push(res);
            }
        }

        this._isMonsterLoaded = false;
        console.log('资源列表', this.resAry);
        if(this.resAry.length > 0)
        {
            Laya.loader.create(this.resAry, Laya.Handler.create(this, this.onCompleteMonster), new Laya.Handler(this, this.onProgress));
        }
        else
        {
            this.onCompleteMonster();
        }
    }

    private onCompleteMonster(): void {
        console.log("怪物所需资源加载完毕");
        this._isMonsterLoaded = true;
        this.allLoadCom();
    }

    private onProgress(value: number): void {
        if(!this._loading)
        {
            return;
        }
        value = Math.ceil(value * 100);
        value = Math.min(value, 100);
        this._loading.txt.text = value + "%";
        // this._loading.bar.scrollRect = new Laya.Rectangle(0, 0, this._loading.bar.width * value / 100, this._loading.bar.height);
    }

    private allLoadCom(): void  {
        if (this._isHeroLoaded && this._isMonsterLoaded)  {
            console.log("所有资源都加载完毕");
            CoinEffect.coinsAry.length = 0;
            Game.scenneM.showBattle();
            Game.scenneM.battle.init();
            this._loading.removeSelf();
        }
    }

    private getMonsterRes(id: number): void {
        console.log("怪物id",id);
        let res: string = '';
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, id);
        // sysEnemy.enemymode = 66666;
        res = "h5/monsters/" + sysEnemy.enemymode + "/monster.lh";
        this.monsterRes[res] = res;

        //普攻
        if (sysEnemy.normalAttack > 0) {
            let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, sysEnemy.normalAttack);
            if (sysBullet.bulletMode > 0) {
                res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                this.monsterRes[res] = res;
            }
            if (sysBullet.boomEffect > 0) {
                res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                this.monsterRes[res] = res;
            }
        }
        //技能
        if (sysEnemy.skillId.length > 0 && sysEnemy.skillId != '0') {
            var skillarr: string[] = sysEnemy.skillId.split(',');
            for (var m = 0; m < skillarr.length; m++) {
                let id: number = Number(skillarr[m]);
                if (id > 0) {
                    let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, Number(id));
                    if (sysBullet.bulletMode > 0) {
                        res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                        this.monsterRes[res] = res;
                    }
                    if (sysBullet.boomEffect > 0) {
                        res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                        this.monsterRes[res] = res;
                    }

                    if (sysBullet.callInfo != '0') {
                        //召唤信息
                        let infoAry: string[] = sysBullet.callInfo.split('|');
                        for (let i = 0; i < infoAry.length; i++) {
                            let info: string[] = infoAry[i].split(',');
                            if (info.length == 3) {
                                let monsterId: number = Number(info[0]);
                                this.getMonsterRes(monsterId);
                            }
                        }
                    }
                }
            }
        }
    }
}