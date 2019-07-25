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

    public load(): void {
        Game.ro && Game.ro.removeSelf();
        if (!this._loading) {
            this._loading = new ui.test.BattleLoadingUI();
        }

        App.layerManager.alertLayer.addChild(this._loading);
        this._loading.txt.text = "0%";

        this._index++;
        if (this._index > 10) {
            this._index = 0;
        }
        this._mapId = this.chaterId * 1000 + this._index;
        let sysMap: SysMap = SysMap.getData(this.chaterId, this._mapId);
        let configArr: string[] = sysMap.stageGroup.split(',');
        let configId: number = Number(configArr[Math.floor(configArr.length * Math.random())]);
        this._configId = configId;
        // this._configId = 100701;//跳跃
        // this._configId = 101005;//分裂
        // this._configId = 101003;//蓝色树妖boss
        // this._configId = 101004;//火龙boss
        // this._configId = 100101;//撞击
        //this._configId = 100104;//单个食人花
        // this._configId = 101001;//蓝色石头人boss
        // this._configId = 101002;//食人花boss
        console.log("当前地图", this._mapId, this._configId);
        Laya.loader.load("h5/mapConfig/" + this._configId + ".json", new Laya.Handler(this, this.onLoadRes));
    }

    private arr: string[] = [];

    private onLoadRes(): void {
        let map = Laya.loader.getRes("h5/mapConfig/" + this._configId + ".json");
        GameBG.MAP_ROW = map.rowNum;
        GameBG.arr0 = map.arr;
        let bgType = map.bgType ? map.bgType : 1;
        bgType = Math.max(bgType, 1);
        GameBG.BG_TYPE = "map_" + bgType;
        this.arr.length = 0;

        //公共资源
        this.arr = [
            "h5/mapConfig/" + this._configId + ".json",
            "h5/wall/wall.lh",
            "h5/zhalan/hero.lh",
            "h5/gunEffect/hero.lh",
            "h5/effects/foot/hero.lh",
            "h5/effects/head/hero.lh",
            "h5/effects/monsterDie/monster.lh",
            "h5/effects/door/monster.lh"
        ];
        //主角
        this.arr.push("h5/bulletsEffect/20000/monster.lh");
        this.arr.push("h5/bullets/20000/monster.lh");
        this.arr.push("h5/gong/hero.lh");
        this.arr.push("h5/hero/hero.lh");

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
        console.log('资源列表', this.arr);
        Laya.loader.create(this.arr, Laya.Handler.create(this, this.onComplete), new Laya.Handler(this, this.onProgress))
    }

    private getMonsterRes(id: number): void  {
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, id);
        this.arr.push("h5/monsters/" + sysEnemy.enemymode + "/monster.lh");
        //普攻
        if (sysEnemy.normalAttack > 0) {
            let sysBullet: SysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, sysEnemy.normalAttack);
            if (sysBullet.bulletMode > 0) {
                this.arr.push("h5/bullets/" + sysBullet.bulletMode + "/monster.lh");
            }
            if (sysBullet.boomEffect > 0) {
                this.arr.push("h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh");
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
                        this.arr.push("h5/bullets/" + sysBullet.bulletMode + "/monster.lh");
                    }
                    if (sysBullet.boomEffect > 0) {
                        this.arr.push("h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh");
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