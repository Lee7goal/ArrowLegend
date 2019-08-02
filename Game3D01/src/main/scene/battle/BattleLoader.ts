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

export default class BattleLoader {
    constructor() { }

    private _mapId: number;
    public chaterId: number = 1;
    private _configId: number;
    private _index: number = -1;

    private _loading: ui.test.BattleLoadingUI;


    public get index(): number {
        return this._index;
    }

    public get mapId(): number {
        return this._mapId;
    }

    public destroyMonsterRes():void
    {
        for(let key in MonsterShader.map)
        {
            let shader:MonsterShader = MonsterShader.map[key];
            if(shader)
            {
                shader.clearShader();
                delete MonsterShader.map[key];
            }
        }
        for(let key in this.monsterRes)//母体
        {
            if(key != '')
            {
                let sp:Laya.Sprite3D = Laya.loader.getRes(key);
                if(sp)
                {
                    sp.destroy(true);
                }
            }
        }
        for(let i = 0; i < Game.monsterResClones.length; i++){
            Game.monsterResClones[i].destroy(true);//克隆体
        }
        Laya.Resource.destroyUnusedResources();
    }

    public load(): void {
        // this.destroyMonsterRes();
        Game.scenneM.battle && Game.scenneM.battle.up(null);

        Game.ro && Game.ro.removeSelf();
        if (!this._loading) {
            this._loading = new ui.test.BattleLoadingUI();
        }

        App.layerManager.alertLayer.addChild(this._loading);
        Game.bg && Game.bg.clear();
        this._loading.txt.text = "0%";

        this._index++;
        if (this._index > 50) {
            this._index = 0;
        }
        this._mapId = this.chaterId * 1000 + this._index;
        let sysMap: SysMap = SysMap.getData(this.chaterId, this._mapId);
        let configArr: string[] = sysMap.stageGroup.split(',');
        let configId: number = Number(configArr[Math.floor(configArr.length * Math.random())]);
        this._configId = configId;
        // this._configId = 101005;//分裂
        // this._configId = 101003;//蓝色树妖boss
        // this._configId = 101004;//火龙boss
        // this._configId = 100101;//撞击
        // this._configId = 101001;//蓝色石头人boss
        // this._configId = 101002;//食人花boss
        // this._configId = 101004;
        // this._configId = 104101//炸弹人
        // this._configId = 100603;
        console.log("当前地图", this._mapId, this._configId);
        Laya.loader.load("h5/mapConfig/" + this._configId + ".json", new Laya.Handler(this, this.onLoadRes));
    }

    private arr: string[] = [];

    /**当前关怪物需要的资源 */
    private monsterRes:any = {};

    public monsterId:number;

    private onLoadRes(): void {
        let map = Laya.loader.getRes("h5/mapConfig/" + this._configId + ".json");
        GameBG.MAP_ROW = map.rowNum;
        GameBG.arr0 = map.arr;
        let bgType = map.bgType ? map.bgType : 1;
        bgType = Math.max(bgType, 1);
        GameBG.BG_TYPE = "map_" + bgType;

        Laya.loader.clearRes("h5/mapConfig/" + this._configId + ".json");//清理map.json
        

        this.arr.length = 0;
        this.monsterId = 0;
        this.monsterRes = {};

        //公共资源
        this.arr = [
            "h5/wall/wall.lh",
            "h5/zhalan/hero.lh",
            // "h5/gunEffect/hero.lh",
            "h5/effects/foot/hero.lh",
            "h5/effects/head/monster.lh",
            "h5/effects/door/monster.lh"
        ];

        this.arr.push("res/atlas/bg.png");
        this.arr.push("res/atlas/bg.atlas");
        this.arr.push("res/atlas/"+GameBG.BG_TYPE+".png");
        this.arr.push("res/atlas/"+GameBG.BG_TYPE+".atlas");

        //主角
        this.arr.push("h5/bulletsEffect/20000/monster.lh");
        this.arr.push("h5/bullets/20000/monster.lh");
        this.arr.push("h5/gong/hero.lh");
        this.arr.push("h5/hero/hero.lh");


        let res = "h5/effects/monsterDie/monster.lh";
        this.monsterRes[res] = res;
        if(this.monsterId <= 0)
        {
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
        }
        else
        {
            this.getMonsterRes(this.monsterId);
        }

        for(let key in this.monsterRes)
        {
            if(key != '')
            {
                this.arr.push(key);
            }
        }
        
        console.log('资源列表', this.arr);
        Laya.loader.create(this.arr, Laya.Handler.create(this, this.onComplete), new Laya.Handler(this, this.onProgress));
        // Laya.loader.on(Laya.Event.PROGRESS,this,this.onP);
    }

    private onP(vv:number):void
    {
        console.log("进度",vv);
    }

    private getMonsterRes(id: number): void  {
        let res:string = '';
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, id);
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

                    if (sysBullet.callInfo != '0')  {
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

    onProgress(value: number): void {
        value = Math.ceil(value * 100);
        value = Math.min(value, 100);
        this._loading.txt.text = value + "%";
    }

    onComplete(): void {
        Game.scenneM.showBattle();
        Game.scenneM.battle.init();
        this._loading.removeSelf();
    }
}