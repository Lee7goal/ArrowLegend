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
import MemoryManager from "./MemoryManager";

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
     private monsterResLoading: any = {};
    _configId: number;
    monsterId: number = 0;
    /**退出再进来数据 */
    continueRes:any;
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
        console.error("释放资源了");
        MemoryManager.ins.release();
        Laya.Resource.destroyUnusedResources();
    }

    clearMonster(): void  {
        for (let key in MonsterShader.map)  {
            let shader: MonsterShader = MonsterShader.map[key];
            if (shader)  {
                // shader.clearShader();
                delete MonsterShader.map[key];
            }
        }
        //清除对象池
        // let tagArr:string[] = [BoomEffect.TAG,Monster.TAG,MonsterBullet.TAG];
        // for(let i = 0; i < tagArr.length; i++)
        // {   
        //     let arr = Laya.Pool.getPoolBySign(tagArr[i]);

        //     for(let j = 0; j < arr.length;j++)
        //     {
        //         let sp3d:Laya.Sprite3D = arr[j].sp3d;
        //         // sp3d && sp3d.destroy(true);
        //     }

        //     if(arr.length > 0)
        //     {
        //         Laya.Pool.clearBySign(tagArr[i]);
        //     }
        //     arr = Laya.Pool.getPoolBySign(tagArr[i]);
        // }
    }

    configIds:number[] = [];
    configUrls:string[] = [];
    init():void
    {
        this.configIds.length = 0;
        let arr:SysMap[] = App.tableManager.getTable(SysMap.NAME);
        let size = arr.length;
        this.configUrls.length = 0;
        this.configUrls.push("h5/mapConfig/1001.json");
        for(var i = 0; i < size; i++)
        {
            let sysMap:SysMap = arr[i];
            if(sysMap.stageId == Session.homeData.chapterId)
            {
                let configArr: string[] = sysMap.stageGroup.split(',');
                let configId: number = Number(configArr[Math.floor(configArr.length * Math.random())]);
                this.configIds.push(configId);
                this.configUrls.push("h5/mapConfig/" + configId + ".json");
            }
        }
        Laya.loader.load(this.configUrls, new Laya.Handler(this, this.loadCfgComplete));
    }

    
    private allMonsterRes:string[] = [];
    private loadCfgComplete():void
    {
        console.log("地图配置加载完毕,开始加载怪物");

        this.allMonsterRes.length = 0;
        let monsterIds:any = {};
        for(let i = 0; i < this.configUrls.length; i++)
        {
            let map = Laya.loader.getRes(this.configUrls[i]);
            let k: number = 0;
            let arr = map.arr;
            for (let j = 0; j < map.rowNum; j++) {
                for (let i = 0; i < map.colNum; i++) {
                    let type: number = arr [k];
                    if (GridType.isMonster(type)) {
                        monsterIds[type] = type;
                    }
                    k++;
                }
            }
        }

        for(let id in monsterIds)
        {
            this.getMonsterRes(monsterIds[id]);
        }

        for (let key in this.monsterResLoading)  {
            if (key != '')  {
                this.allMonsterRes.push(key);
            }
        }

        this.loadMonsterUrl();
    }

    
    private loadMonsterUrl():void
    {
        if(this.allMonsterRes.length > 0)
        {
            let url:string = this.allMonsterRes.shift();
            if(!Laya.loader.getRes(url))
            {
                console.log("预加载怪物资源",url);
                Laya.Sprite3D.load(url,new Laya.Handler(this,this.loadMonsterUrl));
            }
        }
        else
        {
            console.log("怪的预加载完毕");
        }
    }

    
    load(res?:any): void {
        this.continueRes = res;
        Game.scenneM.battle && Game.scenneM.battle.up(null);

        Game.ro && Game.ro.removeSelf();

        if(this.continueRes)
        {
            this._mapId = this.continueRes.mapId;
            this._index  = this.continueRes.index;
            this._configId = this.continueRes.configId;
            Game.battleCoins = this.continueRes.coins;
        }
        else
        {
            let maxCeng:number =  SysMap.getTotal(Session.gameData.chapterId);
            if (this._index > maxCeng) {
                this._index = 1;
            }
            // this._index = 1
            this._mapId = Session.homeData.chapterId * 1000 + this._index;
            this._configId = this.configIds[this._index - 1];
        }
        this._configId = 1001
        console.log("当前地图", this._mapId, this._configId);

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
        this.onLoadMonster();
    }

    public preload():void
    {
        let arr:string[] = [
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
            "h5/zhalan/hero.lh","h5/effects/door/monster.lh",
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

    private onLoadMonster(): void {
        this.resAry.length = 0;
        let res: string;

        if(this.continueRes)
        {
            this.onCompleteMonster();
            return;
        }

        this.curMonsterRes = {};

        
        //怪
        let monsterIds = {};
        let k: number = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                let type: number = GameBG.arr0[k];
                if (GridType.isMonster(type)) {
                    monsterIds[type] = type;
                }
                k++;
            }
        }

        for(let id in monsterIds)
        {
            this.getMonsterRes2(monsterIds[id]);
        }

        for (let key in this.curMonsterRes)  {
            if (key != '')  {
                this.resAry.push(key);
            }
        }

        this._isMonsterLoaded = false;
        // if(this.resAry.length > 0)
        // {
        //     Laya.loader.create(this.resAry, Laya.Handler.create(this, this.onCompleteMonster), new Laya.Handler(this, this.onProgress));
        // }
        // else
        // {
            
        // }
        console.log("加载当前怪的资源");
        if (!this._loading) {
            this._loading = new ui.test.LoadingUI();
        }

        App.layerManager.alertLayer.addChild(this._loading);
        Game.bg && Game.bg.clear();
        this._loading.txt.text = "0%";
        this.loadCurMonster();
    }

    private loadCurMonster():void
    {
        if(this.resAry.length > 0)
        {
            let url:string = this.resAry.shift();
            if(Laya.loader.getRes(url))
            {
                console.log("这个已经加载过了",url);
                this.loadCurMonster();
            }
            else
            {
                console.log("加载当前怪的资源",url);
                Laya.loader.create(url,new Laya.Handler(this,this.loadCurMonster),new Laya.Handler(this, this.onProgress));
            }
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
        this.monsterResLoading[res] = res;

        //普攻
        if (sysEnemy.normalAttack > 0) {
            let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, sysEnemy.normalAttack);
            if (sysBullet.bulletMode > 0) {
                res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                this.monsterResLoading[res] = res;
            }
            if (sysBullet.boomEffect > 0) {
                res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                this.monsterResLoading[res] = res;
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
                        this.monsterResLoading[res] = res;
                    }
                    if (sysBullet.boomEffect > 0) {
                        res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                        this.monsterResLoading[res] = res;
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

    private curMonsterRes:any = {};
    private getMonsterRes2(id: number): void {
        console.log("当前关卡怪物id",id);
        let res: string = '';
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, id);
        // sysEnemy.enemymode = 66666;
        res = "h5/monsters/" + sysEnemy.enemymode + "/monster.lh";
        this.curMonsterRes[res] = res;

        //普攻
        if (sysEnemy.normalAttack > 0) {
            let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, sysEnemy.normalAttack);
            if (sysBullet.bulletMode > 0) {
                res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                this.curMonsterRes[res] = res;
            }
            if (sysBullet.boomEffect > 0) {
                res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                this.curMonsterRes[res] = res;
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
                        this.curMonsterRes[res] = res;
                    }
                    if (sysBullet.boomEffect > 0) {
                        res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                        this.curMonsterRes[res] = res;
                    }

                    if (sysBullet.callInfo != '0') {
                        //召唤信息
                        let infoAry: string[] = sysBullet.callInfo.split('|');
                        for (let i = 0; i < infoAry.length; i++) {
                            let info: string[] = infoAry[i].split(',');
                            if (info.length == 3) {
                                let monsterId: number = Number(info[0]);
                                this.getMonsterRes2(monsterId);
                            }
                        }
                    }
                }
            }
        }
    }
}