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
import GameCube from "./GameCube";
import SysChapter from "../../sys/SysChapter";

export default class BattleLoader {
    constructor() { 
        
    }
    chapterId:number = 0;
    private _mapId: number;
    private _index: number = 1;
    private resAry: string[] = [];
    private pubResAry: string[] = [];
    private isLoadPub: boolean = false;
    private _isHeroLoaded: boolean = false;
    private _isMonsterLoaded: boolean = false;
     /**当前关怪物需要的资源 */
     private monsterRes: any = {};
    private cubeRes:any = {};

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
        for (let key in this.cubeRes)//cube母体
        {
            if (key != '')  {
                let sp: Laya.Sprite3D = Laya.loader.getRes(key);
                if (sp)  {
                    sp.destroy(true);
                }
            }
        }
        
        //清除对象池
        let tagArr:string[] = [DieEffect.TAG,Coin.TAG,MonsterBoomEffect.TAG];
        for(let key in Game.poolTagArr)
        {
            tagArr.push(key);
        }
        for(let i = 0; i < tagArr.length; i++)
        {  
            let arr = Laya.Pool.getPoolBySign(tagArr[i]);

            for(let j = 0; j < arr.length;j++)
            {
                let sp3d:Laya.Sprite3D = arr[j].sp3d;
                if(sp3d)
                {
                    sp3d.destroy(true);
                    sp3d = null;
                }
                arr[j] = null;
            }

            if(arr.length > 0)
            {
                Laya.Pool.clearBySign(tagArr[i]);
                console.log("清理资源",tagArr[i]);
            }
        }

        Laya.Resource.destroyUnusedResources();
        console.log("释放显存");
    }

    
    public load(res?:any): void {
        GameCube.recover();
        this.clearMonster();
        this.continueRes = res;
        Game.scenneM.battle && Game.scenneM.battle.up(null);

        Game.ro && Game.ro.removeSelf();
        if (!this._loading) {
            this._loading = new ui.test.LoadingUI();
            this._loading.mouseEnabled = false;
        }

        App.layerManager.alertLayer.addChild(this._loading);
        Game.bg && Game.bg.clear();
        this._loading.txt.text = "0%";

        if(this.continueRes)
        {
            this.chapterId = this.continueRes.chapterId;
            this._mapId = this.continueRes.mapId;
            this._index  = this.continueRes.index;
            this._configId = this.continueRes.configId;
            Game.battleCoins = this.continueRes.coins;
        }
        else
        {
            let maxCeng:number =  SysMap.getTotal(this.chapterId);
            if (this._index > maxCeng) {
                this._index = 1;
            }
            // this._index = 3;
            this._mapId = this.chapterId * 1000 + this._index;
            let configId: number;
            if(Session.homeData.isGuide)
            {
                configId = 100000;
            }
            else
            {
                this.sysMap = SysMap.getData(this.chapterId, this._index);
                this.curBoTimes = 0;
                this.maxBoTimes = this.sysMap.numEnemy;
                this.monsterGroup = this.sysMap.enemyGroup.split(",");
                let configArr: string[] = this.sysMap.stageGroup.split(',');
                configId = Number(configArr[Math.floor(configArr.length * Math.random())]); 
            }
            this._configId = configId;
        }
        // this._configId = 100301;
        console.log("当前地图", this._mapId, this._configId);
        Laya.loader.load("h5/mapConfig/" + this._configId + ".json", new Laya.Handler(this, this.loadBg));
    }

    public preload():void
    {
        let arr:string[] = [
            // "h5/mapbg/1.jpg",
            // "res/atlas/xiongmao.atlas",
            "res/atlas/shengli.atlas",
            "res/atlas/texiao/jiaxue.atlas",
            "res/atlas/icons/skill.atlas",
            "res/atlas/bg.atlas",
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
            "h5/zhalan/hero.lh","h5/effects/door/monster.lh",
            "h5/effects/foot/hero.lh", "h5/effects/head/monster.lh","h5/bulletsEffect/20000/monster.lh",
            "h5/bullets/skill/5009/monster.lh", "h5/bullets/20000/monster.lh", "h5/hero/1/hero.lh"//主角
        ];
        if(Session.homeData.isGuide)
        {
            pubRes.push("h5/effects/guide/monster.lh");
        }
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
        GameBG.bgHHReal = map.bgHeight;
        GameBG.bgCellWidth = map.cellWidth;

        if(GameBG.bgHH < 1700)
        {
            GameBG.bgHH = 1700;
        }

        GameBG.arr0 = map.arr;
        let bgType = map.bgType ? map.bgType : 1;
        bgType = Math.max(bgType, 1);
        GameBG.BG_TYPE_NUM = bgType;
        GameBG.BG_TYPE = "map_" + bgType;
        Laya.loader.clearRes("h5/mapConfig/" + this._configId + ".json");//清理map.json
        this.onBgComplete();
        // if(this.bgRes[GameBG.BG_TYPE_NUM])
        // {
        //     this.onBgComplete();
        // }
        // else
        // {
        //     Laya.loader.load("h5/mapbg/"+GameBG.BG_TYPE_NUM+".jpg",Laya.Handler.create(this,this.onBgComplete));
        // }
    }

    private onBgComplete():void
    {
        this.bgRes[GameBG.BG_TYPE_NUM] = GameBG.BG_TYPE_NUM;
        this.onLoadMonster();
    }

    private onLoadMonster(): void {
        this.resAry.length = 0;
        this.monsterRes = {};
        this.cubeRes = {};
        let res: string;

        // if(this.continueRes)
        // {
        //     this.onCompleteMonster();
        //     return;
        // }

        
        //怪
        let k: number = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                let type: number = GameBG.arr0[k];
                if (k < GameBG.arr0.length) {
                    if (this.continueRes == null && GridType.isMonster(type)) {
                        this.getMonsterRes(type);
                    }
                    else if(GridType.isCube(type))
                    {
                        //当前的场景模型
                        this.getSceneRes(type);
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

            let pubResAry:string[] = ["h5/effects/monsterDie/monster.lh","h5/coins/coins/monster.lh","h5/effects/boom/monster.lh"];
            for(let j = 0; j < pubResAry.length; j++)
            {
                res = pubResAry[j];
                this.monsterRes[res] = res;
                this.resAry.push(res);
            }
        }

        if(this.index == SysChapter.dropIndex)
        {
            let key:string;
            if(SysChapter.blueNum > 0)
            {
                key = "h5/coins/lanzuan/monster.lh";
                this.monsterRes[key] = key;
                this.resAry.push(key);
            }
            else if(SysChapter.redNum > 0)
            {
                key = "h5/coins/hongzuan/monster.lh";
                this.monsterRes[key] = key;
                this.resAry.push(key);
            }
        }

        if(this.index == SysChapter.heartIndex)
        {
            if(SysChapter.heartNum > 0)
            {
                res = "h5/coins/heart/monster.lh";
                this.monsterRes[res] = res;
                this.resAry.push(res);
            }
        }


        for (let key in this.cubeRes)  {
            if (key != '')  {
                this.monsterRes[key] = key;
                this.resAry.push(key);
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

    private getSceneRes(type:number):void
    {
        let cubeType:number = GameCube.getType(type);
        let res = "h5/wall/"+cubeType+"/monster.lh";
        this.cubeRes[res] = res;
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