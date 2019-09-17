(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "game/battleIndexBox.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = true;
    GameConfig.stat = true;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var Sprite = Laya.Sprite;
    class LayerManager extends Sprite {
        constructor() {
            super();
            this.sceneLayer = new Sprite();
            this.panelLayer = new Sprite();
            this.faceLayer = new Sprite();
            this.alertLayer = new Sprite();
            this.guideLayer = new Sprite();
            this.addChild(this.sceneLayer);
            this.addChild(this.panelLayer);
            this.addChild(this.faceLayer);
            this.addChild(this.alertLayer);
            this.addChild(this.guideLayer);
        }
    }

    class TableManager {
        constructor() {
            this.map = {};
            this.mapList = {};
        }
        register(fileName, cla) {
            this.map[fileName] = cla;
        }
        getOneByName(fileName) {
            return this.map[fileName];
        }
        getTable(tabelId) {
            return this.mapList[tabelId];
        }
        getDataByNameAndId(tabelId, id) {
            var arr = this.getTable(tabelId);
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].id == id) {
                    return arr[i];
                }
            }
        }
        onParse(arr) {
            for (var i = 0; i < arr.length; i += 2) {
                var keyname = arr[i];
                var Cla = this.getOneByName(keyname);
                console.log(keyname);
                if (Cla == null) {
                    console.error("没有注册表-------" + keyname);
                    continue;
                }
                var contente = arr[i + 1];
                var strary = contente.split("\n");
                var tmp = strary[strary.length - 1];
                if (tmp === "") {
                    strary.pop();
                }
                var head = String(strary[0]).replace("\r", "");
                var headary = head.split("\t");
                var contentary = strary.slice(1);
                var dataList = [];
                for (var k = 0; k < contentary.length; k++) {
                    var propstr = String(contentary[k]).replace("\r", "");
                    var propary = propstr.split("\t");
                    var clazz = new Cla();
                    for (var j = 0, len2 = propary.length; j < len2; j++) {
                        var now = clazz[headary[j]];
                        var value = propary[j];
                        if (typeof now === 'number') {
                            now = parseInt(value + "");
                            if ((now + "") != value) {
                                now = parseFloat(value + "");
                            }
                        }
                        else {
                            now = value;
                        }
                        clazz[headary[j]] = now;
                    }
                    dataList.push(clazz);
                }
                this.mapList[keyname] = dataList;
            }
        }
    }

    class SoundManager {
        constructor() {
            this.pre = "";
        }
        setMusicVolume(value) {
            Laya.SoundManager.musicMuted = value == 0;
        }
        setSoundVolume(value) {
            Laya.SoundManager.soundMuted = value == 0;
        }
        play(soundName, isMusic = false) {
            this.soundName = soundName;
            this.isMusic = isMusic;
            var url = this.pre + soundName;
            if (Laya.loader.getRes(url)) {
                this.onLoadCom(url, isMusic);
            }
            else {
                Laya.loader.load(url, new Laya.Handler(this, this.onLoadCom, [url, isMusic]));
            }
        }
        onLoadCom(url, isMusic) {
            if (isMusic) {
                Laya.SoundManager.playMusic(url, 0);
            }
            else {
                Laya.SoundManager.playSound(url, 1);
            }
        }
    }

    class GameEvent {
    }
    GameEvent.START_BATTLE = "START_BATTLE";
    GameEvent.MEMORY_WARNING = "MEMORY_WARNING";
    GameEvent.CONFIG_OVER = "CONFIG_OVER";
    GameEvent.GOLD_CHANGE = "GOLD_CHANGE";
    GameEvent.HERO_UPDATE = "HERO_UPDATE";
    GameEvent.WX_ON_SHOW = "WX_ON_SHOW";
    GameEvent.WX_ON_HIDE = "WX_ON_HIDE";
    GameEvent.SHOW_ACTION_RECT = "SHOW_ACTION_RECT";
    GameEvent.BOOS_BLOOD_UPDATE = "BOOS_BLOOD_UPDATE";
    GameEvent.PLAYER_INFO_UPDATE = "PLAYER_INFO_UPDATE";
    GameEvent.TALENT_UPDATE = "TALENT_UPDATE";

    class LogType {
    }
    LogType.HEART = 100;
    LogType.LOGIN_TIME = 0;
    LogType.ERROR_ITEM_NULL = 1;
    LogType.LOGIN_INFO = 2;
    LogType.LOGIN_STATUS = 3;
    LogType.WX_HIDE = 4;
    LogType.WX_SHOW = 5;
    LogType.LOAD_ERROR = 6;
    LogType.HANGUP_START = 7;
    LogType.HANGUP_OVER = 8;
    LogType.PLAYER_DATA = 9;
    LogType.NEW_PLAYER = 10;
    LogType.CODE_ERROR = 11;
    LogType.LOAD_CONFIG = 13;
    LogType.LOAD_VERSION = 14;
    LogType.LOAD_fileconfig = 15;
    LogType.LOAD_CONFIGZIP = 16;
    LogType.LOAD_CONFIG_ERR = 17;
    LogType.AD_FAIL = 18;
    LogType.AD_SUC = 19;
    LogType.AD_SUC_OVER = 20;
    LogType.AD_FAIL_2 = 21;
    LogType.OPEN_TASK = 22;
    LogType.OPEN_TIANFU = 23;
    LogType.CLOSE_ZHUAN_PAN = 24;
    LogType.OPEN_ZHUAN = 25;
    LogType.AD_ZHUAN = 26;
    LogType.NEWER_FIRST_CLICK = 1000;
    LogType.NEWER_OPEN_ROLE = 1001;
    LogType.NEWER_EQUIP = 1002;
    LogType.NEWER_YUELAIYUEQIANGDA = 1005;
    LogType.NEWER_HALF = 1006;
    LogType.NEWER_XINGLAI = 1007;
    LogType.NEWER_CLICK_CITY = 1008;
    LogType.NEWER_CLICK_STAGE = 1009;

    class FlyUpTips extends Laya.Sprite {
        constructor() {
            super();
            this._bg = new Laya.Image("main/diban.png");
            this._bg.sizeGrid = "17,16,22,15";
            this.addChild(this._bg);
            this._bg.anchorX = this._bg.anchorY = 0.5;
            this._txt = new Laya.Label();
            this._txt.bold = true;
            this._txt.color = "#ffffff";
            this._txt.fontSize = 20;
            this._txt.align = "CENTER";
            this.addChild(this._txt);
            this._txt.anchorX = this._txt.anchorY = 0.5;
        }
        setTips(str, delay, color = "#ffffff", isFly) {
            if (str == null || str == "") {
                return;
            }
            Laya.Tween.clearTween(this);
            this._txt.text = str;
            this._txt.color = color;
            this._bg.size(this._txt.textField.textWidth + 200, this._txt.textField.textHeight + 40);
            this.pos(Laya.stage.width * 0.5, Laya.stage.height * 0.5);
            Laya.stage.addChild(this);
            this.alpha = 1;
            if (isFly) {
                Laya.Tween.to(this, { y: Laya.stage.height * 0.5 - 200 }, delay, null, Laya.Handler.create(this, this.onCom));
            }
            else {
                Laya.Tween.to(this, { alpha: 0 }, delay, null, Laya.Handler.create(this, this.onCom), 500);
            }
        }
        onCom() {
            this.removeSelf();
            this._txt.text = "";
        }
        static setTips(str, delay = 1200, color = "#ffffff", isFly = true) {
            if (this._fly == null) {
                this._fly = new FlyUpTips();
            }
            this._fly.setTips(str, delay, color, isFly);
        }
    }

    class SdkManager {
        constructor() {
            this.haveRight = false;
            this.wxName = null;
            this.wxHead = null;
            this.adMap = {};
            this.lastAdSucTime = 0;
            this.currentAdType = 0;
            this.adHandler = null;
            this.adStat = 0;
            this.errCode = 0;
            this.shareStartTime = 0;
            this.shareTimes = 0;
            this.shareTime = 0;
            this.bannerArray = [];
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            Laya.Browser.window.wx.updateShareMenu({});
            Laya.Browser.window.wx.showShareMenu({});
            Laya.Browser.window.wx.onShareAppMessage(() => {
                return this.getShareObject();
            });
            Laya.Browser.window.wx.getSetting({
                success: res => {
                    if (res.authSetting["scope.userInfo"] == true) {
                        console.log("已经有授权了");
                        this.getUserInfo();
                    }
                    else {
                        this.haveRight = false;
                        console.log("没有授权");
                    }
                }
            });
            Laya.Browser.window.wx.setKeepScreenOn({ keepScreenOn: true });
            Laya.Browser.window.wx.onShow((res) => {
                App.sendEvent(GameEvent.WX_ON_SHOW);
            });
            Laya.Browser.window.wx.onHide((res) => {
                App.sendEvent(GameEvent.WX_ON_HIDE);
            });
            const updateManager = Laya.Browser.window.wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                console.log("版本更新回调:", res.hasUpdate);
            });
            updateManager.onUpdateReady(function () {
                Laya.Browser.window.wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(function () {
            });
            let btn = {};
            btn.type = "image";
            let sty = {};
            sty.left = 0;
            sty.top = 300;
            sty.width = 44;
            sty.height = 44;
            sty.textAlign = "center";
            sty.fontSize = 28;
            sty.lineHeight = 30;
            btn.style = sty;
            btn.icon = "green";
            this.gameClubButton = Laya.Browser.window.wx.createGameClubButton(btn);
            Laya.timer.callLater(this, this.callLaterFun);
        }
        getUserInfo() {
            Laya.Browser.window.wx.getUserInfo({
                success: (res) => {
                    var userInfo = res.userInfo;
                    this.wxName = userInfo.nickName;
                    this.wxHead = userInfo.avatarUrl;
                    var gender = userInfo.gender;
                    var province = userInfo.province;
                    var city = userInfo.city;
                    var country = userInfo.country;
                    console.log("已经授权了:", this.wxName, this.wxHead);
                    this.haveRight = true;
                }
            });
        }
        callLaterFun() {
            this.initAd();
        }
        log(type, content = "") {
        }
        initAd() {
            if (App.isSimulator()) {
                return;
            }
            if (Laya.Browser.onMiniGame) ;
            this.ad = Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: this.adMap[""] });
            this.ad.onClose((res) => {
                console.log("广告 观看结果返回");
                if (res && res.isEnded || res === undefined) {
                    this.lastAdSucTime = Laya.Browser.now();
                    this.exeHandler();
                    this.log(LogType.AD_SUC_OVER);
                }
            });
            this.ad.onError(err => {
                this.adStat = 2;
                this.errCode = err.errCode;
                console.log("广告 加载错误:", err);
                if (this.errCode == 1004) {
                    console.log("加载视频失败,30秒后重试");
                    Laya.timer.once(30 * 1000, this, this.retryAdFun);
                }
                this.log(LogType.AD_FAIL, this.errCode + "");
            });
            this.ad.onLoad(() => {
                this.adStat = 1;
                console.log("广告 加载成功");
            });
        }
        retryAdFun() {
            this.ad.load();
        }
        playAdVideo(code, h) {
            this.currentAdType = code;
            if (Laya.Browser.onMiniGame == false) {
                h.runWith(1);
                return;
            }
            if (this.adStat == 2 || this.ad == null) {
                this.share2(h);
                return;
            }
            this.adHandler = h;
            let adid = this.adMap[code];
            Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: adid });
            this.tryShowAD();
        }
        initAdBtn(sp, type) {
            sp.gray = (this.adStat == 2);
            sp.once(Laya.Event.UNDISPLAY, this, this.adUndisFun, [type]);
        }
        adUndisFun(type) {
        }
        tryShowAD() {
            this.log(LogType.AD_SUC);
            this.ad.show().catch(() => {
                this.ad.load().then(() => this.ad.show()).catch(err => {
                    console.log('广告再加载失败');
                    console.log(err);
                    this.adStat = 2;
                    this.log(LogType.AD_FAIL_2);
                });
            });
        }
        exeHandler() {
            this.adHandler.runWith(1);
        }
        exeHandler2() {
            this.share(this.adHandler);
        }
        share2(h) {
            var obj = this.getShareObject();
            obj.query = "";
            obj.imageUrlId = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
            this.shareStartTime = Laya.Browser.now();
            Laya.stage.once(GameEvent.WX_ON_SHOW, this, this.showFun, [h]);
        }
        share(h, type = 0) {
            this.checkShare();
            if (Laya.Browser.onMiniGame == false) {
                this.shareTimes++;
                h.runWith(1);
                return;
            }
            var obj = this.getShareObject();
            obj.query = "";
            obj.imageUrlId = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
            this.shareStartTime = Laya.Browser.now();
            let chao = this.shareTimes >= SdkManager.SHARE_MAX_TIMES;
            Laya.stage.once(GameEvent.WX_ON_SHOW, this, this.showFun, [chao ? null : h]);
        }
        showFun(h) {
            if (h == null) {
                FlyUpTips.setTips("分享成功");
                return;
            }
            if ((Laya.Browser.now() - this.shareStartTime) > 2000) {
                this.shareTimes++;
                h.runWith(1);
            }
            else {
                FlyUpTips.setTips("请分享到不同群获得奖励");
            }
        }
        checkShare() {
            let now = new Date();
            let last = new Date(this.shareTime);
            if (now.getDate() != last.getDate()) {
                this.shareTimes = 0;
            }
            this.shareTime = Date.now();
        }
        getShareObject() {
            var arr = ["亲手打造更多的神兵利器，来与恶龙们抗争到底。", "只有我一个，我是独一份、我是限量款、我是天选之子。", "今年只玩骑马合成冲，对抗恶龙，拯救你的大陆。"];
            var obj = {};
            obj.title = App.RandomByArray(arr);
            obj.imageUrl = "https://img.kuwan511.com/rideGame/f.jpg";
            return obj;
        }
        savePlayerData(stageNum) {
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var obj = {};
            var o1 = {};
            o1.key = "stageNum";
            o1.value = stageNum + "";
            obj["KVDataList"] = [o1];
            obj.success = (res) => {
                console.log("存储数据成功", res);
            };
            obj.fail = (res) => {
                console.log("失败", res);
            };
            Laya.Browser.window.wx.setUserCloudStorage(obj);
        }
        showBanner(code) {
            let obj = {};
            obj.adUnitId = code;
            let l = (Laya.Browser.clientWidth - 300) / 2;
            obj.style = { left: l, top: 0, width: 300, height: 125 };
            let b = Laya.Browser.window.wx.createBannerAd(obj);
            b.onResize(res => {
                b.style.top = Laya.Browser.clientHeight - res.height - 20;
            });
            b.show();
            this.bannerArray.push(b);
        }
        hideBanner() {
            for (let i = 0; i < this.bannerArray.length; i++) {
                this.bannerArray[i].hide();
                this.bannerArray[i].destroy();
            }
            this.bannerArray.length = 0;
        }
        addUserInfoBtn(sp, h) {
            var s = Laya.Browser.clientWidth / Laya.stage.width;
            var p = sp.localToGlobal(new Laya.Point(0, 0));
            var btnX = p.x * s;
            var btnY = p.y * s;
            var btnwid = sp.width * s;
            var btnhei = sp.height * s;
            this.userInfoButton = Laya.Browser.window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: btnX,
                    top: btnY,
                    width: btnwid,
                    height: btnhei,
                    lineHeight: 40,
                    backgroundColor: '#ffffff00',
                    color: '',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 0,
                    borderColor: "#ffffff"
                }
            });
            this.userInfoButton.onTap((res) => {
                if (res.errMsg == "getUserInfo:ok") {
                    this.wxName = res.userInfo.nickName;
                    this.wxHead = res.userInfo.avatarUrl;
                    this.haveRight = true;
                    h.run();
                    this.undisFun();
                }
            });
            sp.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            if (this.userInfoButton) {
                this.userInfoButton.destroy();
                this.userInfoButton = null;
            }
        }
        chaPingAd(type, handler) {
            if (Laya.Browser.window.wx.createInterstitialAd == null) {
                handler.run();
                return;
            }
            if ((Laya.Browser.now() - this.lastAdSucTime) < 3 * 60 * 1000) {
                handler.run();
                return;
            }
            if (this.canUse("2.6.0") == false) {
                handler.run();
                return;
            }
            let code = this.adMap[type];
            if (code == null) {
                handler.run();
                return;
            }
            let obj = {};
            obj.adUnitId = code;
            let ad = Laya.Browser.window.wx.createInterstitialAd(obj);
            ad.show().catch((err) => {
                console.error("插屏广告:", err);
            });
            ad.onClose(() => {
                handler.run();
            });
        }
        canUse(str) {
            return this.compareVersion(str) >= 0;
        }
        compareVersion(v) {
            let now = Laya.Browser.window.wx.getSystemInfoSync().SDKVersion;
            let v1 = v.split('.');
            let v2 = now.split('.');
            const len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (let i = 0; i < len; i++) {
                const num1 = parseInt(v1[i]);
                const num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                }
                else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
    }
    SdkManager.FLY_BOX = 0;
    SdkManager.GAME_OVER = 1;
    SdkManager.GET_PET = 2;
    SdkManager.TIME_GOLD = 3;
    SdkManager.TREASURE = 4;
    SdkManager.ZHUAN = 5;
    SdkManager.AD_DIALOG = 7;
    SdkManager.NEXT_STAGE_CHAPING = 6;
    SdkManager.SHARE_MAX_TIMES = 6;
    var AD_STAT;
    (function (AD_STAT) {
        AD_STAT[AD_STAT["DIALOG_OPEN"] = 0] = "DIALOG_OPEN";
        AD_STAT[AD_STAT["DIALOG_CLOSE"] = 1] = "DIALOG_CLOSE";
        AD_STAT[AD_STAT["VEDIO_CLICK"] = 2] = "VEDIO_CLICK";
        AD_STAT[AD_STAT["VEDIO_FAIL"] = 3] = "VEDIO_FAIL";
        AD_STAT[AD_STAT["VEDIO_SUC"] = 4] = "VEDIO_SUC";
        AD_STAT[AD_STAT["REWARD"] = 5] = "REWARD";
        AD_STAT[AD_STAT["NO_HAVE"] = 6] = "NO_HAVE";
    })(AD_STAT || (AD_STAT = {}));

    class App {
        static init() {
            App.layerManager = new LayerManager();
            App.tableManager = new TableManager();
            App.soundManager = new SoundManager();
            App.sdkManager = new SdkManager();
        }
        static sendEvent(event) {
            Laya.stage.event(event);
        }
        static isSimulator() {
            if (Laya.Browser.onMiniGame) {
                return Laya.Browser.window.wx.getSystemInfoSync().brand == "devtools";
            }
            else {
                return false;
            }
        }
        static RandomByArray(arr, deleteArr = false) {
            let value = Math.random() * arr.length;
            let index = Math.floor(value);
            let resvalue = arr[index];
            if (deleteArr) {
                arr.splice(index, 1);
            }
            return resvalue;
        }
    }
    App.top = 10;
    App.platformId = 0;
    App.layerManager = null;
    App.tableManager = null;
    App.soundManager = null;
    App.sdkManager = null;

    class SysMap {
        constructor() {
            this.id = 0;
            this.stageId = 0;
            this.stageGroup = '';
            this.numEnemy = 0;
            this.mixEnemy = 0;
            this.maxEnemy = 0;
            this.enemyGroup = '';
        }
        static getData(chaterId, mapId) {
            let arr = App.tableManager.getTable(SysMap.NAME);
            let size = arr.length;
            for (var i = 0; i < size; i++) {
                if (arr[i].id == mapId && arr[i].stageId == chaterId) {
                    return arr[i];
                }
            }
            return null;
        }
        static getTotal(chaterId) {
            let count = 0;
            let arr = App.tableManager.getTable(SysMap.NAME);
            let size = arr.length;
            for (var i = 0; i < size; i++) {
                if (arr[i].stageId == chaterId) {
                    count++;
                }
            }
            return count;
        }
    }
    SysMap.NAME = 'sys_stageinfo.txt';

    class SysEnemy {
        constructor() {
            this.id = 0;
            this.moveType = 0;
            this.moveSpeed = 0;
            this.zoomMode = 0;
            this.zoomShadow = 0;
            this.enemyHp = 0;
            this.enemyAttack = 0;
            this.enemyBlack = 0;
            this.enemySpeed = 0;
            this.normalAttack = 0;
            this.skillId = '';
            this.isBoss = 0;
            this.enemymode = 0;
            this.enemyAi = 0;
            this.txt = '';
            this.enemyLevel = 0;
            this.dropGold = 0;
            this.dropExp = 0;
            this.dropItem = 0;
        }
    }
    SysEnemy.NAME = 'sys_enemy.txt';

    class BattleFlagID {
    }
    BattleFlagID.GUIDE = 10000;
    BattleFlagID.HERO = 9999;
    BattleFlagID.DOOR = 9998;
    BattleFlagID.ANGLE = 9997;
    BattleFlagID.OTHER_NPC = 9996;

    class GridType {
        static isRiverPoint(type) {
            return type >= 100 && type < 200;
        }
        static isRiverScale9Grid(type) {
            return type > 200 && type < 300;
        }
        static isRiverScale9Grid2(type) {
            return type > 900 && type < 1000;
        }
        static isRiverRow(type) {
            return type > 400 && type < 500;
        }
        static isRiverCol(type) {
            return type > 300 && type < 400;
        }
        static isThorn(type) {
            return type >= 500 && type < 600;
        }
        static isFlower(type) {
            return type >= 801 && type <= 804;
        }
        static isWall(type) {
            return (type >= 1000 && type <= 5500);
        }
        static isCube(type) {
            return (type >= 1000 && type <= 5500) || (type >= 1 && type <= 10);
        }
        static isFence(type) {
            return type >= 700 && type < 800;
        }
        static isRiverCube(type) {
            return type == 900;
        }
        static isMonster(type) {
            return type > 10000;
        }
        static isSawHeng(type) {
            return type >= 50 && type < 60;
        }
        static isSawZong(type) {
            return type >= 60 && type < 70;
        }
        static isNpc(type) {
            return type == BattleFlagID.ANGLE || type == BattleFlagID.OTHER_NPC;
        }
    }

    class SysBullet {
        constructor() {
            this.id = 0;
            this.nameTxt = '';
            this.txt = '';
            this.bulletCd = 0;
            this.bulletType = 0;
            this.bulletMode = 0;
            this.boomEffect = 0;
            this.mixNum = 0;
            this.maxNum = 0;
            this.bulletAngle = 0;
            this.bulletNum = 0;
            this.bulletSpeed = 0;
            this.bulletBlock = 0;
            this.bulletEjection = 0;
            this.ejectionNum = 0;
            this.bulletsAoe = 0;
            this.attackAngle = 0;
            this.bulletSplit = 0;
            this.splitNum = 0;
            this.triggerComparison = 0;
            this.skilltarget = 0;
            this.callInfo = '';
            this.damagePercent = 0;
            this.skillEffect1 = 0;
            this.attackDistance = 0;
        }
    }
    SysBullet.NAME = 'sys_bullet.txt';

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var game;
        (function (game) {
            class battleIndexBoxUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battleIndexBoxUI.uiView);
                }
            }
            battleIndexBoxUI.uiView = { "type": "View", "props": { "width": 370, "height": 105 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 50, "x": 83, "var": "pbox1" }, "compId": 13, "child": [{ "type": "Sprite", "props": { "texture": "bg/guandian.png" }, "compId": 7 }, { "type": "Sprite", "props": { "x": 17, "texture": "bg/guandian.png" }, "compId": 8 }, { "type": "Sprite", "props": { "x": 34, "texture": "bg/guandian.png" }, "compId": 9 }] }, { "type": "Box", "props": { "y": 50, "x": 238, "var": "pbox2" }, "compId": 14, "child": [{ "type": "Sprite", "props": { "texture": "bg/guandian.png" }, "compId": 10 }, { "type": "Sprite", "props": { "x": 17, "texture": "bg/guandian.png" }, "compId": 11 }, { "type": "Sprite", "props": { "x": 34, "texture": "bg/guandian.png" }, "compId": 12 }] }, { "type": "Box", "props": { "width": 370, "var": "box", "height": 105 }, "compId": 18 }], "loadList": ["bg/guandian.png"], "loadList3D": [] };
            game.battleIndexBoxUI = battleIndexBoxUI;
            REG("ui.game.battleIndexBoxUI", battleIndexBoxUI);
            class homePageUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(homePageUI.uiView);
                }
            }
            homePageUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "texture": "loading/jiazai.jpg" }, "compId": 5 }, { "type": "Button", "props": { "y": 1163, "x": 246, "stateNum": 1, "skin": "loading/btn_kaishi.png", "scaleY": 0.6, "scaleX": 0.6, "bottom": 80 }, "compId": 6 }, { "type": "LoginView", "props": { "y": 130, "var": "vvv", "runtime": "ui.test.LoginViewUI" }, "compId": 7 }, { "type": "Image", "props": { "y": 478, "x": 134, "skin": "loading/logo.png" }, "compId": 8 }], "loadList": ["loading/jiazai.jpg", "loading/btn_kaishi.png", "loading/logo.png"], "loadList3D": [] };
            game.homePageUI = homePageUI;
            REG("ui.game.homePageUI", homePageUI);
            class newGuideUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newGuideUI.uiView);
                }
            }
            newGuideUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "x": 0, "skin": "guide/fangbian.png", "bottom": 0 }, "compId": 3 }], "loadList": ["guide/fangbian.png"], "loadList3D": [] };
            game.newGuideUI = newGuideUI;
            REG("ui.game.newGuideUI", newGuideUI);
            class newGuide2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newGuide2UI.uiView);
                }
            }
            newGuide2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.75 }, "compId": 6 }, { "type": "Image", "props": { "x": 580, "skin": "guide/nvren.png", "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": 903, "x": 66, "width": 479, "skin": "guide/qipao.png", "sizeGrid": "83,148,116,72", "height": 205 }, "compId": 4 }, { "type": "Label", "props": { "y": 934, "x": 90, "wordWrap": true, "width": 429, "var": "txt", "text": "滑动摇杆，控制角色到达指定位置。", "height": 101, "fontSize": 40, "color": "#ffffff", "bold": true, "align": "left" }, "compId": 5 }], "loadList": ["guide/nvren.png", "guide/qipao.png"], "loadList3D": [] };
            game.newGuide2UI = newGuide2UI;
            REG("ui.game.newGuide2UI", newGuide2UI);
            class newGuide3UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newGuide3UI.uiView);
                }
            }
            newGuide3UI.uiView = { "type": "View", "props": { "y": 70, "x": 42, "width": 142, "height": 350, "anchorY": 0.2, "anchorX": 0.3 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 142, "height": 350 }, "compId": 7, "child": [{ "type": "Image", "props": { "skin": "guide/huangdian.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 161, "x": 31, "var": "img2", "skin": "guide/huangjian.png" }, "compId": 4 }, { "type": "Image", "props": { "y": 235, "x": 31, "var": "img1", "skin": "guide/huangjian.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 309, "x": 31, "var": "img0", "skin": "guide/huangjian.png" }, "compId": 6 }] }], "loadList": ["guide/huangdian.png", "guide/huangjian.png"], "loadList3D": [] };
            game.newGuide3UI = newGuide3UI;
            REG("ui.game.newGuide3UI", newGuide3UI);
            class viewbgUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(viewbgUI.uiView);
                }
            }
            viewbgUI.uiView = { "type": "View", "props": { "width": 750, "height": 1700 }, "compId": 2, "child": [{ "type": "Box", "props": { "height": 1700 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "bg", "skin": "main/zhudi.jpg", "height": 1700 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 109, "x": 0, "texture": "main/zhudi2.png" }, "compId": 5 }] }], "loadList": ["main/zhudi.jpg", "main/zhudi2.png"], "loadList3D": [] };
            game.viewbgUI = viewbgUI;
            REG("ui.game.viewbgUI", viewbgUI);
        })(game = ui.game || (ui.game = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var test;
        (function (test) {
            class alertUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(alertUI.uiView);
                }
            }
            alertUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.5 }, "compId": 12 }, { "type": "Box", "props": { "y": 10, "width": 600, "height": 400, "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "width": 600, "skin": "main/fuhuodi2.jpg", "sizeGrid": "193,104,198,117", "height": 400 }, "compId": 4 }, { "type": "Label", "props": { "y": 127, "x": 15, "width": 570, "var": "txt", "text": "本局将不会产生任何收益。", "height": 40, "fontSize": 36, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }, { "type": "Button", "props": { "y": 271, "x": 55, "width": 200, "var": "cancelBtn", "stateNum": 1, "skin": "main/btn_hong.png", "sizeGrid": "27,29,43,25", "height": 100 }, "compId": 8, "child": [{ "type": "Sprite", "props": { "y": 29, "x": 69, "texture": "main/quxiao.png" }, "compId": 9 }] }, { "type": "Button", "props": { "y": 271, "x": 335, "width": 200, "var": "sureBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "18,31,46,34", "height": 100 }, "compId": 10, "child": [{ "type": "Sprite", "props": { "y": 27, "x": 69, "texture": "main/queding.png" }, "compId": 11 }] }, { "type": "Label", "props": { "y": 180, "x": 15, "width": 570, "var": "txt2", "text": "本局将不会产生任何收益。", "height": 40, "fontSize": 36, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 14 }, { "type": "Sprite", "props": { "y": 19, "x": 245, "texture": "main/biaotitishi.png" }, "compId": 15 }] }], "loadList": ["main/fuhuodi2.jpg", "main/btn_hong.png", "main/quxiao.png", "main/btn_lv.png", "main/queding.png", "main/biaotitishi.png"], "loadList3D": [] };
            test.alertUI = alertUI;
            REG("ui.test.alertUI", alertUI);
            class battleUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battleUI.uiView);
                }
            }
            battleUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 418 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 290, "x": 671, "width": 60, "var": "lvBox", "height": 138 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bg/jinengtiaoxia.png", "sizeGrid": "0,22,0,22", "alpha": 0.8 }, "compId": 3 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "lvBar" }, "compId": 12, "child": [{ "type": "Image", "props": { "var": "jingyantiao", "skin": "bg/jinengtiaoshang.png", "sizeGrid": "-11,34,-17,24" }, "compId": 4 }] }] }, { "type": "Button", "props": { "y": 141, "x": 698, "var": "zanting", "stateNum": 1, "skin": "bg/btn_zhanting.png", "pivotY": 34, "pivotX": 43 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 28, "x": 39, "texture": "bg/qianshu.png", "scaleX": 1, "alpha": 0.8 }, "compId": 7 }, { "type": "FontClip", "props": { "y": 45, "x": 83, "width": 36, "var": "jinbishu", "value": "123", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 121, "align": "left" }, "compId": 8 }, { "type": "Image", "props": { "y": 26, "x": 8, "skin": "bg/dongjin.png", "scaleY": 1, "scaleX": 1 }, "compId": 13 }, { "type": "Box", "props": { "x": 190, "width": 370, "var": "indexBox", "height": 105 }, "compId": 28 }, { "type": "Sprite", "props": { "y": 18.5, "x": 339, "var": "boss", "texture": "bg/BOSS.png" }, "compId": 27 }, { "type": "Box", "props": { "y": 112.5, "x": 190, "var": "bossxuetiao" }, "compId": 35, "child": [{ "type": "Image", "props": { "y": 38, "x": 41, "width": 331, "skin": "bg/bosstiaoxia.png", "sizeGrid": "0,21,0,22", "height": 42 }, "compId": 33 }, { "type": "Image", "props": { "y": 37, "x": 44, "var": "bossxue", "skin": "bg/bosstiaoshang.png" }, "compId": 32 }, { "type": "Sprite", "props": { "texture": "bg/bosstouxiang.png" }, "compId": 34 }] }], "loadList": ["bg/jinengtiaoxia.png", "bg/jinengtiaoshang.png", "bg/btn_zhanting.png", "bg/qianshu.png", "main/clipshuzi.png", "bg/dongjin.png", "bg/BOSS.png", "bg/bosstiaoxia.png", "bg/bosstiaoshang.png", "bg/bosstouxiang.png"], "loadList3D": [] };
            test.battleUI = battleUI;
            REG("ui.test.battleUI", battleUI);
            class battleLvUIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battleLvUIUI.uiView);
                }
            }
            battleLvUIUI.uiView = { "type": "View", "props": { "y": 34, "x": 34, "width": 69, "height": 69, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 2, "child": [{ "type": "Button", "props": { "y": 34, "x": 34, "width": 69, "var": "box", "height": 69, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "var": "btn", "stateNum": 1, "skin": "bg/xiaoguan.png" }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 23, "x": 13, "wordWrap": true, "width": 42, "var": "shuziyou", "text": "98", "height": 32, "fontSize": 24, "color": "#f3e9e9", "align": "center" }, "compId": 4 }] }] }], "loadList": ["bg/xiaoguan.png"], "loadList3D": [] };
            test.battleLvUIUI = battleLvUIUI;
            REG("ui.test.battleLvUIUI", battleLvUIUI);
            class battlestopUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battlestopUI.uiView);
                }
            }
            battlestopUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "x": 0, "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.7 }, "compId": 23 }, { "type": "Box", "props": { "width": 681, "var": "box", "height": 900, "centerY": 0, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "width": 681, "skin": "main/biaotilan.png", "sizeGrid": "0,23,0,125", "height": 99 }, "compId": 4 }, { "type": "Box", "props": { "y": 254, "x": 164, "width": 287, "var": "box1", "height": 446, "anchorX": 0.5 }, "compId": 25 }, { "type": "Box", "props": { "y": 254, "x": 496, "width": 287, "var": "box2", "height": 446, "anchorX": 0.5 }, "compId": 26 }, { "type": "Sprite", "props": { "y": 28.5, "x": 142, "texture": "main/qing.png" }, "compId": 27 }, { "type": "Button", "props": { "y": 887, "x": 330, "width": 303, "var": "queding", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,32,0,34", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 30, "child": [{ "type": "Image", "props": { "y": 20.5, "x": 89, "skin": "main/action.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 31 }, { "type": "Image", "props": { "y": 22, "x": 131, "skin": "main/shuaxin.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 33 }] }] }], "loadList": ["main/biaotilan.png", "main/qing.png", "main/btn_lv.png", "main/action.png", "main/shuaxin.png"], "loadList3D": [] };
            test.battlestopUI = battlestopUI;
            REG("ui.test.battlestopUI", battlestopUI);
            class battlestop2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battlestop2UI.uiView);
                }
            }
            battlestop2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "alpha": 0.6 }, "compId": 24, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 1700, "fillColor": "#000000" }, "compId": 25 }] }, { "type": "Box", "props": { "x": 0, "width": 750, "height": 1256, "centerY": 0 }, "compId": 23, "child": [{ "type": "Label", "props": { "y": 57, "x": 304.5, "var": "baioti", "text": "暂停", "fontSize": 70, "color": "#ffffff", "align": "center" }, "compId": 5 }, { "type": "Button", "props": { "y": 927, "x": 530, "width": 296, "var": "btnPlay", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 17, "child": [{ "type": "Sprite", "props": { "y": 37, "x": 89, "texture": "bg/sanjiao.png" }, "compId": 18 }] }, { "type": "Button", "props": { "y": 720, "x": 195, "width": 296, "var": "btnMusic", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 39, "x": 173, "var": "musicImg", "skin": "bg/zhanting_0.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 20 }, { "type": "Sprite", "props": { "y": 43, "x": 69, "texture": "bg/yinyue.png" }, "compId": 28 }] }, { "type": "Button", "props": { "y": 927, "x": 195, "width": 296, "var": "btnHome", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 86.5, "texture": "bg/huijia.png" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 720, "x": 541, "width": 296, "var": "btnSound", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 26, "child": [{ "type": "Sprite", "props": { "y": 43, "x": 76, "texture": "bg/yinxiao.png" }, "compId": 29 }, { "type": "Image", "props": { "y": 39, "x": 177, "var": "soundImg", "skin": "bg/zhanting_0.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 27 }] }] }], "loadList": ["main/btn_lv.png", "bg/sanjiao.png", "main/btn_huang.png", "bg/zhanting_0.png", "bg/yinyue.png", "bg/huijia.png", "bg/yinxiao.png"], "loadList3D": [] };
            test.battlestop2UI = battlestop2UI;
            REG("ui.test.battlestop2UI", battlestop2UI);
            class Blood2UIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(Blood2UIUI.uiView);
                }
            }
            Blood2UIUI.uiView = { "type": "View", "props": { "width": 85, "height": 17, "centerX": 0 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "texture": "bg/xuetiaodi.png" }, "compId": 3 }, { "type": "Sprite", "props": { "var": "bar", "texture": "bg/xuetiaoshanghong.png" }, "compId": 4 }, { "type": "Label", "props": { "y": -1, "x": 0, "width": 85, "var": "txt", "text": "600", "stroke": 3, "height": 18, "fontSize": 18, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }], "loadList": ["bg/xuetiaodi.png", "bg/xuetiaoshanghong.png"], "loadList3D": [] };
            test.Blood2UIUI = Blood2UIUI;
            REG("ui.test.Blood2UIUI", Blood2UIUI);
            class BloodUIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BloodUIUI.uiView);
                }
            }
            BloodUIUI.uiView = { "type": "View", "props": { "width": 85, "height": 24, "centerX": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 7, "x": 0, "skin": "bg/heroBlood.png" }, "compId": 8 }, { "type": "Image", "props": { "y": 7, "width": 85, "var": "bar", "skin": "bg/xuetiaoshang.png", "height": 17 }, "compId": 10 }, { "type": "Box", "props": { "y": 7, "width": 85, "var": "colBox", "height": 17 }, "compId": 7 }, { "type": "Label", "props": { "y": 2, "x": 0, "width": 85, "var": "txt", "text": "600", "stroke": 3, "height": 18, "fontSize": 18, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }], "loadList": ["bg/heroBlood.png", "bg/xuetiaoshang.png"], "loadList3D": [] };
            test.BloodUIUI = BloodUIUI;
            REG("ui.test.BloodUIUI", BloodUIUI);
            class BulletShadowUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BulletShadowUI.uiView);
                }
            }
            BulletShadowUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": -19, "x": -19, "var": "img", "texture": "bg/douying.png" }, "compId": 3 }], "loadList": ["bg/douying.png"], "loadList3D": [] };
            test.BulletShadowUI = BulletShadowUI;
            REG("ui.test.BulletShadowUI", BulletShadowUI);
            class chengjiuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(chengjiuUI.uiView);
                }
            }
            chengjiuUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "y": 0, "x": 0, "runtime": "ui.game.viewbgUI" }, "compId": 29 }, { "type": "Box", "props": { "y": 111, "x": 37, "width": 675, "var": "listBox", "height": 1100 }, "compId": 25 }], "loadList": [], "loadList3D": [] };
            test.chengjiuUI = chengjiuUI;
            REG("ui.test.chengjiuUI", chengjiuUI);
            class chengjiu_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(chengjiu_1UI.uiView);
                }
            }
            chengjiu_1UI.uiView = { "type": "View", "props": { "width": 675, "height": 262 }, "compId": 1, "child": [{ "type": "Image", "props": { "y": 2, "x": 0, "width": 675, "skin": "chengjiu/chengjiupai.png", "sizeGrid": "0,58,0,88", "height": 260 }, "compId": 2 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "chengjiu/chengjiupai2.png" }, "compId": 4 }, { "type": "Label", "props": { "y": 59, "x": 86, "width": 295, "var": "chengjiuming", "text": "玩家名字七个字", "strokeColor": "#bc871f", "stroke": 3, "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "left" }, "compId": 5 }, { "type": "Label", "props": { "y": 56, "x": 490, "width": 137, "text": "等级：11", "strokeColor": "#bc871f", "stroke": 3, "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "right" }, "compId": 6 }, { "type": "Label", "props": { "y": 113, "x": 83, "width": 339, "var": "xiangjie", "text": "玩家名字七个字", "strokeColor": "#bc871f", "height": 56, "fontSize": 24, "color": "#af6538", "align": "left" }, "compId": 7 }, { "type": "Button", "props": { "y": 168, "x": 549, "width": 182, "var": "lingqu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 24, "x": 64, "skin": "chengjiu/lingquzi.png" }, "compId": 11 }] }, { "type": "Image", "props": { "y": 174, "x": 84, "width": 342, "skin": "main/shukuang.png", "sizeGrid": "0,52,0,49", "height": 41 }, "compId": 12 }, { "type": "Image", "props": { "y": 176, "x": 86, "width": 337, "var": "jindu", "skin": "main/jindutiao.png", "sizeGrid": "0,46,0,55", "height": 37 }, "compId": 13 }, { "type": "Image", "props": { "y": 7, "x": 13, "skin": "chengjiu/xiao.png" }, "compId": 14 }], "loadList": ["chengjiu/chengjiupai.png", "chengjiu/chengjiupai2.png", "main/btn_lv.png", "chengjiu/lingquzi.png", "main/shukuang.png", "main/jindutiao.png", "chengjiu/xiao.png"], "loadList3D": [] };
            test.chengjiu_1UI = chengjiu_1UI;
            REG("ui.test.chengjiu_1UI", chengjiu_1UI);
            class dianjuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(dianjuUI.uiView);
                }
            }
            dianjuUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "heng", "scaleX": 1, "anchorY": 0.35, "anchorX": 0.65 }, "compId": 6, "child": [{ "type": "Clip", "props": { "x": 0.5, "var": "huoxing", "skin": "bg/clip_huoxing.png", "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 3 }, { "type": "Image", "props": { "y": 32, "x": 110.5, "var": "dianju", "skin": "bg/dianju.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 31, "x": 88.5, "var": "jia", "skin": "bg/dianjujia.png" }, "compId": 5 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "zong", "anchorY": 0.65, "anchorX": 0.3 }, "compId": 9, "child": [{ "type": "Clip", "props": { "y": 101, "x": 30.381484041268237, "var": "shudianju", "skin": "bg/clip_dianjushu.png", "clipY": 3, "clipX": 3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Clip", "props": { "x": 42.38148404126824, "width": 58, "var": "shuhuoxing", "skin": "bg/clip_huoxing.png", "rotation": 62, "height": 48, "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 8 }] }], "loadList": ["bg/clip_huoxing.png", "bg/dianju.png", "bg/dianjujia.png", "bg/clip_dianjushu.png"], "loadList3D": [] };
            test.dianjuUI = dianjuUI;
            REG("ui.test.dianjuUI", dianjuUI);
            class GameOverUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GameOverUI.uiView);
                }
            }
            GameOverUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.6 }, "compId": 4 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334 }, "compId": 8, "child": [{ "type": "Box", "props": { "y": 377, "x": 375, "width": 751, "var": "lightView", "height": 755, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20, "child": [{ "type": "Image", "props": { "skin": "shengli/guangzhuan1.png" }, "compId": 21 }, { "type": "Image", "props": { "y": 0, "x": 741, "skin": "shengli/guangzhuan1.png", "scaleX": -1 }, "compId": 25 }, { "type": "Image", "props": { "y": 740, "x": 0, "skin": "shengli/guangzhuan1.png", "scaleY": -1 }, "compId": 24 }, { "type": "Image", "props": { "y": 741, "x": 742, "skin": "shengli/guangzhuan1.png", "scaleY": -1, "scaleX": -1 }, "compId": 23 }] }, { "type": "Image", "props": { "y": 322, "x": 276, "skin": "shengli/qi.png" }, "compId": 14 }, { "type": "Image", "props": { "y": 170, "x": 430, "skin": "shengli/haojiao.png" }, "compId": 15 }, { "type": "Image", "props": { "y": 170, "x": 303, "skin": "shengli/haojiao.png", "scaleX": -1 }, "compId": 16 }, { "type": "Image", "props": { "y": 327, "x": 109, "skin": "shengli/shenglibu.png" }, "compId": 17 }, { "type": "Image", "props": { "y": 272, "x": 292, "skin": "shengli/dunpai.png" }, "compId": 18 }, { "type": "Image", "props": { "y": 668, "x": 172, "width": 430, "skin": "bg/qianshu.png", "sizeGrid": "0,56,0,50", "height": 67 }, "compId": 32 }, { "type": "Box", "props": { "y": 671, "x": 159.5, "width": 439, "var": "expBar", "height": 67 }, "compId": 41, "child": [{ "type": "Image", "props": { "width": 439, "var": "dengjitiao", "skin": "bg/jingyantiaoshang.png", "sizeGrid": "0,24,0,29", "height": 59 }, "compId": 33 }, { "type": "Image", "props": { "width": 437, "skin": "bg/jingyantiaoguang.png", "sizeGrid": "0,38,0,44", "height": 67 }, "compId": 40 }] }, { "type": "Image", "props": { "y": 656, "x": 131, "width": 64, "skin": "shengli/dunpai.png", "height": 90 }, "compId": 31 }] }, { "type": "FontClip", "props": { "y": 679, "x": 140, "width": 182, "var": "dengji", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 121, "align": "center" }, "compId": 39 }, { "type": "FontClip", "props": { "y": 330, "x": 317, "width": 159, "var": "cengshu", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.7, "scaleX": 0.7, "height": 133, "align": "center" }, "compId": 30 }, { "type": "Button", "props": { "y": 838, "x": 364, "width": 421, "var": "lingqu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 34, "child": [{ "type": "FontClip", "props": { "y": 27.5, "x": 105, "width": 395, "var": "jinbishu", "value": "123", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 121, "align": "right" }, "compId": 28 }, { "type": "Image", "props": { "y": 22.5, "x": 228.5, "width": 45, "skin": "bg/dongjin.png", "scaleY": 1, "scaleX": 1, "height": 44 }, "compId": 29 }] }, { "type": "Button", "props": { "y": 961, "x": 354, "width": 421, "visible": false, "var": "fuhuo", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 36, "child": [{ "type": "Sprite", "props": { "y": 4, "x": 123, "texture": "main/action.png" }, "compId": 37 }, { "type": "Label", "props": { "y": 30, "x": 183, "width": 122, "var": "deshuliang", "text": "十倍领取", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "left" }, "compId": 38 }] }], "loadList": ["shengli/guangzhuan1.png", "shengli/qi.png", "shengli/haojiao.png", "shengli/shenglibu.png", "shengli/dunpai.png", "bg/qianshu.png", "bg/jingyantiaoshang.png", "bg/jingyantiaoguang.png", "main/clipshuzi.png", "main/btn_lv.png", "bg/dongjin.png", "main/btn_zi.png", "main/action.png"], "loadList3D": [] };
            test.GameOverUI = GameOverUI;
            REG("ui.test.GameOverUI", GameOverUI);
            class GetItemCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GetItemCellUI.uiView);
                }
            }
            GetItemCellUI.uiView = { "type": "View", "props": { "width": 600, "height": 600 }, "compId": 2, "child": [{ "type": "Light", "props": { "y": 300, "x": 300, "var": "light", "blendMode": "lighter", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 4 }, { "type": "Label", "props": { "y": 431, "x": 156, "width": 288, "var": "label", "text": "X 1000", "height": 91, "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 5 }, { "type": "GoldView", "props": { "y": 150, "x": 155, "var": "v1", "runtime": "ui.test.GoldViewUI" }, "compId": 13 }], "loadList": [], "loadList3D": [] };
            test.GetItemCellUI = GetItemCellUI;
            REG("ui.test.GetItemCellUI", GetItemCellUI);
            class GetItemDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GetItemDialogUI.uiView);
                }
            }
            GetItemDialogUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1200 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "var": "box", "height": 1000 }, "compId": 15 }, { "type": "Button", "props": { "y": 1100, "x": 375, "width": 358, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "name": "close", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 16, "child": [{ "type": "Label", "props": { "y": 30, "x": 68, "width": 222, "var": "deshuliang", "text": "确定", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 17 }] }], "loadList": ["main/btn_lv.png"], "loadList3D": [] };
            test.GetItemDialogUI = GetItemDialogUI;
            REG("ui.test.GetItemDialogUI", GetItemDialogUI);
            class GoldViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GoldViewUI.uiView);
                }
            }
            GoldViewUI.uiView = { "type": "View", "props": { "width": 300, "height": 300 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 27, "x": 24, "visible": false, "var": "red" }, "compId": 3, "child": [{ "type": "Sprite", "props": { "texture": "main/jiangbei.png" }, "compId": 6 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "main/jiangbeiguang.png", "blendMode": "lighter", "alpha": 0.5 }, "compId": 7 }] }, { "type": "Box", "props": { "y": 27, "x": 23, "visible": false, "var": "blue" }, "compId": 4, "child": [{ "type": "Sprite", "props": { "texture": "main/jiangbeilan.png" }, "compId": 8 }, { "type": "Sprite", "props": { "texture": "main/jiangbeiguanglan.png", "blendMode": "lighter", "alpha": 0.5 }, "compId": 9 }] }, { "type": "Image", "props": { "y": 19, "x": 24, "visible": false, "var": "gold", "skin": "main/jiangbi.png" }, "compId": 5 }], "loadList": ["main/jiangbei.png", "main/jiangbeiguang.png", "main/jiangbeilan.png", "main/jiangbeiguanglan.png", "main/jiangbi.png"], "loadList3D": [] };
            test.GoldViewUI = GoldViewUI;
            REG("ui.test.GoldViewUI", GoldViewUI);
            class guangUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(guangUI.uiView);
                }
            }
            guangUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": -219, "x": -210, "skin": "main/guang1.png", "blendMode": "lighter" }, "compId": 3 }, { "type": "Image", "props": { "y": -219, "x": -210, "skin": "main/guang2.png", "blendMode": "lighter" }, "compId": 4 }, { "type": "Image", "props": { "y": -281, "x": -223, "skin": "main/guang1.png", "rotation": 12, "blendMode": "lighter" }, "compId": 5 }, { "type": "Image", "props": { "y": -254, "x": -156, "skin": "main/guang2.png", "rotation": -3, "blendMode": "lighter" }, "compId": 6 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "alpha": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "alpha", "index": 45 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "alpha", "index": 95 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "alpha", "index": 389 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 442 }] } }, { "target": 4, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "alpha", "index": 45 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 95 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "alpha", "index": 115 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 183 }] } }, { "target": 5, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 115 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 183 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "alpha", "index": 244 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 313 }] } }, { "target": 6, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "label": null, "key": "alpha", "index": 244 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 313 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "label": null, "key": "alpha", "index": 389 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 442 }] } }], "name": "ani1", "id": 1, "frameRate": 40, "action": 2 }], "loadList": ["main/guang1.png", "main/guang2.png"], "loadList3D": [] };
            test.guangUI = guangUI;
            REG("ui.test.guangUI", guangUI);
            class HengjuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(HengjuUI.uiView);
                }
            }
            HengjuUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Clip", "props": { "y": -46.5, "x": -107, "var": "huoxing", "skin": "bg/clip_huoxing.png", "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 3 }, { "type": "Box", "props": { "y": -29, "x": -29, "width": 58, "var": "box", "height": 58 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 29, "x": 29, "var": "dianju", "skin": "bg/dianju.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }] }, { "type": "Image", "props": { "y": 0, "x": -20.5, "var": "jia", "skin": "bg/dianjujia.png" }, "compId": 5 }], "loadList": ["bg/clip_huoxing.png", "bg/dianju.png", "bg/dianjujia.png"], "loadList3D": [] };
            test.HengjuUI = HengjuUI;
            REG("ui.test.HengjuUI", HengjuUI);
            class HeroFootUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(HeroFootUI.uiView);
                }
            }
            HeroFootUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 132, "texture": "bg/renlankuang.png", "pivotY": 55, "pivotX": 66, "height": 110 }, "compId": 3 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 50, "var": "dir", "texture": "bg/andanlandian.png", "pivotY": 110, "pivotX": 25, "height": 40 }, "compId": 4 }], "loadList": ["bg/renlankuang.png", "bg/andanlandian.png"], "loadList3D": [] };
            test.HeroFootUI = HeroFootUI;
            REG("ui.test.HeroFootUI", HeroFootUI);
            class hongtanUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(hongtanUI.uiView);
                }
            }
            hongtanUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "loadList": [], "loadList3D": [] };
            test.hongtanUI = hongtanUI;
            REG("ui.test.hongtanUI", hongtanUI);
            class huziUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(huziUI.uiView);
                }
            }
            huziUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": -51, "skin": "bg/tianshiying.png", "scaleY": 0.8, "scaleX": 0.8, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": -188, "x": -29, "skin": "bg/zhuanpan.png" }, "compId": 4 }, { "type": "Image", "props": { "y": -225, "x": -164, "skin": "bg/huzi.png" }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 7, "x": 15, "var": "tan", "skin": "bg/tantan.jpg", "scaleY": 1.1, "scaleX": 1.1 }, "compId": 6 }] }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": -232, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -255, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 20 }, { "value": -232, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "y", "index": 40 }], "x": [{ "value": -162, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 0 }, { "value": -162, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "x", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "bg/zhuanpan.png", "bg/huzi.png", "bg/tantan.jpg"], "loadList3D": [] };
            test.huziUI = huziUI;
            REG("ui.test.huziUI", huziUI);
            class initViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(initViewUI.uiView);
                }
            }
            initViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000" }, "compId": 3 }, { "type": "Label", "props": { "x": 0, "width": 750, "var": "initTxt", "text": "0%", "height": 100, "fontSize": 60, "color": "#ffffff", "centerY": 0, "bold": true, "align": "center" }, "compId": 4 }], "loadList": [], "loadList3D": [] };
            test.initViewUI = initViewUI;
            REG("ui.test.initViewUI", initViewUI);
            class jiesuanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(jiesuanUI.uiView);
                }
            }
            jiesuanUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 310, "x": 278, "var": "di", "skin": "jiesuan/heipai.png" }, "compId": 4 }, { "type": "Label", "props": { "y": 271, "x": 302, "var": "biaoti2", "text": "达到层数", "fontSize": 36, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 5, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 7 }] }, { "type": "Label", "props": { "y": 266, "x": 303, "var": "baioti", "text": "达到层数", "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 598, "x": 155.9853515625, "text": "击败了全国               的玩家", "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 8 }, { "type": "FontClip", "props": { "y": 593, "x": 342.5, "width": 169, "var": "bizhi", "value": "16", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.5, "scaleX": 0.5, "height": 110, "align": "right" }, "compId": 9 }, { "type": "Sprite", "props": { "y": 593, "x": 433, "texture": "jiesuan/baifen.png" }, "compId": 10 }, { "type": "FontClip", "props": { "y": 377, "x": 350.5, "width": 99, "var": "cengshu", "value": "7", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.5, "scaleX": 0.5, "height": 133, "align": "center" }, "compId": 11 }, { "type": "Label", "props": { "y": 472, "x": 338, "var": "wenzi", "text": "章节99", "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 13 }, { "type": "Box", "props": { "y": 522, "x": 163, "var": "jingyanshuliang" }, "compId": 15, "child": [{ "type": "Image", "props": { "y": 6, "x": 25, "width": 400, "skin": "main/shukuang.png", "sizeGrid": "0,20,0,24", "height": 41 }, "compId": 16 }, { "type": "Image", "props": { "y": 8, "x": 27, "width": 395, "var": "jingyan", "skin": "main/jindutiaolan.png", "sizeGrid": "0,33,0,27", "height": 37 }, "compId": 17 }, { "type": "Image", "props": { "y": -5, "x": 0, "skin": "main/pai.png" }, "compId": 18 }, { "type": "FontClip", "props": { "y": 9, "x": 11, "width": 152, "var": "dengji", "value": "12", "spaceX": -2, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ / :", "scaleY": 0.25, "scaleX": 0.25, "height": 97, "align": "center" }, "compId": 19 }] }, { "type": "Image", "props": { "y": 718, "x": 303, "skin": "jiesuan/zhanlipin.png" }, "compId": 20 }, { "type": "Sprite", "props": { "y": 732.5, "x": 500, "texture": "jiesuan/xianglian.png" }, "compId": 21 }, { "type": "Image", "props": { "y": 735, "x": 252.5, "skin": "jiesuan/xianglian.png", "scaleX": -1 }, "compId": 22 }, { "type": "Label", "props": { "y": 1264, "x": 283, "text": "点击关闭", "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 23 }], "loadList": ["jiesuan/heipai.png", "main/clipshuzi.png", "jiesuan/baifen.png", "main/shukuang.png", "main/jindutiaolan.png", "main/pai.png", "jiesuan/zhanlipin.png", "jiesuan/xianglian.png"], "loadList3D": [] };
            test.jiesuanUI = jiesuanUI;
            REG("ui.test.jiesuanUI", jiesuanUI);
            class jiesuan_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(jiesuan_1UI.uiView);
                }
            }
            jiesuan_1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 240, "x": 371, "width": 661, "skin": "jiesuan/lanbu.png", "sizeGrid": "11,62,46,46", "height": 443, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": 189, "x": 371, "skin": "jiesuan/shanglian.png", "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 226.5, "x": 689, "skin": "jiesuan/youtiao.png", "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 231.5, "x": 35, "skin": "jiesuan/zuotiao.png", "anchorX": 0.5 }, "compId": 6 }], "animations": [{ "nodes": [{ "target": 4, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 3 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 3 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 5 }] } }, { "target": 5, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "scaleY", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 3 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 7 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 10 }] } }, { "target": 6, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 3 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 7 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 10 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 7 }] } }, { "target": 3, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 7 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 11 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 13 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["jiesuan/lanbu.png", "jiesuan/shanglian.png", "jiesuan/youtiao.png", "jiesuan/zuotiao.png"], "loadList3D": [] };
            test.jiesuan_1UI = jiesuan_1UI;
            REG("ui.test.jiesuan_1UI", jiesuan_1UI);
            class jueseUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(jueseUI.uiView);
                }
            }
            jueseUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 1, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 51 }, { "type": "Box", "props": { "width": 750, "height": 1334, "centerY": 0 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": 911, "x": 0, "width": 503, "skin": "juese/juese_zi.png", "sizeGrid": "0,16,0,15", "height": 305 }, "compId": 31 }, { "type": "Image", "props": { "y": 911, "x": 503, "width": 247, "skin": "juese/juese_lan.png", "sizeGrid": "0,16,0,15", "height": 305 }, "compId": 30 }, { "type": "Image", "props": { "y": 791, "x": 43, "var": "shengming", "skin": "juese/juese_di.png" }, "compId": 21, "child": [{ "type": "Image", "props": { "y": 92, "x": 41, "skin": "juese/juese_jiaxue.png" }, "compId": 9 }, { "type": "Image", "props": { "y": 63, "x": 123, "skin": "main/juese_sheng.png" }, "compId": 10 }, { "type": "Label", "props": { "y": 5, "x": 54, "width": 74, "text": "生命", "height": 39, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 22 }, { "type": "Button", "props": { "y": 341, "x": 91, "width": 182, "var": "shengmingniu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 23, "x": 62, "skin": "juese/shengzizi.png" }, "compId": 60 }] }, { "type": "Image", "props": { "y": 203, "x": 29.5, "skin": "juese/shengming.png" }, "compId": 68 }, { "type": "FontClip", "props": { "y": 208, "x": 69, "width": 461, "var": "shengmingjia", "value": "+1", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.25, "scaleX": 0.25, "height": 115, "align": "center" }, "compId": 69 }, { "type": "Box", "props": { "y": 307.25, "x": 0, "var": "box1" }, "compId": 72, "child": [{ "type": "Image", "props": { "y": 4.5, "x": 16, "skin": "juese/juese_tiaoxia.png" }, "compId": 12 }, { "type": "Image", "props": { "y": 4.5, "x": 16, "width": 151, "var": "tiao", "skin": "main/juese_tiaoshang.png", "height": 31 }, "compId": 13 }, { "type": "Button", "props": { "y": 20.5, "x": 184, "var": "jia", "stateNum": 1, "skin": "juese/btn_jia.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 59 }, { "type": "Image", "props": { "y": 2.5, "skin": "main/baoshi.png" }, "compId": 58 }, { "type": "FontClip", "props": { "y": 45, "x": 11, "width": 917, "var": "xueshu", "value": "1299/1234", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "center" }, "compId": 14 }] }] }, { "type": "Image", "props": { "y": 789, "x": 280, "var": "gongji", "skin": "juese/juese_di.png" }, "compId": 23, "child": [{ "type": "Image", "props": { "y": 92, "x": 41, "skin": "juese/juese_jiagong.png" }, "compId": 24 }, { "type": "Image", "props": { "y": 63, "x": 123, "skin": "main/juese_sheng.png" }, "compId": 25 }, { "type": "Label", "props": { "y": 5, "x": 54, "width": 74, "text": "攻击", "height": 39, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 29 }, { "type": "Button", "props": { "y": 342, "x": 87, "width": 182, "var": "gongjiniu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 66, "child": [{ "type": "Image", "props": { "y": 23, "x": 62, "skin": "juese/shengzizi.png" }, "compId": 67 }] }, { "type": "Image", "props": { "y": 204, "x": 27, "skin": "juese/gongji.png" }, "compId": 70 }, { "type": "FontClip", "props": { "y": 210, "x": 69, "width": 461, "var": "gongjijia", "value": "+1", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.25, "scaleX": 0.25, "height": 115, "align": "center" }, "compId": 71 }, { "type": "Box", "props": { "y": 307.5, "x": -7, "var": "box2" }, "compId": 73, "child": [{ "type": "Image", "props": { "y": 4.5, "x": 16, "skin": "juese/juese_tiaoxia.png" }, "compId": 61 }, { "type": "Image", "props": { "y": 4.5, "x": 16, "var": "tiao2", "skin": "main/juese_tiaoshang.png" }, "compId": 62 }, { "type": "Button", "props": { "y": 20.5, "x": 184, "var": "jia2", "stateNum": 1, "skin": "juese/btn_jia.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 63 }, { "type": "Image", "props": { "y": 2.5, "skin": "main/baoshi2.png" }, "compId": 64 }, { "type": "FontClip", "props": { "y": 45, "x": 11, "width": 910, "var": "gongshu", "value": "1299/1234", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "center" }, "compId": 65 }] }] }, { "type": "Image", "props": { "y": 797, "x": 543, "width": 175, "skin": "juese/juese_hei.png", "sizeGrid": "23,70,19,34", "height": 367, "alpha": 0.5 }, "compId": 38 }, { "type": "Image", "props": { "y": 1000, "x": 544, "skin": "juese/juesekuai.png" }, "compId": 40 }, { "type": "Image", "props": { "y": 842, "x": 542, "width": 177, "var": "jinengtubiao", "skin": "main/kawen.png", "height": 177 }, "compId": 39 }, { "type": "Label", "props": { "y": 803, "x": 562, "width": 133, "var": "jinengming", "text": "技能名字", "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "center" }, "compId": 41 }, { "type": "Label", "props": { "y": 1045, "x": 551, "wordWrap": true, "width": 157, "var": "skillLabel", "text": "技能说明技能说明技能说明技能说明技能说明", "height": 114, "fontSize": 24, "color": "#f3e9e9", "align": "center" }, "compId": 42 }, { "type": "Button", "props": { "y": 455, "x": 119, "var": "zuo", "stateNum": 1, "skin": "main/btn_zuo.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 43 }, { "type": "Button", "props": { "y": 456, "x": 641, "width": 63, "var": "you", "stateNum": 1, "skin": "main/btn_zuo.png", "scaleX": -1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 44 }, { "type": "juese_1", "props": { "y": 117, "x": 251, "runtime": "ui.test.juese_1UI" }, "compId": 50 }, { "type": "Image", "props": { "y": 571, "x": 246, "var": "xuan", "skin": "juese/juese_yixuanze.png" }, "compId": 45 }, { "type": "Image", "props": { "y": 687, "x": 72, "width": 592, "skin": "juese/juese_hei.png", "sizeGrid": "15,26,22,22", "height": 69, "alpha": 0.5 }, "compId": 53 }, { "type": "Sprite", "props": { "y": 684, "x": 99, "texture": "juese/juese_jiaxue.png" }, "compId": 54 }, { "type": "Sprite", "props": { "y": 686, "x": 400, "texture": "juese/juese_jiagong.png" }, "compId": 55 }, { "type": "FontClip", "props": { "y": 707, "x": 205, "width": 461, "var": "shengmingshu", "value": "12990", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 115, "align": "left" }, "compId": 56 }, { "type": "FontClip", "props": { "y": 702.5, "x": 496, "width": 461, "var": "gongjishu", "value": "12990", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 115, "align": "left" }, "compId": 57 }] }], "loadList": ["juese/juese_zi.png", "juese/juese_lan.png", "juese/juese_di.png", "juese/juese_jiaxue.png", "main/juese_sheng.png", "main/btn_lv.png", "juese/shengzizi.png", "juese/shengming.png", "main/clipshuzi.png", "juese/juese_tiaoxia.png", "main/juese_tiaoshang.png", "juese/btn_jia.png", "main/baoshi.png", "juese/juese_jiagong.png", "juese/gongji.png", "main/baoshi2.png", "juese/juese_hei.png", "juese/juesekuai.png", "main/kawen.png", "main/btn_zuo.png", "test/juese_1.ui", "juese/juese_yixuanze.png"], "loadList3D": [] };
            test.jueseUI = jueseUI;
            REG("ui.test.jueseUI", jueseUI);
            class juese_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(juese_1UI.uiView);
                }
            }
            juese_1UI.uiView = { "type": "View", "props": { "width": 265, "height": 540 }, "compId": 1, "child": [{ "type": "Box", "props": { "y": 5, "width": 265, "var": "ren" }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 436, "skin": "ren/ying.png" }, "compId": 9 }, { "type": "Image", "props": { "y": 5, "x": -110, "skin": "ren/juese1.png" }, "compId": 8 }] }], "loadList": ["ren/ying.png", "ren/juese1.png"], "loadList3D": [] };
            test.juese_1UI = juese_1UI;
            REG("ui.test.juese_1UI", juese_1UI);
            class juese_tishiUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(juese_tishiUI.uiView);
                }
            }
            juese_tishiUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1200 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 506, "centerY": -150, "centerX": 0 }, "compId": 4, "child": [{ "type": "Light", "props": { "y": 259, "x": 375, "var": "light", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 20 }, { "type": "Button", "props": { "y": 460, "x": 374, "width": 358, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Sprite", "props": { "y": 7, "x": 46, "texture": "main/action.png" }, "compId": 14 }, { "type": "Label", "props": { "y": 29, "x": 98, "width": 222, "var": "deshuliang", "text": "随机获得6~10个", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 13 }] }, { "type": "Button", "props": { "y": 68, "x": 614, "var": "closeBtn", "stateNum": 1, "skin": "main/btn_guanbi.png", "name": "close" }, "compId": 9 }, { "type": "Label", "props": { "y": 339, "x": 290.5, "width": 167, "text": "水晶不足", "height": 40, "fontSize": 36, "color": "#000000", "align": "center" }, "compId": 10 }, { "type": "GoldView", "props": { "y": 159, "x": 282, "var": "v1", "scaleY": 0.6, "scaleX": 0.6, "runtime": "ui.test.GoldViewUI" }, "compId": 28 }] }], "loadList": ["main/btn_zi.png", "main/action.png", "main/btn_guanbi.png"], "loadList3D": [] };
            test.juese_tishiUI = juese_tishiUI;
            REG("ui.test.juese_tishiUI", juese_tishiUI);
            class LightUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LightUI.uiView);
                }
            }
            LightUI.uiView = { "type": "View", "props": { "width": 742, "height": 742 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "main/guangzhuan1.png" }, "compId": 9 }, { "type": "Sprite", "props": { "y": 0, "x": 742, "texture": "main/guangzhuan1.png", "scaleX": -1 }, "compId": 10 }, { "type": "Sprite", "props": { "y": 742, "x": 0, "texture": "main/guangzhuan1.png", "scaleY": -1 }, "compId": 11 }, { "type": "Sprite", "props": { "y": 742, "x": 742, "texture": "main/guangzhuan1.png", "scaleY": -1, "scaleX": -1 }, "compId": 12 }], "loadList": ["main/guangzhuan1.png"], "loadList3D": [] };
            test.LightUI = LightUI;
            REG("ui.test.LightUI", LightUI);
            class LoadingUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LoadingUI.uiView);
                }
            }
            LoadingUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#ffffff" }, "compId": 3 }, { "type": "Box", "props": { "width": 156, "scaleY": 1.5, "scaleX": 1.5, "height": 156, "centerY": 0, "centerX": 0 }, "compId": 5, "child": [{ "type": "Clip", "props": { "y": 0, "x": 0, "var": "clip", "skin": "loading/loadingClip.png", "interval": 150, "clipY": 4, "clipX": 4, "autoPlay": true }, "compId": 10 }, { "type": "Label", "props": { "y": 58, "x": 0, "width": 156, "var": "txt", "text": "10%", "height": 40, "fontSize": 36, "color": "#b7b7b7", "bold": true, "align": "center" }, "compId": 7 }] }], "loadList": ["loading/loadingClip.png"], "loadList3D": [] };
            test.LoadingUI = LoadingUI;
            REG("ui.test.LoadingUI", LoadingUI);
            class LoginViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LoginViewUI.uiView);
                }
            }
            LoginViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 500 }, "compId": 2, "child": [{ "type": "TextInput", "props": { "y": 121, "x": 236, "width": 278, "var": "t1", "prompt": "输入用户名", "height": 83, "fontSize": 40, "bgColor": "#ffffff" }, "compId": 3 }, { "type": "Text", "props": { "y": 275, "x": 275, "var": "btn", "text": "点我登陆", "fontSize": 50, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 5 }], "loadList": [], "loadList3D": [] };
            test.LoginViewUI = LoginViewUI;
            REG("ui.test.LoginViewUI", LoginViewUI);
            class mainUIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(mainUIUI.uiView);
                }
            }
            mainUIUI.uiView = { "type": "View", "props": { "width": 750, "height": 106 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 352, "width": 399, "skin": "main/hei.jpg", "height": 106, "alpha": 0.7 }, "compId": 60 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 417, "skin": "main/touxiangdi.png", "sizeGrid": "0,85,0,54", "height": 106 }, "compId": 40 }, { "type": "Image", "props": { "y": 5, "x": 20, "width": 69, "var": "headImg", "height": 69 }, "compId": 42 }, { "type": "Image", "props": { "y": 6, "x": 20, "skin": "main/touxiangkuang.png" }, "compId": 41 }, { "type": "Image", "props": { "y": 84, "x": 0, "width": 370, "skin": "main/jingyantiaodi.png", "sizeGrid": "0,67,0,42", "height": 18 }, "compId": 43 }, { "type": "Image", "props": { "y": 84, "x": 0, "width": 370, "var": "jingyantiao", "skin": "main/jingyantiaoshang.png", "sizeGrid": "0,64,0,26", "height": 18 }, "compId": 44 }, { "type": "FontClip", "props": { "y": 80, "x": 77.5, "width": 226, "var": "dengji", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "left" }, "compId": 21 }, { "type": "Label", "props": { "y": 6, "x": 96, "width": 229, "var": "nameTxt", "text": "玩家名字七个字", "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "left" }, "compId": 45 }, { "type": "Image", "props": { "y": 72.5, "x": 6.5, "width": 26, "skin": "main/dunpai.png", "height": 35 }, "compId": 61 }, { "type": "Image", "props": { "y": 74.5, "x": 33.5, "skin": "main/dengji.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 46 }, { "type": "Image", "props": { "y": 44, "x": 94.5, "skin": "main/dongjin.png" }, "compId": 47 }, { "type": "FontClip", "props": { "y": 49, "x": 128, "width": 582, "var": "coinClip", "value": "12999", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "left" }, "compId": 48 }, { "type": "Sprite", "props": { "y": 46, "x": 253.5, "texture": "main/tili.png" }, "compId": 49 }, { "type": "FontClip", "props": { "y": 31, "x": 313, "width": 472, "var": "timerClip", "value": "00:00", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.15, "scaleX": 0.15, "height": 122 }, "compId": 56 }, { "type": "FontClip", "props": { "y": 49, "x": 290, "width": 434, "var": "tiliClip", "value": "20/20", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 147 }, "compId": 57 }, { "type": "FontClip", "props": { "y": 6, "x": 313, "width": 472, "var": "appEnergyClip", "value": "-5", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.15, "scaleX": 0.15, "height": 122 }, "compId": 58 }], "loadList": ["main/hei.jpg", "main/touxiangdi.png", "main/touxiangkuang.png", "main/jingyantiaodi.png", "main/jingyantiaoshang.png", "main/clipshuzi.png", "main/dunpai.png", "main/dengji.png", "main/dongjin.png", "main/tili.png"], "loadList3D": [] };
            test.mainUIUI = mainUIUI;
            REG("ui.test.mainUIUI", mainUIUI);
            class moguiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(moguiUI.uiView);
                }
            }
            moguiUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 101, "x": 0, "skin": "bg/tianshiying.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Box", "props": { "y": -3, "x": -7 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": -53, "x": 97, "skin": "bg/guichibang.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0 }, "compId": 5 }, { "type": "Image", "props": { "y": -61, "x": -86, "skin": "bg/guichibang.png", "scaleX": -1, "rotation": 0, "anchorY": 0.5, "anchorX": 0 }, "compId": 6 }, { "type": "Image", "props": { "y": -75, "x": -12, "skin": "bg/gui.png", "scaleY": 1.3, "scaleX": 1.3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": -199, "x": -102, "var": "tan", "skin": "bg/tantan.jpg", "scaleY": 1.1, "scaleX": 1.1 }, "compId": 8 }] }], "animations": [{ "nodes": [{ "target": 4, "keyframes": { "y": [{ "value": -105.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "y", "index": 0 }, { "value": -135, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "y", "index": 20 }, { "value": -105.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "y", "index": 40 }], "x": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "x", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "x", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "x", "index": 40 }] } }, { "target": 5, "keyframes": { "y": [{ "value": -61, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "y", "index": 0 }], "x": [{ "value": 89, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "x", "index": 0 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 0 }, { "value": 30, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 40 }] } }, { "target": 6, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "rotation", "index": 0 }, { "value": -30, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "rotation", "index": 40 }] } }, { "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }], "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 40 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "bg/guichibang.png", "bg/gui.png", "bg/tantan.jpg"], "loadList3D": [] };
            test.moguiUI = moguiUI;
            REG("ui.test.moguiUI", moguiUI);
            class mogui_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(mogui_1UI.uiView);
                }
            }
            mogui_1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "alpha": 0.6 }, "compId": 20, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 1700, "fillColor": "#000000" }, "compId": 21 }] }, { "type": "Box", "props": { "centerY": 0, "centerX": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 0, "x": 34, "width": 681, "skin": "main/biaotihong.png", "sizeGrid": "0,23,0,125", "height": 99 }, "compId": 3 }, { "type": "Label", "props": { "y": 31, "x": 196.5, "var": "biaoti2", "text": "你遇见了恶魔", "fontSize": 48, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 4, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 6 }] }, { "type": "Label", "props": { "y": 25, "x": 196.5, "var": "baioti", "text": "你遇见了恶魔", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 5 }, { "type": "mogui", "props": { "y": 305, "x": 344.5, "scaleY": 0.8, "scaleX": 0.8, "runtime": "ui.test.moguiUI" }, "compId": 7 }, { "type": "Label", "props": { "y": 433, "x": 135, "text": "是否与魔鬼签订契约？", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 8 }, { "type": "Label", "props": { "y": 520, "x": 190, "var": "txt", "text": "失去274生命上限", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 726, "width": 750, "var": "tisheng", "text": "攻速提升", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 568, "x": 297, "texture": "main/PT1.png" }, "compId": 12 }, { "type": "Image", "props": { "y": 808, "x": 301.5, "width": 147, "var": "skillBox", "height": 147 }, "compId": 13 }, { "type": "Button", "props": { "y": 1096, "x": 546, "width": 204, "var": "btn_lv", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,22,0,23", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15, "child": [{ "type": "Image", "props": { "y": 17, "x": 69, "skin": "main/qianding.png" }, "compId": 17 }] }, { "type": "Button", "props": { "y": 1096, "x": 212, "width": 204, "var": "btn_hong", "stateNum": 1, "skin": "main/btn_hong.png", "sizeGrid": "0,22,0,23", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 19, "x": 64, "skin": "main/jujue.png" }, "compId": 18 }] }] }], "loadList": ["main/biaotihong.png", "main/PT1.png", "main/btn_lv.png", "main/qianding.png", "main/btn_hong.png", "main/jujue.png"], "loadList3D": [] };
            test.mogui_1UI = mogui_1UI;
            REG("ui.test.mogui_1UI", mogui_1UI);
            class newhandUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newhandUI.uiView);
                }
            }
            newhandUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "loadList": [], "loadList3D": [] };
            test.newhandUI = newhandUI;
            REG("ui.test.newhandUI", newhandUI);
            class ReborthUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ReborthUI.uiView);
                }
            }
            ReborthUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.75 }, "compId": 3 }, { "type": "Box", "props": { "width": 750, "height": 506, "centerY": -2, "centerX": 3 }, "compId": 6, "child": [{ "type": "Sprite", "props": { "y": 59, "x": 75, "width": 600, "texture": "main/fuhuodi2.jpg", "height": 400 }, "compId": 12 }, { "type": "Button", "props": { "y": 460, "x": 374, "width": 240, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 29, "x": 89, "skin": "main/queding.png" }, "compId": 17 }] }, { "type": "Button", "props": { "y": 68, "x": 614, "var": "closeBtn", "stateNum": 1, "skin": "main/btn_guanbi.png" }, "compId": 11 }, { "type": "Label", "props": { "y": 360, "x": 276, "width": 167, "text": "剩余次数：", "height": 40, "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 360, "x": 443, "width": 45, "var": "txt", "text": "2", "height": 40, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 14 }, { "type": "Image", "props": { "y": 65, "x": 331, "skin": "main/biaotifuhuo.png" }, "compId": 15 }, { "type": "Label", "props": { "y": 221, "x": 353, "width": 45, "var": "daojishi", "height": 64, "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 40 }] }, { "type": "Button", "props": { "y": 870, "x": 375, "width": 358, "visible": false, "var": "fuhuo", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 36, "child": [{ "type": "Sprite", "props": { "y": 4, "x": 90, "texture": "main/action.png" }, "compId": 37 }, { "type": "Label", "props": { "y": 30, "x": 150, "width": 122, "var": "deshuliang", "text": "免费复活", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "left" }, "compId": 38 }] }, { "type": "Image", "props": { "y": 586, "x": 296, "var": "jindu", "skin": "main/quantiao.png" }, "compId": 41 }, { "type": "Box", "props": { "y": 667, "x": 375, "var": "centerBox" }, "compId": 42 }], "loadList": ["main/fuhuodi2.jpg", "main/btn_lv.png", "main/queding.png", "main/btn_guanbi.png", "main/biaotifuhuo.png", "main/btn_zi.png", "main/action.png", "main/quantiao.png"], "loadList3D": [] };
            test.ReborthUI = ReborthUI;
            REG("ui.test.ReborthUI", ReborthUI);
            class RockerViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(RockerViewUI.uiView);
                }
            }
            RockerViewUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "var": "sp", "skin": "bg/rockerBg.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Box", "props": { "width": 304, "var": "dir", "height": 304, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Sprite", "props": { "y": 26, "x": 26.5, "texture": "bg/rollDir.png" }, "compId": 5 }] }, { "type": "Image", "props": { "var": "sp0", "skin": "bg/rockerBall.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["bg/rockerBg.png", "bg/rollDir.png", "bg/rockerBall.png"], "loadList3D": [] };
            test.RockerViewUI = RockerViewUI;
            REG("ui.test.RockerViewUI", RockerViewUI);
            class SawHengUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SawHengUI.uiView);
                }
            }
            SawHengUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "bg", "skin": "bg/501.png", "sizeGrid": "0,64,0,64" }, "compId": 3 }], "loadList": ["bg/501.png"], "loadList3D": [] };
            test.SawHengUI = SawHengUI;
            REG("ui.test.SawHengUI", SawHengUI);
            class SawZongUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SawZongUI.uiView);
                }
            }
            SawZongUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "bg", "skin": "bg/502.png", "sizeGrid": "64,0,64,0" }, "compId": 3 }], "loadList": ["bg/502.png"], "loadList3D": [] };
            test.SawZongUI = SawZongUI;
            REG("ui.test.SawZongUI", SawZongUI);
            class selectmissionUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(selectmissionUI.uiView);
                }
            }
            selectmissionUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "x": 0, "centerY": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "main/jiandi.jpg" }, "compId": 3 }] }, { "type": "Box", "props": { "x": 18.5, "centerY": 0 }, "compId": 21, "child": [{ "type": "Image", "props": { "x": 0.5, "width": 714, "skin": "main/biaotilan.png", "sizeGrid": "0,38,0,134", "height": 99 }, "compId": 4 }, { "type": "Label", "props": { "y": 24, "x": 210.5, "var": "biaoti2", "text": "1.我也草原", "fontSize": 60, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 5, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 7 }] }, { "type": "Label", "props": { "y": 19, "x": 212.5, "var": "biaoti", "text": "1.我也草原", "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 686, "x": 171.5, "var": "changdu2", "text": "章节长度：50", "fontSize": 60, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 8, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 10 }] }, { "type": "Label", "props": { "y": 682, "x": 172.5, "var": "changdu", "text": "章节长度：50", "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 781, "x": 37.5, "width": 630, "var": "miaoshu2", "text": "一片肥沃的草原，是打猎的好地方", "height": 34, "fontSize": 34, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 11, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 13 }] }, { "type": "Label", "props": { "y": 776, "x": 37.5, "width": 630, "var": "miaoshu", "text": "一片肥沃的草原，是打猎的好地方", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 958, "x": 354.5, "width": 301, "var": "btn_jinru", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,16,0,18", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 14, "child": [{ "type": "Label", "props": { "y": 42, "x": 90, "text": "进入", "fontSize": 60, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 15, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 17 }] }, { "type": "Label", "props": { "y": 38, "x": 93, "text": "进入", "strokeColor": "#000000", "stroke": 3, "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 16 }] }, { "type": "Button", "props": { "y": 1155, "x": 41.5, "var": "fanhui", "stateNum": 1, "skin": "main/btn_lan.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 17, "x": 19, "skin": "main/toujian.png" }, "compId": 19 }] }, { "type": "xiaodao", "props": { "y": 151, "x": 14, "runtime": "ui.test.xiaodaoUI" }, "compId": 22 }, { "type": "Label", "props": { "y": 944, "x": 245, "var": "tiaojian2", "text": "通过第1章解锁", "height": 34, "fontSize": 34, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 23, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 25 }] }, { "type": "Label", "props": { "y": 938, "x": 245.06494140625, "var": "tiaojian", "text": "通过第1章解锁", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 24 }] }], "loadList": ["main/jiandi.jpg", "main/biaotilan.png", "main/btn_huang.png", "main/btn_lan.png", "main/toujian.png"], "loadList3D": [] };
            test.selectmissionUI = selectmissionUI;
            REG("ui.test.selectmissionUI", selectmissionUI);
            class settingUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(settingUI.uiView);
                }
            }
            settingUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 28 }, { "type": "Box", "props": { "width": 750, "height": 1334, "centerY": 0 }, "compId": 27 }, { "type": "Label", "props": { "y": 162, "x": 213, "width": 139, "var": "id", "text": "ID:1234", "height": 45, "fontSize": 40, "color": "#ffffff", "align": "center" }, "compId": 29 }, { "type": "Label", "props": { "y": 162, "x": 384, "width": 190, "var": "ver", "text": "VER:4.0.2", "height": 45, "fontSize": 40, "color": "#ffffff", "align": "center" }, "compId": 31 }, { "type": "Sprite", "props": { "y": 279, "x": 315, "texture": "shezhi/yuyan.png" }, "compId": 32 }, { "type": "Button", "props": { "y": 383, "x": 375, "width": 540, "var": "yuyan", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 33, "child": [{ "type": "Sprite", "props": { "y": 18, "x": 179, "texture": "shezhi/jianti.png" }, "compId": 38 }] }, { "type": "Button", "props": { "y": 599, "x": 375, "width": 540, "var": "yinxiao", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 36, "child": [{ "type": "Image", "props": { "y": 19, "x": 241, "var": "soundImg", "skin": "shezhi/kai.png" }, "compId": 39 }] }, { "type": "Button", "props": { "y": 781, "x": 105, "width": 540, "var": "yinyue", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "height": 91 }, "compId": 37, "child": [{ "type": "Image", "props": { "y": 21, "x": 240, "var": "musicImg", "skin": "shezhi/kai.png" }, "compId": 40 }] }, { "type": "Sprite", "props": { "y": 495, "x": 316, "texture": "shezhi/yinxiao.png" }, "compId": 41 }, { "type": "Sprite", "props": { "y": 724, "x": 316, "texture": "shezhi/yinyue.png" }, "compId": 42 }], "loadList": ["shezhi/yuyan.png", "main/btn_lv.png", "shezhi/jianti.png", "shezhi/kai.png", "shezhi/yinxiao.png", "shezhi/yinyue.png"], "loadList3D": [] };
            test.settingUI = settingUI;
            REG("ui.test.settingUI", settingUI);
            class SkillGridUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SkillGridUI.uiView);
                }
            }
            SkillGridUI.uiView = { "type": "View", "props": { "width": 287, "height": 446 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "main/kapai.png" }, "compId": 3 }, { "type": "Label", "props": { "y": 15, "x": 64, "width": 160, "var": "txt", "text": "汉字", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 4 }, { "type": "Box", "props": { "y": 60, "x": 52, "width": 183, "var": "imgBox", "height": 183 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 91, "x": 91, "var": "img", "skin": "main/kawen.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11 }] }, { "type": "Label", "props": { "y": 259, "x": 24, "wordWrap": true, "width": 240, "var": "shuoming", "text": "汉字", "height": 162, "fontSize": 30, "color": "#ffffff", "align": "left" }, "compId": 9 }], "loadList": ["main/kapai.png", "main/kawen.png"], "loadList3D": [] };
            test.SkillGridUI = SkillGridUI;
            REG("ui.test.SkillGridUI", SkillGridUI);
            class talentUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(talentUI.uiView);
                }
            }
            talentUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 29 }, { "type": "Image", "props": { "width": 698, "var": "tianfudi", "skin": "tianfu/tiandi.png", "sizeGrid": "89,0,115,0", "height": 1065, "centerY": 0, "centerX": 0 }, "compId": 31, "child": [{ "type": "Button", "props": { "y": 923, "x": 360, "width": 250, "var": "shengmingniu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 114, "child": [{ "type": "FontClip", "props": { "y": 30, "x": 68, "width": 386, "var": "qianshu", "value": "1299", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "right" }, "compId": 116 }, { "type": "Image", "props": { "y": 24, "x": 147, "skin": "main/dongjin.png" }, "compId": 117 }] }, { "type": "List", "props": { "y": 77, "x": 69, "width": 588, "var": "list", "spaceY": 35, "spaceX": 25, "repeatY": 3, "repeatX": 3, "height": 755 }, "compId": 115, "child": [{ "type": "TianFuCell", "props": { "y": 0, "x": 0, "renderType": "render", "runtime": "ui.test.TianFuCellUI" }, "compId": 118 }] }, { "type": "Box", "props": { "y": 276, "x": 5, "visible": false, "var": "tipBox" }, "compId": 123, "child": [{ "type": "Sprite", "props": { "y": 53, "texture": "tianfu/qipao.png" }, "compId": 124 }, { "type": "Sprite", "props": { "x": 101, "texture": "tianfu/qipaojian.png" }, "compId": 125 }, { "type": "Text", "props": { "y": 86, "x": 9, "width": 287, "var": "txt5", "valign": "middle", "text": "这里是天赋信息", "height": 90, "fontSize": 30, "align": "center", "runtime": "laya.display.Text" }, "compId": 126 }] }] }], "loadList": ["tianfu/tiandi.png", "main/btn_lv.png", "main/clipshuzi.png", "main/dongjin.png", "tianfu/qipao.png", "tianfu/qipaojian.png"], "loadList3D": [] };
            test.talentUI = talentUI;
            REG("ui.test.talentUI", talentUI);
            class TalentCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TalentCellUI.uiView);
                }
            }
            TalentCellUI.uiView = { "type": "View", "props": { "width": 660, "height": 179 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 9, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b1" }, "compId": 27, "child": [{ "type": "Box", "props": { "y": 27, "x": 212, "width": 66, "var": "xian1", "height": 127 }, "compId": 19, "child": [{ "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "height": 126 }, "compId": 23 }, { "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 24 }, { "type": "Image", "props": { "y": 119, "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 25 }] }, { "type": "talent_1", "props": { "var": "t1", "runtime": "ui.test.talent_1UI" }, "compId": 6 }] }, { "type": "Box", "props": { "y": 27, "x": 443, "var": "b2" }, "compId": 26, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 66, "scaleX": -1, "height": 127 }, "compId": 18, "child": [{ "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "height": 126 }, "compId": 20 }, { "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 21 }, { "type": "Image", "props": { "y": 119, "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 22 }] }, { "type": "talent_1", "props": { "y": -27, "x": -18, "var": "t2", "runtime": "ui.test.talent_1UI" }, "compId": 7 }] }, { "type": "Box", "props": { "y": 49.75, "x": 233 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": -0.5, "skin": "tianfu/biaoti.png" }, "compId": 3 }, { "type": "FontClip", "props": { "y": 28.5, "x": 108, "width": 253, "var": "dengji0", "value": "10", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 115, "align": "left" }, "compId": 4 }, { "type": "Image", "props": { "y": 24.5, "x": 41, "skin": "main/dengji.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 5 }] }] }], "loadList": ["tianfu/lvtiao.png", "tianfu/biaoti.png", "main/clipshuzi.png", "main/dengji.png"], "loadList3D": [] };
            test.TalentCellUI = TalentCellUI;
            REG("ui.test.TalentCellUI", TalentCellUI);
            class TalentViewUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TalentViewUI.uiView);
                }
            }
            TalentViewUI.uiView = { "type": "Dialog", "props": { "width": 640, "isModal": true, "height": 600 }, "compId": 2, "child": [{ "type": "Text", "props": { "y": 507, "x": 178, "text": "请选择您的天赋", "fontSize": 40, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 9 }, { "type": "TalentZhuan", "props": { "y": 132, "x": 105, "var": "b0", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 10 }, { "type": "TalentZhuan", "props": { "y": 132, "x": 320, "var": "b1", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 16 }, { "type": "TalentZhuan", "props": { "y": 132, "x": 535, "var": "b2", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 17 }, { "type": "TalentZhuan", "props": { "y": 371, "x": 105, "var": "b3", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 18 }, { "type": "TalentZhuan", "props": { "y": 371, "x": 320, "var": "b4", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 19 }, { "type": "TalentZhuan", "props": { "y": 371, "x": 535, "var": "b5", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 20 }], "loadList": [], "loadList3D": [] };
            test.TalentViewUI = TalentViewUI;
            REG("ui.test.TalentViewUI", TalentViewUI);
            class TalentZhuanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TalentZhuanUI.uiView);
                }
            }
            TalentZhuanUI.uiView = { "type": "View", "props": { "width": 175, "height": 212 }, "compId": 2, "child": [{ "type": "TianFuCell", "props": { "y": 0, "x": 175, "var": "back", "scaleX": -1, "runtime": "ui.test.TianFuCellUI" }, "compId": 3 }, { "type": "TianFuCell", "props": { "y": 0, "x": 0, "var": "wenhao", "runtime": "ui.test.TianFuCellUI" }, "compId": 4 }], "loadList": [], "loadList3D": [] };
            test.TalentZhuanUI = TalentZhuanUI;
            REG("ui.test.TalentZhuanUI", TalentZhuanUI);
            class talent_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(talent_1UI.uiView);
                }
            }
            talent_1UI.uiView = { "type": "View", "props": { "width": 231, "height": 179 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 19, "x": 18, "skin": "tianfu/pan.png" }, "compId": 27 }, { "type": "Image", "props": { "y": 22, "x": 23, "width": 186, "var": "wenHao", "skin": "tianfu/dang.jpg", "height": 132 }, "compId": 9 }, { "type": "Box", "props": { "y": 2, "x": 21, "width": 200, "visible": false, "var": "infoBox", "height": 164 }, "compId": 26, "child": [{ "type": "Sprite", "props": { "y": 23.5, "x": 6, "var": "icon", "texture": "tianfu/icon1.jpg" }, "compId": 4 }, { "type": "Image", "props": { "y": 120.5, "x": 5, "width": 184, "var": "tiao2", "skin": "juese/juese_tiaoshang.png", "height": 31 }, "compId": 5 }, { "type": "Label", "props": { "y": 57.5, "x": 103, "width": 89, "var": "jinengming", "text": "技能名", "strokeColor": "#351d03", "stroke": 3, "height": 33, "fontSize": 26, "color": "#f3e9e9", "align": "left" }, "compId": 6 }, { "type": "FontClip", "props": { "y": 125.5, "x": 9, "width": 881, "var": "qianshu2", "value": "1299/1300", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "center" }, "compId": 7 }, { "type": "Image", "props": { "y": 24.5, "x": 182, "var": "sheng", "skin": "main/juese_sheng.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }] }, { "type": "Image", "props": { "y": -1, "x": 0, "width": 231, "visible": false, "var": "select", "skin": "tianfu/xuanzhong1.png", "sizeGrid": "57,40,49,42", "height": 179 }, "compId": 28 }], "loadList": ["tianfu/pan.png", "tianfu/dang.jpg", "tianfu/icon1.jpg", "juese/juese_tiaoshang.png", "main/clipshuzi.png", "main/juese_sheng.png", "tianfu/xuanzhong1.png"], "loadList3D": [] };
            test.talent_1UI = talent_1UI;
            REG("ui.test.talent_1UI", talent_1UI);
            class TianFuCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TianFuCellUI.uiView);
                }
            }
            TianFuCellUI.uiView = { "type": "View", "props": { "width": 175, "height": 212 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 13, "x": 12, "var": "bg1", "skin": "tianfu/PTkuang.png" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 28.5, "x": 29, "var": "box2", "texture": "tianfu/touwen.png" }, "compId": 10 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 175, "var": "select", "skin": "tianfu/xuanzhong1.png", "sizeGrid": "50,50,38,47", "height": 212, "blendMode": "lighter" }, "compId": 13 }, { "type": "Box", "props": { "y": 28.5, "x": 29, "width": 117, "var": "box1", "height": 161 }, "compId": 14, "child": [{ "type": "Image", "props": { "var": "logo1", "skin": "tianfu/gongji.png" }, "compId": 9 }, { "type": "Image", "props": { "y": 123, "var": "txtImg", "skin": "tianfu/gongzi.png", "centerX": 0 }, "compId": 11 }, { "type": "FontClip", "props": { "y": 78, "x": 59, "width": 180, "var": "lv", "value": "9", "spaceX": -3, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:vbnd", "scaleY": 0.3, "scaleX": 0.3, "height": 113, "align": "right" }, "compId": 12 }] }], "loadList": ["tianfu/PTkuang.png", "tianfu/touwen.png", "tianfu/xuanzhong1.png", "tianfu/gongji.png", "tianfu/gongzi.png", "main/clipshuzi.png"], "loadList3D": [] };
            test.TianFuCellUI = TianFuCellUI;
            REG("ui.test.TianFuCellUI", TianFuCellUI);
            class tianshiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(tianshiUI.uiView);
                }
            }
            tianshiUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 133.45000000000002, "x": 0, "skin": "bg/tianshiying.png", "scaleY": 1.09, "scaleX": 1.09, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 7, "child": [{ "type": "Image", "props": { "y": -68, "x": -77, "skin": "bg/qipaowen.png", "rotation": -12.15, "anchorY": 0.4, "anchorX": 1 }, "compId": 4 }, { "type": "Image", "props": { "y": -68, "x": 100, "skin": "bg/qipaowen.png", "scaleX": -1, "rotation": 12.15, "anchorY": 0.4, "anchorX": 1 }, "compId": 5 }, { "type": "Image", "props": { "y": -75, "x": -12, "skin": "bg/tianshi.png", "scaleY": 1.3, "scaleX": 1.3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": -228, "x": -115, "var": "tan", "skin": "bg/tantan.jpg", "scaleY": 1.1, "scaleX": 1.1 }, "compId": 8 }] }], "animations": [{ "nodes": [{ "target": 7, "keyframes": { "y": [{ "value": -133.45000000000002, "tweenMethod": "linearNone", "tween": true, "target": 7, "key": "y", "index": 0 }, { "value": -176, "tweenMethod": "linearNone", "tween": true, "target": 7, "key": "y", "index": 20 }, { "value": -133.45000000000002, "tweenMethod": "linearNone", "tween": true, "target": 7, "label": null, "key": "y", "index": 40 }], "x": [{ "value": -8, "tweenMethod": "linearNone", "tween": true, "target": 7, "key": "x", "index": 0 }] } }, { "target": 6, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "y", "index": 0 }], "x": [{ "value": 2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "x", "index": 0 }], "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 40 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 40 }] } }, { "target": 4, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "rotation", "index": 0 }, { "value": -27, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "rotation", "index": 40 }] } }, { "target": 5, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 0 }, { "value": 27, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "bg/qipaowen.png", "bg/tianshi.png", "bg/tantan.jpg"], "loadList3D": [] };
            test.tianshiUI = tianshiUI;
            REG("ui.test.tianshiUI", tianshiUI);
            class worldUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(worldUI.uiView);
                }
            }
            worldUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334, "centerY": 0 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 26 }, { "type": "Box", "props": { "y": 111, "width": 750, "var": "box", "height": 1000 }, "compId": 24 }], "loadList": [], "loadList3D": [] };
            test.worldUI = worldUI;
            REG("ui.test.worldUI", worldUI);
            class worldCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(worldCellUI.uiView);
                }
            }
            worldCellUI.uiView = { "type": "View", "props": { "width": 750, "height": 710 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 27, "x": 176, "skin": "main/changhong.png" }, "compId": 4 }, { "type": "Button", "props": { "y": 204, "x": 31.5, "var": "mapBtn", "stateNum": 1, "skin": "main/erdao.png" }, "compId": 3 }, { "type": "Label", "props": { "y": 108, "x": 248, "width": 245, "var": "cengshuTxt", "text": "最高层数", "height": 36, "fontSize": 36, "color": "#f6ecec", "align": "center" }, "compId": 6 }, { "type": "Sprite", "props": { "y": 35, "x": 304, "var": "titleTxt", "texture": "main/shamolvzhou.png" }, "compId": 7 }, { "type": "Sprite", "props": { "y": 372.5, "x": 334.5, "var": "suo", "texture": "main/suo2.png" }, "compId": 8 }, { "type": "Box", "props": { "y": 702, "x": 5, "width": 739 }, "compId": 27, "child": [{ "type": "Sprite", "props": { "texture": "main/xuxian.png" }, "compId": 10 }, { "type": "Sprite", "props": { "x": 50, "texture": "main/xuxian.png" }, "compId": 12 }, { "type": "Sprite", "props": { "x": 100, "texture": "main/xuxian.png" }, "compId": 13 }, { "type": "Sprite", "props": { "x": 150, "texture": "main/xuxian.png" }, "compId": 14 }, { "type": "Sprite", "props": { "x": 200, "texture": "main/xuxian.png" }, "compId": 15 }, { "type": "Sprite", "props": { "x": 250, "texture": "main/xuxian.png" }, "compId": 16 }, { "type": "Sprite", "props": { "x": 300, "texture": "main/xuxian.png" }, "compId": 17 }, { "type": "Sprite", "props": { "x": 350, "texture": "main/xuxian.png" }, "compId": 18 }, { "type": "Sprite", "props": { "x": 400, "texture": "main/xuxian.png" }, "compId": 19 }, { "type": "Sprite", "props": { "x": 450, "texture": "main/xuxian.png" }, "compId": 20 }, { "type": "Sprite", "props": { "x": 500, "texture": "main/xuxian.png" }, "compId": 21 }, { "type": "Sprite", "props": { "x": 550, "texture": "main/xuxian.png" }, "compId": 22 }, { "type": "Sprite", "props": { "x": 600, "texture": "main/xuxian.png" }, "compId": 23 }, { "type": "Sprite", "props": { "x": 650, "texture": "main/xuxian.png" }, "compId": 24 }, { "type": "Sprite", "props": { "x": 700, "texture": "main/xuxian.png" }, "compId": 28 }] }], "loadList": ["main/changhong.png", "main/erdao.png", "main/shamolvzhou.png", "main/suo2.png", "main/xuxian.png"], "loadList3D": [] };
            test.worldCellUI = worldCellUI;
            REG("ui.test.worldCellUI", worldCellUI);
            class xiaodaoUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(xiaodaoUI.uiView);
                }
            }
            xiaodaoUI.uiView = { "type": "Scene", "props": { "width": 684, "height": 531 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "dao", "skin": "main/erdao.png" }, "compId": 3 }], "loadList": ["main/erdao.png"], "loadList3D": [] };
            test.xiaodaoUI = xiaodaoUI;
            REG("ui.test.xiaodaoUI", xiaodaoUI);
            class xiongmaoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(xiongmaoUI.uiView);
                }
            }
            xiongmaoUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 125, "x": 17, "width": 120, "texture": "bg/tianshiying.png", "height": 58 }, "compId": 4 }, { "type": "Image", "props": { "y": 2.6666666666666665, "x": -1, "skin": "xiongmao/5.png" }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -0.25, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 3 }, { "value": -0.16666666666666674, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 6 }, { "value": 0.4166666666666665, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 9 }, { "value": 0.2777777777777777, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 10 }, { "value": 0.6388888888888888, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 11 }, { "value": 3, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 12 }, { "value": 2.3333333333333335, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 13 }, { "value": 2.6666666666666665, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 14 }, { "value": -5, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 15 }, { "value": -4.666666666666667, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 16 }, { "value": -4.833333333333334, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 17 }, { "value": -7, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 18 }, { "value": -8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 21 }, { "value": -7.5, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 24 }, { "value": -7.333333333333334, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 25 }, { "value": -7.166666666666667, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 26 }, { "value": -1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 27 }], "x": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 0 }, { "value": 0.33333333333333326, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 1 }, { "value": 1.166666666666667, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 2 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 3 }, { "value": 3.333333333333333, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 6 }, { "value": 3.166666666666666, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 9 }, { "value": 2.7777777777777777, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 10 }, { "value": 2.888888888888889, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 11 }, { "value": -1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 12 }], "skin": [{ "value": "xiongmao/1.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 0 }, { "value": "xiongmao/2.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 3 }, { "value": "xiongmao/3.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 6 }, { "value": "xiongmao/4.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 9 }, { "value": "xiongmao/5.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 12 }, { "value": "xiongmao/6.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 15 }, { "value": "xiongmao/7.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 18 }, { "value": "xiongmao/8.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 21 }, { "value": "xiongmao/9.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 24 }, { "value": "xiongmao/10.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 27 }, { "value": "xiongmao/11.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 30 }, { "value": "xiongmao/12.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 33 }, { "value": "xiongmao/13.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 36 }, { "value": "xiongmao/14.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 39 }, { "value": "xiongmao/15.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 42 }, { "value": "xiongmao/16.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 45 }, { "value": "xiongmao/17.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 48 }, { "value": "xiongmao/18.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 51 }, { "value": "xiongmao/19.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 54 }, { "value": "xiongmao/20.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 57 }, { "value": "xiongmao/21.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 60 }, { "value": "xiongmao/22.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 63 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "xiongmao/5.png", "xiongmao/1.png", "xiongmao/2.png", "xiongmao/3.png", "xiongmao/4.png", "xiongmao/6.png", "xiongmao/7.png", "xiongmao/8.png", "xiongmao/9.png", "xiongmao/10.png", "xiongmao/11.png", "xiongmao/12.png", "xiongmao/13.png", "xiongmao/14.png", "xiongmao/15.png", "xiongmao/16.png", "xiongmao/17.png", "xiongmao/18.png", "xiongmao/19.png", "xiongmao/20.png", "xiongmao/21.png", "xiongmao/22.png"], "loadList3D": [] };
            test.xiongmaoUI = xiongmaoUI;
            REG("ui.test.xiongmaoUI", xiongmaoUI);
            class xiongmao1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(xiongmao1UI.uiView);
                }
            }
            xiongmao1UI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": -33.5, "x": -72, "texture": "bg/tianshiying.png" }, "compId": 5 }, { "type": "Sprite", "props": { "y": -161, "x": -72, "texture": "bg/xiongmao.png" }, "compId": 4 }], "loadList": ["bg/tianshiying.png", "bg/xiongmao.png"], "loadList3D": [] };
            test.xiongmao1UI = xiongmao1UI;
            REG("ui.test.xiongmao1UI", xiongmao1UI);
            class zhaohuanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(zhaohuanUI.uiView);
                }
            }
            zhaohuanUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "zhaohuan/yuandi.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": 8, "x": 0, "skin": "zhaohuan/yun.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 17, "x": -2, "skin": "zhaohuan/guangzhu.png", "anchorY": 1, "anchorX": 0.5 }, "compId": 5 }], "animations": [{ "nodes": [{ "target": 5, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 0 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 5 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 15 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "scaleY", "index": 18 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleX", "index": 0 }, { "value": 0.2, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleX", "index": 5 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleX", "index": 15 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "scaleX", "index": 18 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 15 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "alpha", "index": 18 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 24 }] } }, { "target": 4, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 0 }, { "value": 1.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 29 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 0 }, { "value": 1.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 29 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 8 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "alpha", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 25 }] } }, { "target": 3, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 15 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 15 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 8 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 22 }] } }], "name": "ani1", "id": 1, "frameRate": 60, "action": 1 }], "loadList": ["zhaohuan/yuandi.png", "zhaohuan/yun.png", "zhaohuan/guangzhu.png"], "loadList3D": [] };
            test.zhaohuanUI = zhaohuanUI;
            REG("ui.test.zhaohuanUI", zhaohuanUI);
            class zhuanpanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(zhuanpanUI.uiView);
                }
            }
            zhuanpanUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "alpha": 0.6 }, "compId": 21, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 1700, "fillColor": "#000000" }, "compId": 22 }] }, { "type": "Box", "props": { "x": 12, "centerY": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "width": 726, "skin": "main/biaotihuang.png", "sizeGrid": "0,23,0,135", "height": 99 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 32, "x": 279, "texture": "bg/xingyunda.png" }, "compId": 8 }, { "type": "Image", "props": { "y": 497, "x": 354, "var": "pan", "skin": "bg/zhuanpan2.png", "rotation": 31, "anchorY": 0.49, "anchorX": 0.505 }, "compId": 9 }, { "type": "Image", "props": { "y": 269, "x": 353, "var": "zhen", "skin": "bg/zhen.png", "rotation": 0, "anchorY": 0.4, "anchorX": 0.5 }, "compId": 10 }, { "type": "Button", "props": { "y": 1035, "x": 357, "width": 296, "var": "btn_kaishi", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 43, "x": 98, "skin": "main/kaishi.png" }, "compId": 13 }] }, { "type": "Image", "props": { "y": 550, "x": 249, "var": "pan4", "skin": "bg/zhuan_baoji.png", "rotation": -122, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 14 }, { "type": "Image", "props": { "y": 385, "x": 353, "var": "pan0", "skin": "bg/zhuan_qiansan.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15 }, { "type": "Image", "props": { "y": 438, "x": 460, "var": "pan1", "skin": "bg/zhuan_qianer.png", "rotation": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 16 }, { "type": "Image", "props": { "y": 438, "x": 249, "var": "pan5", "skin": "bg/zhuan_qianyi.png", "rotation": -60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 17 }, { "type": "Image", "props": { "y": 609, "x": 353, "var": "pan3", "skin": "bg/zhuan_xixue.png", "rotation": 180, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18 }, { "type": "Image", "props": { "y": 556, "x": 458, "var": "pan2", "skin": "bg/zhuan_jiaxue.png", "rotation": 120, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 19 }] }], "loadList": ["main/biaotihuang.png", "bg/xingyunda.png", "bg/zhuanpan2.png", "bg/zhen.png", "main/btn_huang.png", "main/kaishi.png", "bg/zhuan_baoji.png", "bg/zhuan_qiansan.png", "bg/zhuan_qianer.png", "bg/zhuan_qianyi.png", "bg/zhuan_xixue.png", "bg/zhuan_jiaxue.png"], "loadList3D": [] };
            test.zhuanpanUI = zhuanpanUI;
            REG("ui.test.zhuanpanUI", zhuanpanUI);
            class ZongjuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ZongjuUI.uiView);
                }
            }
            ZongjuUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Clip", "props": { "y": 0, "x": 0, "var": "shudianju", "skin": "bg/clip_dianjushu.png", "scaleY": 1.2, "scaleX": 1.2, "clipY": 3, "clipX": 3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Clip", "props": { "y": -107, "x": 12, "width": 58, "var": "shuhuoxing", "skin": "bg/clip_huoxing.png", "rotation": 62, "height": 48, "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 4 }], "loadList": ["bg/clip_dianjushu.png", "bg/clip_huoxing.png"], "loadList3D": [] };
            test.ZongjuUI = ZongjuUI;
            REG("ui.test.ZongjuUI", ZongjuUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameShaderObj extends Laya.EventDispatcher {
        constructor() {
            super();
            if (GameShaderObj.init_) {
                this.initShader();
                GameShaderObj.init_ = true;
            }
        }
        setShader0(sp3d, type) {
            if (type == 8000 && !GameShaderObj.sp) {
                GameShaderObj.sp = sp3d;
                console.log(sp3d);
            }
        }
        initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
                'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
            };
            var uniformMap = {
                'u_Bones': Laya.Shader3D.PERIOD_CUSTOM,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_texture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_marginalColor': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE,
                'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
            };
            var vs = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        varying vec2 v_Texcoord;
        varying vec3 v_Normal;
        #ifdef BONE
        attribute vec4 a_BoneIndices;
        attribute vec4 a_BoneWeights;
        const int c_MaxBoneCount = 24;
        uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        #if defined(DIRECTIONLIGHT)
        varying vec3 v_PositionWorld;
        #endif
        void main()
        {
        #ifdef BONE
        mat4 skinTransform=mat4(0.0);
        skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        vec4 position = skinTransform * a_Position;
        gl_Position=u_MvpMatrix * position;
        mat3 worldMat=mat3(u_WorldMat * skinTransform);
        #else
        gl_Position=u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        #endif
        v_Texcoord=a_Texcoord;
        v_Normal=worldMat*a_Normal;
        #if defined(DIRECTIONLIGHT)
        #ifdef BONE
        v_PositionWorld=(u_WorldMat*position).xyz;
        #else
        v_PositionWorld=(u_WorldMat*a_Position).xyz;
        #endif
        #endif
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
            var ps = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        #include "Lighting.glsl";
        varying vec2 v_Texcoord;
        uniform sampler2D u_texture;
        uniform vec3 u_marginalColor;
        varying vec3 v_Normal;
        #if defined(DIRECTIONLIGHT)
        uniform vec3 u_CameraPos;
        varying vec3 v_PositionWorld;
        uniform DirectionLight u_DirectionLight;
        #endif
        void main()
        {
        gl_FragColor=texture2D(u_texture,v_Texcoord);
        vec3 normal=normalize(v_Normal);
        vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);
        float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));
        vec3 Emissive = 15.0 * u_DirectionLight.Color * u_marginalColor * pow(Rim,3.0); 
        gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);
        }`;
            var customShader = Laya.Shader3D.add("CustomShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap, Laya.SkinnedMeshSprite3D.shaderDefines);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }
    GameShaderObj.init_ = true;

    class CustomMaterial extends Laya.BaseMaterial {
        constructor() {
            super();
            this._addReference(3);
            this.setShaderName("CustomShader");
        }
        get diffuseTexture() {
            return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
        }
        set diffuseTexture(value) {
            this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE, value);
        }
        set marginalColor(value) {
            this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR, value);
        }
    }
    CustomMaterial.DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
    CustomMaterial.MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");

    class MonsterShader extends GameShaderObj {
        constructor(sp) {
            super();
            this.spArr = [];
            this.cpArr = [];
            this.sp = sp;
            for (let i = 0; i < 1; i++) {
                if (sp.getChildAt(i) instanceof Laya.Sprite3D) {
                    var ssp = sp.getChildAt(i);
                    for (let j = 0; j < ssp._children.length; j++) {
                        if (ssp._children[j] instanceof Laya.SkinnedMeshSprite3D) {
                            var sm = ssp._children[j];
                            if (!this.spArr[i]) {
                                this.spArr[i] = [];
                                this.cpArr[i] = [];
                            }
                            this.spArr[i][j] = sm.skinnedMeshRenderer.sharedMaterials;
                            this.cpArr[i][j] = sm.skinnedMeshRenderer.sharedMaterials;
                            this.initShander(i, j);
                        }
                    }
                }
            }
        }
        initShander(i, j) {
            var sms = this.spArr[i][j];
            var cms = [];
            this.cpArr[i][j] = cms;
            for (let k = 0; k < sms.length; k++) {
                var bm = sms[k];
                let cm = new CustomMaterial();
                cms.push(cm);
                var bdata = bm._shaderValues.getData();
                var tx;
                for (let key in bdata) {
                    var data = bdata[key];
                    if (data instanceof Laya.Texture2D) {
                        tx = data;
                        cm.diffuseTexture = tx;
                    }
                }
                cm.marginalColor = new Laya.Vector3(1, 1, 1);
            }
        }
        clearShader() {
            if (!this.sp) {
                return;
            }
            for (let i = 0; i < 1; i++) {
                if (this.sp.getChildAt(i) instanceof Laya.Sprite3D) {
                    var ssp = this.sp.getChildAt(i);
                    for (let j = 0; j < ssp._children.length; j++) {
                        if (ssp._children[j] instanceof Laya.SkinnedMeshSprite3D) {
                            var sm = ssp._children[j];
                            var sms = sm.skinnedMeshRenderer.sharedMaterials;
                            for (let k = 0; k < sms.length; k++) {
                                let cm = sms[k];
                                var bdata = cm._shaderValues.getData();
                                for (let key in bdata) {
                                    var data = bdata[key];
                                    if (data instanceof Laya.Texture2D) {
                                        data && data.destroy();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.cpArr.length = this.spArr.length = 0;
        }
        setShader0(sp, k) {
            for (let i = 0; i < 1; i++) {
                if (sp.getChildAt(i) instanceof Laya.Sprite3D) {
                    var ssp = sp.getChildAt(i);
                    for (let j = 0; j < ssp._children.length; j++) {
                        if (ssp._children[j] instanceof Laya.SkinnedMeshSprite3D) {
                            var sm = ssp._children[j];
                            if (k == 0) {
                                sm.skinnedMeshRenderer.sharedMaterials = this.spArr[i][j];
                            }
                            else {
                                sm.skinnedMeshRenderer.sharedMaterials = this.cpArr[i][j];
                            }
                        }
                    }
                }
            }
        }
    }
    MonsterShader.map = {};

    var Point = Laya.Point;
    class MaoLineTest {
        static intersectionP(u1, u2, v1, v2) {
            var ret = new Point(u1.x, u1.y);
            var t = ((u1.x - v1.x) * (v1.y - v2.y) - (u1.y - v1.y) * (v1.x - v2.x)) / ((u1.x - u2.x) * (v1.y - v2.y) - (u1.y - u2.y) * (v1.x - v2.x));
            ret.x += (u2.x - u1.x) * t;
            ret.y += (u2.y - u1.y) * t;
            return ret;
        }
        static intersectionMao(u, v) {
            return MaoLineTest.intersectionP(u.p0, u.p1, v.p0, v.p1);
        }
        static simpleLineTestXY(l1p1x, l1p1y, l1p2x, l1p2y, l2p1x, l2p1y, l2p2x, l2p2y, u, v) {
            var line1p1;
            line1p1 = (l1p2x - l1p1x) * (l2p1y - l1p1y) - (l2p1x - l1p1x) * (l1p2y - l1p1y);
            var line1p2;
            line1p2 = (l1p2x - l1p1x) * (l2p2y - l1p1y) - (l2p2x - l1p1x) * (l1p2y - l1p1y);
            var line2p1;
            line2p1 = (l2p2x - l2p1x) * (l1p1y - l2p1y) - (l1p1x - l2p1x) * (l2p2y - l2p1y);
            var line2p2;
            line2p2 = (l2p2x - l2p1x) * (l1p2y - l2p1y) - (l1p2x - l2p1x) * (l2p2y - l2p1y);
            if ((line1p1 * line1p2 <= 0) && (line2p1 * line2p2 <= 0)) {
                return MaoLineTest.intersectionMao(u, v);
            }
            else {
                return null;
            }
        }
        static simpleLineTestMao(u, v) {
            return MaoLineTest.simpleLineTestXY(u.p0.x, u.p0.y, u.p1.x, u.p1.y, v.p0.x, v.p0.y, v.p1.x, v.p1.y, u, v);
        }
    }

    var Point$1 = Laya.Point;
    class MaoLineData {
        constructor(x0, y0, x1, y1) {
            this.p0_ = new Point$1();
            this.p1_ = new Point$1();
            this.p0_.x = x0;
            this.p0_.y = y0;
            this.p1_.x = x1;
            this.p1_.y = y1;
        }
        reset(x0, y0, x1, y1) {
            this.p0_.x = x0;
            this.p0_.y = y0;
            this.p1_.x = x1;
            this.p1_.y = y1;
        }
        reset00(x0, y0) {
            var l = this.getlen();
            var rad = this.atan2();
            this.p0_.x = x0;
            this.p0_.y = y0;
            this.p1_.x = x0 + Math.cos(rad) * l;
            this.p1_.y = y0 + Math.sin(rad) * l;
        }
        resetlen(len) {
            var l = len;
            var rad = this.atan2();
            this.p1_.x = this.p0_.x + Math.cos(rad) * l;
            this.p1_.y = this.p0_.y + Math.sin(rad) * l;
        }
        draw(g, linecolor, lw = 1) {
            g.drawLine(this.p0_.x, this.p0_.y, this.p1_.x, this.p1_.y, linecolor, lw);
        }
        get p0() {
            return this.p0_;
        }
        get p1() {
            return this.p1_;
        }
        set x0(value) {
            this.p0_.x = value;
        }
        get x0() {
            return this.p0_.x;
        }
        set y0(value) {
            this.p0_.y = value;
        }
        get y0() {
            return this.p0_.y;
        }
        set x1(value) {
            this.p1_.x = value;
        }
        get x1() {
            return this.p1_.x;
        }
        set y1(value) {
            this.p1_.y = value;
        }
        get y1() {
            return this.p1_.y;
        }
        get x_len() {
            return (this.x1 - this.x0);
        }
        get y_len() {
            return (this.y1 - this.y0);
        }
        getlen() {
            var xl = this.x_len;
            var yl = this.y_len;
            return Math.sqrt((xl * xl) + (yl * yl));
        }
        getF0() {
            var xl = this.x_len;
            var yl = this.y_len;
            return new MaoLineData(this.x0, this.y0, this.x0 - yl, this.y0 + xl);
        }
        getF1() {
            var xl = this.x_len;
            var yl = this.y_len;
            return new MaoLineData(this.x0, this.y0, this.x0 + yl, this.y0 - xl);
        }
        lineTest(other) {
            return MaoLineTest.simpleLineTestMao(this, other);
        }
        atan2() {
            return Math.atan2((this.y1 - this.y0), (this.x1 - this.x0));
        }
        rad(rad) {
            var len = this.getlen();
            this.p1.x = this.p0.x + (len * Math.cos(rad));
            this.p1.y = this.p0.y + (len * Math.sin(rad));
            return rad;
        }
        getCenter() {
            var rad = this.atan2();
            var len = this.getlen() / 2;
            return new Laya.Point(this.p0.x + (len * Math.cos(rad)), this.p0.y + (len * Math.sin(rad)));
        }
        rebound(line0) {
            var line0 = line0;
            var linev = this;
            var p = linev.lineTest(line0);
            if (!p) {
                return null;
            }
            var f0 = line0.getF0();
            var f = f0;
            var lengthN = Math.sqrt(f.x_len * f.x_len + f.y_len * f.y_len);
            var n0x = f.x_len / lengthN;
            var n0y = f.y_len / lengthN;
            var nx = -(linev.x_len * n0x + linev.y_len * n0y) * n0x;
            var ny = -(linev.x_len * n0x + linev.y_len * n0y) * n0y;
            var Tx = linev.x_len + nx;
            var Ty = linev.y_len + ny;
            var Fx = 2 * Tx - linev.x_len;
            var Fy = 2 * Ty - linev.y_len;
            var nv = new MaoLineData(p.x, p.y, p.x + Fx, p.y + Fy);
            return nv;
        }
        rebound_error(line0) {
            var linev = this;
            var p = linev.lineTest(line0);
            if (!p) {
                return null;
            }
            var v = new MaoLineData(linev.x0, linev.y0, p.x, p.y);
            var f0l = line0.getlen();
            var n0x = line0.x_len / f0l;
            var n0y = line0.y_len / f0l;
            var nx = -(v.x_len * n0x + v.y_len * n0y) * n0x;
            var ny = -(v.x_len * n0x + v.y_len * n0y) * n0y;
            var Tx = v.x_len + nx;
            var Ty = v.y_len + ny;
            var Fx = 2 * Tx - v.x_len;
            var Fy = 2 * Ty - v.y_len;
            v.reset(p.x, p.y, p.x + Fx, p.y + Fy);
            return v;
        }
        static len(x0, y0, x1, y1) {
            var xx = x1 - x0;
            var yy = y1 - y0;
            return Math.sqrt(xx * xx + yy * yy);
        }
    }

    class GameHitBox {
        constructor(ww, hh) {
            this.x_ = 0;
            this.y_ = 0;
            this.ww_ = 2;
            this.hh_ = 2;
            this.cx_ = 1;
            this.cy_ = 1;
            this.h2_ = 1;
            this.w2_ = 1;
            this.top_ = 0;
            this.left_ = 0;
            this.right_ = 0;
            this.bottom_ = 0;
            this.value = -1;
            this.cdTime = 0;
            this.ww_ = ww;
            this.hh_ = hh;
            this.h2_ = this.hh_ / 2;
            this.w2_ = this.ww_ / 2;
            this.setXY(0, 0);
        }
        setVV(x0, y0, vx, vy) {
            var ax = Math.abs(vx);
            var ay = Math.abs(vy);
            if (ax > 0 && ay > 0) {
                this.ww_ = ax;
                this.hh_ = ay;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(Math.min(x0, x0 + vx), Math.min(y0, y0 + vy));
            }
            else if (ax == 0 && ay > 0) {
                this.ww_ = 2;
                this.hh_ = ay;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(x0 - 1, Math.min(y0, y0 + vy));
            }
            else if (ax > 0 && ay == 0) {
                this.ww_ = ax;
                this.hh_ = 2;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(Math.min(x0, x0 + vx), y0 - 1);
            }
            else {
                this.ww_ = 2;
                this.hh_ = 2;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(x0 - 1, y0 - 1);
            }
            return this;
        }
        get ww() {
            return this.ww_;
        }
        get hh() {
            return this.hh_;
        }
        setXY(xx, yy) {
            this.x_ = xx;
            this.y_ = yy;
            this.cx_ = this.x_ + this.w2_;
            this.cy_ = this.y_ + this.h2_;
            this.update();
        }
        setCenter(xx, yy) {
            this.cx_ = xx;
            this.cy_ = yy;
            this.x_ = this.cx_ - this.w2_;
            this.y_ = this.cy_ - this.h2_;
            this.update();
        }
        setRq(x, y, ww, hh) {
            this.ww_ = ww;
            this.hh_ = hh;
            this.h2_ = this.hh_ / 2;
            this.w2_ = this.ww_ / 2;
            this.setXY(x, y);
            return this;
        }
        update() {
            this.top_ = this.y_;
            this.left_ = this.x_;
            this.bottom_ = this.y_ + this.hh_;
            this.right_ = this.x_ + this.ww_;
        }
        get cx() {
            return this.cx_;
        }
        get cy() {
            return this.cy_;
        }
        get x() {
            return this.x_;
        }
        get y() {
            return this.y_;
        }
        get top() {
            return this.top_;
        }
        get bottom() {
            return this.bottom_;
        }
        get left() {
            return this.left_;
        }
        get right() {
            return this.right_;
        }
        hit(b0, b1) {
            return b0.x < b1.right &&
                b0.right > b1.x &&
                b0.y < b1.bottom &&
                b0.bottom > b1.y;
        }
        static faceTo(my, target) {
            var xx = target.cx - my.cx;
            var yy = target.cy - my.cy;
            return Math.atan2(yy, xx);
        }
        static faceTo3D(my, target) {
            var xx = target.cx - my.cx;
            var yy = my.cy - target.cy;
            return Math.atan2(yy, xx);
        }
        static faceToLenth(my, target) {
            var vx = my.x - target.x;
            var vy = my.y - target.y;
            return Math.sqrt(vx * vx + vy * vy);
        }
        getLeft(l_ = null) {
            return this.getLine(this.left, this.top, this.left, this.bottom, l_);
        }
        getRight(l_ = null) {
            return this.getLine(this.right, this.top, this.right, this.bottom, l_);
        }
        getTop(l_ = null) {
            return this.getLine(this.left, this.top, this.right, this.top, l_);
        }
        getBottom(l_ = null) {
            return this.getLine(this.left, this.bottom, this.right, this.bottom, l_);
        }
        getLine(x0, y0, x1, y1, l_) {
            var l = l_;
            if (!l) {
                l = new MaoLineData(x0, y0, x1, y1);
            }
            else {
                l.reset(x0, y0, x1, y1);
            }
            return l;
        }
    }

    class GameData {
        constructor() {
            this._bounce = 0;
            this.proType_ = 0;
            this.damage = 10;
            this.ammoClip = -1;
            this.attackCD = 1000;
            this.rspeed = 20;
        }
        set bounce(v) {
            this._bounce = v;
        }
        get bounce() {
            return this._bounce;
        }
        set proType(pt) {
            this.proType_ = pt;
            if (this.proType_ <= 800) {
                this.rspeed = 0;
            }
            else {
                this.rspeed = 20;
            }
        }
        get proType() {
            return this.proType_;
        }
    }

    class FootCircle extends ui.test.HeroFootUI {
        constructor() { super(); }
    }

    class GameProType {
    }
    GameProType.Hero = 9999;
    GameProType.RockGolem_Blue = 8000;
    GameProType.Rock = 801;
    GameProType.HeroArrow = 799;
    GameProType.MonstorArrow = 798;

    class HeroBlood extends ui.test.BloodUIUI {
        constructor() {
            super();
            this._rect = new Laya.Rectangle();
            this.shape = new Laya.Sprite();
            this.shape.y = this.bar.y + 2;
        }
        init(data) {
            this.gameData = data;
            this._rect.x = 0;
            this._rect.y = 0;
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this._rect.height = 17;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
            this.colBox.removeChildren();
            var size = this.gameData.maxhp / 200;
            var ww = this.width / size;
            for (var i = 1; i < size; i++) {
                var gang = new Laya.Image();
                gang.skin = "bg/xuetiaogang.png";
                this.colBox.addChild(gang);
                gang.y = 2;
                gang.x = ww * i;
            }
        }
        update(hurt) {
            this.gameData.hp -= hurt;
            this.gameData.hp = Math.max(this.gameData.hp, 0);
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
            Laya.Tween.clearTween(this.shape);
            this.shape.graphics.clear();
            this.shape.graphics.drawRect(0, 0, hurt / this.gameData.maxhp * this.width, 13, "#ffffff");
            this.addChild(this.shape);
            this.shape.x = this._rect.width;
            Laya.Tween.to(this.shape, { width: 0 }, 300, null, new Laya.Handler(this, this.onCom));
            if (this.gameData.hp == 0) {
                this.removeSelf();
            }
        }
        onCom() {
            this.shape.removeSelf();
        }
    }

    class MonsterBlood extends ui.test.Blood2UIUI {
        constructor() {
            super();
            this._rect = new Laya.Rectangle();
            this.shape = new Laya.Sprite();
            this.shape.y = this.bar.y + 2;
            this.txt.visible = false;
        }
        init(data) {
            this.gameData = data;
            this._rect.x = 0;
            this._rect.y = 0;
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this._rect.height = 17;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
        }
        update(hurt) {
            this.gameData.hp -= hurt;
            this.gameData.hp = Math.max(this.gameData.hp, 0);
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
            Laya.Tween.clearTween(this.shape);
            this.shape.graphics.clear();
            this.shape.graphics.drawRect(0, 0, hurt / this.gameData.maxhp * this.width, 13, "#ffffff");
            this.addChild(this.shape);
            this.shape.x = this._rect.width;
            Laya.Tween.to(this.shape, { width: 0 }, 300, null, new Laya.Handler(this, this.onCom));
            if (this.gameData.hp == 0) {
                this.removeSelf();
            }
        }
        onCom() {
            this.shape.removeSelf();
        }
    }

    class Blood extends Laya.Sprite {
        constructor() {
            super();
            this.bloodCount = 0;
        }
        init(data) {
            this._data = data;
            if (this._data.proType == GameProType.Hero) {
                if (!this.ui) {
                    this.ui = new HeroBlood();
                }
                this.ui.init(this._data);
                this.addChild(this.ui);
            }
            else if (this._data.proType == GameProType.RockGolem_Blue) {
                if (!this.ui2) {
                    this.ui2 = new MonsterBlood();
                }
                this.ui2.init(this._data);
                this.addChild(this.ui2);
            }
        }
        update(hurt) {
            if (this._data.proType == GameProType.Hero) {
                this.ui.update(hurt);
            }
            else if (this._data.proType == GameProType.RockGolem_Blue) {
                this.ui2.update(hurt);
            }
        }
    }

    class GameAI {
        constructor() {
            this.run_ = false;
        }
        die() { }
        ;
    }
    GameAI.closeCombat = "Attack1";
    GameAI.NormalAttack = "Attack";
    GameAI.Idle = "Idle";
    GameAI.Die = "Die";
    GameAI.Run = "Run";
    GameAI.TakeDamage = "TakeDamage";
    GameAI.SkillStart = "SkillStart";
    GameAI.SkillLoop = "SkillLoop";
    GameAI.SkillEnd = "SkillEnd";

    class BitmapNumber extends Laya.FontClip {
        constructor() {
            super();
        }
        update(skin, sheet, tScale) {
            this.skin = skin;
            this.sheet = sheet;
            this.scale(tScale, tScale);
            this.anchorX = this.anchorY = 0.5;
        }
        static getFontClip(tScale = 1, skin = "main/clipshuzi.png", sheet) {
            let bn = Laya.Pool.getItemByClass(BitmapNumber.TAG, BitmapNumber);
            bn.update(skin, sheet ? sheet : "123456 7890-+ /:cdef", tScale ? tScale : 1);
            return bn;
        }
        recover() {
            this.removeSelf();
            Laya.Pool.recover(BitmapNumber.TAG, this);
        }
    }
    BitmapNumber.TAG = "BitmapNumber";

    class BloodEffect {
        constructor() { }
        static add(value, sprite, isCrit, skin) {
            let bitNum = BitmapNumber.getFontClip(0.05, skin);
            if (isCrit) {
                Game.shakeBattle();
            }
            bitNum.value = value;
            let xx = -GameBG.ww2 + Math.random() * GameBG.ww;
            let yy = Math.random() * GameBG.ww;
            sprite.addChild(bitNum);
            bitNum.pos(xx, yy);
            sprite.bloodCount++;
            Laya.Tween.to(bitNum, { y: yy - 50, scaleX: 0.2, scaleY: 0.2 }, 200, Laya.Ease.circOut);
            setTimeout(() => {
                bitNum.recover();
            }, 400);
        }
    }

    class GamePro extends Laya.EventDispatcher {
        constructor(proType_, hp = 600) {
            super();
            this.buffAry = [];
            this.tScale = 1;
            this.isIce = false;
            this.unBlocking = false;
            this.hurtValue = 0;
            this.speed_ = 6;
            this._pos2 = new Laya.Vector3(0, 0, 0);
            this.moven2d_ = 0;
            this.facen2d_ = 0;
            this.facen3d_ = 0;
            this.acstr_ = "";
            this.rotationEulerY = 0;
            this.keyNum = -1;
            this.gamedata_ = new GameData();
            this.gamedata_.hp = this.gamedata_.maxhp = hp;
            this.gamedata_.proType = proType_;
            this.rotationEulerY = 0;
        }
        checkBlackList(ee) {
            if (this.hit_blacklist) {
                let arr = this.hit_blacklist;
                for (let i = 0; i < arr.length; i++) {
                    let e = arr[i];
                    if (e == ee) {
                        return true;
                    }
                }
            }
            return false;
        }
        setShadowSize(ww) {
            this._bulletShadow && this._bulletShadow.img.size(ww, ww);
        }
        removeShodow() {
            this._bulletShadow && this._bulletShadow.removeSelf();
        }
        get bloodUI() {
            return this._bloodUI;
        }
        setKeyNum(n) {
            this.keyNum = n;
        }
        initBlood(hp, maxhp) {
            this.gamedata.hp = hp;
            this.gamedata.maxhp = maxhp;
            if (!this._bloodUI) {
                this._bloodUI = new Blood();
            }
            this._bloodUI.init(this.gamedata_);
            Game.bloodLayer.addChild(this._bloodUI);
            this._bloodUI && this._bloodUI.pos(this.hbox_.cx, this.hbox_.cy - 120);
        }
        addFootCircle() {
            if (!this._footCircle) {
                this._footCircle = new FootCircle();
            }
            Game.footLayer.addChild(this._footCircle);
            this._footCircle && this._footCircle.pos(this.hbox_.cx, this.hbox_.cy);
        }
        hurt(hurt, isCrit) {
            this._bloodUI && this._bloodUI.update(hurt);
            if (hurt > 0) {
                BloodEffect.add("-" + hurt, this._bloodUI, isCrit, isCrit ? "main/redFont.png" : "main/clipshuzi.png");
            }
        }
        die() {
            this.play(GameAI.Die);
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
                Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
            }
        }
        setSp3d(sp, ww) {
            this.sp3d_ = sp;
            this.sp3d_.transform.localRotationEulerY = this.rotationEulerY = 0;
            this.hbox_ = new GameHitBox(ww ? ww : GameBG.mw, ww ? ww : GameBG.mw);
            this.hbox_.linkPro_ = this;
            this.hbox_.setCenter(GameBG.mcx, GameBG.mcy);
            let aniSprite3d = sp.getChildAt(0);
            if (aniSprite3d) {
                this.ani_ = aniSprite3d.getComponent(Laya.Animator);
            }
            this.on(Game.Event_Hit, this, this.hit);
        }
        get animator() {
            return this.ani_;
        }
        addSprite3DToChild(childName, sprite3d) {
            var ss = this.sp3d.getChildAt(0).getChildByName(childName);
            return ss.addChild(sprite3d);
        }
        addWeapon() {
            this.weapon = Laya.loader.getRes("h5/gong/hero.lh");
            this.addSprite3DToAvatarNode("joint14", this.weapon);
        }
        addSprite3DToAvatarNode(nodeName, sprite3d) {
            var bool = this.ani_.linkSprite3DToAvatarNode(nodeName, sprite3d);
        }
        removeSprite3DToAvatarNode(s3d) {
            this.ani_ && this.ani_.unLinkSprite3DToAvatarNode(s3d);
        }
        hit(pro, isBuff = false) {
            if (this.gameAI) {
                this.gameAI.hit(pro, isBuff);
            }
        }
        closeCombat(pro) {
        }
        get acstr() {
            return this.acstr_;
        }
        set acstr(s) {
            this.acstr_ = s;
        }
        get face2d() {
            return this.facen2d_;
        }
        get face3d() {
            return this.facen3d_;
        }
        get speed() {
            return this.speed_;
        }
        setSpeed(speed) {
            this.speed_ = speed;
        }
        setGameMove(gamemove) {
            this.movef = gamemove;
        }
        getGameMove() {
            return this.movef;
        }
        setGameAi(gameAI) {
            this.gameAI = gameAI;
            return this.gameAI;
        }
        getGameAi() {
            return this.gameAI;
        }
        get hbox() {
            if (!this.hbox_) {
                this.hbox_ = new GameHitBox(GameBG.mw, GameBG.mw);
                this.hbox_.setXY(GameBG.mcx, GameBG.mcy);
            }
            return this.hbox_;
        }
        get sp2d() {
            if (!this.sp2d_) {
                this.sp2d_ = new Laya.Sprite();
                this.sp2d_.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, null, 0xfff000);
                this.sp2d_.x = this.hbox.x;
                this.sp2d_.y = this.hbox.y;
            }
            return this.sp2d_;
        }
        get sp3d() {
            return this.sp3d_;
        }
        play(actionstr) {
            if (this.acstr == GameAI.Die) {
                return;
            }
            this.acstr_ = actionstr;
            this.ani_.play(actionstr);
            if (this.acstr != GameAI.Run && this.acstr != GameAI.Idle && this.acstr != GameAI.Die) {
                Laya.stage.frameLoop(1, this, this.ac0);
            }
            else {
                Laya.stage.timer.clear(this, this.ac0);
            }
        }
        ac0() {
            if (this.normalizedTime >= 1) {
                var str = this.acstr_;
                Laya.stage.timer.clear(this, this.ac0);
                this.event(Game.Event_PlayStop, str);
                if (str == GameAI.SkillStart) {
                    this.play(GameAI.SkillLoop);
                }
                else if (str == GameAI.SkillLoop) {
                    this.play(GameAI.SkillLoop);
                }
                else {
                    this.play(GameAI.Idle);
                }
            }
        }
        ac1() {
            if (this.keyNum >= 0 && this.normalizedTime >= this.keyNum) {
                this.event(Game.Event_KeyNum, this.keyNum);
                this.keyNum = -1;
            }
        }
        get normalizedTime() {
            return this.ani_.getCurrentAnimatorPlayState().normalizedTime;
        }
        rotation(n) {
            if (!n) {
                return;
            }
            if (this.gamedata.hp <= 0) {
                return;
            }
            this.facen3d_ = n;
            this.facen2d_ = (2 * Math.PI - n);
            var nn = Math.atan2(Math.sin(n) / Game.cameraCN.cos0, Math.cos(n));
            nn = ((nn + Math.PI / 2) / Math.PI * 180);
            var ey = Math.round(nn);
            if (ey >= 360) {
                while (ey >= 360) {
                    ey -= 360;
                }
            }
            else if (ey < 0) {
                while (ey < 0) {
                    ey += 360;
                }
            }
            if (this.gamedata_.rspeed <= 0) {
                this.sp3d_.transform.localRotationEulerY = ey;
                this.rotationEulerY = this.sp3d_.transform.localRotationEulerY;
                return;
            }
            if (this.rotationEulerY != ey) {
                this.rotationEulerY = ey;
                if (this.sp3d_.transform.localRotationEulerY >= 360) {
                    while (this.sp3d_.transform.localRotationEulerY >= 360) {
                        this.sp3d_.transform.localRotationEulerY -= 360;
                    }
                }
                else if (this.sp3d_.transform.localRotationEulerY < 0) {
                    while (this.sp3d_.transform.localRotationEulerY < 0) {
                        this.sp3d_.transform.localRotationEulerY += 360;
                    }
                }
            }
        }
        ai() {
            this.ac1();
            if (this.animator && this.animator.speed > 0 && this.gamedata_.proType == GameProType.Hero) {
                if (this.acstr_ == GameAI.Run) {
                    if (this.animator.speed == 1) {
                        this.animator.speed = (this.speed_ / 6);
                    }
                }
                if (this.acstr_ == GameAI.NormalAttack || this.acstr_ == GameAI.closeCombat) {
                    this.animator.speed = 2;
                }
                else {
                    if (this.animator.speed != 1) {
                        this.animator.speed = 1;
                    }
                }
            }
            if (this.gameAI) {
                this.gameAI.exeAI(this);
            }
            if (this.isDie) {
                return;
            }
            if (this.sp3d_ == null) {
                return;
            }
            if (this.sp3d_ && this.rotationEulerY == this.sp3d_.transform.localRotationEulerY) {
                return;
            }
            for (let i = 0; i < this.gamedata_.rspeed; i++) {
                var n = this.rotationEulerY - this.sp3d_.transform.localRotationEulerY;
                if (n == 0) {
                    break;
                }
                else if ((n > 0 && n <= 180) || (n < -180)) {
                    this.sp3d_.transform.localRotationEulerY += 1;
                }
                else {
                    this.sp3d_.transform.localRotationEulerY -= 1;
                }
                while (this.sp3d_.transform.localRotationEulerY >= 360) {
                    this.sp3d_.transform.localRotationEulerY -= 360;
                }
                while (this.sp3d_.transform.localRotationEulerY < 0) {
                    this.sp3d_.transform.localRotationEulerY += 360;
                }
            }
        }
        get pos2() {
            return this._pos2;
        }
        pos2To3d() {
            this.sp3d_.transform.localPositionX = this._pos2.x / GameBG.ww;
            this.sp3d_.transform.localPositionZ = this._pos2.z / Game.cameraCN.cos0 / GameBG.ww;
            this.hbox_.setXY(GameBG.mcx + this._pos2.x, GameBG.mcy + this._pos2.z);
            if (this.sp2d_) {
                this.sp2d_.x = this.hbox_.x;
                this.sp2d_.y = this.hbox_.y;
                Game.footLayer.addChild(this.sp2d_);
            }
            this.updateUI();
        }
        updateUI() {
            this._bloodUI && this._bloodUI.pos(this.hbox_.cx, this.hbox_.cy - 90);
            this._footCircle && this._footCircle.pos(this.hbox_.cx, this.hbox_.cy);
            this._bulletShadow && this._bulletShadow.pos(this.hbox_.cx, this.hbox_.cy);
        }
        get z() {
            return this.sp3d_.transform.localPositionZ;
        }
        get x() {
            return this.sp3d_.transform.localPositionX;
        }
        move2D(n, hd = true) {
            if (this.isIce) {
                return;
            }
            this.moven2d_ = n;
            if (this.movef) {
                return this.movef.move2d(n, this, this.speed, false);
            }
            return false;
        }
        setXY2D(xx, yy) {
            this.pos2.x = xx;
            this.pos2.z = yy;
            this.pos2To3d();
        }
        setcXcY2DBox(xx, yy) {
            this.hbox_.setCenter(xx, yy);
            this.pos2.x = this.hbox_.x - GameBG.mcx;
            this.pos2.z = this.hbox_.y - GameBG.mcy;
            this.pos2To3d();
        }
        setXY2DBox(xx, yy) {
            this.hbox_.setXY(xx, yy);
            this.pos2.x = this.hbox_.x - GameBG.mcx;
            this.pos2.z = this.hbox_.y - GameBG.mcy;
            this.pos2To3d();
        }
        startAi() {
            if (this.gameAI) {
                this.gameAI.starAi();
                if (Game.AiArr.indexOf(this) < 0) {
                    Game.AiArr.push(this);
                }
            }
        }
        stopAi() {
            if (this.gameAI) {
                this.gameAI.stopAi();
            }
            var index = Game.AiArr.indexOf(this);
            if (index > -1) {
                Game.AiArr.splice(index, 1);
            }
            else {
                console.error("为什么没有这个");
            }
        }
        get gamedata() {
            return this.gamedata_;
        }
    }

    class FootRotateScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            this.box.transform.localRotationEulerY += 5;
        }
        onDisable() {
        }
    }

    class CoinsAI extends GameAI {
        constructor() { super(); }
        starAi() {
            this.run_ = true;
        }
        stopAi() {
            this.run_ = false;
        }
        hit(pro) {
        }
        exeAI(pro) {
            if (!this.run_) {
                return false;
            }
            var a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
            if (pro.move2D(pro.face2d)) {
                pro.clear();
                this.run_ = false;
            }
            return false;
        }
    }

    class GameMove {
        move2d(n, pro, speed, hitStop) { return false; }
        Blocking(pro, vx, vz) {
            if (!pro.unBlocking) {
                var hits = Game.map0.Eharr;
                if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                    return false;
                }
            }
            return true;
        }
    }

    class CoinsMove extends GameMove {
        constructor() { super(); }
        move2d(n, pro, speed) {
            if (pro.status == 0) ;
            else if (pro.status == 1) {
                var vx = Math.cos(n) * speed;
                var vz = Math.sin(n) * speed;
                if (pro.curLen >= 0 && pro.moveLen >= 0) {
                    pro.curLen += speed;
                    if (pro.curLen >= pro.moveLen) {
                        pro.curLen = pro.moveLen;
                    }
                    var nn = pro.curLen / pro.moveLen;
                    var dy = Math.sin((Math.PI * nn)) * 2;
                    pro.sp3d.transform.localPositionY = 0.1 + dy;
                }
                if (pro.curLen >= pro.moveLen) {
                    pro.status = 0;
                }
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            }
            else if (pro.status == 2) {
                var a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                pro.rotation(a);
                if (speed <= 0) {
                    return false;
                }
                if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) < GameBG.ww2) {
                    return true;
                }
                var vx = Math.cos(n) * speed;
                var vz = Math.sin(n) * speed;
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            }
            return false;
        }
    }

    class Coin extends GamePro {
        constructor() {
            super(0, 1);
            this.curLen = 0;
            this.moveLen = 0;
            this.status = 0;
            var sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/coins/monster.lh"));
            this.setSp3d(sp);
            sp.transform.localScale = new Laya.Vector3(1.5, 1.5, 1.5);
            this.sp3d.addComponent(FootRotateScript);
            this.setSpeed(0);
            this.setGameAi(new CoinsAI());
            this.setGameMove(new CoinsMove());
            this._bulletShadow = new ui.test.BulletShadowUI();
            Game.footLayer.addChild(this._bulletShadow);
            this.setShadowSize(20);
        }
        static getOne() {
            let coin = Laya.Pool.getItemByClass(Coin.TAG, Coin);
            return coin;
        }
        setPos(monster, r) {
            this.status = 1;
            this.curLen = 0;
            this.moveLen = 20 + Math.random() * GameBG.ww;
            this.setXY2D(monster.pos2.x, monster.pos2.z);
            this.setSpeed(2);
            this.rotation(r);
            this.startAi();
            Game.layer3d.addChild(this.sp3d);
            Game.footLayer.addChild(this._bulletShadow);
        }
        updateUI() {
            super.updateUI();
            this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy + 10);
        }
        onCom() {
            this.setShadowSize(20);
            let xx = GameBG.ww * this.sp3d.transform.localPositionX;
            let yy = GameBG.ww * this.sp3d.transform.localPositionZ * Game.cameraCN.cos0;
            this.setXY2D(xx, yy);
            this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy);
        }
        fly() {
            var a = GameHitBox.faceTo3D(this.hbox, Game.hero.hbox);
            this.rotation(a);
            this.status = 2;
            this.curLen = 0;
            this.moveLen = 0;
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.setSpeed(40);
        }
        clear() {
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.stopAi();
            this.sp3d && this.sp3d.removeSelf();
            Game.battleCoins++;
            Laya.stage.event(Game.Event_COINS);
            this.curLen = 0;
            this.moveLen = 0;
            this.status = 0;
            Laya.Pool.recover(Coin.TAG, this);
        }
    }
    Coin.TAG = "Coin";

    class CoinEffect {
        constructor() {
        }
        static addEffect(monster, goldNum) {
            for (let i = 0; i < goldNum; i++) {
                let coin = Coin.getOne();
                coin.setPos(monster, 2 * Math.PI / goldNum * i);
                CoinEffect.coinsAry.push(coin);
                setTimeout(() => {
                }, i * 50);
            }
        }
        static fly() {
            let len = CoinEffect.coinsAry.length;
            if (len > 0) {
                Game.playSound("fx_goldget.wav");
            }
            for (let i = 0; i < len; i++) {
                let coin = CoinEffect.coinsAry.shift();
                coin && coin.fly();
            }
        }
    }
    CoinEffect.coinsAry = [];

    class ShakeUtils {
        constructor() {
            this.startPo = new Laya.Point();
            this.flag = false;
            this.arr = [-1, -1, -1, 1, 1, 1, 1, -1];
            this.now = 0;
            this.nowIndex = 0;
        }
        static setShakeUI(ani, box) {
            ShakeUtils.shake.shakeAni = ani;
            ShakeUtils.shake.shakeBox = box;
        }
        static execute(sp, time, moveLen) {
            ShakeUtils.shake.exe(sp, time, moveLen);
        }
        static execute2(sp, time, rotateNum) {
            ShakeUtils.shake.exe2(sp, time, rotateNum);
        }
        exe2(sp, delay, rotateNum) {
            this.flag = false;
            this.rotateNum = rotateNum;
            this.sp = sp;
            Laya.timer.loop(delay, this, this.loopFun2);
            this.now = 0;
        }
        loopFun2() {
            if (this.rotateNum <= 0) {
                Laya.timer.clear(this, this.loopFun2);
                this.sp.rotation = 0;
                this.sp = null;
                return;
            }
            this.flag = !this.flag;
            this.rotateNum--;
            this.sp.rotation = this.rotateNum * (this.flag ? -1 : 1);
        }
        exe(sp, time, moveLen) {
            this.moveLen = moveLen;
            this.time = time;
            this.sp = sp;
            this.startPo.setTo(sp.x, sp.y);
            Laya.timer.clear(this, this.loopFun);
            Laya.timer.frameLoop(1, this, this.loopFun);
            this.startTime = Laya.Browser.now();
            this.now = 0;
        }
        loopFun() {
            if ((Laya.Browser.now() - this.startTime) > this.time) {
                Laya.timer.clear(this, this.loopFun);
                this.sp.pos(this.startPo.x, this.startPo.y);
                this.sp = null;
                return;
            }
            if (this.now >= this.arr.length) {
                this.now = 0;
            }
            this.sp.pos(this.startPo.x + this.arr[this.now] * this.moveLen, this.startPo.y + this.arr[this.now + 1] * this.moveLen);
            this.now += 2;
        }
        static shakeByUI(sp) {
            ShakeUtils.shake.exeByUI(sp);
        }
        exeByUI(sp) {
            this.sp = sp;
            this.startPo.setTo(sp.x, sp.y);
            Laya.timer.frameLoop(1, this, this.enterFun);
        }
        enterFun() {
            if (this.nowIndex >= this.shakeAni.count) {
                this.stopShakeByUI();
                return;
            }
            this.shakeAni.index = this.nowIndex;
            this.sp.pos(this.startPo.x + this.shakeBox.x, this.startPo.y + this.shakeBox.y);
            this.nowIndex++;
        }
        stopShakeByUI() {
            this.sp.pos(this.startPo.x, this.startPo.y);
            Laya.timer.clear(this, this.enterFun);
            this.nowIndex = 0;
        }
    }
    ShakeUtils.shake = new ShakeUtils();

    class DateUtils {
        constructor() {
        }
        static getFormatBySecond(second, type = 1) {
            var str = "";
            switch (type) {
                case 1:
                    str = DateUtils.getFormatBySecond1(second);
                    break;
                case 2:
                    str = DateUtils.getFormatBySecond2(second);
                    break;
                case 3:
                    str = DateUtils.getFormatBySecond3(second);
                    break;
                case 4:
                    str = DateUtils.getFormatBySecond4(second);
                    break;
                case 5:
                    str = DateUtils.getFormatBySecond5(second);
                    break;
            }
            return str;
        }
        static getFormatBySecond1(t = 0) {
            var hourst = Math.floor(t / 3600);
            var hours;
            if (hourst == 0) {
                hours = "00";
            }
            else {
                if (hourst < 10)
                    hours = "0" + hourst;
                else
                    hours = "" + hourst;
            }
            var minst = Math.floor((t - hourst * 3600) / 60);
            var secondt = Math.floor((t - hourst * 3600) % 60);
            var mins;
            var sens;
            if (minst == 0) {
                mins = "00";
            }
            else if (minst < 10) {
                mins = "0" + minst;
            }
            else {
                mins = "" + minst;
            }
            if (secondt == 0) {
                sens = "00";
            }
            else if (secondt < 10) {
                sens = "0" + secondt;
            }
            else {
                sens = "" + secondt;
            }
            return hours + ":" + mins + ":" + sens;
        }
        static getFormatBySecond3(t = 0) {
            var hourst = Math.floor(t / 3600);
            var minst = Math.floor((t - hourst * 3600) / 60);
            var secondt = Math.floor((t - hourst * 3600) % 60);
            var mins;
            var sens;
            if (minst == 0) {
                mins = "00";
            }
            else if (minst < 10) {
                mins = "0" + minst;
            }
            else {
                mins = "" + minst;
            }
            if (secondt == 0) {
                sens = "00";
            }
            else if (secondt < 10) {
                sens = "0" + secondt;
            }
            else {
                sens = "" + secondt;
            }
            return mins + ":" + sens;
        }
        static getFormatBySecond2(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
        }
        static getFormatBySecond4(time) {
            var t = Math.floor(time / 3600);
            if (t > 0) {
                if (t > 24) {
                    return Math.floor(t / 24) + "天前";
                }
                else {
                    return t + "小时前";
                }
            }
            else {
                return Math.floor(time / 60) + "分钟前";
            }
        }
        static getFormatBySecond5(time) {
            var oneDay = 3600 * 24;
            var oneHourst = 3600;
            var oneMinst = 60;
            var days = Math.floor(time / oneDay);
            var hourst = Math.floor(time % oneDay / oneHourst);
            var minst = Math.floor((time - hourst * oneHourst) / oneMinst);
            var secondt = Math.floor((time - hourst * oneHourst) % oneMinst);
            var dayss = "";
            var hourss = "";
            var minss = "";
            var secss = "";
            if (time > 0) {
                if (days == 0) {
                    dayss = "";
                    if (hourst == 0) {
                        hourss = "";
                        if (minst == 0) {
                            minss = "";
                            if (secondt == 0) {
                                secss = "";
                            }
                            else if (secondt < 10) {
                                secss = "0" + secondt + "秒";
                            }
                            else {
                                secss = "" + secondt + "秒";
                            }
                            return secss;
                        }
                        else {
                            minss = "" + minst + "分";
                            if (secondt == 0) {
                                secss = "";
                            }
                            else if (secondt < 10) {
                                secss = "0" + secondt + "秒";
                            }
                            else {
                                secss = "" + secondt + "秒";
                            }
                        }
                        return minss + secss;
                    }
                    else {
                        hourss = hourst + "小时";
                        if (minst == 0) {
                            minss = "";
                            if (secondt == 0) {
                                secss = "";
                            }
                            else if (secondt < 10) {
                                secss = "0" + secondt + "秒";
                            }
                            else {
                                secss = "" + secondt + "秒";
                            }
                            return secss;
                        }
                        else if (minst < 10) {
                            minss = "0" + minst + "分";
                        }
                        else {
                            minss = "" + minst + "分";
                        }
                        return hourss + minss;
                    }
                }
                else {
                    dayss = days + "天";
                    if (hourst == 0) {
                        hourss = "";
                    }
                    else {
                        if (hourst < 10)
                            hourss = "0" + hourst + "小时";
                        else
                            hourss = "" + hourst + "小时";
                    }
                    return dayss + hourss;
                }
            }
            return "";
        }
    }

    class SysHero {
        constructor() {
            this.id = 0;
            this.roleExp = 0;
        }
    }
    SysHero.NAME = 'sys_hero.txt';

    class MainUI extends Laya.Box {
        constructor() {
            super();
            this.height = GameBG.height;
            this.width = 750;
            this.topUI = new TopUI();
            this.addChild(this.topUI);
            this.bottomUI = new BottomUI();
            this.addChild(this.bottomUI);
            this.bottomUI.bottom = -2;
            let img = new Laya.Image();
            img.skin = "main/jianhei.png";
            this.addChild(img);
            img.width = 800;
            img.anchorX = 0.5;
            img.y = this.bottomUI.y - 93;
            img.x = 375;
            this.addChild(this.bottomUI);
            this.mouseThrough = true;
        }
        appEnergy() {
            this.topUI.appEnergy();
        }
        get selectIndex() {
            return this.bottomUI.selectIndex;
        }
    }
    class TopUI extends ui.test.mainUIUI {
        constructor() {
            super();
            this._remainingTime = 0;
            this.maskSpr = new Laya.Sprite();
            this._isInit = false;
            this.lastWidth = 0;
            this.isTwo = false;
            this.timerClip.visible = false;
            this.appEnergyClip.visible = false;
            this.headImg.skin = Game.userHeadUrl;
            this.nameTxt.text = Game.userName;
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.homeData = Session.homeData;
            if (Date.now() >= this.homeData.lastTime) {
                this._remainingTime = 0;
            }
            else {
                let deltaTime = Session.homeData.lastTime - Date.now();
                let time = Math.floor(deltaTime / 1000);
                this._remainingTime = Math.floor(time % TopUI.TOTAL_TIME);
                if (this._remainingTime == 0) {
                    this._remainingTime = TopUI.TOTAL_TIME;
                }
            }
            this.updateEnergy();
            this.dengji.value = "" + Session.homeData.level;
            this.coinClip.value = "" + Session.homeData.coins;
            let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, Session.homeData.level);
            let vv = Session.homeData.playerExp / sys.roleExp;
            Laya.timer.frameLoop(1, this, this.onLoopExp, [vv]);
        }
        onLoopExp(vv) {
            this.lastWidth += 15;
            if (this.isTwo) {
                if (this.lastWidth >= this.jingyantiao.width) {
                    this.lastWidth = 0;
                    this.isTwo = false;
                }
            }
            else {
                if (this.lastWidth >= this.jingyantiao.width * vv) {
                    this.lastWidth = this.jingyantiao.width * vv;
                    Laya.timer.clear(this, this.onLoopExp);
                }
            }
            this.lastWidth = Math.max(1, this.lastWidth);
            this.maskSpr.graphics.clear();
            this.maskSpr.graphics.drawRect(0, 0, this.lastWidth, this.jingyantiao.height, "#fff000");
            this.jingyantiao.mask = this.maskSpr;
        }
        appEnergy() {
            if (this.homeData.curEnergy < TopUI.xiaohao) {
                FlyUpTips.setTips("体力不足！");
            }
            Game.isStartBattle = true;
            this.homeData.curEnergy -= TopUI.xiaohao;
            this.appEnergyClip.visible = true;
            this.appEnergyClip.value = "-" + TopUI.xiaohao;
            Laya.Tween.to(this.appEnergyClip, { y: 100 }, 300, null, new Laya.Handler(this, this.onStart));
        }
        onStart() {
            this.appEnergyClip.visible = false;
            this.appEnergyClip.y = 47;
            this._remainingTime = TopUI.TOTAL_TIME;
            this.updateEnergy();
            this.homeData.lastTime = Date.now() + (this.homeData.totalEnergy - this.homeData.curEnergy) * TopUI.TOTAL_TIME * 1000;
            Session.saveData();
            Game.battleLoader.load();
        }
        updateEnergy() {
            this.tiliClip.value = this.homeData.curEnergy + "/" + this.homeData.maxEngergy;
            let value = this.homeData.curEnergy / this.homeData.maxEngergy;
            value = Math.max(0.1, value);
            if (this.homeData.curEnergy < this.homeData.totalEnergy) {
                Laya.timer.clear(this, this.onLoop);
                Laya.timer.loop(1000, this, this.onLoop);
                this.onLoop();
            }
        }
        onLoop() {
            this.timerClip.visible = true;
            this.timerClip.value = DateUtils.getFormatBySecond3(this._remainingTime);
            this._remainingTime--;
            if (this._remainingTime < 0) {
                this.homeData.curEnergy++;
                if (this.homeData.curEnergy == this.homeData.totalEnergy) {
                    Laya.timer.clear(this, this.onLoop);
                    this.timerClip.visible = false;
                }
                else {
                    this._remainingTime = TopUI.TOTAL_TIME;
                }
                this.updateEnergy();
            }
        }
    }
    TopUI.TOTAL_TIME = 12 * 60;
    TopUI.MAX_ENERGY = 20;
    TopUI.xiaohao = 2;
    class BottomUI extends Laya.Box {
        constructor() {
            super();
            this.bgBox = new Laya.Box();
            this.curBg = new Laya.Image();
            this.btnBox = new Laya.Box();
            this.bgs = [];
            this.btns = [];
            this._selectIndex = 0;
            this.opens = [1, -1, -1, -1, 1];
            this.size(750, 122);
            this.addChild(this.bgBox);
            this.curBg.skin = 'main/dazhao.png';
            this.addChild(this.curBg);
            this.addChild(this.btnBox);
            for (let i = 0; i < 5; i++) {
                let bg = new Laya.Image();
                bg.skin = 'main/xiaobiao.png';
                bg.width = 127;
                bg.height = 122;
                this.bgBox.addChild(bg);
                bg.x = i * bg.width;
                this.bgs.push(bg);
                let btn = new Laya.Button();
                btn.tag = this.opens[i];
                if (this.opens[i] == 1) {
                    btn.stateNum = 2;
                    btn.width = 132;
                    btn.height = 136;
                    btn.skin = 'main/btn_' + i + '.png';
                    btn.y = bg.y + 40;
                }
                else {
                    btn.stateNum = 1;
                    btn.width = 38;
                    btn.height = 55;
                    btn.skin = 'main/suo.png';
                    btn.y = bg.y + 61;
                    btn.scale(1.2, 1.2);
                }
                this.btnBox.addChild(btn);
                btn.anchorX = 0.5;
                btn.anchorY = 0.5;
                btn.x = bg.x + 63;
                btn.clickHandler = new Laya.Handler(this, this.onClick, [btn]);
                this.btns.push(btn);
            }
            this.onClick(this.btns[this._selectIndex], 10);
        }
        onClick(clickBtn, delay = 500) {
            if (clickBtn.tag == -1) {
                clickBtn.mouseEnabled = false;
                ShakeUtils.execute(clickBtn, 300, 2);
                setTimeout(() => {
                    clickBtn.mouseEnabled = true;
                }, 300);
                return;
            }
            var ww = 0;
            let tmp;
            for (let i = 0; i < this.btns.length; i++) {
                let btn = this.btns[i];
                let bg = this.bgs[i];
                bg.width = 127;
                btn.selected = false;
                if (btn == clickBtn) {
                    btn.selected = true;
                    bg.skin = 'main/dabiao.png';
                    bg.width = 242;
                    this._selectIndex = i;
                    tmp = bg;
                }
                bg.x = ww;
                ww += bg.width;
                btn.x = bg.x + bg.width * 0.5;
            }
            Laya.Tween.to(this.curBg, { x: tmp.x }, delay, Laya.Ease.cubicInOut);
            Laya.stage.event("switchView");
        }
        get selectIndex() {
            return this._selectIndex;
        }
    }

    class HomeData {
        constructor() {
            this.redDiamond = 0;
            this.blueDiamond = 0;
            this.playerExp = 0;
        }
        setData(data) {
            this.totalEnergy = data.totalEnergy;
            this.maxEngergy = data.maxEngergy;
            this.lastTime = data.lastTime;
            this.curEnergy = data.curEnergy;
            this.chapterId = data.chapterId;
            this.mapIndex = data.mapIndex;
            this.level = data.level;
            this.coins = data.coins;
            this.playerExp = data.playerExp;
            if (this.playerExp == null) {
                this.playerExp = 0;
            }
            if (Date.now() >= this.lastTime) {
                this.curEnergy = this.totalEnergy;
            }
            else {
                let deltaTime = this.lastTime - Date.now();
                let time = Math.floor(deltaTime / 1000);
                let delta = Math.ceil(time / TopUI.TOTAL_TIME);
                this.curEnergy = this.totalEnergy - delta;
                console.log("Session剩余的时间", time, this.curEnergy);
            }
        }
        saveData(data) {
            data.curEnergy = this.curEnergy;
            data.maxEngergy = this.maxEngergy;
            data.lastTime = this.lastTime;
            data.totalEnergy = this.totalEnergy;
            data.chapterId = this.chapterId;
            data.mapIndex = this.mapIndex;
            data.level = this.level;
            data.coins = this.coins;
            data.playerExp = this.playerExp;
            if (Game.battleLoader.index > this.mapIndex) {
                data.mapIndex = Game.battleLoader.index;
                console.log("存储最高层数", data.mapIndex);
            }
            data.coins += Game.addCoins;
            this.coins = data.coins;
            data.level = this.level;
        }
        initData(data) {
            this.totalEnergy = TopUI.MAX_ENERGY;
            this.maxEngergy = TopUI.MAX_ENERGY;
            this.curEnergy = this.totalEnergy;
            this.lastTime = 0;
            this.chapterId = 1;
            this.mapIndex = 0;
            this.level = 1;
            this.coins = 0;
            this.redDiamond = 0;
            this.playerExp = 0;
            this.blueDiamond = 0;
        }
        changeGold(type, value, useType = 0) {
            let num = this.getGoldByType(type);
            if ((num + value) < 0) {
                return false;
            }
            this.setGoldByType(type, value);
            Laya.stage.event(GameEvent.GOLD_CHANGE);
            return true;
        }
        getGoldByType(type) {
            if (type == GoldType.GOLD) {
                return this.coins;
            }
            else if (type == GoldType.RED_DIAMONG) {
                return this.redDiamond;
            }
            else if (type == GoldType.BLUE_DIAMONG) {
                return this.blueDiamond;
            }
        }
        setGoldByType(type, value) {
            if (type == GoldType.GOLD) {
                this.coins += value;
            }
            else if (type == GoldType.RED_DIAMONG) {
                this.redDiamond += value;
            }
            else if (type == GoldType.BLUE_DIAMONG) {
                this.blueDiamond += value;
            }
        }
        addPlayerExp(exp) {
            this.playerExp += exp;
            while (true) {
                let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, this.level);
                if (this.playerExp >= sys.roleExp) {
                    let nowLv = this.level + 1;
                    if (App.tableManager.getDataByNameAndId(SysHero.NAME, this.level) == null) {
                        break;
                    }
                    this.level = nowLv;
                    this.playerExp -= sys.roleExp;
                }
                else {
                    break;
                }
            }
            App.sendEvent(GameEvent.PLAYER_INFO_UPDATE);
        }
    }
    var GoldType;
    (function (GoldType) {
        GoldType[GoldType["GOLD"] = 0] = "GOLD";
        GoldType[GoldType["RED_DIAMONG"] = 1] = "RED_DIAMONG";
        GoldType[GoldType["BLUE_DIAMONG"] = 2] = "BLUE_DIAMONG";
    })(GoldType || (GoldType = {}));

    var HttpRequest = Laya.HttpRequest;
    class Http {
        constructor() {
            this.xhr = new HttpRequest();
            this.xhr.http.timeout = 10000;
        }
        static create() {
            return new Http();
        }
        success(func, thisObj) {
            this.xhr.once(Laya.Event.COMPLETE, thisObj, function (data) {
                Laya.Handler.create(thisObj, func).runWith(data);
            });
            return this;
        }
        error(func, thisObj = null) {
            this.xhr.once(Laya.Event.ERROR, thisObj, function (data) {
                Laya.Handler.create(thisObj, func).runWith(data);
            });
            return this;
        }
        send(url, data, method, responseType) {
            this.xhr.send(url, data, method, responseType);
        }
    }

    class BaseHttp {
        constructor(hand) {
            this.handler = hand;
            this._http = Http.create().success(this.onSuccess, this).error(this.onErro, this);
        }
        onSuccess(data) {
            this.handler && this.handler.runWith(data);
        }
        onErro(e) {
            console.error(e);
        }
        send(url, data, method, responseType) {
            this._http.send(url, data, method, responseType);
        }
    }

    class SenderHttp extends BaseHttp {
        constructor() {
            super(null);
        }
        static create() {
            return new SenderHttp();
        }
        send() {
            let obj = Session.gameData;
            super.send(App.serverIP + "gamex3/save2", "skey=" + Session.SKEY + "&type=0&num=0&gamedata=" + JSON.stringify(obj), "post", "text");
        }
        onSuccess(data) {
            super.onSuccess(data);
            console.log("save success", data);
        }
    }

    class SysTalentInfo {
        constructor() {
            this.id = 0;
            this.idName = "";
            this.talentName = "";
            this.talentInfo = "";
        }
    }
    SysTalentInfo.NAME = "sys_talentinfo.txt";

    class SysTalentCost {
        constructor() {
            this.id = 0;
            this.talentCost = 0;
        }
    }
    SysTalentCost.NAME = "sys_talentcost.txt";

    class Equip {
        constructor() {
            this.hp = 0;
            this.atk = 0;
            this.def = 0;
            this.crit = 0;
            this.moveSpeed = 0;
            this.atkSpeed = 0;
            this.critEffect = 0;
        }
        copy() {
            let e = new Equip();
            e.hp = this.hp;
            e.atk = this.atk;
            e.def = this.def;
            e.crit = this.crit;
            e.moveSpeed = this.moveSpeed;
            e.atkSpeed = this.atkSpeed;
            e.critEffect = this.critEffect;
            return e;
        }
        reset0() {
            this.hp = 0;
            this.atk = 0;
            this.def = 0;
            this.crit = 0;
            this.moveSpeed = 0;
            this.atkSpeed = 0;
            this.critEffect = 0;
        }
    }

    class TalentData {
        constructor() {
            this.talentArr = [];
            this.lvTimes = 0;
            this.equip = new Equip();
            this.imgArr = [];
            this.addData("tianfu/PTkuang.png", "tianfu/gongji.png", "tianfu/gongzi.png", 1);
            this.addData("tianfu/PTkuang.png", "tianfu/shengming.png", "tianfu/shengzi.png", 2);
            this.addData("tianfu/PTkuang.png", "tianfu/shengming.png", "tianfu/shengzi.png", 3);
            this.addData("tianfu/JYkuang.png", "tianfu/fangyu.png", "tianfu/fangzi.png", 4);
            this.addData("tianfu/JYkuang.png", "tianfu/gongji.png", "tianfu/gongzi.png", 5);
            this.addData("tianfu/JYkuang.png", "tianfu/jinbi.png", "tianfu/diaozi.png", 6);
            this.addData("tianfu/SSkuang.png", "tianfu/baoji.png", "tianfu/baozi.png", 7);
            this.addData("tianfu/SSkuang.png", "tianfu/lixian.png", "tianfu/lizi.png", 8);
            this.addData("tianfu/SSkuang.png", "tianfu/tiejiang.png", "tianfu/tiezi.png", 9);
        }
        addData(bg, logo, font, id) {
            this.imgArr.push({ bg: bg, logo: logo, font: font, id: id });
        }
        getImgData(id) {
            return this.imgArr[id - 1];
        }
        setData(data) {
            if (data.talent == null) {
                this.initData(data);
            }
            let arr = data.talent.split(",");
            for (let k of arr) {
                this.talentArr.push(parseInt(k));
            }
        }
        saveData(data) {
            data.talent = this.talentArr.join(",");
        }
        initData(data) {
            let sysArr = App.tableManager.getTable(SysTalentInfo.NAME);
            for (let k of sysArr) {
                this.talentArr.push(0);
            }
        }
        getLv(id) {
            return this.talentArr[id - 1];
        }
        getTxt(index) {
            return "";
        }
        setView(v, id) {
        }
        lvUp(id) {
            let res = this.canLvUp();
            if (res != 0) {
                return res;
            }
            this.lvTimes++;
            let sys = App.tableManager.getDataByNameAndId(SysTalentCost.NAME, (this.lvTimes + 1));
            Session.homeData.changeGold(GoldType.GOLD, -sys.talentCost);
            this.talentArr[id - 1] = this.getLv(id) + 1;
            App.sendEvent(GameEvent.TALENT_UPDATE);
            Session.saveData();
            return res;
        }
        haveGold() {
            let g = Session.homeData.getGoldByType(GoldType.GOLD);
            let sys = App.tableManager.getDataByNameAndId(SysTalentCost.NAME, (this.lvTimes + 1));
            return g >= sys.talentCost;
        }
        canLvUp() {
            if (this.haveGold() == false) {
                return -1;
            }
            if (this.lvTimes > Session.homeData.level) {
                return -2;
            }
            return 0;
        }
    }

    class UserData {
        constructor() {
        }
        setData(data) {
        }
        saveData(data) {
        }
        initData(data) {
        }
    }

    class TaskData {
        constructor() {
        }
        setData(data) {
        }
        saveData(data) {
        }
        initData(data) {
        }
    }

    class SysRoleBase {
        constructor() {
            this.id = 0;
            this.roleName = "";
            this.baseAtk = 0;
            this.baseHp = 0;
            this.baseSpeed = 0;
            this.baseCrit = 0;
            this.baseCritHurt = 0;
            this.baseDodge = 0;
            this.baseMove = 0;
            this.baseSkill = 0;
            this.addExp = 0;
            this.addSpeed = 0;
            this.addAttack = 0;
        }
        static getSys(id) {
            let arr = App.tableManager.getTable(SysRoleBase.NAME);
            for (let k of arr) {
                if (k.id == id) {
                    return k;
                }
            }
            return null;
        }
        getValue(v) {
            if (v == HeroLvType.ATK) {
                return this.baseAtk;
            }
            else if (v == HeroLvType.HP) {
                return this.baseHp;
            }
        }
    }
    SysRoleBase.NAME = 'sys_rolebase.txt';

    class SysRoleUp {
        constructor() {
            this.id = 0;
            this.roleLevel = 0;
            this.roleId = 0;
            this.addAtk = 0;
            this.costAtk = 0;
            this.addHp = 0;
            this.costHp = 0;
        }
        getCost(type) {
            if (type == HeroLvType.ATK) {
                return this.costAtk;
            }
            else if (type == HeroLvType.HP) {
                return this.costHp;
            }
        }
        getCostType(type) {
            if (type == HeroLvType.ATK) {
                return GoldType.BLUE_DIAMONG;
            }
            else if (type == HeroLvType.HP) {
                return GoldType.RED_DIAMONG;
            }
        }
        getValue(type) {
            if (type == HeroLvType.ATK) {
                return this.addAtk;
            }
            else if (type == HeroLvType.HP) {
                return this.addHp;
            }
        }
        static getSysRole(roleId, lv) {
            let sysArr = App.tableManager.getTable(SysRoleUp.NAME);
            for (let k of sysArr) {
                if (k.roleId == roleId && k.roleLevel == lv) {
                    return k;
                }
            }
            return null;
        }
    }
    SysRoleUp.NAME = 'sys_roleup.txt';

    var GOLD_CHANGE_TYPE;
    (function (GOLD_CHANGE_TYPE) {
        GOLD_CHANGE_TYPE[GOLD_CHANGE_TYPE["AD_DIAMOND"] = 0] = "AD_DIAMOND";
        GOLD_CHANGE_TYPE[GOLD_CHANGE_TYPE["HERO_LV_ABILITY"] = 1] = "HERO_LV_ABILITY";
    })(GOLD_CHANGE_TYPE || (GOLD_CHANGE_TYPE = {}));

    class HeroData {
        constructor() {
            this.heroData = {};
        }
        setData(data) {
            this.heroData = data.heroData;
        }
        saveData(data) {
            data.heroData = this.heroData;
        }
        initData(data) {
            let arr = App.tableManager.getTable(SysRoleBase.NAME);
            for (let k of arr) {
                this.heroData[k.id] = [1, 1];
            }
        }
        getHeroLv(heroId, type) {
            return this.heroData[heroId][type];
        }
        lvUp(heroId, type) {
            let lv = this.heroData[heroId][type];
            let sys = SysRoleUp.getSysRole(heroId, lv);
            let cost = sys.getCost(type);
            let goldType = sys.getCostType(type);
            let res = Session.homeData.changeGold(goldType, -cost, GOLD_CHANGE_TYPE.HERO_LV_ABILITY);
            if (res == false) {
                return false;
            }
            let nowLv = lv + 1;
            let nowSys = SysRoleUp.getSysRole(heroId, nowLv);
            if (nowSys == null) {
                return false;
            }
            this.heroData[heroId][type] = nowLv;
            Laya.stage.event(GameEvent.HERO_UPDATE);
            Session.saveData();
            return true;
        }
    }
    var HeroLvType;
    (function (HeroLvType) {
        HeroLvType[HeroLvType["ATK"] = 0] = "ATK";
        HeroLvType[HeroLvType["HP"] = 1] = "HP";
    })(HeroLvType || (HeroLvType = {}));

    class Session {
        static init() {
            Session.IDataArr.push(Session.homeData);
            Session.IDataArr.push(Session.talentData);
            Session.IDataArr.push(Session.taskData);
            Session.IDataArr.push(Session.userData);
            Session.IDataArr.push(Session.heroData);
        }
        static saveData() {
            for (let i of Session.IDataArr) {
                i.saveData(Session.gameData);
            }
            SenderHttp.create().send();
        }
        static parseData(str) {
            Session.isGuide = false;
            if (str != "" && str != "0") {
                Session.gameData = JSON.parse(str);
                for (let i of Session.IDataArr) {
                    i.setData(Session.gameData);
                }
            }
            else {
                Session.isGuide = true;
                Laya.stage.once(GameEvent.CONFIG_OVER, null, Session.configFun);
            }
        }
        static configFun() {
            for (let i of Session.IDataArr) {
                i.initData(Session.gameData);
            }
            Session.saveData();
        }
    }
    Session.gameData = {};
    Session.homeData = new HomeData();
    Session.talentData = new TalentData();
    Session.userData = new UserData();
    Session.taskData = new TaskData();
    Session.heroData = new HeroData();
    Session.IDataArr = [];

    class DieEffect {
        constructor() {
        }
        static addEffect(player) {
            let effect = Laya.Pool.getItemByClass(DieEffect.TAG, DieEffect);
            if (!effect.sp3d) {
                effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/monsterDie/monster.lh"));
                console.log("创建新的死亡特效");
            }
            effect.sp3d.transform.localRotationEulerY = 45;
            Game.layer3d.addChild(effect.sp3d);
            effect.sp3d.transform.localPosition = player.sp3d.transform.localPosition;
            effect.sp3d.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            setTimeout(() => {
                effect.recover();
            }, 1000);
            return effect;
        }
        recover() {
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(DieEffect.TAG, this);
            if (Game.map0.Eharr.length == 0) {
                CoinEffect.fly();
                Laya.stage.event(Game.Event_EXP);
            }
        }
    }
    DieEffect.TAG = "DieEffect";

    class MonsterBoomEffect {
        constructor() {
            this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/boom/monster.lh"));
        }
        static addEffect(pro, tScale = 1) {
            let effect = Laya.Pool.getItemByClass(MonsterBoomEffect.TAG, MonsterBoomEffect);
            effect.player = pro;
            effect.sp3d.transform.localPosition = pro.sp3d.transform.localPosition;
            Game.layer3d.addChild(effect.sp3d);
            effect.sp3d.transform.localScale = new Laya.Vector3(tScale, tScale, tScale);
            setTimeout(() => {
                effect.recover();
            }, 1000);
            return effect;
        }
        recover() {
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(MonsterBoomEffect.TAG, this);
        }
    }
    MonsterBoomEffect.TAG = "MonsterBoomEffect";

    class GameCube {
        constructor() {
        }
        init(type) {
            if (!this.box) {
                this.box = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/wall/" + type + "/monster.lh"));
                if (type != 3000 && type != 3500 && type != 4000) {
                    this.box.transform.setWorldLossyScale(Game.cameraCN.boxscale);
                }
            }
            Game.layer3d.addChild(this.box);
        }
        static recover() {
            while (GameCube.arr.length > 0) {
                let rube = GameCube.arr.shift();
                rube.box.removeSelf();
                Laya.Pool.recover(GameCube.TAG + rube.type, rube);
            }
            GameCube.arr.length = 0;
        }
        static getOne(v3, type) {
            type = GameCube.getType(type);
            let tag = GameCube.TAG + type;
            Game.poolTagArr[tag] = tag;
            let rube = Laya.Pool.getItemByClass(tag, GameCube);
            rube.init(type);
            rube.box.transform.position = v3;
            GameCube.arr.push(rube);
            return rube;
        }
        static getType(type) {
            if (type == 1 || (type >= 1000 && type < 1500)) {
                return 1000;
            }
            if (type == 2 || (type >= 1500 && type < 2000)) {
                return 1500;
            }
            if (type == 3 || (type >= 2000 && type < 2500)) {
                return 2000;
            }
            if (type == 4 || (type >= 2500 && type < 3000)) {
                return 2500;
            }
            if (type == 5 || (type >= 3000 && type < 3500)) {
                return 3000;
            }
            if (type == 6 || (type >= 3500 && type < 4000)) {
                return 3500;
            }
            if (type == 7 || (type >= 4000 && type < 4500)) {
                return 4000;
            }
            if (type == 8 || (type >= 4500 && type < 5000)) {
                return 4500;
            }
            if (type == 9 || (type >= 5000 && type < 5500)) {
                return 5000;
            }
            if (type == 10 || (type >= 5500 && type < 6000)) {
                return 5500;
            }
        }
    }
    GameCube.TAG = "GameCube_";
    GameCube.arr = [];

    class BattleLoader {
        constructor() {
            this._index = 1;
            this.resAry = [];
            this.pubResAry = [];
            this.isLoadPub = false;
            this._isHeroLoaded = false;
            this._isMonsterLoaded = false;
            this.monsterRes = {};
            this.cubeRes = {};
            this.monsterId = 0;
            this.curBoTimes = 0;
            this.maxBoTimes = 0;
            this.bgRes = {};
        }
        get index() {
            return this._index;
        }
        set index(v) {
            this._index = v;
        }
        get mapId() {
            return this._mapId;
        }
        onRelease() {
            console.log("释放资源了");
        }
        clearMonster() {
            for (let key in MonsterShader.map) {
                let shader = MonsterShader.map[key];
                if (shader) {
                    delete MonsterShader.map[key];
                }
            }
            for (let key in this.monsterRes) {
                if (key != '') {
                    let sp = Laya.loader.getRes(key);
                    if (sp) {
                        sp.destroy(true);
                    }
                }
            }
            for (let key in this.cubeRes) {
                if (key != '') {
                    let sp = Laya.loader.getRes(key);
                    if (sp) {
                        sp.destroy(true);
                    }
                }
            }
            let tagArr = [DieEffect.TAG, Coin.TAG, MonsterBoomEffect.TAG];
            for (let key in Game.poolTagArr) {
                tagArr.push(key);
            }
            for (let i = 0; i < tagArr.length; i++) {
                let arr = Laya.Pool.getPoolBySign(tagArr[i]);
                for (let j = 0; j < arr.length; j++) {
                    let sp3d = arr[j].sp3d;
                    if (sp3d) {
                        sp3d.destroy(true);
                        sp3d = null;
                    }
                    arr[j] = null;
                }
                if (arr.length > 0) {
                    Laya.Pool.clearBySign(tagArr[i]);
                    console.log("清理资源", tagArr[i]);
                }
            }
            Laya.Resource.destroyUnusedResources();
            console.log("释放显存");
        }
        load(res) {
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
            if (this.continueRes) {
                this._mapId = this.continueRes.mapId;
                this._index = this.continueRes.index;
                this._configId = this.continueRes.configId;
                Game.battleCoins = this.continueRes.coins;
            }
            else {
                let maxCeng = SysMap.getTotal(Session.gameData.chapterId);
                if (this._index > maxCeng) {
                    this._index = 1;
                }
                this._mapId = Session.homeData.chapterId * 1000 + this._index;
                let configId;
                if (Session.isGuide) {
                    configId = 100100;
                }
                else {
                    this.sysMap = SysMap.getData(Session.homeData.chapterId, this._mapId);
                    this.curBoTimes = 0;
                    this.maxBoTimes = this.sysMap.numEnemy;
                    this.monsterGroup = this.sysMap.enemyGroup.split(",");
                    let configArr = this.sysMap.stageGroup.split(',');
                    configId = Number(configArr[Math.floor(configArr.length * Math.random())]);
                }
                this._configId = configId;
            }
            console.log("当前地图", this._mapId, this._configId);
            Laya.loader.load("h5/mapConfig/" + this._configId + ".json", new Laya.Handler(this, this.loadBg));
        }
        preload() {
            let arr = [
                "h5/mapbg/1.jpg",
                "res/atlas/shengli.atlas",
                "res/atlas/icons/skill.atlas",
                "res/atlas/bg.atlas",
                "res/atlas/map_1.atlas",
                "res/atlas/jiesuan.atlas"
            ];
            Laya.loader.load(arr, Laya.Handler.create(this, this.onCompletePre));
        }
        onCompletePre() {
            console.log("2D资源加载完毕");
            this.loadHeroRes();
        }
        loadHeroRes() {
            let pubRes = [
                "h5/zhalan/hero.lh", "h5/effects/door/monster.lh",
                "h5/effects/foot/hero.lh", "h5/effects/head/monster.lh",
                "h5/bullets/skill/5009/monster.lh", "h5/bulletsEffect/20000/monster.lh", "h5/bullets/20000/monster.lh", "h5/hero/hero.lh"
            ];
            if (Session.isGuide) {
                pubRes.push("h5/effects/guide/monster.lh");
            }
            Laya.loader.create(pubRes, Laya.Handler.create(this, this.onCompleteHero), new Laya.Handler(this, this.onProgress));
        }
        onCompleteHero() {
            console.log("主角所需资源加载完毕");
            this._isHeroLoaded = true;
            this.allLoadCom();
        }
        loadBg() {
            let map = Laya.loader.getRes("h5/mapConfig/" + this._configId + ".json");
            GameBG.MAP_ROW = map.rowNum + 4;
            GameBG.MAP_COL = map.colNum;
            GameBG.MAP_ROW2 = Math.floor(GameBG.MAP_ROW * 0.5);
            GameBG.MAP_COL2 = Math.floor(GameBG.MAP_COL * 0.5);
            GameBG.bgId = map.bgId;
            GameBG.bgWW = map.bgWidth;
            GameBG.bgHH = map.bgHeight + 250;
            GameBG.bgCellWidth = map.cellWidth;
            GameBG.arr0 = map.arr;
            let bgType = map.bgType ? map.bgType : 1;
            bgType = Math.max(bgType, 1);
            GameBG.BG_TYPE_NUM = bgType;
            GameBG.BG_TYPE = "map_" + bgType;
            Laya.loader.clearRes("h5/mapConfig/" + this._configId + ".json");
            if (this.bgRes[GameBG.BG_TYPE_NUM]) {
                this.onBgComplete();
            }
            else {
                Laya.loader.load("h5/mapbg/" + GameBG.BG_TYPE_NUM + ".jpg", Laya.Handler.create(this, this.onBgComplete));
            }
        }
        onBgComplete() {
            this.bgRes[GameBG.BG_TYPE_NUM] = GameBG.BG_TYPE_NUM;
            this.onLoadMonster();
        }
        onLoadMonster() {
            this.resAry.length = 0;
            this.monsterRes = {};
            this.cubeRes = {};
            let res;
            let k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    let type = GameBG.arr0[k];
                    if (k < GameBG.arr0.length) {
                        if (this.continueRes == null && GridType.isMonster(type)) {
                            this.getMonsterRes(type);
                        }
                        else if (GridType.isCube(type)) {
                            this.getSceneRes(type);
                        }
                    }
                    k++;
                }
            }
            for (let key in this.monsterRes) {
                if (key != '') {
                    this.resAry.push(key);
                }
            }
            if (this.resAry.length > 0) {
                let pubResAry = ["h5/effects/monsterDie/monster.lh", "h5/coins/monster.lh", "h5/effects/boom/monster.lh",];
                for (let j = 0; j < pubResAry.length; j++) {
                    res = pubResAry[j];
                    this.monsterRes[res] = res;
                    this.resAry.push(res);
                }
            }
            for (let key in this.cubeRes) {
                if (key != '') {
                    this.resAry.push(key);
                }
            }
            this._isMonsterLoaded = false;
            console.log('资源列表', this.resAry);
            if (this.resAry.length > 0) {
                Laya.loader.create(this.resAry, Laya.Handler.create(this, this.onCompleteMonster), new Laya.Handler(this, this.onProgress));
            }
            else {
                this.onCompleteMonster();
            }
        }
        getSceneRes(type) {
            let cubeType = GameCube.getType(type);
            let res = "h5/wall/" + cubeType + "/monster.lh";
            this.cubeRes[res] = res;
        }
        onCompleteMonster() {
            console.log("怪物所需资源加载完毕");
            this._isMonsterLoaded = true;
            this.allLoadCom();
        }
        onProgress(value) {
            if (!this._loading) {
                return;
            }
            value = Math.ceil(value * 100);
            value = Math.min(value, 100);
            this._loading.txt.text = value + "%";
        }
        allLoadCom() {
            if (this._isHeroLoaded && this._isMonsterLoaded) {
                console.log("所有资源都加载完毕");
                CoinEffect.coinsAry.length = 0;
                Game.scenneM.showBattle();
                Game.scenneM.battle.init();
                this._loading.removeSelf();
            }
        }
        getMonsterRes(id) {
            console.log("怪物id", id);
            let res = '';
            let sysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, id);
            res = "h5/monsters/" + sysEnemy.enemymode + "/monster.lh";
            this.monsterRes[res] = res;
            if (sysEnemy.normalAttack > 0) {
                let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, sysEnemy.normalAttack);
                if (sysBullet.bulletMode > 0) {
                    res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                    this.monsterRes[res] = res;
                }
                if (sysBullet.boomEffect > 0) {
                    res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                    this.monsterRes[res] = res;
                }
            }
            if (sysEnemy.skillId.length > 0 && sysEnemy.skillId != '0') {
                var skillarr = sysEnemy.skillId.split(',');
                for (var m = 0; m < skillarr.length; m++) {
                    let id = Number(skillarr[m]);
                    if (id > 0) {
                        let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, Number(id));
                        if (sysBullet.bulletMode > 0) {
                            res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                            this.monsterRes[res] = res;
                        }
                        if (sysBullet.boomEffect > 0) {
                            res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                            this.monsterRes[res] = res;
                        }
                        if (sysBullet.callInfo != '0') {
                            let infoAry = sysBullet.callInfo.split('|');
                            for (let i = 0; i < infoAry.length; i++) {
                                let info = infoAry[i].split(',');
                                if (info.length == 3) {
                                    let monsterId = Number(info[0]);
                                    this.getMonsterRes(monsterId);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    class HeadTranslateScript extends Laya.Script3D {
        constructor() {
            super();
            this.flag = false;
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            if (this.flag) {
                this.box.transform.translate(new Laya.Vector3(0, -0.05, 0), false);
            }
            else {
                this.box.transform.translate(new Laya.Vector3(0, 0.05, 0), false);
            }
            if (this.box.transform.localPositionY >= 1) {
                this.flag = true;
            }
            else if (this.box.transform.localPositionY <= 0) {
                this.flag = false;
            }
        }
        onDisable() {
        }
    }

    class SysChapter {
        constructor() {
            this.id = 0;
            this.name = '';
            this.image = '';
            this.status = 0;
            this.winCondition = 0;
            this.beforeId = 0;
            this.npcDamagescale = 0;
            this.npcHealthscale = 0;
            this.description = '';
        }
    }
    SysChapter.NAME = 'sys_stagemap.txt';

    class WorldCell extends ui.test.worldCellUI {
        constructor() {
            super();
            this.mapBtn.clickHandler = new Laya.Handler(this, this.onClick);
            this.suo.visible = false;
        }
        onClick() {
            if (!this.suo.visible) {
                Laya.stage.event(GameEvent.START_BATTLE);
            }
            else {
                FlyUpTips.setTips("未开启");
            }
        }
        update(sysChapter) {
            this.suo.visible = Session.gameData.chapterId < sysChapter.id;
            this.mapBtn.gray = this.suo.visible;
            this.cengshuTxt.text = "";
            if (!this.suo.visible) {
                let maxCeng = SysMap.getTotal(Session.gameData.chapterId);
                if (sysChapter.id == Session.gameData.chapterId) {
                    this.cengshuTxt.text = "最高层数:" + Session.gameData.mapIndex + "/" + maxCeng;
                }
                else {
                    this.cengshuTxt.text = "最高层数:" + maxCeng + "/" + maxCeng;
                }
            }
            console.log("刷新大关卡");
        }
    }

    class WorldView extends ui.test.worldUI {
        constructor() {
            super();
            this.list = new Laya.List();
            this.list.pos(this.box.x, this.box.y);
            this.addChild(this.list);
            this.list.itemRender = WorldCell;
            this.list.repeatX = 1;
            this.list.repeatY = 2;
            this.list.vScrollBarSkin = "";
            this.list.renderHandler = new Laya.Handler(this, this.updateItem);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        updateItem(cell, index) {
            cell.update(this.list.array[index]);
        }
        onDis() {
            let arr = App.tableManager.getTable(SysChapter.NAME);
            this.list.array = arr;
        }
    }

    class AcheievementCell extends ui.test.chengjiu_1UI {
        constructor() {
            super();
        }
    }

    class AchievementsView extends ui.test.chengjiuUI {
        constructor() {
            super();
            this.list = new Laya.List();
            this.list.pos(this.listBox.x, this.listBox.y);
            this.addChild(this.list);
            this.list.itemRender = AcheievementCell;
            this.list.repeatX = 1;
            this.list.repeatY = 4;
            this.list.vScrollBarSkin = "";
            this.list.renderHandler = new Laya.Handler(this, this.updateItem);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.list.array = [, , , , , , , , ,];
            this.refresh();
            this.effect();
        }
        refresh() {
        }
        effect() {
            this.list.mouseEnabled = false;
            let len = this.list.cells.length;
            for (let i = 0; i < len; i++) {
                this.tw(this.list.cells[i], i * 100);
            }
            Laya.timer.once(len * 100 + 800, this, this.mouseFun);
        }
        mouseFun() {
            this.list.mouseEnabled = true;
        }
        tw(cell, delay) {
            let t = new Laya.Tween();
            t.from(cell, { y: cell.y + this.list.height - cell.height }, 800 + delay, Laya.Ease.backIn, null);
        }
        updateItem() {
        }
    }

    class CookieKey {
    }
    CookieKey.CURRENT_BATTLE = "CURRENT_BATTLE";
    CookieKey.MUSIC_SWITCH = "MUSIC_SWITCH";
    CookieKey.SOUND_SWITCH = "SOUND_SWITCH";
    CookieKey.USER_ID = "USER_ID";

    class SettingView extends ui.test.settingUI {
        constructor() {
            super();
            this.yuyan.clickHandler = new Laya.Handler(this, this.onLanguage);
            this.yinxiao.clickHandler = new Laya.Handler(this, this.onSound);
            this.yinyue.clickHandler = new Laya.Handler(this, this.onMusic);
            this.ver.text = "VER:" + Game.resVer;
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                this.musicImg.skin = res.state == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
                this.yinyue.skin = res.state == 1 ? "main/btn_lv.png" : "main/btn_hong.png";
            });
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                this.soundImg.skin = res.state == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
                this.yinxiao.skin = res.state == 1 ? "main/btn_lv.png" : "main/btn_hong.png";
            });
        }
        onLanguage() {
        }
        onSound() {
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 0 });
                    this.soundImg.skin = "shezhi/guan.png";
                    App.soundManager.setSoundVolume(0);
                    this.yinxiao.skin = "main/btn_hong.png";
                }
                else {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    this.soundImg.skin = "shezhi/kai.png";
                    App.soundManager.setSoundVolume(1);
                    this.yinxiao.skin = "main/btn_lv.png";
                }
            });
        }
        onMusic() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 0 });
                    this.musicImg.skin = "shezhi/guan.png";
                    App.soundManager.setMusicVolume(0);
                    this.yinyue.skin = "main/btn_hong.png";
                }
                else {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    this.musicImg.skin = "shezhi/kai.png";
                    App.soundManager.setMusicVolume(1);
                    Game.playBgMusic();
                    this.yinyue.skin = "main/btn_lv.png";
                }
            });
        }
    }

    class SelectTalent extends ui.test.TalentViewUI {
        constructor() {
            super();
            this.arr = [];
            this.arr.push(this.b0, this.b1, this.b2, this.b3, this.b4, this.b5);
            for (let k of this.arr) {
                k.wenhao.box1.visible = false;
                k.wenhao.select.visible = false;
                k.back.select.visible = false;
                k.back.box2.visible = false;
                k.on(Laya.Event.CLICK, this, this.clickFun, [k]);
            }
        }
        clickFun(e) {
            let now = Math.floor(Math.random() * 9) + 1;
            let obj = Session.talentData.getImgData(now);
            e.back.logo1.skin = obj.logo;
            e.back.bg1.skin = obj.bg;
            e.back.txtImg.skin = obj.font;
            let lv = Session.talentData.getLv(now);
            e.back.lv.value = (lv + 1) + "";
            Session.talentData.lvUp(now);
            e.back.select.visible = true;
            this.mouseEnabled = false;
            let t = new Laya.Tween();
            t.to(e, { scaleX: -1, update: new Laya.Handler(this, this.upFun, [e]) }, 600);
            this.timer.once(2000, this, this.timerFun);
        }
        timerFun() {
            this.close();
        }
        upFun(e) {
            if (e.scaleX <= 0) {
                e.wenhao.visible = false;
            }
        }
    }

    class TalentCell2 extends ui.test.TianFuCellUI {
        constructor() {
            super();
        }
    }

    class TalentView extends ui.test.talentUI {
        constructor() {
            super();
            this.height = Laya.stage.height;
            this.width = Laya.stage.width;
            this.list.itemRender = TalentCell2;
            this.on(Laya.Event.DISPLAY, this, this.disFun);
            this.shengmingniu.clickHandler = new Laya.Handler(this, this.btnFun);
            Laya.stage.on(GameEvent.TALENT_UPDATE, this, this.tFun);
            this.list.renderHandler = new Laya.Handler(this, this.renderFun);
        }
        selectFun(index) {
            console.log(index);
            if (index == -1) {
                this.tipBox.visible = false;
                return;
            }
            let lv = Session.talentData.getLv(index + 1);
            this.tipBox.visible = true;
            let b = this.list.getCell(index);
            this.tipBox.x = this.list.x + b.x - 130;
            this.tipBox.y = this.list.y + b.y + 200;
            let sys = App.tableManager.getDataByNameAndId(SysTalentInfo.NAME, index + 1);
            this.txt5.text = sys.talentInfo + ":" + Session.talentData.getTxt(index) + "%";
        }
        renderFun(cell, index) {
            let sys = this.list.getItem(index);
            let obj = Session.talentData.getImgData(sys.id);
            cell.logo1.skin = obj.logo;
            cell.bg1.skin = obj.bg;
            cell.txtImg.skin = obj.font;
            let lv = Session.talentData.getLv(sys.id);
            cell.lv.value = lv + "";
            cell.box1.visible = cell.box2.visible = false;
            if (lv == 0) {
                cell.box2.visible = true;
            }
            else {
                cell.box1.visible = true;
            }
            cell.select.visible = (this.list.selectedIndex == index);
            cell.on(Laya.Event.CLICK, this, this.cellClickFun, [cell, index]);
        }
        cellClickFun(cell, index) {
            if (index == -1) {
                this.tipBox.visible = false;
                return;
            }
            let lv = Session.talentData.getLv(index + 1);
            if (lv == 0) {
                this.tipBox.visible = false;
            }
            else {
                this.tipBox.visible = true;
                this.tipBox.x = this.list.x + cell.x - 60;
                this.tipBox.y = this.list.y + cell.y + 200;
                let sys = App.tableManager.getDataByNameAndId(SysTalentInfo.NAME, index + 1);
                this.txt5.text = sys.talentInfo + ":" + Session.talentData.getTxt(index) + "%";
            }
        }
        tFun() {
            this.refresh();
        }
        btnFun() {
            let d = new SelectTalent();
            d.popup(false);
        }
        disFun() {
            this.tipBox.visible = false;
            this.refresh();
        }
        refresh() {
            let sysArr = App.tableManager.getTable(SysTalentInfo.NAME);
            this.list.array = sysArr;
            this.shengmingniu.disabled = !Session.talentData.haveGold();
        }
        effect() {
            this.list.mouseEnabled = false;
            let len = this.list.cells.length;
            for (let i = 0; i < len; i++) {
                this.tw(this.list.cells[i], i * 100);
            }
            Laya.timer.once(len * 100 + 800, this, this.mouseFun);
        }
        mouseFun() {
            this.list.mouseEnabled = true;
        }
        tw(cell, delay) {
            let t = new Laya.Tween();
            t.from(cell, { y: cell.y + this.list.height - cell.height }, 800 + delay, Laya.Ease.backIn, null);
        }
    }

    class RotationEffect {
        constructor() {
        }
        rotation(s, ro) {
            this.s = s;
            this.ro = ro;
            Laya.timer.frameLoop(1, this, this.loopFun);
            s.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            Laya.timer.clear(this, this.loopFun);
        }
        loopFun() {
            this.s.rotation += this.ro;
        }
        static play(s, ro = 1) {
            let a = new RotationEffect();
            a.rotation(s, ro);
        }
    }

    var AD_TYPE;
    (function (AD_TYPE) {
        AD_TYPE[AD_TYPE["AD_DIAMOND"] = 0] = "AD_DIAMOND";
    })(AD_TYPE || (AD_TYPE = {}));

    class GetItemCell extends ui.test.GetItemCellUI {
        constructor() {
            super();
            RotationEffect.play(this.light);
            this.anchorX = this.anchorY = 0.5;
        }
        setData(data) {
            if (data.type == GoldType.BLUE_DIAMONG) {
                this.v1.blue.visible = true;
            }
            else if (data.type == GoldType.RED_DIAMONG) {
                this.v1.red.visible = true;
            }
            else if (data.type == GoldType.GOLD) {
                this.v1.gold.visible = true;
            }
            this.label.text = "+" + data.value;
        }
    }

    class GetItemDialog extends ui.test.GetItemDialogUI {
        constructor() {
            super();
            this.now = 0;
            this.col = 3;
            this.dArr = [];
            this.cellWid = 500;
            this.cellHei = 500;
        }
        setData(value) {
            this.now = 0;
            if (value instanceof Array) {
                this.dArr = value;
            }
            else {
                this.dArr = [value];
            }
            let len = this.dArr.length;
            this.box.width = ((len >= this.col) ? 3 : len) * this.cellWid;
            this.box.height = Math.ceil(len / this.col) * this.cellWid;
            let sw = 750 / this.box.width;
            this.box.scale(sw, sw);
            let wid = this.box.width * this.box.scaleX;
            this.rebornBtn.y = this.box.height * sw + 50;
            if (this.rebornBtn.y > (Laya.stage.height - 80)) {
                this.rebornBtn.y = Laya.stage.height - 80;
            }
            this.box.x = (750 - wid) / 2;
            Laya.timer.once(400, this, this.effect);
            this.height = this.box.height * sw + 200;
            this.rebornBtn.visible = false;
        }
        effect() {
            let v = new GetItemCell();
            v.x = this.now % this.col * this.cellWid + this.cellWid / 2;
            v.y = Math.floor(this.now / this.col) * this.cellHei + this.cellHei / 2;
            v.setData(this.dArr[this.now]);
            this.box.addChild(v);
            this.now++;
            let t = new Laya.Tween();
            t.from(v, { scaleX: 3, scaleY: 3, alpha: 0 }, 300);
            if (this.now < this.dArr.length) {
                Laya.timer.once(100, this, this.effect);
            }
            else {
                this.rebornBtn.visible = true;
            }
        }
    }

    class AdDiamond extends ui.test.juese_tishiUI {
        constructor() {
            super();
            this.goldType = 0;
            RotationEffect.play(this.light);
            this.rebornBtn.clickHandler = new Laya.Handler(this, this.clickFun);
        }
        clickFun() {
            App.sdkManager.playAdVideo(AD_TYPE.AD_DIAMOND, new Laya.Handler(this, this.adFun));
        }
        setGoldType(a) {
            this.goldType = a;
            if (this.goldType == GoldType.BLUE_DIAMONG) {
                this.v1.blue.visible = true;
            }
            else if (this.goldType == GoldType.RED_DIAMONG) {
                this.v1.red.visible = true;
            }
            else if (this.goldType == GoldType.GOLD) {
                this.v1.gold.visible = true;
            }
        }
        adFun() {
            let v = Math.ceil(Math.random() * 4) + 6;
            Session.homeData.changeGold(this.goldType, v, GOLD_CHANGE_TYPE.AD_DIAMOND);
            let g = new GetItemDialog();
            g.setData({ type: this.goldType, value: v });
            g.popup(true);
        }
    }

    class AutoEvent {
        constructor() {
            this.arr = [];
        }
        setSprite(sp) {
            sp.on(Laya.Event.DISPLAY, this, this.disFun);
            sp.on(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            for (let i = 0; i < this.arr.length; i += 3) {
                Laya.stage.off(this.arr[i], this.arr[i + 1], this.arr[i + 2]);
            }
        }
        disFun() {
            for (let i = 0; i < this.arr.length; i += 3) {
                Laya.stage.on(this.arr[i], this.arr[i + 1], this.arr[i + 2]);
            }
        }
        onEvent(e, caller, listener) {
            this.arr.push(e, caller, listener);
            Laya.stage.on(e, caller, listener);
        }
    }

    class SysSkill {
        constructor() {
            this.id = 0;
            this.skillName = '';
            this.skillInfo = '';
            this.skillType = 0;
            this.triggerComparison = 0;
            this.skilltarget = 0;
            this.skillcondition = '';
            this.damagePercent = 0;
            this.skillEffect1 = 0;
            this.upperLimit = 0;
            this.curTimes = 0;
        }
        reset() {
            let ary = App.tableManager.getTable(SysSkill.NAME);
            for (let i = 0; i < ary.length; i++) {
                ary[i].curTimes = 0;
            }
        }
    }
    SysSkill.NAME = 'sys_roleskill.txt';

    class RoleView extends ui.test.jueseUI {
        constructor() {
            super();
            this.nowRoleId = 1;
            this.autoEvent = new AutoEvent();
            this.autoEvent.setSprite(this);
            this.shengmingniu.clickHandler = new Laya.Handler(this, this.hpFun);
            this.gongjiniu.clickHandler = new Laya.Handler(this, this.atkFun);
            this.updateAll();
            this.on(Laya.Event.DISPLAY, this, this.disFun);
            this.jia.clickHandler = new Laya.Handler(this, this.jiaFun, [GoldType.RED_DIAMONG]);
            this.jia2.clickHandler = new Laya.Handler(this, this.jiaFun, [GoldType.BLUE_DIAMONG]);
            this.autoEvent.onEvent(GameEvent.GOLD_CHANGE, this, this.goldChangeFun);
            this.autoEvent.onEvent(GameEvent.HERO_UPDATE, this, this.heroFun);
        }
        heroFun() {
            this.updateAll();
        }
        goldChangeFun() {
            this.updateAll();
        }
        jiaFun(goldType) {
            let d = new AdDiamond();
            d.setGoldType(goldType);
            d.popup();
        }
        disFun() {
            this.updateAll();
        }
        hpFun() {
            Session.heroData.lvUp(this.nowRoleId, HeroLvType.HP);
        }
        atkFun() {
            Session.heroData.lvUp(this.nowRoleId, HeroLvType.ATK);
        }
        updateAll() {
            this.setOne(this.box1, HeroLvType.HP, this.shengmingniu, this.shengmingjia, this.xueshu, this.tiao, this.shengmingshu);
            this.setOne(this.box2, HeroLvType.ATK, this.gongjiniu, this.gongjijia, this.gongshu, this.tiao2, this.gongjishu);
            let sys = SysRoleBase.getSys(this.nowRoleId);
            let sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME, sys.baseSkill);
            this.skillLabel.text = sysSkill.skillInfo;
            this.jinengming.text = sysSkill.skillName;
            this.jinengtubiao.skin = null;
            this.jinengtubiao.skin = "icons/skill/" + sysSkill.id + ".png";
        }
        setOne(box, type, btn, fc, fc2, tiao, allFc) {
            let lv = Session.heroData.getHeroLv(this.nowRoleId, type);
            let sys = SysRoleUp.getSysRole(this.nowRoleId, lv);
            fc.value = "+" + sys.getValue(type);
            let cost = sys.getCost(type);
            let costType = sys.getCostType(type);
            let have = Session.homeData.getGoldByType(costType);
            let can = (have >= cost);
            btn.visible = can;
            box.visible = !can;
            let sysRB = SysRoleBase.getSys(this.nowRoleId);
            let v = sysRB.getValue(type);
            allFc.value = (v + sys.getValue(type)) + "";
            if (box.visible == false) {
                return;
            }
            fc2.value = (have + "/" + cost);
            let vv = (have / cost);
            tiao.scrollRect = new Laya.Rectangle(0, 0, tiao.width * vv, tiao.height);
            tiao.visible = (vv != 0);
        }
    }

    class MainView extends Laya.Box {
        constructor() {
            super();
            this.views = [];
            this.skins = [null, "juese", "tianfu", "chengjiu", "shezhi"];
            this.VIEW_CLAS = [WorldView, RoleView, TalentView, AchievementsView, SettingView];
            this.initUI();
        }
        initUI() {
            this.content = new Laya.Box();
            this.addChild(this.content);
        }
        set selectIndex(index) {
            let view = this.views[index];
            if (!view) {
                let skinName = this.skins[index];
                if (skinName) {
                    Laya.loader.load("res/atlas/" + skinName + ".atlas", new Laya.Handler(this, () => {
                        let CLA = this.VIEW_CLAS[index];
                        this.views[index] = new CLA();
                        this.setView(index);
                    }));
                }
                else {
                    let CLA = this.VIEW_CLAS[index];
                    this.views[index] = new CLA();
                    this.setView(index);
                }
            }
            else {
                this.setView(index);
            }
        }
        setView(index) {
            let view = this.views[index];
            view.removeSelf();
            this.content.addChild(view);
            if (this.curIndex != null) {
                var xx = index > this.curIndex ? GameConfig.width : -GameConfig.width;
                view.x = xx;
                Laya.Tween.clearTween(this.content);
                Laya.Tween.to(this.content, { x: -xx }, 500, null, new Laya.Handler(this, this.onCom, [view]));
            }
            this.curIndex = index;
        }
        onCom(view) {
            this.content.x = 0;
            view.x = 0;
        }
    }

    class MainScene extends Laya.Sprite {
        constructor() {
            super();
            this.verLabel = new Laya.Label();
            this.height = GameBG.height;
            this.initUI();
        }
        initUI() {
            this.mainView = new MainView();
            this.mainUI = new MainUI();
            this.addChild(this.mainView);
            this.addChild(this.mainUI);
            this.addChild(this.verLabel);
            this.verLabel.fontSize = 16;
            this.verLabel.color = "#ffffff";
            Laya.stage.on("switchView", this, this.switchView);
            this.switchView();
            Laya.stage.on(GameEvent.START_BATTLE, this, this.onStartBattle);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis(e) {
        }
        onStartBattle() {
            if (Game.isStartBattle) {
                return;
            }
            Game.isStartBattle = true;
            this.mainUI.appEnergy();
        }
        switchView() {
            this.mainView.selectIndex = this.mainUI.selectIndex;
        }
    }

    class Rocker extends ui.test.RockerViewUI {
        constructor() {
            super();
            this.a = 0;
            this.a3d = 0;
            this.speed = 0;
        }
        reset() {
            this.sp0.x = 0;
            this.sp0.y = 0;
        }
        resetPos() {
            this.x = Laya.stage.width / 2;
            this.y = Laya.stage.height - 200;
        }
        getA() {
            return this.a;
        }
        getA3d() {
            return this.a3d;
        }
        getSpeed() {
            return this.speed;
        }
        setSp0(xx, yy) {
            let n = xx - this.x;
            let m = yy - this.y;
            this.a = Math.atan2(m, n);
            this.a3d = Math.atan2(this.y - yy, xx - this.x);
            let l = Math.sqrt(n * n + m * m);
            if (l > 4) {
                if (l > 80) {
                    l = 80;
                    this.sp0.x = Math.cos(this.a) * l;
                    this.sp0.y = Math.sin(this.a) * l;
                }
                else {
                    this.sp0.x = n;
                    this.sp0.y = m;
                }
                this.speed = 1;
            }
            else {
                this.reset();
                this.speed = 0;
            }
        }
        setSp1(xx, yy) {
            let n = xx - this.x;
            let m = Math.abs(n);
            if (m > 35) {
                n = 35 * (m / n);
            }
            this.sp0.x = n;
            n = yy - this.y;
            m = Math.abs(n);
            if (m > 35) {
                n = 35 * (m / n);
            }
            this.sp0.y = n;
        }
        rotate(n) {
            this.dir.rotation = (2 * Math.PI - n) / Math.PI * 180 + 90;
        }
    }

    class GameMap0 extends Laya.Sprite {
        constructor() {
            super();
            this.info = {};
            this.endRowNum = 0;
            this.map = {};
            this.Amap = {};
            this.futureBox = new GameHitBox(1, 1);
            this._isNext = false;
            this._isNpc = false;
            this.fcount = 0;
            this.sp = new Laya.Point();
            this.ep = new Laya.Point();
            this.ballistic = new Laya.Sprite();
            this.arrhb = new GameHitBox(2, 2);
        }
        reset() {
            this.Aharr = [];
            this.Wharr = [];
            this.Eharr = [];
            this.Hharr = [];
            this.Fharr = [];
            this.Flyharr = [];
            this.info = {};
            this.map = {};
            this.Amap = {};
            this.graphics.clear();
        }
        drawMap() {
            this.info = {};
            this.npcHitBox = null;
            this._isNext = false;
            let hb = null;
            this.reset();
            hb = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww);
            hb.setXY(0, GameBG.ww * 2);
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            hb = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww);
            hb.setXY(0, GameBG.ww * (GameBG.MAP_ROW - 2));
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            hb = new GameHitBox(GameBG.ww, GameBG.ww * GameBG.MAP_ROW);
            hb.setXY(GameBG.ww, 0);
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            hb = new GameHitBox(GameBG.ww, GameBG.ww * GameBG.MAP_ROW);
            hb.setXY(GameBG.ww * (GameBG.MAP_COL - 2), 0);
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            this.endRowNum = GameBG.MAP_COL - 2;
            var k = 0;
            for (var j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    var ww = GameBG.ww;
                    var x = i * ww;
                    var y = j * ww;
                    let key = GameBG.arr0[k];
                    if (k < GameBG.arr0.length) {
                        this.info[j + "_" + i] = key;
                        if (GridType.isWall(key)) {
                            if (this.map[key]) {
                                hb = this.map[key];
                                hb.setRq(hb.x, hb.y, x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                            }
                            else {
                                hb = new GameHitBox(GameBG.ww, GameBG.ww);
                                hb.value = key;
                                hb.setXY(x, y);
                                this.Wharr.push(hb);
                                this.map[key] = hb;
                            }
                        }
                        else if (GridType.isRiverPoint(key)
                            || GridType.isRiverScale9Grid(key)
                            || GridType.isRiverScale9Grid2(key)
                            || GridType.isRiverRow(key)
                            || GridType.isRiverCol(key)
                            || GridType.isRiverPoint(key)) {
                            hb = new GameHitBox(GameBG.ww, GameBG.ww);
                            hb.setXY(x, y);
                            this.Wharr.push(hb);
                        }
                        else if (GridType.isFence(key)) {
                            hb = new GameHitBox(GameBG.ww * 3, GameBG.ww);
                            hb.value = key;
                            hb.setXY(x - GameBG.ww, y);
                            this.Wharr.push(hb);
                        }
                        else if (GridType.isNpc(key)) {
                            this.npcHitBox = new GameHitBox(GameBG.ww * 4, GameBG.ww * 4);
                            this.npcHitBox.setXY(x, y);
                        }
                        if (key == BattleFlagID.DOOR) {
                            this.doorHitBox = new GameHitBox(GameBG.ww * 2, GameBG.ww * 2);
                            this.doorHitBox.setXY(x - GameBG.ww2, y - GameBG.ww2);
                        }
                        else if (key == BattleFlagID.GUIDE) {
                            this.guideHitBox = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww);
                            this.guideHitBox.setXY(x, y);
                        }
                        k++;
                    }
                }
            }
            k = 0;
            for (var j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    var ww = GameBG.ww;
                    var x = i * ww;
                    var y = j * ww;
                    let key = GameBG.arr0[k];
                    if (GridType.isWall(GameBG.arr0[k])) {
                        if (this.Amap[key]) {
                            hb = this.Amap[key];
                            hb.setVV(hb.x, hb.y, x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                        }
                        else {
                            hb = new GameHitBox(GameBG.ww, GameBG.ww);
                            hb.setXY(x, y);
                            this.Aharr.push(hb);
                            this.Amap[key] = hb;
                        }
                    }
                    else if (GridType.isFence(GameBG.arr0[k])) {
                        hb = new GameHitBox(GameBG.ww * 3, GameBG.ww);
                        hb.setXY(x - GameBG.ww, y);
                        this.Aharr.push(hb);
                    }
                    k++;
                }
            }
            this.alpha = 1;
            this.addChild(this.ballistic);
            this.setDoor(false);
        }
        clearNpc() {
            this._isNpc = false;
            this.npcHitBox = null;
            this.graphics.clear();
            for (let i = 0; i < this.Wharr.length; i++) {
                var hb = this.Wharr[i];
                this.graphics.drawRect(hb.left, hb.top, hb.ww, hb.hh, null, 0xff0000);
            }
        }
        checkNpc() {
            let bool = false;
            if (this.npcHitBox && Game.hero.hbox.hit(Game.hero.hbox, this.npcHitBox)) {
                bool = true;
                this._isNpc = true;
                this.npcHitBox = null;
                Laya.stage.event(Game.Event_SELECT_NEWSKILL);
            }
            return bool;
        }
        checkDoor() {
            let bool = false;
            if (this.doorHitBox && Game.hero.hbox.hit(Game.hero.hbox, this.doorHitBox)) {
                bool = true;
                this.doorHitBox = null;
                Game.battleLoader.load();
            }
            return bool;
        }
        setDoor(isOpen) {
            this.graphics.clear();
            for (let i = 0; i < this.Wharr.length; i++) {
                var hb = this.Wharr[i];
                this.graphics.drawRect(hb.left, hb.top, hb.ww, hb.hh, null, 0xff0000);
            }
        }
        chechHitHero_(vx, vy) {
            return this.chechHit(Game.hero, vx, vy);
        }
        chechHit(gamepro, vx, vy) {
            if (this._isNext) {
                return true;
            }
            let chuanqiangSkill = Game.skillManager.isHas(5007);
            let waterSkill = Game.skillManager.isHas(5008);
            var hb = gamepro.hbox;
            var fb = this.futureBox;
            fb.setRq(hb.x + vx, hb.y + vy, hb.ww, hb.hh);
            for (let i = 0; i < this.Wharr.length; i++) {
                let ehb = this.Wharr[i];
                if (gamepro == Game.hero) {
                    if (i == 0 && ehb.hit(ehb, fb)) ;
                    if (chuanqiangSkill && (GridType.isWall(ehb.value) || GridType.isFence(ehb.value))) {
                        continue;
                    }
                    if (waterSkill && ehb.value == 7777) {
                        continue;
                    }
                }
                if (ehb.hit(ehb, fb)) {
                    return true;
                }
            }
            return false;
        }
        chechHitArrs(gamepro, vx, vy, thbArr) {
            var hb = gamepro.hbox;
            var fb = this.futureBox;
            fb.setRq(hb.x + vx, hb.y + vy, hb.ww, hb.hh);
            for (let i = 0; i < thbArr.length; i++) {
                let ehb = thbArr[i];
                if (ehb == hb) {
                    continue;
                }
                if (ehb.hit(ehb, fb)) {
                    return true;
                }
            }
            return false;
        }
        chechHit_arr(thb, thbArr) {
            let ehb = null;
            for (let i = 0; i < thbArr.length; i++) {
                ehb = thbArr[i];
                if (ehb.hit(ehb, thb)) {
                    return ehb;
                }
            }
            return null;
        }
        chechHit_arr_all(thb, thbArr) {
            let arr = null;
            let ehb = null;
            for (let i = 0; i < thbArr.length; i++) {
                ehb = thbArr[i];
                if (ehb.hit(ehb, thb)) {
                    if (!arr)
                        arr = [];
                    arr.push(ehb);
                }
            }
            return arr;
        }
        lineTest(arr, vv) {
            var ebh;
            var ebs = [];
            let l;
            var sp;
            for (let i = 0; i < arr.length; i++) {
                ebh = arr[i];
                l = ebh.getBottom();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
                l = ebh.getTop();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
                l = ebh.getLeft();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
                l = ebh.getRight();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
            }
            return ebs;
        }
        getPointAndLine(vv, arr) {
            var ebs = this.lineTest(arr, vv);
            if (ebs.length <= 0)
                return null;
            if (ebs.length == 3)
                return ebs;
            var x0 = vv.x0;
            var y0 = vv.y0;
            var rs0 = null;
            var rs1 = null;
            var rs2 = null;
            var len = -1;
            for (let i = 0; i < ebs.length; i += 3) {
                var p = ebs[i];
                var tlen = MaoLineData.len(x0, y0, p.x, p.y);
                if (len == -1) {
                    rs0 = p;
                    rs1 = ebs[i + 1];
                    rs2 = ebs[i + 2];
                    len = tlen;
                }
                else if (tlen < len) {
                    rs0 = p;
                    rs1 = ebs[i + 1];
                    rs2 = ebs[i + 2];
                    len = tlen;
                }
            }
            ebs.length = 2;
            ebs[0] = rs0;
            ebs[1] = rs1;
            ebs[2] = rs2;
            return ebs;
        }
        drawBallistic(heron) {
            Game.hero.hbox.setXY(Game.hero.sp2d.x, Game.hero.sp2d.y);
            var vx = Math.cos(heron) * GameBG.mw2;
            var vy = Math.sin(heron) * GameBG.mw2;
            var x0 = Game.hero.hbox.cx;
            var y0 = Game.hero.hbox.cy;
            this.sp.x = x0;
            this.sp.y = y0;
            this.fcount = 0;
            var g = this.ballistic.graphics;
            g.clear();
            for (let i = 0; i < 6000; i++) {
                this.arrhb.setVV(x0, y0, vx, vy);
                var ebh;
                ebh = this.chechHit_arr(this.arrhb, this.Wharr);
                if (ebh) {
                    g.drawRect(this.arrhb.x, this.arrhb.y, this.arrhb.ww, this.arrhb.hh, null, "#ff0000");
                    g.drawRect(ebh.x, ebh.y, ebh.ww, ebh.hh, "#00ff00", "#00ff00");
                    g.drawLine(this.sp.x, this.sp.y, x0, y0, "#ff0000");
                    this.sp.x = x0;
                    this.sp.y = y0;
                    if (this.fcount < 4) {
                        if (!this.chechHit_arr(this.arrhb.setVV(x0, y0, -1 * vx, vy), this.Wharr)) {
                            vx = -1 * vx;
                            this.fcount++;
                        }
                        else if (!this.chechHit_arr(this.arrhb.setVV(x0, y0, vx, -1 * vy), this.Wharr)) {
                            vy = -1 * vy;
                            this.fcount++;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
                else {
                    g.drawRect(this.arrhb.x, this.arrhb.y, this.arrhb.ww, this.arrhb.hh, null, "#0000ff");
                    x0 += vx;
                    y0 += vy;
                }
            }
        }
    }

    class PlaneGameMove extends GameMove {
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            if (Game.map0.chechHit(pro, vx, vz)) {
                if (vz != 0 && Game.map0.chechHit(pro, vx, 0)) {
                    vx = 0;
                    vz = (vz < 0 ? -1 : 1) * pro.speed;
                }
                if (vx != 0 && Game.map0.chechHit(pro, 0, vz)) {
                    vz = 0;
                    vx = (vx < 0 ? -1 : 1) * pro.speed;
                }
                if (Game.map0.chechHit(pro, vx, vz)) {
                    return false;
                }
            }
            if (!this.Blocking(pro, vx, vz)) {
                return false;
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class HeroArrowAI extends GameAI {
        constructor(pro) {
            super();
            this.i = 0;
            this.pro = pro;
        }
        hit(pro) {
            this.pro.die();
        }
        exeAI(pro) {
            if (pro.isDie) {
                return false;
            }
            if (this.i == 0 && !pro.move2D(pro.face2d)) {
                this.i = 1;
                return false;
            }
            if (this.i > 0) {
                this.i++;
                if (this.i > 30) ;
            }
        }
        starAi() {
            this.i = 0;
        }
        stopAi() {
            this.i = 0;
        }
    }

    class ArrowGameMove0 extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(2, 2);
            this.speed = 0;
            this.sp = new Laya.Point();
            this.st = 0;
            this.n = 0;
            this.cos = 0;
            this.sin = 0;
            this.arrowlen = 10;
            this.line = new MaoLineData(0, 0, 0, this.arrowlen);
            this.vv = new MaoLineData(0, 0, 0, 1);
            this.fv = null;
            this.ii = 1;
        }
        move2d(n, pro, speed, hitStop) {
            if (pro.isDie) {
                return false;
            }
            if (speed == 0)
                return false;
            if (this.fv != null) {
                pro.rotation(2 * Math.PI - this.fv.atan2());
                n = pro.face2d;
                pro.setcXcY2DBox(this.fv.x1, this.fv.y1);
                this.fv = null;
            }
            var now = Game.executor.getWorldNow();
            if (this.speed != speed || this.n != n) {
                this.sp.x = pro.hbox.x;
                this.sp.y = pro.hbox.y;
                this.st = now;
                this.n = n;
                this.sin = Math.sin(n);
                this.cos = Math.cos(n);
                this.speed = speed;
            }
            var hits = Game.map0.Eharr;
            if (pro.hit_blacklist) {
                var tem = [];
                for (let i = 0; i < hits.length; i++) {
                    var e = hits[i];
                    if (!pro.checkBlackList(e)) {
                        tem.push(e);
                    }
                }
                hits = tem;
            }
            var box = pro.hbox;
            var line = this.line;
            line.reset00(box.cx, box.cy);
            line.rad(n);
            var vv = this.vv;
            box = this.future.setRq(line.x1 - GameBG.mw4, line.y1 - GameBG.mw4, GameBG.mw2, GameBG.mw2);
            var enemy = Game.map0.chechHit_arr(this.future, hits);
            if (enemy) {
                if (this.hitEnemy(enemy, pro) == 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            box = this.future.setVV(line.x0, line.y0, line.x_len, line.y_len);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                vv.reset(line.x0, line.y0, line.x1, line.y1);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    enemy = rs[2];
                    if (enemy) {
                        if (this.hitEnemy(enemy, pro) == 0) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
                box = this.future.setVV(line.x1, line.y1, vx, vz);
                var all = Game.map0.chechHit_arr_all(this.future, hits);
                if (all) {
                    vv.reset(line.x0, line.y0, line.x1, line.y1);
                    var rs = Game.map0.getPointAndLine(vv, all);
                    if (rs) {
                        enemy = rs[2];
                        if (enemy) {
                            if (this.hitEnemy(enemy, pro) == 0) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }
                }
            }
            hits = Game.map0.Aharr;
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            box = this.future.setVV(line.x1, line.y1, vx, vz);
            vv.reset(line.x1, line.y1, line.x1 + vx, line.y1 + vz);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    var p = rs[0];
                    var l = rs[1];
                    vv.reset(vv.x0, vv.y0, p.x, p.y);
                    pro.setXY2D(pro.pos2.x + vv.x_len, pro.pos2.z + vv.y_len);
                    l = vv.rebound(l);
                    if (l) {
                        l.resetlen(this.arrowlen);
                    }
                }
                pro.fcount--;
                if (pro.fantanSkill) {
                    pro.hurtValue = Math.floor(pro.hurtValue * pro.fantanSkill.damagePercent / 100);
                }
                this.fv = l;
                if (pro.fcount <= 0) {
                    pro.die();
                    return false;
                }
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            if (Math.abs(pro.pos2.x) > GameBG.ww * GameBG.MAP_COL || Math.abs(pro.pos2.z) > GameBG.ww * GameBG.MAP_ROW) {
                pro.die();
            }
            return true;
        }
        sore0(g0, g1) {
            if (!this.he_)
                return 0;
            return GameHitBox.faceToLenth(this.he_, g0) - GameHitBox.faceToLenth(this.he_, g1);
        }
        hitEnemy(enemy, pro) {
            enemy.linkPro_.event(Game.Event_Hit, pro);
            if (pro.tansheSkill && this.ii > 0) {
                if (!pro.hit_blacklist) {
                    pro.hit_blacklist = [];
                }
                pro.hit_blacklist.push(enemy);
                this.ii--;
                if (pro.tansheSkill) {
                    pro.hurtValue = Math.floor(pro.hurtValue * pro.tansheSkill.damagePercent / 100);
                }
                else if (pro.chuantouSkill) {
                    pro.hurtValue = Math.floor(pro.hurtValue * pro.chuantouSkill.damagePercent / 100);
                }
                let arr = Game.map0.Eharr;
                for (let i = 0; i < arr.length; i++) {
                    let e = arr[i];
                    if (e != enemy) {
                        pro.setXY2D(enemy.linkPro_.pos2.x, enemy.linkPro_.pos2.z);
                        var a = GameHitBox.faceTo3D(pro.hbox, e);
                        pro.rotation(a);
                        return 1;
                    }
                }
                pro.die();
                return 0;
            }
            if (!pro.chuantouSkill) {
                if (!pro.hit_blacklist) {
                    pro.hit_blacklist = [];
                }
                pro.hit_blacklist.push(enemy);
                pro.die();
                return 0;
            }
            pro.die();
            return 0;
        }
    }

    class HeroBullet extends GamePro {
        constructor() {
            super(GameProType.HeroArrow);
            this.buffAry = [];
            this.fcount = 0;
            this.setGameMove(new ArrowGameMove0());
            this.setGameAi(new HeroArrowAI(this));
        }
        setBullet(id) {
            if (!this.sp3d) {
                this.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + id + "/monster.lh")));
                console.log("创建主角的子弹");
            }
            if (Game.skillManager.arrowHeadId > 0) {
                if (!this.head) {
                    let ss = Laya.loader.getRes("h5/bullets/skill/" + Game.skillManager.arrowHeadId + "/monster.lh");
                    if (ss) {
                        this.head = Laya.Sprite3D.instantiate(ss);
                        this.head.transform.localRotationEulerY = -180;
                        this.addSprite3DToChild("Gua", this.head);
                    }
                }
            }
        }
        static getBullet(id) {
            let bullet = Laya.Pool.getItemByClass(HeroBullet.TAG, HeroBullet);
            bullet.hit_blacklist = null;
            bullet.getGameMove().fv = null;
            bullet.getGameMove().ii = 1;
            bullet.chuantouSkill = null;
            bullet.fantanSkill = null;
            bullet.fcount = 0;
            bullet.tansheSkill = null;
            bullet.buffAry.length = 0;
            bullet.isDie = false;
            bullet.setBullet(id);
            bullet.chuantouSkill = Game.skillManager.isHas(1006);
            bullet.fantanSkill = Game.skillManager.isHas(1008);
            bullet.fcount = bullet.fantanSkill ? 2 : 0;
            bullet.tansheSkill = Game.skillManager.isHas(1009);
            let arr = [2001, 2002, 2003, 5001, 5002, 5003, 5004];
            for (let i = 0; i < arr.length; i++) {
                if (Game.skillManager.isHas(arr[i])) {
                    bullet.buffAry.push(arr[i]);
                }
            }
            return bullet;
        }
        die() {
            if (this.isDie) {
                return;
            }
            this.isDie = true;
            this.stopAi();
            this.setSpeed(0);
            this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
            Laya.Pool.recover(HeroBullet.TAG, this);
        }
    }
    HeroBullet.TAG = 'HeroBullet';

    class Shooting {
        constructor() {
            this.scd = 0;
            this.st = 0;
            this.et = 0;
            this.now = 0;
            this.at = 0;
            this.future = new GameHitBox(2, 2);
        }
        short_arrow(speed_, r_, pro, attackPower, bulletId = 20000) {
            let bo = HeroBullet.getBullet(bulletId);
            for (let i = 0; i < bo.buffAry.length; i++) {
                let sys = App.tableManager.getDataByNameAndId(SysSkill.NAME, bo.buffAry[i]);
                attackPower = attackPower * sys.damagePercent / 100;
            }
            bo.hurtValue = Math.floor(attackPower);
            bo.sp3d.transform.localPositionY = 0.8;
            bo.setXY2D(pro.pos2.x, pro.pos2.z);
            bo.setSpeed(speed_);
            bo.rotation(r_);
            bo.gamedata.bounce = pro.gamedata.bounce;
            bo.startAi();
            Game.layer3d.addChild(bo.sp3d);
            return bo;
        }
        attackOk() {
            this.now = Game.executor.getWorldNow();
            return this.now >= this.st;
        }
        starAttack(pro, acstr) {
            this.pro = pro;
            this.curAttack = acstr;
            if (this.attackOk()) {
                this.st = this.now + Game.hero.playerData.attackSpeed;
                this.scd = 0;
                this.pro.play(acstr);
                if (this.at > 0) {
                    Laya.stage.timer.frameLoop(this.at, this, this.ac0);
                }
                else {
                    this.ac0();
                }
                return true;
            }
            return false;
        }
        cancelAttack() {
            this.st = this.et;
            this.scd = 0;
            Laya.stage.timer.clear(this, this.ac0);
        }
        ac0() {
            if (this.pro.normalizedTime >= this.at) {
                if (this.pro.normalizedTime >= 1) {
                    Laya.stage.timer.clear(this, this.ac0);
                    this.pro.play(GameAI.Idle);
                }
                if (this.scd == 0) {
                    this.scd = 1;
                    this.pro.event(Game.Event_Short, this.curAttack);
                    this.et = this.st;
                }
            }
        }
        checkBallistic(n, pro, ero) {
            var vx = GameBG.mw2 * Math.cos(n);
            var vz = GameBG.mw2 * Math.sin(n);
            var x0 = pro.hbox.cx;
            var y0 = pro.hbox.cy;
            var ebh;
            for (let i = 0; i < 6000; i++) {
                ebh = null;
                this.future.setVV(x0, y0, vx, vz);
                if (ero.hbox.hit(ero.hbox, this.future)) {
                    return ero;
                }
                var hits = Game.map0.Aharr;
                ebh = Game.map0.chechHit_arr(this.future, hits);
                if (ebh) {
                    return null;
                }
                x0 += vx;
                y0 += vz;
            }
            return null;
        }
    }

    class ArrowRoateMove extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(2, 2);
            this.angle = 0;
            this.zhuanLine = new MaoLineData(0, 0, GameBG.ww * 3, 0);
            this.cd = 0;
        }
        move2d(n, pro, speed) {
            this.angle += 5;
            if (this.angle > 360) {
                this.angle = 0;
            }
            let hudu = this.angle / 180 * Math.PI;
            this.zhuanLine.rad(n + hudu);
            pro.setXY2D(Game.hero.pos2.x + this.zhuanLine.x_len, Game.hero.pos2.z + this.zhuanLine.y_len);
            if (Game.executor.getWorldNow() > this.cd) {
                var ebh = Game.map0.chechHit_arr(pro.hbox, Game.map0.Eharr);
                if (ebh) {
                    if (ebh.linkPro_) {
                        ebh.linkPro_.event(Game.Event_Hit, pro);
                        pro.event(Game.Event_Hit, ebh.linkPro_);
                        this.cd = Game.executor.getWorldNow() + 1000;
                    }
                }
            }
            return true;
        }
    }

    class BulletRotate extends GamePro {
        constructor() {
            super(GameProType.HeroArrow);
            this.setGameMove(new ArrowRoateMove());
        }
        static getBullet(id) {
            let bullet = new BulletRotate();
            bullet.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + id + "/monster.lh")));
            bullet.sp3d.transform.localPositionY = 1;
            bullet.sp3d.transform.localRotationEulerX = 45;
            return bullet;
        }
    }
    BulletRotate.TAG = 'HeroBullet';

    class GameThorn extends Laya.Image {
        constructor() {
            super();
            this.lastTime = 0;
            this.hbox = new GameHitBox(GameBG.ww, GameBG.ww);
            this.inDanger = false;
            this.cd = 1500;
            this.diciPro = new GamePro(8, 0);
            this.diciPro.hurtValue = 150;
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
        }
        static getOne() {
            let one = Laya.Pool.getItemByClass(GameThorn.TAG, GameThorn);
            GameThorn.arr.push(one);
            return one;
        }
        static recover() {
            while (GameThorn.length > 0) {
                let one = GameThorn.arr.shift();
                one.removeSelf();
                Laya.Pool.recover(GameThorn.TAG, one);
            }
        }
        onDis() {
            console.log("显示地刺");
            this.inDanger = false;
            Laya.timer.frameLoop(1, this, this.onLoop);
            this.onLoop();
        }
        onLoop() {
            let now = Game.executor.getWorldNow();
            if (now > this.lastTime) {
                this.inDanger = !this.inDanger;
                this.lastTime = now + this.cd;
                this.skin = this.inDanger ? GameBG.BG_TYPE + '/500.png' : GameBG.BG_TYPE + '/500_0.png';
            }
        }
        onUnDis() {
            this.inDanger = false;
            Laya.timer.clear(this, this.onLoop);
        }
    }
    GameThorn.TAG = "GameThorn";
    GameThorn.arr = [];

    class HeroAI extends GameAI {
        constructor() {
            super();
            this.shootin = HeroAI.shoot;
            this.skillDic = {};
        }
        set run(b) {
            if (this.run_ != b) {
                this.run_ = b;
                if (this.run_) {
                    this.stopAi();
                    Game.hero.play(GameAI.Run);
                }
                else {
                    Game.hero.play(GameAI.Idle);
                    this.starAi();
                }
            }
        }
        hit(pro) {
            if (Game.hero.isWudi) {
                return;
            }
            if (Game.hero.gamedata.hp > 0) {
                Game.hero.hurt(pro.hurtValue, false);
            }
            if (Game.hero.gamedata.hp <= 0) {
                Game.hero.die();
                this.run_ = false;
            }
        }
        starAi() {
            if (Game.hero.gamedata.hp <= 0) {
                return;
            }
            if (Game.map0.Eharr.length > 1) {
                Game.map0.Eharr.sort(this.sore0);
            }
            if (Game.map0.Eharr.length > 0) {
                Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
            }
            Game.hero.on(Game.Event_Short, this, this.short);
            this.shootin.at = 0.5;
            this.shootin.now = Game.executor.getWorldNow();
        }
        rotateBullet() {
            let skillIds = Game.skillManager.getRotateSkills();
            let br;
            let hudu = Math.PI / skillIds.length;
            let skillId;
            for (let i = 0; i < skillIds.length; i++) {
                skillId = skillIds[i];
                br = this.skillDic[skillId + "_1"];
                if (!br) {
                    this.skillDic[skillId + "_1"] = BulletRotate.getBullet(skillId);
                }
                br = this.skillDic[skillId + "_1"];
                Game.layer3d.addChild(br.sp3d);
                br.move2D(hudu * i);
                br = this.skillDic[skillId + "_2"];
                if (!br) {
                    this.skillDic[skillId + "_2"] = BulletRotate.getBullet(skillId);
                }
                br = this.skillDic[skillId + "_2"];
                Game.layer3d.addChild(br.sp3d);
                br.move2D(Math.PI + hudu * i);
            }
        }
        short(ac) {
            if (Game.e0_) {
                var a = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
                Game.hero.rotation(a);
            }
            if (ac == GameAI.closeCombat) {
                Game.playSound("fx_hit.wav");
                if (Game.e0_) {
                    Game.hero.hurtValue = Math.floor(Game.hero.playerData.baseAttackPower * 1.5);
                    Game.e0_.hbox.linkPro_.event(Game.Event_Hit, Game.hero);
                }
                return;
            }
            Game.playSound("fx_shoot.wav");
            let basePower = Game.hero.playerData.baseAttackPower;
            this.onShoot(basePower);
            let skill1005 = Game.skillManager.isHas(1005);
            if (skill1005) {
                if (skill1005.curTimes == 1) {
                    Laya.timer.frameOnce(15, this, () => {
                        this.onShoot(basePower * skill1005.damagePercent / 100);
                    });
                }
                else {
                    Laya.timer.frameOnce(15, this, () => {
                        this.onShoot(basePower * skill1005.damagePercent / 100);
                    });
                    Laya.timer.frameOnce(30, this, () => {
                        this.onShoot(basePower * skill1005.damagePercent / 100);
                    });
                }
            }
        }
        onShoot(basePower) {
            let moveSpeed = GameBG.ww / 2;
            let skillLen = Game.skillManager.skillList.length;
            let skill1001 = Game.skillManager.isHas(1001);
            if (skill1001) {
                if (!this.line)
                    this.line = new MaoLineData(0, 0, GameBG.mw2, 0);
                this.line.rad(Game.hero.face2d + Math.PI / 2);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
                this.line.rad(Game.hero.face2d - Math.PI / 2);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
                if (skill1001.curTimes >= 2) {
                    this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100);
                }
            }
            else {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower);
            }
            let skill1002 = Game.skillManager.isHas(1002);
            if (skill1002) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI, Game.hero, basePower * skill1002.damagePercent / 100);
            }
            let skill1003 = Game.skillManager.isHas(1003);
            if (skill1003) {
                let angle = skill1003.curTimes == 1 ? 90 : 120;
                let num = 2 * skill1003.curTimes;
                angle = angle / num;
                let hudu = angle / 180 * Math.PI;
                let count = Math.floor(num / 2);
                for (var i = 1; i <= count; i++) {
                    this.shootin.short_arrow(moveSpeed, Game.hero.face3d + hudu * i, Game.hero, basePower * skill1003.damagePercent / 100);
                    this.shootin.short_arrow(moveSpeed, Game.hero.face3d - hudu * i, Game.hero, basePower * skill1003.damagePercent / 100);
                }
            }
            let skill1004 = Game.skillManager.isHas(1004);
            if (skill1004) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI * 0.5, Game.hero, basePower * skill1004.damagePercent / 100);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d - Math.PI * 0.5, Game.hero, basePower * skill1004.damagePercent / 100);
            }
        }
        stopAi() {
            this.shootin.cancelAttack();
            Game.hero.off(Game.Event_Short, this, this.short);
        }
        exeAI(pro) {
            if (Session.guideId == 1 || Session.guideId == 2) {
                return;
            }
            var now = Game.executor.getWorldNow();
            Game.bg.checkNpc();
            if (Game.hero.isIce) {
                return;
            }
            this.rotateBullet();
            let chuanqiangSkill = Game.skillManager.isHas(5007);
            if (!chuanqiangSkill) {
                if (GameThorn.arr.length > 0) {
                    for (var i = 0; i < GameThorn.arr.length; i++) {
                        let thorn = GameThorn.arr[i];
                        let thornBox = thorn.hbox;
                        if (thorn.inDanger && Game.hero.hbox.hit(Game.hero.hbox, thornBox)) {
                            if (now > thornBox.cdTime) {
                                pro.event(Game.Event_Hit, thorn.diciPro);
                                thornBox.cdTime = now + 2000;
                            }
                        }
                    }
                }
            }
            if (Session.isGuide) {
                if (Session.guideId == 3) {
                    if (Game.map0.guideHitBox && Game.hero.hbox.hit(Game.hero.hbox, Game.map0.guideHitBox)) {
                        Game.scenneM.battle && Game.scenneM.battle.up(null);
                        Game.scenneM.battle.setGuide("主角会自动攻击，移动中不会攻击。", 2);
                        Game.map0.guideHitBox = null;
                        return false;
                    }
                }
            }
            if (this.run_) {
                this.moves();
                return;
            }
            if (Session.isGuide) {
                if (Session.guideId == 3) {
                    return false;
                }
            }
            if (Game.map0.Eharr.length > 0) {
                if (this.shootin.attackOk()) {
                    var a = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
                    var facen2d_ = (2 * Math.PI - a);
                    if (Game.e0_.gamedata.hp > 0 && this.shootin.checkBallistic(facen2d_, Game.hero, Game.e0_)) {
                        pro.rotation(a);
                        return this.starAttack();
                    }
                    if (Game.map0.Eharr.length > 1) {
                        Game.map0.Eharr.sort(this.sore0);
                        var arr = Game.map0.Eharr;
                        for (let i = 0; i < arr.length; i++) {
                            var ero = arr[i];
                            if (ero.linkPro_ != Game.e0_) {
                                var a = GameHitBox.faceTo3D(pro.hbox, ero);
                                var facen2d_ = (2 * Math.PI - a);
                                if (this.shootin.checkBallistic(facen2d_, Game.hero, ero.linkPro_)) {
                                    Game.selectEnemy(ero.linkPro_);
                                    pro.rotation(a);
                                    return this.starAttack();
                                }
                            }
                        }
                    }
                    Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
                    var a = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
                    pro.rotation(a);
                    this.starAttack();
                }
            }
            else if (Game.TestShooting == 1 && this.shootin.attackOk()) {
                this.starAttack();
            }
            return true;
        }
        starAttack() {
            let isCloseCombat = GameHitBox.faceToLenth(Game.hero.hbox, Game.e0_.hbox) <= GameBG.ww * 3;
            let ac = "";
            if (isCloseCombat) {
                ac = GameAI.closeCombat;
            }
            else {
                ac = GameAI.NormalAttack;
            }
            return this.shootin.starAttack(Game.hero, ac);
        }
        sore0(g0, g1) {
            return GameHitBox.faceToLenth(Game.hero.hbox, g0) - GameHitBox.faceToLenth(Game.hero.hbox, g1);
        }
        move2d(n) {
            Game.hero.move2D(n);
            Game.bg.updateY();
        }
        moves() {
            let n;
            var speed = Game.ro.getSpeed();
            n = Game.ro.getA3d();
            Game.ro.rotate(n);
            if (speed > 0) {
                Game.hero.rotation(n);
                this.move2d(Game.ro.getA());
            }
        }
    }
    HeroAI.shoot = new Shooting();

    class HitEffect {
        constructor() {
            this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/20000/monster.lh"));
        }
        static addEffect(player) {
            let effect = Laya.Pool.getItemByClass(HitEffect.TAG, HitEffect);
            effect.player = player;
            effect.player.sp3d.addChild(effect.sp3d);
            setTimeout(() => {
                effect.recover();
            }, 800);
            return effect;
        }
        recover() {
            this.player.sp3d.removeChild(this.sp3d);
            Laya.Pool.recover(HitEffect.TAG, this);
            this.sp3d = null;
        }
    }
    HitEffect.TAG = "HitEffect";

    class PlayerData {
        constructor() {
            this.exp = 0;
            this.baseAttackPower = 200;
            this.attackSpeed = 650;
            this.moveSpeed = 6;
        }
        copy() {
            let p = new PlayerData();
            p.exp = this.exp;
            p.level = this.level;
            p.lastLevel = this.lastLevel;
            p.baseAttackPower = this.baseAttackPower;
            p.attackSpeed = this.attackSpeed;
            p.moveSpeed = this.moveSpeed;
            return p;
        }
        add(p) {
            this.exp += p.exp;
            this.level += p.level;
            this.lastLevel += p.lastLevel;
            this.baseAttackPower += p.baseAttackPower;
            this.attackSpeed += p.attackSpeed;
            this.moveSpeed += p.moveSpeed;
        }
        reduce(p) {
            this.exp -= p.exp;
            this.level -= p.level;
            this.lastLevel -= p.lastLevel;
            this.baseAttackPower -= p.baseAttackPower;
            this.attackSpeed -= p.attackSpeed;
            this.moveSpeed -= p.moveSpeed;
        }
        reset() {
        }
    }

    class SysBuff {
        constructor() {
            this.id = 0;
            this.buffName = '';
            this.bufflInfo = '';
            this.buffDot = 0;
            this.buffCD = 0;
            this.times = 0;
            this.damagePercent = 0;
            this.addExp = 0;
            this.addAttack = 0;
            this.addSpeed = 0;
            this.addCrit = 0;
            this.addHurt = 0;
            this.addHp = 0;
            this.hpLimit = 0;
            this.addMiss = 0;
        }
    }
    SysBuff.NAME = 'sys_rolebuff.txt';

    class WudiRotateScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            this.box.transform.localRotationEulerY += 3;
        }
        onDisable() {
        }
    }

    class Hero extends GamePro {
        constructor() {
            super(GameProType.Hero, 0);
            this.playerData = new PlayerData();
            this.isWudi = false;
            this.isNew = true;
            this.busi = false;
            this.lastTime = 0;
            this.reset();
            this.unBlocking = true;
            this.setGameMove(new PlaneGameMove());
            this.setGameAi(new HeroAI());
        }
        addBuff(buffId) {
            if (this.buffAry.indexOf(buffId) == -1) {
                Game.buffM.addBuff(buffId, this);
                this.buffAry.push(buffId);
            }
        }
        lossBlood() {
            return (this.gamedata.maxhp - this.gamedata.hp) / this.gamedata.maxhp;
        }
        changeBlood(sys) {
            let buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys.skillEffect1);
            if (buff) {
                if (sys.id == 4002 || sys.id == 4004) {
                    this.addBlood(Math.floor(Game.hero.gamedata.maxhp * buff.addHp / 1000));
                    return true;
                }
                else if (sys.id == 4003) {
                    this.changeMaxBlood(buff.hpLimit / 1000);
                    return true;
                }
            }
            return false;
        }
        changeMaxBlood(changeValue) {
            if (changeValue > 0) {
                this.gamedata.hp = this.gamedata.hp + Math.floor(this.gamedata.maxhp * changeValue);
            }
            this.gamedata.maxhp = Math.floor(this.gamedata.maxhp * (1 + changeValue));
            if (this.gamedata.hp >= this.gamedata.maxhp) {
                this.gamedata.hp = this.gamedata.maxhp;
            }
            this.initBlood(this.gamedata.hp);
        }
        addBlood(addValue) {
            this.gamedata.hp = this.gamedata.hp + addValue;
            this.gamedata.hp = Math.min(this.gamedata.hp, this.gamedata.maxhp);
            this.initBlood(this.gamedata.hp);
            BloodEffect.add("+" + addValue, this._bloodUI, false, "main/greenFont.png");
        }
        updateAttackSpeed() {
            console.log("修改攻速");
        }
        reset() {
            this.gamedata.hp = this.gamedata.maxhp = 600;
            this.buffAry.length = 0;
        }
        resetAI() {
            this.getGameAi().run = false;
        }
        setWudi(bool) {
            if (this.isWudi == bool) {
                return;
            }
            this.isWudi = bool;
            if (bool) {
                if (!this.wudi) {
                    let sp = Laya.loader.getRes("h5/bullets/skill/5009/monster.lh");
                    if (sp) {
                        this.wudi = sp;
                        this.wudi.transform.localPositionY = -0.5;
                        this.wudi.addComponent(WudiRotateScript);
                    }
                }
                this.sp3d.addChild(this.wudi);
            }
            else {
                this.wudi && this.wudi.removeSelf();
            }
        }
        init() {
            if (Game.battleLoader.continueRes) {
                Game.hero.gamedata.hp = Game.battleLoader.continueRes.curhp;
                Game.hero.gamedata.maxhp = Game.battleLoader.continueRes.maxhp;
                let skills = Game.battleLoader.continueRes.skills;
                if (skills.length > 0) {
                    let arr = skills.split(",");
                    for (let i = 0; i < arr.length; i++) {
                        let info = arr[i].split("_");
                        if (info.length == 2) {
                            let sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME, Number(info[0]));
                            sysSkill.curTimes = Number(info[1]);
                            Game.skillManager.addSkill(sysSkill);
                        }
                    }
                }
            }
            this.isDie = false;
            this.setKeyNum(1);
            this.acstr = "";
            let sp = Laya.loader.getRes("h5/hero/hero.lh");
            Game.layer3d.addChild(sp);
            var scale = 1.4;
            sp.transform.localScale = new Laya.Vector3(scale, scale, scale);
            this.setSp3d(sp);
            this.play("Idle");
            this.pos2.x = this.pos2.z = 0;
            this.sp3d.transform.localPositionX = 0;
            this.sp3d.transform.localPositionY = 0;
            console.log("出生位置", Hero.bornX, Hero.bornY);
            this.setXY2DBox(Hero.bornX, Hero.bornY);
            this.initBlood(this.gamedata.hp);
            this.addFootCircle();
            Game.map0.Hharr.push(this.hbox);
            this.gamedata.rspeed = 0;
            this.rotation(90 / 180 * Math.PI);
            this.onJumpDown();
            Laya.stage.on(Game.Event_ADD_HP, this, this.addBlood);
            Laya.stage.on(Game.Event_UPDATE_ATTACK_SPEED, this, this.updateAttackSpeed);
            this.updateUI();
        }
        initBlood(hp) {
            super.initBlood(hp, this.gamedata.maxhp);
            this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
        }
        updateUI() {
            super.updateUI();
            this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
            this._footCircle && this._footCircle.pos(this.hbox.cx, this.hbox.cy);
            if (this._footCircle) {
                this._footCircle.dir.rotation = this.face2d * 180 / Math.PI + 90;
            }
        }
        onJumpDown() {
            this.gamedata.rspeed = 20;
            this.startAi();
            Game.executor.start();
            console.log("主角调下来", Game.AiArr.length);
        }
        hurt(hurt, isCrit) {
            if (this.busi) {
                return;
            }
            let isMiss = false;
            let missSkill = Game.skillManager.isHas(5006);
            if (missSkill) {
                let missBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, missSkill.skillEffect1);
                if (missBuff) {
                    let missRate = missBuff.addMiss / 1000;
                    if ((1 - Math.random()) > missRate) {
                        isMiss = true;
                        console.log(missSkill.skillName);
                    }
                }
            }
            if (!isMiss) {
                super.hurt(hurt, isCrit);
                HitEffect.addEffect(this);
            }
            let angerSkill = Game.skillManager.isHas(3008);
            if (angerSkill) {
                let rate = (this.gamedata.maxhp - this.gamedata.hp) / this.gamedata.maxhp;
                this.playerData.baseAttackPower = Math.floor(Game.skillManager.addAttack() * (1 + rate));
            }
        }
        die() {
            if (this.isDie) {
                return;
            }
            this.isDie = true;
            this.setKeyNum(1);
            this.once(Game.Event_KeyNum, this, this.onDie);
            setTimeout(() => {
                this.play(GameAI.Die);
            }, 300);
        }
        reborn() {
            Game.rebornTimes--;
            Game.skillManager.removeSkill(4005);
            this.isDie = false;
            this.setKeyNum(1);
            this.acstr = "";
            Game.hero.reset();
            Game.hero.initBlood(Game.hero.gamedata.hp);
            this.play("Idle");
            this.startAi();
            Game.executor && Game.executor.start();
            this.setWudi(true);
            setTimeout(() => {
                this.setWudi(false);
            }, 2000);
        }
        onDie(key) {
            let skill4005 = Game.skillManager.isHas(4005);
            if (skill4005) {
                setTimeout(() => {
                    this.reborn();
                }, 800);
                console.log(skill4005.skillName);
            }
            else {
                this.stopAi();
                Game.executor && Game.executor.stop_();
                console.log("全部暂停");
                Laya.stage.event(Game.Event_MAIN_DIE);
            }
        }
        pos2To3d() {
            super.pos2To3d();
            if (Laya.Browser.now() - this.lastTime >= 300) {
                var runSmog = RunSmog.create(this.hbox.cx, this.hbox.cy);
                Laya.Tween.to(runSmog, { scaleX: 0, scaleY: 0, alpha: 0 }, 600, null, new Laya.Handler(this, this.onClear, [runSmog]));
                this.lastTime = Laya.Browser.now();
            }
        }
        onClear(runSmog) {
            RunSmog.recover(runSmog);
        }
    }
    class RunSmog extends Laya.Image {
        constructor() {
            super();
            this.skin = "bg/renyan.png";
            this.size(64, 64);
            this.anchorX = 0.5;
            this.anchorY = 0.5;
        }
        static create(xx, yy) {
            var smog = Laya.Pool.getItemByClass(RunSmog.flag, RunSmog);
            smog.pos(xx, yy);
            Game.footLayer.addChild(smog);
            return smog;
        }
        static recover(smog) {
            smog.removeSelf();
            smog.alpha = 1;
            smog.scale(1, 1);
            Laya.Pool.recover(RunSmog.flag, smog);
        }
    }
    RunSmog.flag = "RunSmog";

    class GameExecut extends Laya.EventDispatcher {
        constructor() {
            super();
            this.now = 0;
            this.st = 0;
            this.stopt = 0;
            this.startt = 0;
            this.dt = 0;
            this.isRun = false;
            this.now = Laya.Browser.now();
            this.st = this.now;
            this.stop_();
        }
        start() {
            this.now = Laya.Browser.now();
            this.dt += (this.now - this.stopt);
            var arr = Game.AiArr;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].animator)
                    arr[i].animator.speed = 1;
            }
            this.isRun = true;
            Laya.stage.frameLoop(1, this, this.ai);
        }
        stop_() {
            this.now = Laya.Browser.now();
            this.stopt = this.now;
            Laya.timer.clear(this, this.ai);
            var arr = Game.AiArr;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].animator)
                    arr[i].animator.speed = 0;
            }
            this.isRun = false;
        }
        getWorldNow() {
            this.now = Laya.Browser.now();
            return (this.now - this.dt);
        }
        ai() {
            var arr = Game.AiArr;
            for (let i = 0; i < arr.length; i++) {
                arr[i].ai();
            }
            if (arr.length == 1) {
                if (Game.bg.npcId == 0) {
                    if (Game.state == 0 && Game.hero.playerData.lastLevel != Game.hero.playerData.level && Game.isPopupSkill == 0) {
                        Laya.stage.event(Game.Event_SELECT_NEWSKILL, Game.hero.playerData.level);
                    }
                }
                if (arr[0] instanceof Hero) {
                    Game.openDoor();
                    Game.map0.checkDoor();
                }
            }
            var farr = Game.map0.Fharr;
            for (let i = 0; i < farr.length; i++) {
                var fhit = farr[i];
                var pro = fhit.linkPro_;
                if (fhit.hit(fhit, Game.hero.hbox)) {
                    pro.closeCombat(Game.hero);
                    if (pro.gamedata.ammoClip == 0) {
                        farr.slice(farr.indexOf(fhit), 1);
                    }
                }
            }
            Game.buffM.exe(this.getWorldNow());
        }
    }

    class GameCameraNum {
        constructor(a, y) {
            this.a = a;
            this.n = a * Math.PI / 180;
            this.abs = Math.abs(a);
            this.a0 = 90 - this.abs;
            this.n0 = this.a0 * Math.PI / 180;
            this.tan0 = Math.tan(this.n0);
            this.cos0 = Math.cos(this.n0);
            this.y = y;
            this.z = y * this.tan0;
            this.boxscale = new Laya.Vector3(1, 1, 1 / this.cos0);
            this.boxscale0 = new Laya.Vector3(1, 1, (0.5) / this.cos0);
        }
    }

    class MoveType {
    }
    MoveType.TAG = "MOVE";
    MoveType.FLY = 1;
    MoveType.MOVE = 2;
    MoveType.FIXED = 3;
    MoveType.JUMP = 4;
    MoveType.BACK = 5;
    MoveType.BOOM = 6;

    class AttackType {
    }
    AttackType.TAG = "ATTACK";
    AttackType.NORMAL_BULLET = 1;
    AttackType.RANDOM_BULLET = 2;
    AttackType.AOE = 3;
    AttackType.FLY_HIT = 4;
    AttackType.SPLIT = 5;
    AttackType.CALL_MONSTER = 6;

    class MemoryManager {
        constructor() {
            this.res = {};
        }
        add(url) {
            let data = this.res[url];
            if (data == null) {
                data = new ResourceData();
                data.url = url;
                data.time = Date.now();
                this.res[data.url] = data;
            }
            data.count++;
        }
        app(url) {
            let data = this.res[url];
            if (data) {
                data.count--;
            }
        }
        release() {
            for (let key in this.res) {
                let data = this.res[key];
                if (data.count <= 0) {
                    let sp = Laya.loader.getRes(key);
                    sp && sp.destroy(true);
                    console.log("释放资源", key);
                }
            }
        }
    }
    MemoryManager.ins = new MemoryManager();
    class ResourceData {
        constructor() {
            this.url = '';
            this.time = 0;
            this.count = 0;
        }
    }

    class Monster extends GamePro {
        constructor() {
            super(GameProType.RockGolem_Blue, 0);
            this._bulletShadow = new ui.test.BulletShadowUI();
            Game.footLayer.addChild(this._bulletShadow);
        }
        onCie() {
            if (!this.isIce) {
                this.isIce = true;
                this.animator.speed = 0;
            }
        }
        offCie() {
            if (this.isIce) {
                this.isIce = false;
                this.animator.speed = 1;
            }
        }
        startAi() {
            super.startAi();
        }
        stopAi() {
            super.stopAi();
        }
        setShadowSize(ww) {
            super.setShadowSize(ww);
            Game.footLayer.addChild(this._bulletShadow);
        }
        updateUI() {
            super.updateUI();
            this._bulletShadow && this._bulletShadow.pos(this.hbox.cx - (this._bulletShadow.img.width - GameBG.mw) * 0.5, this.hbox.cy - (this._bulletShadow.img.height - GameBG.mw) * 0.5);
        }
        init() {
            let sysBullet;
            if (this.sysEnemy.normalAttack > 0) {
                sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
                this.aiType = sysBullet.bulletType;
            }
            if (this.sysEnemy.skillId != '0') {
                var arr = this.sysEnemy.skillId.split(',');
                for (var m = 0; m < arr.length; m++) {
                    let id = Number(arr[m]);
                    if (id > 0) {
                        sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                        this.aiType = sysBullet.bulletType;
                    }
                }
            }
        }
        show() {
            Game.layer3d.addChild(this.sp3d);
            Game.bloodLayer.addChild(this._bloodUI);
            Game.footLayer.addChild(this._bulletShadow);
        }
        hide() {
            this.sp3d && this.sp3d.removeSelf();
            this._bloodUI && this._bloodUI.removeSelf();
            this._bulletShadow && this._bulletShadow.removeSelf();
        }
        initBlood(hp) {
            super.initBlood(hp, hp);
            this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 90);
        }
        hurt(hurt, isCrit, isBuff = false) {
            super.hurt(hurt, isCrit);
            if (this.sysEnemy.isBoss) {
                Laya.stage.event(GameEvent.BOOS_BLOOD_UPDATE, hurt);
            }
            if (isBuff) {
                return;
            }
            HitEffect.addEffect(this);
            MonsterBoomEffect.addEffect(this, this.tScale);
        }
        die() {
            this.setKeyNum(1);
            this.once(Game.Event_KeyNum, this, this.onDie);
            this.play(GameAI.Die);
            if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
                Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
            }
            if (Game.hero.playerData.level <= 10) {
                if (this.sysEnemy.dropExp > 0) {
                    let skill3001 = Game.skillManager.isHas(3001);
                    let addNum = 0;
                    if (skill3001) {
                        console.log(skill3001.skillName);
                        let buff3001 = App.tableManager.getDataByNameAndId(SysBuff.NAME, skill3001.skillEffect1);
                        addNum = Math.ceil(this.sysEnemy.dropExp * buff3001.addExp / 1000);
                    }
                    Game.hero.playerData.exp += this.sysEnemy.dropExp + addNum;
                }
            }
            let skill4001 = Game.skillManager.isHas(4001);
            if (skill4001) {
                let buff4001 = App.tableManager.getDataByNameAndId(SysBuff.NAME, skill4001.skillEffect1);
                Game.hero.addBlood(Math.floor(Game.hero.gamedata.maxhp * buff4001.addHp / 1000));
                console.log(skill4001.skillName);
            }
        }
        onDie(key) {
            Game.selectHead.removeSelf();
            Game.selectFoot.removeSelf();
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(Monster.TAG + this.sysEnemy.enemymode, this);
            DieEffect.addEffect(this);
            MemoryManager.ins.app(this.sp3d.url);
        }
        clear() {
            Game.selectHead.removeSelf();
            Game.selectFoot.removeSelf();
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(Monster.TAG + this.sysEnemy.enemymode, this);
            MemoryManager.ins.app(this.sp3d.url);
        }
        static getMonster(enemyId, xx, yy, mScale, hp) {
            let sysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, enemyId);
            let now = Game.executor.getWorldNow();
            if (!MonsterShader.map[sysEnemy.enemymode]) {
                MonsterShader.map[sysEnemy.enemymode] = new MonsterShader(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
            }
            if (!hp) {
                hp = sysEnemy.enemyHp;
                if (sysEnemy.skillId != '0') {
                    var arr = sysEnemy.skillId.split(',');
                    for (var m = 0; m < arr.length; m++) {
                        let id = Number(arr[m]);
                        if (id > 0) {
                            let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                            if (sysBullet.bulletType == AttackType.SPLIT) {
                                hp = sysEnemy.enemyHp / sysBullet.splitNum;
                            }
                        }
                    }
                }
            }
            let tag = Monster.TAG + sysEnemy.enemymode;
            Game.poolTagArr[tag] = tag;
            var gpro = Laya.Pool.getItemByClass(tag, Monster);
            gpro.curLen = gpro.moveLen = 0;
            gpro.sysEnemy = sysEnemy;
            gpro.init();
            if (!gpro.sp3d) {
                var sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
                MemoryManager.ins.add(sp.url);
                gpro.setSp3d(sp, GameBG.ww * 0.8);
                console.log("克隆一个怪");
            }
            gpro.hurtValue = sysEnemy.enemyAttack;
            if (sysEnemy.moveType > 0) {
                var MOVE = Laya.ClassUtils.getClass(MoveType.TAG + sysEnemy.moveType);
                gpro.setGameMove(new MOVE());
            }
            let tScale = sysEnemy.zoomMode / 100;
            tScale = mScale ? mScale : tScale;
            gpro.tScale = tScale;
            gpro.sp3d.transform.setWorldLossyScale(new Laya.Vector3(tScale, tScale, tScale));
            Game.map0.Eharr.push(gpro.hbox);
            Game.map0.Fharr.push(gpro.hbox);
            gpro.setShadowSize(sysEnemy.zoomShadow);
            gpro.setXY2DBox(xx, yy);
            gpro.initBlood(hp);
            var MonAI = Laya.ClassUtils.getClass(AttackType.TAG + sysEnemy.enemyAi);
            console.log("当前怪的AI", sysEnemy.id, sysEnemy.enemymode, sysEnemy.txt, sysEnemy.enemyAi, MonAI);
            if (MonAI == null) {
                console.log('没有这个怪的AI', sysEnemy.id);
            }
            gpro.setGameAi(new MonAI(gpro));
            gpro.startAi();
            Game.layer3d.addChild(gpro.sp3d);
            console.log("ai的长度", Game.AiArr.length);
            return gpro;
        }
    }
    Monster.TAG = "Monster_";

    class SysLevel {
        constructor() {
            this.id = 0;
            this.roleExp = 0;
        }
        static getMaxExpByLv(lv) {
            var sys = App.tableManager.getDataByNameAndId(SysLevel.NAME, lv);
            return sys == null ? 0 : sys.roleExp;
        }
        static getLv(exp) {
            var sum = 0;
            for (var i = 1; i <= 10; i++) {
                var sys = App.tableManager.getDataByNameAndId(SysLevel.NAME, i);
                sum += sys.roleExp;
                if (exp < sum) {
                    return sys.id;
                }
            }
            return 10;
        }
        static getExpSum(lv) {
            var sum = 0;
            for (var i = 1; i <= lv; i++) {
                sum += SysLevel.getMaxExpByLv(i);
            }
            return sum;
        }
    }
    SysLevel.NAME = 'sys_rolelevel.txt';

    class TopUI$1 extends ui.test.battleUI {
        constructor() {
            super();
            this.maskSpr = new Laya.Sprite();
            this._indexBox = new IndexBox();
            this.lastWidth = 0;
            this.isTwo = false;
            Laya.stage.on(Game.Event_COINS, this, this.updateCoins);
            Laya.stage.on(Game.Event_EXP, this, this.updateExp);
            this.indexBox.addChild(this._indexBox);
            this.y = App.top + 60;
            Laya.stage.on(GameEvent.BOOS_BLOOD_UPDATE, this, this.onUpdate);
        }
        onUpdate(hurt) {
            this._curBlood -= hurt;
            this._curBlood = Math.max(1, this._curBlood);
            this.bossxue.scrollRect = new Laya.Rectangle(0, 0, this.bossxue.width * this._curBlood / this._bossEnemy.enemyHp, this.bossxue.height);
        }
        setBoss(isBoss, sys) {
            this.boss.visible = isBoss;
            this.bossxuetiao.visible = isBoss;
            this._bossEnemy = sys;
            if (!this._bossEnemy) {
                return;
            }
            this._curBlood = this._bossEnemy.enemyHp;
            if (this.bossxuetiao.visible) {
                this.bossxue.scrollRect = new Laya.Rectangle(0, 0, this.bossxue.width, this.bossxue.height);
            }
        }
        reset() {
            this._indexBox.init();
        }
        updateIndex(index) {
            this._indexBox.update(index);
        }
        updateExp() {
            let lv = SysLevel.getLv(Game.hero.playerData.exp);
            let maxExp = SysLevel.getMaxExpByLv(lv);
            let curExpSum = SysLevel.getExpSum(lv - 1);
            let curExp = Game.hero.playerData.exp - curExpSum;
            let vv = curExp / maxExp;
            this.isTwo = lv > Game.hero.playerData.level;
            Laya.timer.frameLoop(1, this, this.onLoop, [vv]);
            Game.hero.playerData.level = lv;
            if (!this.isTwo) ;
        }
        onLoop(vv) {
            this.lastWidth += 15;
            if (this.isTwo) {
                if (this.lastWidth >= this.lvBar.height) {
                    this.lastWidth = 0;
                    this.isTwo = false;
                }
            }
            else {
                if (this.lastWidth >= this.lvBar.height * vv) {
                    this.lastWidth = this.lvBar.height * vv;
                    Laya.timer.clear(this, this.onLoop);
                }
            }
            this.lastWidth = Math.max(1, this.lastWidth);
            this.maskSpr.graphics.clear();
            this.maskSpr.graphics.drawRect(0, this.lvBar.height - this.lastWidth, this.lvBar.width, this.lastWidth, "#fff000");
            this.lvBar.mask = this.maskSpr;
        }
        updateCoins() {
            this.jinbishu.value = "" + Game.battleCoins;
        }
        removeSelf() {
            Game.state = 0;
            return super.removeSelf();
        }
    }
    class IndexBox extends ui.game.battleIndexBoxUI {
        constructor() {
            super();
            this._cellList = [];
            this._isInit = false;
            this.scrollRect = new Laya.Rectangle(0, 0, this.width, this.height);
        }
        init() {
            this._cellList.length = 0;
            let max = SysMap.getTotal(Session.homeData.chapterId);
            for (let i = 0; i < max; i++) {
                let cell = Laya.Pool.getItemByClass(IndexCell.TAG, IndexCell);
                cell.update(i + 1);
                this.box.addChild(cell);
                cell.x = 185 + i * 150;
                cell.y = 55;
                cell.gray = true;
                this._cellList.push(cell);
                cell.visible = false;
            }
        }
        update(index) {
            for (let i = 0; i < this._cellList.length; i++) {
                this._cellList[i].visible = false;
                if (index >= 2) {
                    if (i == index - 1 || i == index - 2 || i == index) {
                        this._cellList[i].visible = true;
                    }
                }
                else {
                    this._cellList[0].visible = true;
                    this._cellList[1].visible = true;
                    this._cellList[2].visible = true;
                }
            }
            let max = SysMap.getTotal(Session.homeData.chapterId);
            if (index > max) {
                index = max;
            }
            this.pbox1.visible = index != 1;
            this.pbox2.visible = index != max;
            if (!this._isInit) {
                this.box.x = -(index - 1) * 150;
                this._cellList[index - 1].scale(1.5, 1.5);
                this._cellList[index - 1].gray = false;
                this._isInit = true;
                for (let i = 0; i < index - 1; i++) {
                    this._cellList[i].gray = false;
                }
                return;
            }
            Laya.Tween.to(this.box, { x: -(index - 1) * 150 }, 300, null, null, 100);
            if (index == 1) {
                Laya.Tween.to(this._cellList[index - 1], { scaleX: 1.5, scaleY: 1.5 }, 300, null, null, 100);
            }
            else {
                Laya.Tween.to(this._cellList[index - 2], { scaleX: 1, scaleY: 1 }, 300, null, null, 100);
                Laya.Tween.to(this._cellList[index - 1], { scaleX: 1.5, scaleY: 1.5 }, 300, null, null, 100);
            }
            this._cellList[index - 1].gray = false;
        }
    }
    class IndexCell extends ui.test.battleLvUIUI {
        constructor() {
            super();
            this.on(Laya.Event.UNDISPLAY, this, this.onUndis);
        }
        onUndis() {
            Laya.Pool.recover(IndexCell.TAG, this);
        }
        set gray(value) {
            this.btn.gray = value;
        }
        update(index) {
            this.shuziyou.text = "" + index;
        }
    }
    IndexCell.TAG = "IndexCell";

    class PauseUI extends ui.test.battlestop2UI {
        constructor() {
            super();
            this.btnHome.clickHandler = new Laya.Handler(this, this.onHome);
            this.btnSound.clickHandler = new Laya.Handler(this, this.onSound);
            this.btnPlay.clickHandler = new Laya.Handler(this, this.onBattle);
            this.btnMusic.clickHandler = new Laya.Handler(this, this.onMusic);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                this.musicImg.skin = res.state == 1 ? "bg/zhanting_1.png" : "bg/zhanting_0.png";
            });
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                this.soundImg.skin = res.state == 1 ? "bg/zhanting_1.png" : "bg/zhanting_0.png";
            });
        }
        onSound() {
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 0 });
                    this.soundImg.skin = "bg/zhanting_0.png";
                    App.soundManager.setSoundVolume(0);
                }
                else {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    this.soundImg.skin = "bg/zhanting_1.png";
                    App.soundManager.setSoundVolume(1);
                }
            });
        }
        onMusic() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 0 });
                    this.musicImg.skin = "bg/zhanting_0.png";
                    App.soundManager.setMusicVolume(0);
                }
                else {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    this.musicImg.skin = "bg/zhanting_1.png";
                    App.soundManager.setMusicVolume(1);
                    Game.playBattleMusic();
                }
            });
        }
        onHome() {
            Game.alert.onShow("确定返回主页吗?", new Laya.Handler(this, this.onGo), null, "本局将不会产生任何收益。");
        }
        onGo() {
            Game.addCoins = 0;
            Game.addExp = 0;
            Game.showMain();
            this.removeSelf();
        }
        onBattle() {
            this.removeSelf();
            Game.executor.start();
        }
        removeSelf() {
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class GameOverView extends ui.test.GameOverUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.on(Laya.Event.CLICK, this, this.onClick);
        }
        onClick() {
            this.removeSelf();
            Game.showMain();
        }
        onDis() {
            this.jinbishu.value = "" + Game.battleCoins;
            let lastLv = Session.homeData.level;
            let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, lastLv);
            let ww = this.expBar.width * Game.battleExp / sys.roleExp;
            ww = Math.max(1, ww);
            this.expBar.scrollRect = new Laya.Rectangle(0, 0, ww, this.expBar.height);
            this.cengshu.value = Session.homeData.level + "";
            this.dengji.value = Session.homeData.level + "";
            Session.homeData.addPlayerExp(Game.battleExp);
            Game.addCoins = Game.battleCoins;
            Session.saveData();
            Game.addCoins = 0;
            Laya.timer.frameLoop(1, this, this.onLoop);
        }
        onLoop() {
            this.lightView.rotation++;
        }
        removeSelf() {
            Laya.timer.clear(this, this.onLoop);
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class CustomShaderff00 extends Laya.BaseMaterial {
        static get ff00() {
            if (!CustomShaderff00.ff00_) {
                return new CustomShaderff00;
            }
            return CustomShaderff00.ff00_;
        }
        constructor() {
            super();
            if (!CustomShaderff00.ff00_) {
                this.initShader();
                this.setShaderName("CustomShaderff00");
                CustomShaderff00.ff00_ = this;
            }
            else {
                this.setShaderName("CustomShaderff00");
            }
        }
        initShader() {
            let attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0
            };
            let uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE
            };
            let vs = `
            attribute vec4 a_Position;
            uniform mat4 u_MvpMatrix;
            void main()
            {
            gl_Position = u_MvpMatrix * a_Position;
            }`;
            let ps = `
            #ifdef FSHIGHPRECISION
            precision highp float;
            #else
            precision mediump float;
            #endif            
            void main()
            {           
            gl_FragColor=vec4(1.0,0.0,0.0,1.0);
            }`;
            let CustomShaderff00 = Laya.Shader3D.add("CustomShaderff00");
            let subShader = new Laya.SubShader(attributeMap, uniformMap);
            CustomShaderff00.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class SkillGrid extends ui.test.SkillGridUI {
        constructor(handler) {
            super();
            this.handler = handler;
            this.imgBox.addChild(this.img);
            this.imgBox.on(Laya.Event.CLICK, this, this.onClick);
        }
        onClick() {
            this.handler && this.handler.runWith(this.sys);
        }
        update(skillId) {
            this.txt.text = "****";
            this.shuoming.text = "****";
            this.img.skin = "main/kawen.png";
            Laya.Tween.to(this.parent, { scaleX: 0.1 }, 150, null, new Laya.Handler(this, this.onFan, [skillId]));
        }
        onFan(skillId) {
            this.sys = App.tableManager.getDataByNameAndId(SysSkill.NAME, skillId);
            this.txt.text = this.sys.skillName;
            this.shuoming.text = this.sys.skillInfo;
            this.img.skin = 'icons/skill/' + this.sys.id + ".png";
            Laya.Tween.to(this.parent, { scaleX: 1 }, 150);
        }
    }

    class SelectNewSkill extends ui.test.battlestopUI {
        constructor() {
            super();
            this.grid1 = new SkillGrid(new Laya.Handler(this, this.onClick));
            this.grid2 = new SkillGrid(new Laya.Handler(this, this.onClick));
            this.queding.visible = false;
            this.box1.addChild(this.grid1);
            this.box2.addChild(this.grid2);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onClick(sys) {
            console.log(sys.skillName);
            if (!Game.hero.changeBlood(sys)) {
                Game.skillManager.addSkill(sys);
            }
            Game.bg.clearNpc();
            this.removeSelf();
        }
        onDis() {
            Game.executor.stop_();
            this.box1.scaleX = 1;
            this.box2.scaleX = 1;
            this.grid1.update(Game.skillManager.getRandomSkillByNpcId(1004));
            this.grid2.update(Game.skillManager.getRandomSkillByNpcId(1004));
        }
        removeSelf() {
            Game.executor.start();
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class RebornView extends ui.test.ReborthUI {
        constructor() {
            super();
            this.closeBtn.clickHandler = new Laya.Handler(this, this.onClose);
            this.rebornBtn.clickHandler = new Laya.Handler(this, this.onReborn);
            this.shape = new Laya.Sprite();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.txt.text = "" + Game.rebornTimes;
            this._curTime = 5;
            this.daojishi.text = "" + this._curTime;
            Laya.timer.loop(1000, this, this.onLoop2);
        }
        onLoop2() {
            this._curTime--;
            this.daojishi.text = "" + this._curTime;
            if (this._curTime <= 0) {
                Laya.timer.clear(this, this.onLoop2);
                this.onClose();
            }
        }
        onLoop() {
            if (this._curTime == 0) {
                this.clearTimer(this, this.onLoop);
                return;
            }
            this._curTime--;
            console.log("------------", this._curTime);
            this.shape.graphics.clear();
            this.jindu.mask = this.shape;
            this.shape.graphics.drawPie(this.centerBox.x, this.centerBox.y, 81, 90, 90 + (5000 - this._curTime) / 5000 * 360, "#ff0000");
        }
        onClose() {
            this.removeSelf();
            Game.rebornTimes = 0;
            Laya.stage.event(Game.Event_MAIN_DIE);
        }
        onReborn() {
            Laya.timer.clear(this, this.onLoop2);
            this.removeSelf();
            Game.hero.reborn();
        }
        removeSelf() {
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class GameFence {
        constructor() {
            this.box = Laya.Sprite3D.instantiate(Game.fence);
        }
        setPos(v3) {
            this.box.transform.position = v3;
            Game.layer3d.addChild(this.box);
        }
        static recover() {
            while (GameFence.arr.length > 0) {
                let rube = GameFence.arr.shift();
                rube.box.removeSelf();
                Laya.Pool.recover(GameFence.TAG, rube);
            }
            GameFence.arr.length = 0;
        }
        static getOne(v3) {
            let rube = Laya.Pool.getItemByClass(GameFence.TAG, GameFence);
            rube.setPos(v3);
            GameFence.arr.push(rube);
            return rube;
        }
    }
    GameFence.TAG = "GameFence";
    GameFence.arr = [];

    class GuideTalk extends ui.game.newGuide2UI {
        constructor() {
            super();
            this.on(Laya.Event.CLICK, this, this.onClick);
        }
        onClick() {
            this.removeSelf();
        }
        setContent(str, guideId) {
            this._guideId = guideId;
            this.contents = str.split("");
            this.txt.text = "";
            Laya.timer.loop(80, this, this.onLoop);
        }
        onLoop() {
            if (this.contents.length > 0) {
                let char = this.contents.shift();
                this.txt.text += char;
            }
            else {
                Laya.timer.clear(this, this.onLoop);
            }
        }
        removeSelf() {
            Laya.stage.event(GameEvent.SHOW_ACTION_RECT, this._guideId);
            return super.removeSelf();
        }
    }

    class GuideActionArea extends ui.game.newGuideUI {
        constructor() {
            super();
        }
    }

    class BattleScene extends Laya.Sprite {
        constructor() {
            super();
            this.nullGridList = [];
            this.index = 0;
            var bg = new GameBG();
            this.addChild(bg);
            Game.bg = bg;
            var map0 = new GameMap0();
            Game.map0 = map0;
            this.addChild(Game.footLayer);
            this.addChild(Game.frontLayer);
            var scene = this.addChild(new Laya.Scene3D());
            scene.addChild(Game.layer3d);
            Game.scene3d = scene;
            this.addChild(Game.bloodLayer);
            this.addChild(Game.topLayer);
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            Game.cameraCN = new GameCameraNum(-45, 10);
            camera.transform.translate(new Laya.Vector3(0, Game.cameraCN.y, Game.cameraCN.z));
            camera.transform.rotate(new Laya.Vector3(Game.cameraCN.a, 0, 0), true, false);
            camera.orthographic = true;
            Game.camera = camera;
            GameBG.orthographicVerticalSize = GameBG.wnum * Laya.stage.height / Laya.stage.width;
            camera.orthographicVerticalSize = GameBG.orthographicVerticalSize;
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            bg.on(Game.Event_NPC, this, this.showNpcView);
            this._top = new TopUI$1();
            this.addChild(this._top);
            this._top.reset();
            this._top.zanting.clickHandler = new Laya.Handler(this, this.showPause);
            Laya.stage.on(Game.Event_SELECT_NEWSKILL, this, this.onShowSelect);
            Laya.stage.on(Game.Event_MAIN_DIE, this, this.showDieView1);
            Laya.stage.on(GameEvent.MEMORY_WARNING, this, this.onRelease);
        }
        onRelease() {
            Game.battleLoader.onRelease();
        }
        onShowSelect(lv) {
            if (lv > 10) {
                return;
            }
            this.up(null);
            if (!this._selectSkill) {
                this._selectSkill = new SelectNewSkill();
            }
            this.addChild(this._selectSkill);
            Game.isPopupSkill = 1;
            Game.state = 1;
        }
        onOver() {
            if (!this._gameOver) {
                this._gameOver = new GameOverView();
            }
            this.addChild(this._gameOver);
            Game.state = 1;
        }
        onReborn() {
            if (!this._rebornView) {
                this._rebornView = new RebornView();
            }
            this.addChild(this._rebornView);
            Game.state = 1;
        }
        showDieView1() {
            if (Game.rebornTimes <= 0) {
                this.onOver();
            }
            else {
                this.onReborn();
            }
        }
        showPause() {
            if (!this._pauseUI) {
                this._pauseUI = new PauseUI();
            }
            this.addChild(this._pauseUI);
            Game.executor.stop_();
            Game.state = 1;
        }
        showNpcView() {
            let npcId = Game.bg.npcId;
            if (npcId > 0) {
                let NPCVIEW = Laya.ClassUtils.getClass("NPCVIEW" + npcId);
                if (NPCVIEW) {
                    this.npcView = new NPCVIEW();
                    this.addChild(this.npcView);
                }
                Game.state = 1;
            }
        }
        init() {
            if (!Game.hero) {
                Game.hero = new Hero();
            }
            GameFence.recover();
            GameThorn.recover();
            Session.saveData();
            Game.reset();
            this._top.updateCoins();
            this._top.updateExp();
            this._top.updateIndex(Game.battleLoader.index);
            if (!Game.executor) {
                Game.executor = new GameExecut();
            }
            this._top._indexBox.visible = !Session.isGuide;
            Game.map0.drawMap();
            GameBG.mcx = 13 * GameBG.ww / 2 - GameBG.mw2;
            GameBG.mcy = GameBG.bgHH * 0.5 - GameBG.mw2;
            Game.setSelectEffect();
            var aa = Laya.loader.getRes("h5/zhalan/hero.lh");
            Game.fence = aa;
            this.nullGridList.length = 0;
            var isHasBoss = false;
            var bossEnemy;
            var monster;
            let k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    let type = GameBG.arr0[k];
                    if (GridType.isCube(type)) {
                        GameCube.getOne(GameBG.get3D(i, j), type);
                    }
                    else if (GridType.isFence(type)) {
                        GameFence.getOne(GameBG.get3D(i, j));
                    }
                    else if (Game.battleLoader.continueRes == null && GridType.isMonster(type)) {
                        if (Game.battleLoader.monsterId > 0) {
                            type = Game.battleLoader.monsterId;
                        }
                        monster = Monster.getMonster(type, GameBG.ww * i + (GameBG.ww - GameBG.mw) / 2, j * GameBG.ww + (GameBG.ww - GameBG.mw) / 2);
                        monster.splitTimes = 1;
                        if (!isHasBoss) {
                            isHasBoss = monster.sysEnemy.isBoss == 1;
                            bossEnemy = monster.sysEnemy;
                        }
                        if (Session.isGuide) {
                            this.guideMonster = monster;
                            this.guideMonster.hide();
                        }
                    }
                    if (type == BattleFlagID.DOOR) {
                        let v3 = GameBG.get3D(i, j);
                        if (!Game.door) {
                            Game.door = Laya.loader.getRes("h5/effects/door/monster.lh");
                            Game.layer3d.addChild(Game.door);
                            Game.door.transform.translate(v3);
                        }
                        Game.door.transform.localPositionX = v3.x;
                        Game.door.transform.localPositionZ = v3.z;
                    }
                    else if (type == BattleFlagID.GUIDE) {
                        let v3 = GameBG.get3D(i, j);
                        console.log("绿圈的位置", i, j, v3);
                        console.log("使用的时候", i, j, v3);
                        this.guideCircle = Laya.loader.getRes("h5/effects/guide/monster.lh");
                        this.guideCircle.transform.translate(v3);
                        this.guideCircle.transform.localPositionX = v3.x;
                        this.guideCircle.transform.localPositionZ = v3.z;
                    }
                    k++;
                }
            }
            this._top.setBoss(isHasBoss, bossEnemy);
            Game.closeDoor();
            if (monster) {
                Game.e0_ = monster;
            }
            Game.bg.drawR(isHasBoss);
            Game.ro = new Rocker();
            Game.ro.resetPos();
            this.addChild(Game.ro);
            if (!Game.hero) {
                Game.hero = new Hero();
            }
            Game.hero.init();
            Game.hero.playerData.lastLevel = Game.hero.playerData.level;
            Game.bg.updateY();
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1001));
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1002));
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1003));
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1004));
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1005));
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1008));
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, 1009));
            this.setGuide("滑动摇杆，控制角色到达指定位置。", 1);
            Laya.MouseManager.multiTouchEnabled = false;
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
            Laya.stage.on(Laya.Event.KEY_PRESS, this, this.onOpenDoor);
        }
        setGuide(str, guideId) {
            this._guideTalk && this._guideTalk.removeSelf();
            if (!Session.isGuide) {
                return;
            }
            Session.guideId = guideId;
            if (!this._guideTalk) {
                this._guideTalk = new GuideTalk();
            }
            this.addChild(this._guideTalk);
            this._guideTalk.setContent(str, guideId);
            Laya.stage.on(GameEvent.SHOW_ACTION_RECT, this, this.showActionRect);
        }
        showActionRect(guideId) {
            this._guideArea && this._guideArea.removeSelf();
            if (!Session.isGuide) {
                return;
            }
            if (Session.guideId == 1) {
                if (!this._guideArea) {
                    this._guideArea = new GuideActionArea();
                }
                this.addChild(this._guideArea);
                Game.layer3d.addChild(this.guideCircle);
                Session.guideId = 3;
            }
            else if (Session.guideId == 2) {
                let zhaohuan = new ui.test.zhaohuanUI();
                Game.bloodLayer.addChild(zhaohuan);
                zhaohuan.pos(this.guideMonster.hbox.cx, this.guideMonster.hbox.cy);
                setTimeout(() => {
                    zhaohuan.removeSelf();
                    this.guideMonster.show();
                    Session.guideId = 4;
                    this.guideCircle && this.guideCircle.removeSelf();
                }, 800);
            }
        }
        doorLoop() {
            if (this.index % 2 == 0) {
                Game.door.transform.localPositionY = 0;
            }
            else {
                Game.door.transform.localPositionY = -500;
            }
            this.index++;
        }
        onOpenDoor(e) {
            if (e.nativeEvent.keyCode == 111) {
                Game.hero.busi = true;
            }
        }
        kd(eve) {
            if (Game.executor.isRun) {
                Game.executor.stop_();
            }
            else {
                Game.executor.start();
            }
        }
        md(eve) {
            if (Game.state > 0) {
                return;
            }
            if (Session.guideId == 1 || Session.guideId == 2) {
                return;
            }
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.md);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.up);
            let xx = Laya.stage.mouseX;
            let yy = Laya.stage.mouseY;
            Game.ro.x = xx;
            Game.ro.y = yy;
            this.addChild(Game.ro);
            Laya.stage.frameLoop(1, this, this.moves);
            if (Game.executor.isRun) {
                Game.hero.getGameAi().run = true;
            }
        }
        up(eve) {
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.up);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
            if (Game.ro && Game.ro.parent) {
                Game.ro.resetPos();
                Game.ro.reset();
            }
            Laya.stage.clearTimer(this, this.moves);
            if (Game.executor.isRun) {
                Game.hero.getGameAi().run = false;
            }
        }
        moves() {
            if (Game.state > 0) {
                return;
            }
            let xx = Laya.stage.mouseX;
            let yy = Laya.stage.mouseY;
            Game.ro.setSp0(xx, yy);
        }
    }

    class SceneManager {
        constructor() { }
        ;
        showMain() {
            if (!this.main) {
                this.main = new MainScene();
            }
            Game.isStartBattle = false;
            App.layerManager.sceneLayer.removeChildren();
            App.layerManager.sceneLayer.addChild(this.main);
            this.battle && this.battle._top && this.battle._top.reset();
        }
        showBattle() {
            if (!this.battle) {
                this.battle = new BattleScene();
            }
            App.layerManager.sceneLayer.removeChildren();
            App.layerManager.sceneLayer.addChild(this.battle);
            Game.playBattleMusic();
        }
    }

    class SysNpc {
        constructor() {
            this.id = 0;
            this.npcTxt = '';
            this.skillId = 0;
            this.skillRandom = '';
        }
    }
    SysNpc.NAME = 'sys_npc.txt';

    class BuffID {
    }
    BuffID.WUDI_5009 = 5009;
    BuffID.FIRE_2001 = 2001;
    BuffID.FIRE_5001 = 5001;
    BuffID.DU_2002 = 2002;
    BuffID.DU_5002 = 5002;
    BuffID.ICE_2003 = 2003;
    BuffID.ICE_5003 = 5003;

    class PlayerSkillManager {
        constructor() {
            this.skillList = [];
            this.arrowHeadId = 0;
            this.skinsHeads = [2001, 2002, 2003, 2004];
            this.skinSkills = [5001, 5002, 5003, 5004, 5005, 5009];
        }
        clear() {
            this.skillList.length = 0;
            this.arrowHeadId = 0;
        }
        get skills() {
            let ss = "";
            for (let i = 0; i < this.skillList.length; i++) {
                ss += "," + this.skillList[i].id + "_" + this.skillList[i].curTimes;
            }
            ss = ss.substring(1);
            return ss;
        }
        addArrowHead(id) {
            this.arrowHeadId = id;
            Laya.loader.create(["h5/bullets/skill/" + id + "/monster.lh"]);
        }
        addSkill(data) {
            if (this.skinsHeads.indexOf(data.id) != -1) {
                this.addArrowHead(data.id);
            }
            if (data) {
                let sys = this.isHas(data.id);
                if (sys) {
                    if (sys.curTimes < sys.upperLimit) {
                        sys.curTimes++;
                    }
                }
                else {
                    this.skillList.push(data);
                    data.curTimes++;
                }
                console.log(data.skillName, "添加技能");
            }
            if (this.skinSkills.indexOf(data.id) != -1) {
                Laya.loader.create(["h5/bullets/skill/" + data.id + "/monster.lh"]);
            }
            if (data.id == BuffID.WUDI_5009) {
                Game.hero.addBuff(BuffID.WUDI_5009);
            }
            this.addAttack();
            this.addAttackSpeed();
        }
        addAttack() {
            let buff;
            Game.hero.playerData.baseAttackPower = 200;
            let sys3002 = this.isHas(3002);
            if (sys3002) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3002.skillEffect1);
                if (buff) {
                    Game.hero.playerData.baseAttackPower += sys3002.curTimes * buff.addAttack;
                }
            }
            buff = null;
            let sys3003 = this.isHas(3003);
            if (sys3003) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3003.skillEffect1);
                if (buff) {
                    Game.hero.playerData.baseAttackPower += sys3003.curTimes * buff.addAttack;
                }
            }
            return Game.hero.playerData.baseAttackPower;
        }
        addAttackSpeed() {
            let buff;
            Game.hero.playerData.attackSpeed = 650;
            let sys3004 = this.isHas(3004);
            if (sys3004) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3004.skillEffect1);
                if (buff) {
                    for (let i = 0; i < sys3004.curTimes; i++) {
                        Game.hero.playerData.attackSpeed = Game.hero.playerData.attackSpeed * (1 - buff.addSpeed / 1000);
                    }
                }
            }
            buff = null;
            let sys3005 = this.isHas(3005);
            if (sys3005) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3005.skillEffect1);
                if (buff) {
                    let rate = 1;
                    for (let i = 0; i < sys3005.curTimes; i++) {
                        rate = rate * (buff.addSpeed / 1000);
                    }
                    Game.hero.playerData.attackSpeed = Game.hero.playerData.attackSpeed * (1 - rate);
                }
            }
            return Game.hero.playerData.attackSpeed;
        }
        isHas(id) {
            for (let i = 0; i < this.skillList.length; i++) {
                if (this.skillList[i].id == id) {
                    return this.skillList[i];
                }
            }
            return null;
        }
        removeSkill(id) {
            let sys = this.isHas(id);
            if (sys) {
                let index = this.skillList.indexOf(sys);
                if (index >= 0) {
                    this.skillList.splice(index, 1);
                }
            }
        }
        getRotateSkills() {
            let skillIds = [5001, 5002, 5003, 5004];
            let rt = [];
            for (let i = 0; i < skillIds.length; i++) {
                if (this.isHas(skillIds[i])) {
                    rt.push(skillIds[i]);
                }
            }
            return rt;
        }
        getRandomSkillByNpcId(npcId) {
            let sysNpc = App.tableManager.getDataByNameAndId(SysNpc.NAME, npcId);
            let ary = sysNpc.skillRandom.split(",");
            for (let i = 0; i < this.skillList.length; i++) {
                let sys = this.skillList[i];
                if (sys) {
                    if (sys.curTimes >= sys.upperLimit) {
                        let flag = ary.indexOf(sys.id + "");
                        if (flag != -1) {
                            ary.splice(flag, 1);
                        }
                    }
                }
            }
            let rand = Math.floor(Math.random() * ary.length);
            return Number(ary[rand]);
        }
    }

    class BuffManager {
        constructor() {
            this.buffArr = [];
        }
        exe(now) {
            for (let i = 0; i < this.buffArr.length; i++) {
                this.buffArr[i].exe(now);
            }
        }
        addBuff(buffId, to, bullet) {
            let BUFF = Laya.ClassUtils.getRegClass("BUFF" + buffId);
            let buff = new BUFF(buffId);
            buff.to = to;
            this.buffArr.push(buff);
            if (bullet) {
                buff.bullet = bullet;
                buff.hurtValue = bullet.hurtValue;
                buff.startTime += Game.executor.getWorldNow();
                let buffIndex = bullet.buffAry.indexOf(buffId);
                if (buffIndex > -1) {
                    bullet.buffAry.splice(buffIndex, 1);
                }
            }
        }
        removeBuff(buff) {
            let buffIndex = buff.to.buffAry.indexOf(buff.skill.id);
            if (buffIndex != -1) {
                buff.to.buffAry.splice(buffIndex, 1);
            }
            let index = this.buffArr.indexOf(buff);
            if (index > -1) {
                this.buffArr.splice(index, 1);
            }
        }
    }

    var Sprite3D = Laya.Sprite3D;
    class Game {
        constructor() {
        }
        static selectEnemy(pro) {
            Game.e0_ = pro;
            let curScale = pro.sysEnemy.zoomMode / 100;
            curScale = 1 / curScale;
            if (Game.e0_.sp3d && Game.e0_.sp3d.transform) {
                Game.e0_.sp3d.addChild(Game.selectFoot);
                Game.e0_.addSprite3DToChild("guadian", Game.selectHead);
                Game.selectHead.transform.localScale = new Laya.Vector3(curScale, curScale, curScale);
                Game.selectFoot.transform.localScale = new Laya.Vector3(curScale, curScale, curScale);
            }
            else {
                console.log("克隆体没有了？");
            }
        }
        static updateMap() {
            if (Game.map0) {
                if (Game.bg) {
                    Game.bloodLayer.pos(Game.bg.x, Game.bg.y);
                    Game.frontLayer.pos(Game.bg.x, Game.bg.y);
                    Game.footLayer.pos(Game.bg.x, Game.bg.y);
                    Game.topLayer.pos(Game.bg.x, Game.bg.y);
                    Game.map0.pos(Game.bg.x, Game.bg.y);
                }
            }
        }
        static openDoor() {
            if (Game.isOpen) {
                return;
            }
            console.log("开门");
            Game.cookie.setCookie(CookieKey.CURRENT_BATTLE, {
                "mapId": Game.battleLoader.mapId,
                "index": Game.battleLoader.index,
                "configId": Game.battleLoader._configId,
                "curhp": Game.hero.gamedata.hp,
                "maxhp": Game.hero.gamedata.maxhp,
                "skills": Game.skillManager.skills,
                "coins": Game.battleCoins
            });
            Game.isOpen = true;
            if (Session.isGuide) {
                Game.scenneM.battle.setGuide("通过传送进入下一关。", 5);
                Session.isGuide = false;
                Game.battleLoader.index = 1;
            }
            else {
                Game.battleLoader.index++;
            }
            Game.bg.setDoor(1);
            Game.layer3d.addChild(Game.door);
            Game.map0.setDoor(true);
            Game.shakeBattle();
            Game.battleLoader.clearMonster();
            Session.saveData();
        }
        static shakeBattle() {
            Game.scenneM.battle.pos(0, 0);
            ShakeUtils.execute(Game.scenneM.battle, 75, 4);
        }
        static closeDoor() {
            console.log("关门====================");
            Game.isOpen = false;
            Game.door && Game.door.removeSelf();
            Game.map0.setDoor(false);
            Game.bg.setDoor(0);
        }
        static setSelectEffect() {
            if (!Game.selectHead) {
                Game.selectHead = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/head/monster.lh"));
                Game.selectHead.addComponent(HeadTranslateScript);
            }
            if (!Game.selectFoot) {
                Game.selectFoot = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/foot/hero.lh"));
                Game.selectFoot.addComponent(FootRotateScript);
            }
        }
        static reset() {
            Game.state = 0;
            Game.isPopupSkill = 0;
            Game.bloodLayer.removeChildren();
            Game.frontLayer.removeChildren();
            Game.footLayer.removeChildren();
            Game.layer3d.removeChildren();
            Game.topLayer.removeChildren();
            Game.selectHead && Game.selectHead.removeSelf();
            Game.selectFoot && Game.selectFoot.removeSelf();
            Game.map0.reset();
            Game.e0_ = null;
            Game.executor && Game.executor.stop_();
            if (Game.ro) {
                Game.ro.destroy();
            }
        }
        static getRandPos(pro) {
            let mRow = Math.floor(pro.hbox.y / GameBG.ww);
            let mCol = Math.floor(pro.hbox.x / GameBG.ww);
            let range = 4;
            let endRowNum = Game.map0.endRowNum - 1;
            var info = Game.map0.info;
            var arr = [];
            for (let i = mRow - range; i <= mRow + range; i++) {
                if (i < 3 || i > GameBG.MAP_ROW - 7) {
                    continue;
                }
                for (let j = mCol - range; j <= mCol + range; j++) {
                    if (j == mRow && i == mCol) {
                        continue;
                    }
                    if (j < 3 || j > GameBG.MAP_COL - 3) {
                        continue;
                    }
                    var key = info[i + "_" + j];
                    if (key == null) {
                        continue;
                    }
                    if (key == 0) {
                        let aaa = [j, i];
                        arr.push(aaa);
                    }
                }
            }
            var toArr = [];
            if (arr.length > 0) {
                var rand = Math.floor(arr.length * Math.random());
                toArr = arr[rand];
            }
            return toArr;
        }
        static showMain() {
            Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
            Game.battleCoins = 0;
            Game.selectFoot && Game.selectFoot.removeSelf();
            Game.selectHead && Game.selectHead.removeSelf();
            Game.skillManager.clear();
            Game.battleLoader.index = 1;
            Game.rebornTimes = 2;
            Game.hero.reset();
            Game.hero.resetAI();
            Game.hero.playerData.exp = 0;
            Game.battleLoader.clearMonster();
            Game.scenneM.showMain();
            Game.map0.Eharr.length = 0;
            Game.AiArr.length = 0;
            Game.playBgMusic();
        }
        static playBgMusic() {
            Game.playMusic("menu.mp3");
        }
        static playBattleMusic() {
            Game.playMusic("state_fight.mp3");
        }
        static playMusic(str) {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res == null || res.state == 1) {
                    App.soundManager.play(str, true);
                }
            });
        }
        static playSound(str) {
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res.state == 1) {
                    App.soundManager.play(str);
                }
            });
        }
    }
    Game.resVer = "1.0.16.191710";
    Game.userHeadUrl = "";
    Game.userName = "";
    Game.poolTagArr = {};
    Game.isStartBattle = false;
    Game.TestShooting = 0;
    Game.BigMapMode = 1;
    Game.state = 0;
    Game.isPopupSkill = 0;
    Game.rebornTimes = 2;
    Game.Event_MAIN_DIE = "Event_MAIN_DIE";
    Game.Event_PlayStop = "Game.Event_PlayStop";
    Game.Event_Short = "Game.Event_Short";
    Game.Event_Hit = "Game.Event_Hit";
    Game.Event_KeyNum = "Game.Event_KeyNum";
    Game.Event_ADD_HP = "Event_ADD_HP";
    Game.Event_UPDATE_ATTACK_SPEED = "Event_UPDATE_ATTACK_SPEED";
    Game.Event_NPC = "Event_NPC";
    Game.Event_COINS = "Event_COINS";
    Game.Event_EXP = "Event_EXP";
    Game.Event_LEVEL = "Event_LEVEL";
    Game.Event_SELECT_NEWSKILL = "Event_SELECT_NEWSKILL";
    Game.skillManager = new PlayerSkillManager();
    Game.AiArr = [];
    Game.HeroArrows = [];
    Game.layer3d = new Sprite3D();
    Game.cameraY = 10;
    Game.sqrt3 = 10 * Math.sqrt(3);
    Game.footLayer = new Laya.Sprite();
    Game.bloodLayer = new Laya.Sprite();
    Game.frontLayer = new Laya.Sprite();
    Game.topLayer = new Laya.Sprite();
    Game.scenneM = new SceneManager();
    Game.buffM = new BuffManager();
    Game.battleLoader = new BattleLoader();
    Game.isOpen = false;
    Game.battleCoins = 0;
    Game.battleExp = 0;
    Game.addCoins = 0;
    Game.addExp = 0;

    class SawHeng extends ui.test.SawHengUI {
        constructor(xx, yy, vv) {
            super();
            this.line = new LineData();
            this.bg.width = vv;
            this.pos(xx, yy);
            this.line.startX = xx;
            this.line.startY = yy;
            this.line.endX = xx + vv;
            this.line.endY = yy;
        }
    }
    class HengJu extends ui.test.HengjuUI {
        constructor(xx, yy, vv) {
            super();
            this.hbox = new GameHitBox(56, 56);
            this.cd = 0;
            this.status = 0;
            this.ww = vv;
            this.ww -= GameBG.ww;
            this.pos(xx + GameBG.ww2 + 5, yy + GameBG.ww2);
            this.startX = this.x;
            this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.box.scrollRect = new Laya.Rectangle(0, 0, 58, 35);
        }
        onUnDis() {
            this.clearTimer(this, this.onLoop);
            this.huoxing.stop();
        }
        onDis() {
            this.frameLoop(1, this, this.onLoop);
            this.huoxing.play();
        }
        onLoop() {
            this.dianju.rotation += 20;
            if (this.status == 0) {
                this.x += 4;
            }
            else {
                this.x -= 4;
            }
            if (this.x >= this.startX + this.ww) {
                this.status = 1;
                this.scaleX = -1;
            }
            else if (this.x <= this.startX) {
                this.status = 0;
                this.scaleX = 1;
            }
            this.hbox.setXY(this.x, this.y);
            this.checkHero();
        }
        checkHero() {
            if (Game.executor.getWorldNow() >= this.cd) {
                if (GameHitBox.faceToLenth(this.hbox, Game.hero.hbox) < GameBG.ww2) {
                    if (Game.hero.hbox.linkPro_) {
                        Game.hero.hbox.linkPro_.event(Game.Event_Hit, Game.bg.saw.pro);
                        this.cd = Game.executor.getWorldNow() + 1000;
                    }
                }
            }
        }
    }

    class SawZong extends ui.test.SawZongUI {
        constructor(xx, yy, vv) {
            super();
            this.line = new LineData();
            this.bg.height = vv;
            this.pos(xx, yy);
            this.line.startX = xx;
            this.line.startY = yy;
            this.line.endX = xx;
            this.line.endY = yy + vv;
        }
    }
    class ZongJu extends ui.test.ZongjuUI {
        constructor(xx, yy, vv) {
            super();
            this.hbox = new GameHitBox(35, 70);
            this.cd = 0;
            this.status = 0;
            this.ww = vv;
            this.ww -= GameBG.ww;
            this.pos(xx + GameBG.ww2, yy + GameBG.ww2);
            this.startY = this.y;
            this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onUnDis() {
            this.clearTimer(this, this.onLoop);
            this.shudianju.stop();
            this.shuhuoxing.stop();
        }
        onDis() {
            this.shudianju.play();
            this.shuhuoxing.play();
            this.frameLoop(1, this, this.onLoop);
        }
        onLoop() {
            if (this.status == 0) {
                this.y += 4;
            }
            else {
                this.y -= 4;
            }
            if (this.y >= this.startY + this.ww) {
                this.status = 1;
                this.scaleY = -1;
            }
            else if (this.y <= this.startY) {
                this.status = 0;
                this.scaleY = 1;
            }
            this.hbox.setXY(this.x, this.y);
            this.checkHero();
        }
        checkHero() {
            if (Game.executor.getWorldNow() >= this.cd) {
                if (GameHitBox.faceToLenth(this.hbox, Game.hero.hbox) < GameBG.ww2) {
                    if (Game.hero.hbox.linkPro_) {
                        Game.hero.hbox.linkPro_.event(Game.Event_Hit, Game.bg.saw.pro);
                        this.cd = Game.executor.getWorldNow() + 1000;
                    }
                }
            }
        }
    }

    class Saw extends Laya.Sprite {
        constructor() {
            super();
            this.hengAry = [];
            this.zongAry = [];
            this.hengJuAry = [];
            this.zongJuAry = [];
            this.pro = new GamePro(0);
            this.pro.hurtValue = 150;
        }
        addBg(xx, yy, vv, type) {
            if (type == 1) {
                let heng = new SawHeng(xx, yy, vv);
                this.addChild(heng);
                this.hengAry.push(heng);
                let hengju = new HengJu(xx, yy, vv);
                this.hengJuAry.push(hengju);
            }
            else if (type == 2) {
                let zong = new SawZong(xx, yy, vv);
                this.addChild(zong);
                this.zongAry.push(zong);
                let zongju = new ZongJu(xx, yy, vv);
                this.zongJuAry.push(zongju);
            }
        }
        updateSaw() {
            for (var i = 0; i < this.hengAry.length; i++) {
                for (var j = 0; j < this.zongAry.length; j++) {
                    if (this.zongAry[j].line.startX > this.hengAry[i].line.startX && this.zongAry[j].line.startX < this.hengAry[i].line.endX && this.zongAry[j].line.startY < this.hengAry[i].line.startY && this.zongAry[j].line.endY > this.hengAry[i].line.startY) {
                        let xx = this.zongAry[j].line.startX;
                        let yy = this.hengAry[i].line.startY;
                        let img = new Laya.Image();
                        img.skin = 'bg/503.png';
                        this.addChild(img);
                        img.pos(xx, yy + 1);
                    }
                }
            }
            for (var i = 0; i < this.hengJuAry.length; i++) {
                this.addChild(this.hengJuAry[i]);
            }
            for (var i = 0; i < this.zongJuAry.length; i++) {
                this.addChild(this.zongJuAry[i]);
            }
        }
        clear() {
            this.removeChildren();
            this.hengAry.length = this.zongAry.length = this.hengJuAry.length = this.zongJuAry.length = 0;
        }
    }
    Saw.TAG = "SAW";
    class LineData {
    }

    var Image = Laya.Image;
    var Sprite$1 = Laya.Sprite;
    class GameBG extends Laya.Sprite {
        constructor() {
            super();
            this.bgh = 0;
            this._box = new Sprite$1();
            this._top = new Image();
            this._bossImg = new Image();
            this._bottom = new Image();
            this._topShadow = new Image();
            this._leftShadow = new Image();
            this._door = new Image();
            this.saw = new Saw();
            this._sawInfo = {};
            this._sawInfoZong = {};
            this.npcId = 0;
            this.npcP = new Laya.Point();
            GameBG.gameBG = this;
            this.mySp = new Sprite$1();
            this.mySp.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, 0x00ff00);
            this.doorNumber = BitmapNumber.getFontClip(0.3);
        }
        static get3D(xx, yy) {
            if (!GameBG.v3d) {
                GameBG.v3d = new Laya.Vector3(0, 0, 0);
            }
            GameBG.v3d.x = (xx - 6);
            let rowNum = GameBG.bgHH / GameBG.ww / 2;
            GameBG.v3d.z = (yy - rowNum + 0.5) / Game.cameraCN.cos0;
            return GameBG.v3d;
        }
        getBgh() {
            return this.bgh;
        }
        isHit(dx, dy) {
            var dx0 = dx - GameBG.mw2;
            var dy0 = dy - GameBG.mw2;
            var b = false;
            for (let i = 0; i < GameBG.arrsp.length; i++) {
                var element = GameBG.arrsp[i];
                if (this.isHit_(dx0, dy0, element)) {
                    b = true;
                }
            }
            return b;
        }
        isHit_(dx, dy, d2) {
            return dx < d2.x + GameBG.ww &&
                dx + GameBG.mw > d2.x &&
                dy < d2.y + GameBG.ww &&
                GameBG.mw + dy > d2.y;
        }
        setZhuan(box) {
        }
        updata(x, y) {
            this.mySp.x = x - GameBG.mw2;
            this.mySp.y = y - GameBG.mw2;
        }
        clear() {
            this._box.removeChildren();
            this.saw.clear();
            this._sawInfo = {};
            this._sawInfoZong = {};
            this.npcId = 0;
            this._npcAni && this._npcAni.removeSelf();
            this._npcAni = null;
        }
        drawR(hasBoss = false) {
            this.npcId = 0;
            var img;
            var ww = GameBG.ww;
            var k = 0;
            let gType = 0;
            this.addChild(this._box);
            this.addChild(this.saw);
            var sprite = new Laya.Image();
            this._box.addChild(sprite);
            sprite.texture = Laya.loader.getRes("h5/mapbg/" + GameBG.BG_TYPE_NUM + ".jpg");
            sprite.sizeGrid = "584,711,51,72";
            sprite.size(GameBG.bgWW, GameBG.bgHH);
            var bottomImg = new Laya.Image();
            this._box.addChild(bottomImg);
            bottomImg.texture = Laya.loader.getRes("h5/mapbg/" + GameBG.BG_TYPE_NUM + "_1.png");
            bottomImg.y = 1372;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                this.bgh += ww;
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    gType = GameBG.arr0[k];
                    img = new Image();
                    this._box.addChild(img);
                    img.x = i * ww;
                    img.y = j * ww;
                    var thorn;
                    var grid = new Image();
                    if (GridType.isRiverPoint(gType)) {
                        grid.skin = GameBG.BG_TYPE + '/100.png';
                    }
                    else if (GridType.isThorn(gType)) {
                        thorn = GameThorn.getOne();
                        thorn.hbox.setXY(img.x, img.y);
                        console.log("添加地刺");
                        img.addChild(thorn);
                    }
                    else if (GridType.isRiverScale9Grid(gType) || GridType.isRiverScale9Grid2(gType) || GridType.isRiverRow(gType) || GridType.isRiverCol(gType)) {
                        gType = Math.floor(gType / 100) * 100 + gType % 10;
                        grid.skin = GameBG.BG_TYPE + '/' + gType + '.png';
                    }
                    else if (GridType.isFlower(gType)) {
                        grid.skin = GameBG.BG_TYPE + '/' + gType + '.png';
                    }
                    else if (GridType.isSawHeng(gType)) {
                        if (this._sawInfo[gType] == null) {
                            let hengAry = [];
                            this._sawInfo[gType] = hengAry;
                        }
                        let p = new Laya.Point(img.x, img.y);
                        this._sawInfo[gType].push(p);
                    }
                    else if (GridType.isSawZong(gType)) {
                        if (this._sawInfoZong[gType] == null) {
                            let hengAry = [];
                            this._sawInfoZong[gType] = hengAry;
                        }
                        let p = new Laya.Point(img.x, img.y);
                        this._sawInfoZong[gType].push(p);
                    }
                    else if (GridType.isNpc(gType)) {
                        this.npcId = gType;
                        this.npcP.x = img.x + GameBG.ww2;
                        this.npcP.y = img.y;
                        if (this.npcId == BattleFlagID.ANGLE) {
                            let NPC = Laya.ClassUtils.getClass("NPC" + 1001);
                            this._npcAni = new NPC();
                            this.showNpc();
                        }
                    }
                    if (gType == BattleFlagID.DOOR) {
                        this._box.addChild(this._door);
                        this._door.pos(img.x - GameBG.ww2, img.y - GameBG.ww2);
                        this._door.skin = 'bg/door.png';
                        console.log("门的位置", img.x, img.y);
                    }
                    else if (gType == BattleFlagID.HERO) {
                        Hero.bornX = img.x;
                        Hero.bornY = img.y;
                    }
                    img.addChild(grid);
                    k++;
                }
            }
            var k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    gType = GameBG.arr0[k];
                    var shadow = new Laya.Image();
                    if ((GridType.isWall(gType) || (gType >= 1 && gType <= 10))) {
                        shadow.skin = 'bg/y' + GameCube.getType(gType) + '.png';
                        shadow.x = i * ww;
                        shadow.y = j * ww;
                        this._box.addChild(shadow);
                    }
                    else if (GridType.isFence(gType)) {
                        shadow.skin = 'bg/lanying.png';
                        shadow.width = 200;
                        shadow.x = i * ww - 64;
                        shadow.y = j * ww + 50;
                        this._box.addChild(shadow);
                    }
                    else if (GridType.isRiverCube(gType)) {
                        shadow.skin = GameBG.BG_TYPE + '/900.png';
                        shadow.width = 122;
                        shadow.height = 134;
                        shadow.x = i * ww - 28;
                        shadow.y = j * ww - 35;
                        this._box.addChild(shadow);
                    }
                    k++;
                }
            }
            this.saw.clear();
            for (let key in this._sawInfo) {
                let hengAry = this._sawInfo[key];
                let pos = hengAry[0];
                let ww = hengAry[1].x - hengAry[0].x + GameBG.ww;
                this.saw.addBg(pos.x, pos.y, ww, 1);
            }
            for (let key in this._sawInfoZong) {
                let zongAry = this._sawInfoZong[key];
                let pos = zongAry[0];
                let hh = zongAry[1].y - zongAry[0].y + GameBG.ww;
                this.saw.addBg(pos.x, pos.y, hh, 2);
            }
            this.saw.updateSaw();
            this.x = -GameBG.ww2;
            this.y = (Laya.stage.height - GameBG.bgHH) * 0.5;
            GameBG.cx = this.x;
            GameBG.cy = this.y;
        }
        showGuidePointer() {
        }
        hideGuidePointer() {
        }
        showNpc() {
            if (this._npcAni) {
                Game.topLayer.addChild(this._npcAni);
                this._npcAni.pos(this.npcP.x, this.npcP.y - 800);
                Laya.Tween.to(this._npcAni, { y: this.npcP.y }, 300, Laya.Ease.circIn);
            }
        }
        checkNpc() {
            if (this.npcId <= 0) {
                return;
            }
            if (!Game.map0.checkNpc()) {
                return;
            }
            Game.scenneM.battle.up(null);
            if (this.npcId == BattleFlagID.OTHER_NPC) {
                this.npcId = 0;
                let lossRate = Game.hero.lossBlood();
                if (lossRate <= 0) {
                    this.npcId = 1002;
                }
                else if (lossRate <= 0.1) {
                    this.npcId = 1002;
                }
                else {
                    this.npcId = 1001;
                }
            }
            else if (this.npcId == BattleFlagID.ANGLE) {
                this.npcId = 1001;
            }
            if (this.npcId > 0) {
                if (!this._npcAni) {
                    let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
                    this._npcAni = new NPC();
                    this.showNpc();
                }
            }
        }
        clearNpc() {
            if (this._npcAni) {
                Laya.Tween.to(this._npcAni, { scaleX: 0.3 }, 200, null, null, 100);
                Laya.Tween.to(this._npcAni, { y: -300 }, 300, Laya.Ease.circIn, new Laya.Handler(this, this.clearNpcCom), 300);
            }
        }
        clearNpcCom() {
            this._npcAni && this._npcAni.removeSelf();
            Game.map0.clearNpc();
            this.npcId = 0;
            this._npcAni = null;
        }
        setDoor(state) {
            this._door.visible = state == 1;
            console.log("门是否显示", this._door.visible);
        }
        updateY() {
            var bgy = GameBG.cy - Game.hero.pos2.z;
            if (bgy <= 0 && bgy >= Laya.stage.height - GameBG.bgHH) {
                Game.bg.y = bgy;
                Game.camera.transform.localPositionZ = Game.cameraCN.z + Game.hero.z;
            }
            else if (bgy < Laya.stage.height - GameBG.bgHH) {
                Game.bg.y = Laya.stage.height - GameBG.bgHH;
                Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y) / GameBG.ww / Game.cameraCN.cos0;
            }
            else {
                Game.bg.y = 0;
                Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y) / GameBG.ww / Game.cameraCN.cos0;
            }
            var bgx = GameBG.cx - Game.hero.pos2.x;
            if (bgx <= -GameBG.ww2 && bgx >= (Laya.stage.width - GameBG.bgWW) + GameBG.ww2) {
                Game.camera.transform.localPositionX = Game.hero.x;
                Game.bg.x = bgx;
            }
            else if (bgx > -GameBG.ww2) {
                Game.bg.x = -GameBG.ww2;
                Game.camera.transform.localPositionX = (GameBG.cx - Game.bg.x) / GameBG.ww;
            }
            else {
                Game.bg.x = (Laya.stage.width - GameBG.bgWW) + GameBG.ww2;
                Game.camera.transform.localPositionX = (GameBG.cx - Game.bg.x) / GameBG.ww;
            }
            Game.updateMap();
        }
    }
    GameBG.wnum = 12;
    GameBG.hnum = 49;
    GameBG.width = 750;
    GameBG.height = 1334;
    GameBG.ww = GameBG.width / GameBG.wnum;
    GameBG.ww2 = GameBG.ww / 2;
    GameBG.fw = GameBG.ww * 0.4;
    GameBG.mw = GameBG.ww - GameBG.fw;
    GameBG.mw2 = GameBG.mw / 2;
    GameBG.mw4 = GameBG.mw / 4;
    GameBG.orthographicVerticalSize = GameBG.wnum * GameBG.height / GameBG.width;
    GameBG.arrsp = [];
    GameBG.arr0 = [];

    var Handler = Laya.Handler;
    var Loader = Laya.Loader;
    class ZipLoader {
        constructor() {
            this.handler = null;
            this.fileNameArr = [];
            this.resultArr = [];
        }
        static load(fileName, handler) {
            this.instance.loadFile(fileName, handler);
        }
        loadFile(fileName, handler) {
            this.handler = handler;
            Laya.loader.load(fileName, new Handler(this, this.zipFun), null, Loader.BUFFER);
        }
        zipFun(ab, handler) {
            this.handler = handler;
            Laya.Browser.window.JSZip.loadAsync(ab).then((jszip) => {
                this.analysisFun(jszip);
            });
        }
        analysisFun(jszip) {
            this.currentJSZip = jszip;
            for (var fileName in jszip.files) {
                this.fileNameArr.push(fileName + "");
            }
            this.exeOne();
        }
        exeOne() {
            this.currentJSZip.file(this.fileNameArr[0]).async('text').then((content) => {
                this.over(content);
            });
        }
        over(content) {
            var fileName = this.fileNameArr.shift();
            this.resultArr.push(fileName);
            this.resultArr.push(content);
            if (this.fileNameArr.length != 0) {
                this.exeOne();
            }
            else {
                this.handler.runWith([this.resultArr]);
            }
        }
    }
    ZipLoader.instance = new ZipLoader();

    class GameAlert extends ui.test.alertUI {
        constructor() {
            super();
            this.cancelBtn.clickHandler = new Laya.Handler(this, this.onCancel);
            this.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
        }
        onCancel() {
            this.removeSelf();
            this.handler2 && this.handler2.run();
        }
        onSure() {
            this.handler && this.handler.run();
            this.removeSelf();
        }
        onShow(content, sureHandler, cancelHandler = null, content2 = "", title = "提示") {
            this.txt.text = content;
            this.txt2.text = content2;
            this.handler = sureHandler;
            this.handler2 = cancelHandler;
            App.layerManager.alertLayer.addChild(this);
        }
    }

    class SysTalent {
        constructor() {
            this.id = 0;
            this.addAttack = 0.1;
            this.addHp = 0.1;
            this.addItemhp = 0.1;
            this.addDefense = 0.1;
            this.addAtkspeed = 0.1;
            this.dropLevelhp = 0.1;
            this.addCompose = 0.1;
            this.lineGold = 0.1;
            this.offlineGold = 0.1;
        }
    }
    SysTalent.NAME = "sys_talent.txt";

    class GameMain {
        constructor() {
            ZipLoader.instance.zipFun(Laya.loader.getRes("h5/tables.zip"), new Laya.Handler(this, this.zipFun));
        }
        zipFun(arr) {
            this.initTable(arr);
            Laya.stage.event(GameEvent.CONFIG_OVER);
            Game.alert = new GameAlert();
            Game.scenneM.showMain();
            Game.battleLoader.preload();
            if (Session.isGuide) {
                Game.battleLoader.load();
            }
            else {
                Game.cookie.getCookie(CookieKey.CURRENT_BATTLE, (res) => {
                    if (res) {
                        Game.alert.onShow("是否继续未完成的战斗?", new Laya.Handler(this, this.onContinue, [res]), new Laya.Handler(this, this.onCancel));
                    }
                });
            }
        }
        onCancel() {
            Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
        }
        onContinue(res) {
            Game.battleLoader.load(res);
            console.log("继续战斗", res);
        }
        initTable(arr) {
            App.tableManager.register(SysChapter.NAME, SysChapter);
            App.tableManager.register(SysMap.NAME, SysMap);
            App.tableManager.register(SysEnemy.NAME, SysEnemy);
            App.tableManager.register(SysBullet.NAME, SysBullet);
            App.tableManager.register(SysLevel.NAME, SysLevel);
            App.tableManager.register(SysSkill.NAME, SysSkill);
            App.tableManager.register(SysBuff.NAME, SysBuff);
            App.tableManager.register(SysNpc.NAME, SysNpc);
            App.tableManager.register(SysRoleBase.NAME, SysRoleBase);
            App.tableManager.register(SysRoleUp.NAME, SysRoleUp);
            App.tableManager.register(SysHero.NAME, SysHero);
            App.tableManager.register(SysTalentCost.NAME, SysTalentCost);
            App.tableManager.register(SysTalentInfo.NAME, SysTalentInfo);
            App.tableManager.register(SysTalent.NAME, SysTalent);
            App.tableManager.onParse(arr);
        }
    }

    class PlatformID {
    }
    PlatformID.TEST = 0;
    PlatformID.H5 = 10;
    PlatformID.WX = 31;

    class LoginHttp extends BaseHttp {
        constructor(hand) {
            super(hand);
        }
        static create(hand) {
            return new LoginHttp(hand);
        }
        send() {
            let str = "gamex3/login";
            if (App.platformId == PlatformID.H5) {
                str = "gamex2/login";
            }
            super.send(App.serverIP + str, "scode=" + App.platformId + "&jscode=" + LoginHttp.FRONT + this.jsCode, "post", "text");
        }
        onSuccess(data) {
            Session.SKEY = data;
            super.onSuccess(data);
            console.log("login success", data);
        }
        checkLogin() {
            let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
            new BP().login((code) => {
                this.jsCode = code;
                this.send();
            });
        }
    }
    LoginHttp.FRONT = "";

    class ReceiverHttp extends BaseHttp {
        constructor(hand) {
            super(hand);
        }
        static create(hand) {
            return new ReceiverHttp(hand);
        }
        send() {
            super.send(App.serverIP + "gamex3/gamedata", "skey=" + Session.SKEY, "post", "text");
        }
        onSuccess(data) {
            Session.parseData(data);
            super.onSuccess(data);
            console.log("receive data", data);
        }
    }

    class HitType {
    }
    HitType.hit1 = 1;
    HitType.hit2 = 2;
    HitType.hit3 = 3;
    HitType.hit4 = 4;

    class GameScaleAnimator {
        constructor() {
            this.starttime = 0;
            this.playtime = 0;
            this.movelen = 0;
            this.ms = null;
            this.rad = 0;
            this.now = 0;
            this.cd = 650;
        }
        ai(ms) { }
        ;
        isOk() {
            return Game.executor.getWorldNow() >= this.now + this.cd;
        }
    }

    class GameScaleAnimator1 extends GameScaleAnimator {
        constructor() {
            super();
        }
        zoom(nt, zoom, ms) {
            if (nt > 1)
                nt = 1;
            nt = Math.sin(Math.PI * (nt) * 4);
            let st = 0;
            st = zoom * 0.2 * nt;
            st = zoom * 0.8 + st;
            ms.sp3d.transform.localScaleX = st;
            ms.sp3d.transform.localScaleZ = st;
            st = zoom * 0.1 * nt;
            st = zoom * 1.1 - st;
            ms.sp3d.transform.localScaleY = st;
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                var zoom = ms.tScale;
                if (now >= this.starttime + this.playtime) {
                    ms.sp3d.transform.localScaleZ = zoom;
                    ms.sp3d.transform.localScaleX = zoom;
                    ms.sp3d.transform.localScaleY = zoom;
                    this.starttime = 0;
                }
                else {
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.zoom(nt, zoom, ms);
                }
            }
        }
    }

    class GameScaleAnimator2 extends GameScaleAnimator {
        constructor() {
            super();
            this.movelen = GameBG.ww * 2.5;
            this.futureBox = new GameHitBox(1, 1);
            this.sp = new Laya.Point(0, 0);
        }
        move(nt) {
            var ww = this.movelen * nt;
            let ww2 = 0;
            let i = 0;
            while (i < 10) {
                ww2 += ww / 10;
                var vx = ww2 * Math.cos(this.rad);
                var vy = ww2 * Math.sin(this.rad);
                let nextX = this.sp.x + vx;
                let nextY = this.sp.y + vy;
                if (nextX >= (GameBG.width - GameBG.ww2) || nextX <= GameBG.ww2 || nextY >= ((Game.map0.endRowNum - 1) * GameBG.ww) || nextY <= 10 * GameBG.ww) {
                    return;
                }
                this.futureBox.setXY(nextX, nextY);
                var hits = Game.map0.Wharr;
                if (!Game.map0.chechHit_arr(this.futureBox, hits)) {
                    this.ms.setXY2DBox(this.futureBox.x, this.futureBox.y);
                }
                else {
                    return;
                }
                i++;
            }
        }
        zoom(nt, zoom, ms) {
            if (nt > 1)
                nt = 1;
            if (nt < 0.5)
                nt = 0.5;
            nt = nt * 1;
            nt = Math.sin(Math.PI * (nt));
            if (nt < 0)
                nt *= -1;
            let st = 0;
            st = zoom * 0.8 * (1 - nt);
            st = zoom * 0.2 + st;
            ms.sp3d.transform.localScaleZ = st;
            st = zoom * 0.2 * (1 - nt);
            st = zoom * 1 + st;
            ms.sp3d.transform.localScaleX = st;
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                var zoom = ms.tScale;
                if (now >= this.starttime + this.playtime) {
                    ms.sp3d.transform.localScaleZ = zoom;
                    ms.sp3d.transform.localScaleX = zoom;
                    ms.sp3d.transform.localScaleY = zoom;
                    this.starttime = 0;
                    this.ms = null;
                }
                else {
                    if (!this.ms) {
                        this.ms = ms;
                        this.rad = ms.face2d + Math.PI;
                        this.sp.x = ms.hbox.x;
                        this.sp.y = ms.hbox.y;
                        this.futureBox.setRq(this.sp.x, this.sp.y, ms.hbox.ww, ms.hbox.hh);
                    }
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.move(nt);
                    this.zoom(nt, zoom, ms);
                }
            }
        }
    }

    class GameScaleAnimator3 extends GameScaleAnimator {
        constructor() {
            super();
            this.movelen = GameBG.ww;
            this.futureBox = new GameHitBox(1, 1);
            this.sp = new Laya.Point(0, 0);
        }
        move(nt) {
            var ww = this.movelen * nt;
            var vx = ww * Math.cos(this.rad);
            var vy = ww * Math.sin(this.rad);
            this.futureBox.setXY(this.sp.x + vx, this.sp.y + vy);
            var hits = Game.map0.Wharr;
            if (!Game.map0.chechHit_arr(this.futureBox, hits)) {
                this.ms.setXY2DBox(this.futureBox.x, this.futureBox.y);
            }
        }
        zoom(nt, zoom, ms) {
            if (nt > 1)
                nt = 1;
            if (nt < 0.5)
                nt = 0.5;
            nt = nt * 1;
            nt = Math.sin(Math.PI * (nt));
            if (nt < 0)
                nt *= -1;
            let st = 0;
            st = zoom * 0.8 * (1 - nt);
            st = zoom * 0.2 + st;
            ms.sp3d.transform.localScaleZ = st;
            st = zoom * 0.2 * (1 - nt);
            st = zoom * 1 + st;
            ms.sp3d.transform.localScaleX = st;
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                var zoom = ms.tScale;
                if (now >= this.starttime + this.playtime) {
                    ms.sp3d.transform.localScaleZ = zoom;
                    ms.sp3d.transform.localScaleX = zoom;
                    ms.sp3d.transform.localScaleY = zoom;
                    this.starttime = 0;
                    this.ms = null;
                }
                else {
                    if (!this.ms) {
                        this.ms = ms;
                        this.rad = ms.face2d + Math.PI;
                        this.sp.x = ms.hbox.x;
                        this.sp.y = ms.hbox.y;
                        this.futureBox.setRq(this.sp.x, this.sp.y, ms.hbox.ww, ms.hbox.hh);
                    }
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.zoom(nt, zoom, ms);
                }
            }
        }
    }

    class GameScaleAnimator4 extends GameScaleAnimator {
        constructor() {
            super();
            this.flag = false;
        }
        move(nt, ms) {
            this.flag = !this.flag;
            ms.sp3d.transform.localPositionX = ms.sp3d.transform.localPositionX + (this.flag ? 0.1 : -0.1);
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                if (now >= this.starttime + this.playtime) {
                    this.starttime = 0;
                }
                else {
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.move(nt, ms);
                }
            }
        }
    }

    class NPC_1001 extends ui.test.xiongmao1UI {
        constructor() { super(); }
    }

    class NPC_1002 extends ui.test.moguiUI {
        constructor() { super(); }
    }

    class NPC_1003 extends ui.test.huziUI {
        constructor() { super(); }
    }

    class AIType {
    }
    AIType.NOTHAS = 0;
    AIType.FLYHIT = 1;
    AIType.BULLET = 2;
    AIType.STONE = 3;
    AIType.SHITOUREN = 4;
    AIType.TREE = 5;
    AIType.RANDOM_MOVE = 6;
    AIType.MOVEHIT = 8;
    AIType.REBOUND = 9;
    AIType.JUMP_FOLLOW = 10;
    AIType.RED_LINE = 11;

    class BaseSkill {
        constructor(sys) {
            this.cd = 0;
            this.sysBullet = sys;
        }
        exeSkill(now, pro) {
            return false;
        }
    }

    class SplitSkill extends BaseSkill {
        constructor(sys) { super(sys); }
        exeSkill(now, pro) {
            this.pro = pro;
            if (pro.splitTimes < this.sysBullet.splitNum) {
                this.onDieSplit();
                return true;
            }
            return false;
        }
        onDieSplit() {
            console.log("分裂");
            let flag = this.pro.splitTimes + 1;
            let hp = this.pro.gamedata.maxhp / 2;
            let monster1 = Monster.getMonster(this.pro.sysEnemy.id, this.pro.hbox.cx, this.pro.hbox.cy, 1, hp);
            monster1.splitTimes = flag;
            let monster2 = Monster.getMonster(this.pro.sysEnemy.id, this.pro.hbox.cx, this.pro.hbox.cy, 1, hp);
            monster2.splitTimes = flag;
        }
    }

    class BaseAI extends GameAI {
        constructor(ms) {
            super();
            this.skillISbs = [];
            this.now = 0;
            this.shaders = 0;
            this.collisionCd = 0;
            this.stiff = 500;
            this.pro = ms;
            this.sysEnemy = this.pro.sysEnemy;
            this.normalSb = null;
            if (this.sysEnemy.normalAttack > 0) {
                this.normalSb = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
            }
            this.skillISbs = [];
            if (this.sysEnemy.skillId != '0') {
                var arr = this.sysEnemy.skillId.split(',');
                for (var m = 0; m < arr.length; m++) {
                    let id = Number(arr[m]);
                    if (id > 0) {
                        let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                        this.skillISbs.push(sysBullet);
                        if (sysBullet.bulletType == AttackType.SPLIT) {
                            this.splitSkill = new SplitSkill(sysBullet);
                        }
                    }
                }
            }
            if (this.sysEnemy.enemyBlack > 0) {
                let HIT = Laya.ClassUtils.getClass("HIT_" + this.sysEnemy.enemyBlack);
                this.g2 = new HIT();
            }
        }
        checkHeroCollision() {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            var now = Game.executor.getWorldNow();
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
                if (now > this.collisionCd) {
                    if (Game.hero.hbox.linkPro_) {
                        this.pro.hurtValue = 150;
                        Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
                        this.collisionCd = now + 2000;
                    }
                }
            }
        }
        setShader() {
            if (this.shaders > 0 && this.now >= this.shaders) {
                this.shaders = 0;
                var ms = this.pro;
                if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                    var shader = MonsterShader.map[ms.sysEnemy.enemymode];
                    shader.setShader0(this.pro.sp3d, 0);
                }
            }
        }
        exeAI(pro) {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            if (!this.run_)
                return;
            this.now = Game.executor.getWorldNow();
            this.setShader();
            this.hitEffect();
            return false;
        }
        hitEffect() {
            if (this.g2) {
                this.g2.ai(this.pro);
            }
        }
        starAi() {
            this.run_ = true;
            this.pro.play(GameAI.Idle);
        }
        stopAi() {
            this.run_ = false;
        }
        setCrit(pro, id) {
            let critSkill = Game.skillManager.isHas(id);
            if (critSkill) {
                let critBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, critSkill.skillEffect1);
                if (critBuff) {
                    let rate3006 = critBuff.addCrit / 1000;
                    if ((1 - Math.random()) > rate3006) {
                        pro.hurtValue = Math.floor(pro.hurtValue * 1.5 + pro.hurtValue * (critBuff.addHurt / 1000));
                        return true;
                    }
                }
            }
            return false;
        }
        setBoomHead() {
            let dieSkill = Game.skillManager.isHas(1007);
            if (dieSkill) {
                let arr = dieSkill.skillcondition.split(",");
                let hpRate = Number(arr[0]);
                let rate = Number(arr[1]);
                if (this.pro.gamedata.hp / this.pro.gamedata.maxhp < hpRate / 100) {
                    if ((1 - Math.random()) > rate / 100) {
                        this.pro.hurtValue = this.pro.gamedata.hp;
                        console.log("爆头了");
                    }
                }
            }
        }
        hit(pro, isBuff = false) {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            let crit3006 = this.setCrit(pro, 3006);
            let crit3007 = this.setCrit(pro, 3007);
            this.setBoomHead();
            if (pro.buffAry.length > 0) {
                for (let i = 0; i < pro.buffAry.length; i++) {
                    let buffId = pro.buffAry[i];
                    if (this.pro.buffAry.indexOf(buffId) == -1) {
                        Game.buffM.addBuff(pro.buffAry[i], this.pro, pro);
                        this.pro.buffAry.push(buffId);
                    }
                }
            }
            this.pro.hurt(pro.gamedata.maxhp, crit3006 || crit3007, isBuff);
            if (this.pro.gamedata.hp <= 0) {
                this.die();
            }
            else {
                if (this.sysEnemy.enemyAi != 0) {
                    if (this.pro.acstr == GameAI.Idle || this.pro.acstr == GameAI.Run) {
                        this.pro.play(GameAI.TakeDamage);
                    }
                }
                if (isBuff) {
                    return;
                }
                this.stiffTime = this.now;
                if (this.g2 && this.g2.isOk() && !this.pro.unBlocking) {
                    if (this.sysEnemy.moveType != 5) {
                        var a = pro.face3d + Math.PI;
                        this.pro.rotation(a);
                    }
                    if (this.g2.starttime == 0) {
                        this.g2.starttime = this.now;
                        this.g2.now = this.now;
                        this.g2.playtime = 200;
                    }
                }
                var ms = this.pro;
                if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                    var shader = MonsterShader.map[ms.sysEnemy.enemymode];
                    shader.setShader0(this.pro.sp3d, 1);
                    var now = Game.executor.getWorldNow();
                    this.shaders = now + 250;
                }
            }
        }
        die() {
            this.setShader();
            let goldNum = this.sysEnemy.dropGold;
            if (goldNum > 0) {
                CoinEffect.addEffect(this.pro, goldNum);
            }
            Game.battleExp += this.sysEnemy.dropExp;
            this.splitSkill && this.splitSkill.exeSkill(this.now, this.pro);
            this.pro.die();
        }
    }

    class FlyAndHitAi extends BaseAI {
        constructor(pro) {
            super(pro);
            this.status = 0;
            this.cd = 0;
            pro.sp3d.transform.localPositionY = 1;
            if (FlyAndHitAi.timdex >= 4) {
                FlyAndHitAi.timdex = 0;
            }
            this.cd = Game.executor.getWorldNow() + FlyAndHitAi.timdex * 2000;
            FlyAndHitAi.timdex++;
            pro.setSpeed(1);
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            var sys = this.pro.sysEnemy;
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0 && this.now >= this.cd) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.cd = this.now + 1000;
                this.status = 1;
                if (this.pro.acstr != GameAI.NormalAttack) {
                    this.pro.play(GameAI.NormalAttack);
                    this.pro.unBlocking = true;
                }
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.pro.setSpeed(sys.moveSpeed);
                this.cd = this.now + sys.enemySpeed;
                this.status = 0;
                this.pro.unBlocking = false;
                this.pro.play(GameAI.Run);
            }
            if (this.status == 1) {
                if (this.pro.normalizedTime > 0.4) {
                    this.pro.setSpeed(10);
                    this.pro.move2D(this.pro.face2d);
                }
                else {
                    this.pro.setSpeed(1);
                    this.pro.move2D(this.pro.face2d + Math.PI);
                }
            }
            else if (this.status == 0) {
                this.traceHero();
            }
        }
        traceHero() {
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) > GameBG.ww2) {
                let a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.pro.move2D(this.pro.face2d);
            }
        }
        hit(pro) {
            super.hit(pro);
        }
    }
    FlyAndHitAi.timdex = 0;

    class MonsterBulletAI extends GameAI {
        constructor(pro) {
            super();
            this.i = 0;
            this.pro = pro;
        }
        hit(pro) {
        }
        exeAI(pro) {
            if (!pro.move2D(pro.face2d)) {
                pro.die();
                return false;
            }
        }
        starAi() {
            this.i = 0;
        }
        stopAi() {
            this.i = 0;
        }
    }

    class BoomEffect {
        constructor() {
            this.effectId = 0;
        }
        static getEffect(pro, effectId) {
            let tag = BoomEffect.TAG + effectId;
            Game.poolTagArr[tag] = tag;
            let effect = Laya.Pool.getItemByClass(tag, BoomEffect);
            if (!effect.pro) {
                effect.pro = pro;
                effect.effectId = effectId;
                effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/" + effectId + "/monster.lh"));
                MemoryManager.ins.add(effect.sp3d.url);
                console.log("创建新的怪物子弹爆炸特效");
            }
            effect.sp3d.transform.localPosition = pro.sp3d.transform.localPosition;
            Game.layer3d.addChild(effect.sp3d);
            setTimeout(() => {
                effect.recover();
            }, 500);
            return effect;
        }
        recover() {
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(BoomEffect.TAG + this.effectId, this);
            MemoryManager.ins.app(this.sp3d.url);
        }
    }
    BoomEffect.TAG = "BoomEffect";

    class MonsterBulletMove extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(2, 2);
        }
        move2d(n, pro, speed) {
            pro.setSpeed(speed);
            if (pro.speed <= 0)
                return;
            if (pro.sysBullet.bulletBlock == 1) {
                var vx = pro.speed * Math.cos(n);
                var vz = pro.speed * Math.sin(n);
                var x0 = pro.hbox.cx;
                var y0 = pro.hbox.cy;
                this.future.setVV(x0, y0, vx, vz);
                var ebh;
                if (pro.sysBullet.bulletEjection == 1) {
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Hharr);
                    if (ebh) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        if (ebh.linkPro_) {
                            pro.hurtValue = 150;
                            ebh.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, ebh.linkPro_);
                        }
                        this.hitEffect(pro);
                        return false;
                    }
                    var hits = Game.map0.Aharr;
                    ebh = Game.map0.chechHit_arr(this.future, hits);
                    if (ebh) {
                        if (pro.gamedata.bounce <= 0) {
                            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                            pro.setSpeed(0);
                            this.hitEffect(pro);
                            return false;
                        }
                        pro.gamedata.bounce--;
                        if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, -1 * vx, vz), hits)) {
                            vx = -1 * vx;
                        }
                        else if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, vx, -1 * vz), hits)) {
                            vz = -1 * vz;
                        }
                        else {
                            this.hitEffect(pro);
                            return false;
                        }
                        n = 2 * Math.PI - Math.atan2(vz, vx);
                        pro.rotation(n);
                    }
                    pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                    return true;
                }
                else {
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Hharr);
                    if (ebh) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        if (ebh.linkPro_) {
                            pro.hurtValue = 150;
                            ebh.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, ebh.linkPro_);
                        }
                        this.hitEffect(pro);
                        return false;
                    }
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Aharr);
                    if (ebh) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        if (ebh.linkPro_) {
                            pro.hurtValue = 150;
                            ebh.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, ebh.linkPro_);
                        }
                        this.hitEffect(pro);
                        return false;
                    }
                    pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                    return true;
                }
            }
            else {
                var heroBox = Game.hero.hbox;
                pro.curLen += speed;
                if (pro.curLen >= pro.moveLen) {
                    pro.curLen = pro.moveLen;
                }
                var nn = pro.curLen / pro.moveLen;
                var vx = speed * Math.cos(n);
                var vz = speed * Math.sin(n);
                var dy = Math.sin((Math.PI * nn)) * 2;
                pro.sp3d.transform.localPositionY = 0.1 + dy;
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                if (heroBox.hit(heroBox, pro.hbox)) {
                    if (Game.hero) {
                        pro.hurtValue = 150;
                        Game.hero.event(Game.Event_Hit, pro);
                        pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                        pro.setSpeed(0);
                    }
                    return false;
                }
                if (pro.curLen == pro.moveLen) {
                    this.hitEffect(pro);
                    return false;
                }
                return true;
            }
        }
        hitEffect(pro) {
            pro.setSpeed(0);
            if (pro.sysBullet.boomEffect > 0) {
                BoomEffect.getEffect(pro, pro.sysBullet.boomEffect);
            }
        }
    }

    class BulletRotateScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onAwake() {
            let box = this.owner;
            this.qiu = box.getChildAt(0);
            this.qiu.transform.localRotationEulerX = 45;
            this.ball = this.qiu.getChildAt(0);
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            this.ball.transform.localRotationEulerY += 8;
        }
        onDisable() {
        }
    }

    class MonsterBullet extends GamePro {
        constructor() {
            super(GameProType.MonstorArrow);
            this.setGameMove(new MonsterBulletMove());
            this.setGameAi(new MonsterBulletAI(this));
            this._bulletShadow = new ui.test.BulletShadowUI();
            Game.footLayer.addChild(this._bulletShadow);
            this.setShadowSize(19);
        }
        setBubble(sb) {
            if (sb == null) {
                console.error('这个子弹有问题');
                return;
            }
            if (sb.bulletMode == 10004 || sb.bulletMode == 10005) {
                this._bulletShadow && this._bulletShadow.removeSelf();
            }
            else {
                Game.footLayer.addChild(this._bulletShadow);
            }
            this.sysBullet = sb;
            if (!this.sp3d) {
                var bullet;
                bullet = (Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + sb.bulletMode + "/monster.lh")));
                if (this.sysBullet.id != 10 && this.sysBullet.id != 11 && this.sysBullet.id != 20) {
                    bullet.getChildAt(0).transform.localRotationEulerY = -bullet.transform.localRotationEulerY;
                    bullet.addComponent(BulletRotateScript);
                }
                MemoryManager.ins.add(bullet.url);
                this.setSp3d(bullet);
            }
            this.gamedata.bounce = sb.ejectionNum;
        }
        static getBullet(sb) {
            let tag = MonsterBullet.TAG + sb.bulletMode;
            Game.poolTagArr[tag] = tag;
            let bullet = Laya.Pool.getItemByClass(tag, MonsterBullet);
            bullet.isDie = false;
            bullet.setBubble(sb);
            return bullet;
        }
        die() {
            if (this.isDie) {
                return;
            }
            this.isDie = true;
            this.curLen = null;
            this.moveLen = null;
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.sp3d.transform.localPositionY = -500;
            this.sp3d.transform.localPositionZ = -500;
            Laya.Pool.recover(MonsterBullet.TAG + this.sysBullet.bulletMode, this);
            MemoryManager.ins.app(this.sp3d.url);
        }
    }
    MonsterBullet.TAG = "MonsterBullet_";
    MonsterBullet.count = 0;

    class MonsterShooting {
        constructor() {
            this.scd = 0;
            this.shootCd = 1200;
            this.st = 0;
            this.now = 0;
            this.at = 0;
            this.future = new GameHitBox(2, 2);
        }
        short_arrow(r_, pro, proType_, range = 0) {
            var bo = MonsterBullet.getBullet(this._sysBullet);
            bo.curLen = null;
            bo.moveLen = null;
            bo.sp3d.transform.localPositionY = 0.1;
            bo.setXY2D(pro.pos2.x, pro.pos2.z);
            Game.layer3d.addChild(bo.sp3d);
            bo.setSpeed(this._sysBullet.bulletSpeed);
            Game.bloodLayer.graphics.clear();
            bo.rotation(r_);
            bo.curLen = 0;
            bo.hurtValue = pro.hurtValue;
            bo.moveLen = range + Math.sqrt((bo.hbox.cy - Game.hero.hbox.cy) * (bo.hbox.cy - Game.hero.hbox.cy) + (bo.hbox.cx - Game.hero.hbox.cx) * (bo.hbox.cx - Game.hero.hbox.cx));
            bo.startAi();
        }
        get attackOk() {
            this.now = Game.executor.getWorldNow();
            return this.now >= this.st;
        }
        starAttack(pro, acstr) {
            this.pro = pro;
            if (this.attackOk) {
                this.scd = 0;
                pro.play(acstr);
                if (this.at > 0) {
                    Laya.stage.timer.frameLoop(this.at, this, this.ac0);
                }
                else {
                    this.ac0();
                }
                return true;
            }
            return false;
        }
        cancelAttack() {
            Laya.stage.timer.clear(this, this.ac0);
            this.scd = 0;
        }
        ac0() {
            if (this.pro.normalizedTime >= this.at) {
                if (this.pro.normalizedTime >= 1) {
                    Laya.stage.timer.clear(this, this.ac0);
                    this.pro.play(GameAI.Idle);
                }
                if (this.scd == 0) {
                    this.scd = 1;
                    this.pro.event(Game.Event_Short, null);
                    this.st = Game.executor.getWorldNow() + this.shootCd;
                }
            }
        }
        checkBallistic(n, pro, ero) {
            var vx = GameBG.mw2 * Math.cos(n);
            var vz = GameBG.mw2 * Math.sin(n);
            var x0 = pro.hbox.cx;
            var y0 = pro.hbox.cy;
            var ebh;
            for (let i = 0; i < 6000; i++) {
                ebh = null;
                this.future.setVV(x0, y0, vx, vz);
                if (ero.hbox.hit(ero.hbox, this.future)) {
                    return ero;
                }
                var hits = Game.map0.Aharr;
                ebh = Game.map0.chechHit_arr(this.future, hits);
                if (ebh) {
                    return null;
                }
                x0 += vx;
                y0 += vz;
            }
            return null;
        }
    }

    class FlowerAI extends BaseAI {
        constructor(pro) {
            super(pro);
            this.shooting = new MonsterShooting();
            this.nextTime = 0;
            this.status = 0;
            this.shooting.at = 0.4;
            this.pro.setSpeed(this.sysEnemy.moveSpeed);
            this.pro.on(Game.Event_Short, this, this.shootAc);
            this.nextTime = Game.executor.getWorldNow() + Math.floor(Math.random() * 2000);
        }
        shootAc() {
            let curBullet = this.shooting._sysBullet;
            if (!curBullet) {
                return;
            }
            let minNum = curBullet.mixNum;
            let maxNum = curBullet.maxNum;
            let bulletAngle = curBullet.bulletAngle;
            this.shooting.shootCd = this.sysEnemy.enemySpeed;
            if (curBullet.bulletType == 1) {
                if (bulletAngle != 360) {
                    if (minNum % 2 == 0) {
                        let angle = curBullet.bulletAngle;
                        angle = angle / (minNum - 1);
                        let hudu = angle / 180 * Math.PI * 0.5;
                        let count = Math.floor(minNum / 2);
                        for (let k = 0; k < curBullet.bulletNum; k++) {
                            setTimeout(() => {
                                for (var i = 1; i <= count; i++) {
                                    this.shooting.short_arrow(this.pro.face3d + hudu * (2 * i - 1), this.pro, GameProType.MonstorArrow);
                                    this.shooting.short_arrow(this.pro.face3d - hudu * (2 * i - 1), this.pro, GameProType.MonstorArrow);
                                }
                            }, k * 500);
                        }
                    }
                    else {
                        let angle = curBullet.bulletAngle;
                        angle = angle / minNum;
                        let hudu = angle / 180 * Math.PI;
                        let count = Math.floor(minNum / 2);
                        for (let k = 0; k < curBullet.bulletNum; k++) {
                            setTimeout(() => {
                                this.shooting.short_arrow(this.pro.face3d, this.pro, GameProType.MonstorArrow);
                                for (var i = 1; i <= count; i++) {
                                    this.shooting.short_arrow(this.pro.face3d + hudu * i, this.pro, GameProType.MonstorArrow);
                                    this.shooting.short_arrow(this.pro.face3d - hudu * i, this.pro, GameProType.MonstorArrow);
                                }
                            }, k * 500);
                        }
                    }
                }
                else if (bulletAngle == 360) {
                    for (let k = 0; k < curBullet.bulletNum; k++) {
                        setTimeout(() => {
                            for (var i = 1; i <= minNum; i++) {
                                this.shooting.short_arrow(2 * Math.PI / minNum * i, this.pro, GameProType.MonstorArrow);
                            }
                        }, k * 500);
                    }
                }
            }
            else if (curBullet.bulletType == 2) {
                this.shooting.shootCd = this.sysEnemy.enemySpeed;
                let angle = curBullet.bulletAngle;
                angle = angle / 2;
                let bulletNum = minNum + Math.ceil(Math.random() * (maxNum - minNum));
                for (let i = 0; i < bulletNum; i++) {
                    setTimeout(() => {
                        let flag = i % 2 == 0 ? 1 : -1;
                        let tmp = (angle * Math.random()) / 180 * Math.PI * flag;
                        this.shooting.short_arrow(this.pro.face3d + tmp, this.pro, GameProType.MonstorArrow, (Math.random() > 0.5 ? 1 : -1) * 200 * Math.random());
                    }, Math.random() * 1000 + 200);
                }
            }
        }
        startAttack() {
            this.shooting._sysBullet = null;
            if (this.normalSb) {
                if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                    this.shooting._sysBullet = this.normalSb;
                }
            }
            if (!this.shooting._sysBullet) {
                if (this.skillISbs.length > 0) {
                    let rand = Math.floor(this.skillISbs.length * Math.random());
                    let skillBullet = this.skillISbs[rand];
                    if (skillBullet.bulletType == AttackType.NORMAL_BULLET || skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                        this.shooting._sysBullet = skillBullet;
                    }
                }
            }
            if (this.shooting._sysBullet) {
                if (this.now >= this.nextTime) {
                    this.faceToHero();
                    this.shooting.starAttack(this.pro, GameAI.NormalAttack);
                }
            }
            if (this.now >= this.nextTime) {
                this.faceToHero();
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
            }
        }
        faceToHero() {
            var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.onExe();
            return false;
        }
        onExe() {
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.status = 1;
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.startAttack();
                this.status = 0;
                this.nextTime = this.now + this.shooting.shootCd;
            }
            if (this.status == 1) {
                if (this.sysEnemy.moveType == MoveType.FIXED) {
                    return;
                }
                this.pro.move2D(this.pro.face2d);
                this.pro.play(GameAI.Run);
            }
        }
        hit(pro) {
            super.hit(pro);
        }
        die() {
            super.die();
            this.shooting && this.shooting.cancelAttack();
        }
    }

    class CallSkill extends BaseSkill {
        constructor(sys) {
            super(sys);
            this.callId = 0;
            this.callCd = 0;
            let arr = this.sysBullet.callInfo.split(',');
            this.callId = Number(arr[0]);
            this.callCd = Number(arr[2]);
            this.cd = Game.executor.getWorldNow() + this.callCd;
        }
        exeSkill(now, pro) {
            if (now >= this.cd) {
                pro.play(GameAI.NormalAttack);
                let monster = Monster.getMonster(this.callId, pro.hbox.x + GameBG.ww, pro.hbox.y - GameBG.ww);
                let zhaohuan = new ui.test.zhaohuanUI();
                Game.bloodLayer.addChild(zhaohuan);
                zhaohuan.pos(pro.hbox.cx, pro.hbox.cy);
                setTimeout(() => {
                    zhaohuan.removeSelf();
                }, 1500);
                this.cd = now + this.callCd;
                return true;
            }
            return false;
        }
    }

    class WindSkill extends BaseSkill {
        constructor(sys) {
            super(sys);
            this.sysBullet.bulletCd = 4000;
        }
        exeSkill(now, pro) {
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) > GameBG.ww * 6) {
                if (now >= this.cd) {
                    let a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                    pro.rotation(a);
                    pro.play(GameAI.SkillStart);
                    pro.curLen = 0;
                    pro.moveLen = GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox);
                    this.cd = now + this.sysBullet.bulletCd;
                    return true;
                }
            }
            return false;
        }
    }

    class StoneAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.skillcd = 0;
            this.windCd = 0;
            this.callSkill = new CallSkill(this.skillISbs[0]);
            this.windSkill = new WindSkill(this.skillISbs[1]);
            this.cd = this.sysEnemy.enemySpeed;
            this.nextTime = Game.executor.getWorldNow() + this.cd;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            if (pro.isDie) {
                return;
            }
            this.setShader();
            if (this.pro.isIce) {
                return;
            }
            this.now = Game.executor.getWorldNow();
            if (this.now >= this.nextTime) {
                this.onExe2(this.now);
                this.nextTime = this.now + this.cd;
            }
            if (this.pro.moveLen > 0) {
                this.pro.setSpeed(8);
                if (this.pro.move2D(this.pro.face2d)) {
                    this.pro.curLen = this.pro.moveLen = 0;
                    this.pro.setSpeed(this.sysEnemy.moveSpeed);
                    this.pro.play(GameAI.SkillEnd);
                }
            }
            return false;
        }
        onExe2(now) {
            let isCall = this.callSkill.exeSkill(now, this.pro);
            if (!isCall) {
                let isWind = this.windSkill.exeSkill(now, this.pro);
                if (!isWind) {
                    this.normalAttack();
                }
            }
        }
        normalAttack() {
            if (this.pro.isDie) {
                return;
            }
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.status = 1;
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.startAttack();
                this.status = 0;
                this.nextTime = this.now + this.shooting.shootCd;
            }
        }
    }

    class TreeAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            this.pro.rotation(Math.PI * 0.5);
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            return false;
        }
        onExe() {
            if (this.pro.isDie) {
                return;
            }
            this.checkHeroCollision();
            this.jump();
        }
        jump() {
            if (this.status == 0 && this.now >= this.nextTime) {
                this.onJump();
                this.status = 1;
            }
            if (this.status == 1) {
                let isTo = this.pro.move2D(this.pro.face2d);
                if (isTo) {
                    if (this.status == 1) {
                        if (this.skillISbs.length > 0) {
                            let sys = this.skillISbs[Math.floor(this.skillISbs.length * Math.random())];
                            if (sys && sys.bulletType == AttackType.AOE) {
                                if (this.now >= this.nextTime) {
                                    this.onAoe(sys);
                                    this.nextTime = this.now + this.sysEnemy.enemySpeed;
                                    this.status = 0;
                                }
                            }
                            else {
                                if (this.now >= this.nextTime) {
                                    this.startAttack();
                                    this.shootAc();
                                    this.pro.play(GameAI.NormalAttack);
                                    this.nextTime = this.now + this.shooting.shootCd;
                                    this.status = 0;
                                }
                            }
                        }
                        else {
                            if (this.now >= this.nextTime) {
                                this.startAttack();
                                this.shootAc();
                                this.pro.play(GameAI.NormalAttack);
                                this.nextTime = this.now + this.shooting.shootCd;
                                this.status = 0;
                            }
                        }
                    }
                    this.status = 0;
                }
            }
        }
        startAttack() {
            if (this.pro.isDie) {
                return;
            }
            this.shooting._sysBullet = null;
            if (this.normalSb) {
                if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                    this.shooting._sysBullet = this.normalSb;
                }
            }
            if (!this.shooting._sysBullet) {
                if (this.skillISbs.length > 0) {
                    let rand = Math.floor(this.skillISbs.length * Math.random());
                    let skillBullet = this.skillISbs[rand];
                    if (skillBullet.bulletType == AttackType.NORMAL_BULLET || skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                        this.shooting._sysBullet = skillBullet;
                    }
                }
            }
        }
        onAoe(bullet) {
            BoomEffect.getEffect(this.pro, bullet.boomEffect);
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) <= bullet.attackAngle) {
                this.pro.hurtValue = this.pro.sysEnemy.enemyAttack;
                Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
            }
        }
        onJump() {
            this.pro.sp3d.transform.localPositionY = 0;
            let toArr = Game.getRandPos(this.pro);
            if (toArr.length == 2) {
                let toX = toArr[0] * GameBG.ww;
                let toY = toArr[1] * GameBG.ww;
                if (toX && toY) {
                    this.pro.curLen = 0;
                    this.pro.moveLen = Math.sqrt((this.pro.hbox.y - toY) * (this.pro.hbox.y - toY) + (this.pro.hbox.x - toX) * (this.pro.hbox.x - toX));
                    this.pro.setSpeed(Math.ceil(this.pro.moveLen / GameBG.ww));
                    var xx = toX - this.pro.hbox.x;
                    var yy = this.pro.hbox.y - toY;
                    this.pro.rotation(Math.atan2(yy, xx));
                }
            }
        }
    }

    class RandMoveAI extends BaseAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.status = 0;
            pro.setSpeed(this.sysEnemy.moveSpeed);
            if (RandMoveAI.timdex >= 4) {
                RandMoveAI.timdex = 0;
            }
            this.cd = Game.executor.getWorldNow() + RandMoveAI.timdex * 2000;
            RandMoveAI.timdex++;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0 && this.now >= this.cd) {
                this.status = 1;
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.pro.rotation((Math.PI / 8) * Math.floor(Math.random() * 16));
                this.pro.play(GameAI.Run);
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.status = 0;
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.pro.play(GameAI.Idle);
            }
            if (this.status == 1) {
                this.pro.move2D(this.pro.face2d);
            }
        }
        exeAI0(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.status == 0 && this.now >= this.cd) {
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.status = 1;
                let toArr = Game.getRandPos(this.pro);
                let toX = toArr[0] * GameBG.ww;
                let toY = toArr[1] * GameBG.ww;
                this.pro.curLen = 0;
                this.pro.moveLen = Math.sqrt((this.pro.hbox.y - toY) * (this.pro.hbox.y - toY) + (this.pro.hbox.x - toX) * (this.pro.hbox.x - toX));
                var xx = toX - this.pro.hbox.x;
                var yy = this.pro.hbox.y - toY;
                this.pro.rotation(Math.atan2(yy, xx));
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.status = 0;
            }
            if (this.status == 1) {
                this.pro.move2D(this.pro.face2d);
            }
        }
    }
    RandMoveAI.timdex = 0;

    class MoveAndHitAi extends BaseAI {
        constructor(pro) {
            super(pro);
            this.status = 0;
            this.cd = 0;
            MoveAndHitAi.index++;
            if (MoveAndHitAi.index > 4) {
                MoveAndHitAi.index = 0;
            }
            this.cd = Game.executor.getWorldNow() + MoveAndHitAi.index * 1500;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            var sys = this.pro.sysEnemy;
            if (this.status == 0 && this.now >= this.cd) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.cd = this.now + sys.enemySpeed;
                this.status = 1;
                if (this.pro.acstr != GameAI.NormalAttack) {
                    this.pro.play(GameAI.NormalAttack);
                }
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.pro.setSpeed(sys.moveSpeed);
                this.cd = this.now + sys.enemySpeed;
                this.status = 0;
                this.pro.play(GameAI.Run);
            }
            if (this.status == 1) {
                if (this.pro.normalizedTime > 0.4) {
                    this.pro.setSpeed(8);
                    this.pro.move2D(this.pro.face2d);
                }
                else {
                    this.pro.setSpeed(1);
                    this.pro.move2D(this.pro.face2d + Math.PI);
                }
            }
            else {
                if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww * 5) {
                    let a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                    this.pro.rotation(a);
                    this.pro.move2D(this.pro.face2d);
                }
            }
        }
        hit(pro) {
            super.hit(pro);
        }
    }
    MoveAndHitAi.index = 0;

    class ReboundAI extends BaseAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.status = 0;
            this.f = [];
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0) {
                this.status = 1;
                this.pro.rotation(Math.PI / 180 * 360 * Math.random());
            }
            var bm = this.pro.getGameMove();
            this.pro.move2D(this.pro.face2d);
            if (bm && bm.rotation != this.pro.face2d) {
                this.pro.rotation(2 * Math.PI - bm.rotation);
            }
            if (this.pro.acstr != GameAI.Run) {
                this.pro.play(GameAI.Run);
            }
            return false;
        }
    }

    class AOESkill extends BaseSkill {
        constructor(sys) {
            super(sys);
            this.sysBullet.bulletCd = 3000;
        }
        exeSkill(now, pro) {
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) > GameBG.ww * 6) {
                if (now >= this.cd) {
                    pro.sp3d.transform.localPositionY = 0;
                    pro.curLen = 0;
                    pro.moveLen = GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox);
                    pro.setSpeed(Math.ceil(pro.moveLen / GameBG.ww));
                    let a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                    pro.rotation(a);
                    this.cd = now + this.sysBullet.bulletCd;
                    return true;
                }
            }
            return false;
        }
        showEff(pro) {
            pro.curLen = pro.moveLen = 0;
            BoomEffect.getEffect(pro, this.sysBullet.boomEffect);
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) <= this.sysBullet.attackAngle) {
                pro.hurtValue = pro.sysEnemy.enemyAttack;
                Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
            }
        }
    }

    class JumpFollowAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.skillcd = 0;
            this.windCd = 0;
            this.callSkill = new CallSkill(this.skillISbs[0]);
            this.aoeSkill = new AOESkill(this.skillISbs[1]);
            this.cd = this.sysEnemy.enemySpeed;
            this.nextTime = Game.executor.getWorldNow() + this.cd;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            if (this.pro.isIce) {
                return;
            }
            this.setShader();
            this.now = Game.executor.getWorldNow();
            if (this.now >= this.nextTime) {
                this.onExe2(this.now);
                this.nextTime = this.now + this.cd;
            }
            if (this.pro.moveLen > 0) {
                if (this.pro.move2D(this.pro.face2d)) {
                    this.aoeSkill.showEff(this.pro);
                }
            }
            return false;
        }
        onExe2(now) {
            let isCall = this.callSkill.exeSkill(now, this.pro);
            if (!isCall) {
                let isWind = this.aoeSkill.exeSkill(now, this.pro);
                if (!isWind) {
                    this.normalAttack();
                }
            }
        }
        normalAttack() {
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.status = 1;
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.startAttack();
                this.status = 0;
                this.nextTime = this.now + this.shooting.shootCd;
            }
        }
        onJump() {
        }
    }

    class GameInfrared {
        constructor(pro_, nn_ = 1) {
            this.vv = new MaoLineData(0, 0, 0, 1);
            this.future = new GameHitBox(2, 2);
            this.redLines = [];
            this.nn = 1;
            this.show_ = false;
            this.nn = nn_;
            this.pro = pro_;
            for (let i = 0; i < this.nn; i++) {
                let redLine = new Laya.Image();
                redLine.skin = "bg/hongtiao.png";
                redLine.anchorX = 0.5;
                redLine.anchorY = 0.5;
                redLine.alpha = 0.8;
                this.redLines.push(redLine);
            }
        }
        get show() {
            return this.show_;
        }
        set show(b) {
            this.show_ = b;
            this.show_ = false;
            if (this.show_) {
                for (let i = 0; i < this.redLines.length; i++) {
                    var e = this.redLines[i];
                    Game.frontLayer.addChild(e);
                }
            }
            else {
                for (let i = 0; i < this.redLines.length; i++) {
                    var e = this.redLines[i];
                    e.removeSelf();
                }
            }
        }
        moveline(n, x0, y0, clearg) {
            var vv = this.vv;
            var hits = Game.map0.Aharr;
            var vx = GameBG.ww * 20 * Math.cos(n);
            var vz = GameBG.ww * 20 * Math.sin(n);
            this.future.setVV(x0, y0, vx, vz);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                vv.reset(x0, y0, x0 + vx, y0 + vz);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    var p = rs[0];
                    let l = rs[1];
                    vv.reset(vv.x0, vv.y0, p.x, p.y);
                    var l1 = new MaoLineData(vv.x0, vv.y0, p.x, p.y);
                    l = vv.rebound(l);
                    if (l) {
                        return [l1, l];
                    }
                    return [l1, null];
                }
            }
            return null;
        }
        drawMoveline() {
            if (!this.show_) {
                return;
            }
            var hero = this.pro;
            let larr = this.moveline(hero.face2d, hero.hbox.cx, hero.hbox.cy, true);
            for (let i = 0; i < this.nn; i++) {
                if (!larr)
                    break;
                let l0 = larr[0];
                let l1 = larr[1];
                var cp = l0.getCenter();
                var redLine = this.redLines[i];
                Game.frontLayer.addChild(redLine);
                redLine.x = cp.x;
                redLine.y = cp.y;
                redLine.height = l0.getlen();
                redLine.rotation = l0.atan2() / Math.PI * 180 + 270;
                if (l1) {
                    larr = this.moveline(l1.atan2(), l1.x0, l1.y0, false);
                }
            }
        }
    }

    class ArcherAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            if (!this.gi) {
                var i = this.normalSb.ejectionNum + 1;
                if (i < 1)
                    i = 1;
                this.gi = new GameInfrared(pro, i);
                this.gi.show = false;
            }
        }
        faceToHero() {
            return;
        }
        onExe() {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            this.checkHeroCollision();
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.rotation((Math.PI / 4) * Math.ceil(Math.random() * 8));
                this.nextTime = this.now + 1500;
                this.status = 1;
                this.pro.play(GameAI.Run);
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.nextTime = this.now + 1500;
                this.status = 2;
                this.pro.play(GameAI.Idle);
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.gi.show = true;
                this.gi.drawMoveline();
            }
            else if (this.status == 2 && this.now >= this.nextTime) {
                this.gi.show = false;
                this.nextTime = this.now + 500;
                this.status = 3;
            }
            else if (this.status == 3 && this.now >= this.nextTime) {
                this.startAttack();
                this.nextTime = this.now + 1000;
                this.status = 0;
            }
            if (this.status == 1) {
                this.pro.move2D(this.pro.face2d);
            }
            else if (this.status == 2) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.gi.show = true;
                this.gi.drawMoveline();
            }
        }
        hit(pro) {
            super.hit(pro);
            if (this.pro.gamedata.hp <= 0) {
                this.gi.show = false;
            }
        }
    }

    class FlyGameMove extends GameMove {
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            var hits = Game.map0.Flyharr;
            if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                if (vz != 0 && Game.map0.chechHitArrs(pro, vx, 0, hits)) {
                    vx = 0;
                }
                if (vx != 0 && Game.map0.chechHitArrs(pro, 0, vz, hits)) {
                    vz = 0;
                }
                if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                    return false;
                }
            }
            if (!this.Blocking(pro, vx, vz)) {
                return false;
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class FixedGameMove extends GameMove {
        move2d(n, pro, speed) {
            pro.setSpeed(0);
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class JumpMove extends GameMove {
        constructor() { super(); }
        move2d(n, monster, speed) {
            this.pro = monster;
            monster.curLen += speed;
            if (monster.curLen >= monster.moveLen) {
                monster.curLen = monster.moveLen;
                return true;
            }
            var nn = monster.curLen / monster.moveLen;
            var vx = speed * Math.cos(n);
            var vz = speed * Math.sin(n);
            var dy = Math.sin((Math.PI * nn)) * 2;
            monster.sp3d.transform.localPositionY = 0.1 + dy * 2;
            monster.setXY2D(monster.pos2.x + vx, monster.pos2.z + vz);
            if (monster.hbox.x == null || monster.hbox.y == null) {
                console.log("跳出问题了");
            }
            return false;
        }
    }

    class BackMove extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(1, 1);
            this.rotation = Math.PI * -1;
        }
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            this.rotation = n;
            var vx = Math.cos(n) * speed;
            var vz = Math.sin(n) * speed;
            var hits = Game.map0.Wharr;
            this.future.setXY(pro.hbox.x + vx, pro.hbox.y + vz);
            if (Game.map0.chechHit_arr(this.future, hits)) {
                this.future.setXY(pro.hbox.x + vx, pro.hbox.y);
                var ex = Game.map0.chechHit_arr(this.future, hits);
                this.future.setXY(pro.hbox.x, pro.hbox.y + vz);
                var ez = Game.map0.chechHit_arr(this.future, hits);
                if (ex != null) {
                    vx = vx * -1;
                }
                else if (ez != null) {
                    vz = vz * -1;
                }
                this.future.setXY(pro.hbox.x + vx, pro.hbox.y + vz);
                if (Game.map0.chechHit_arr(this.future, hits)) {
                    vx = vx * -1;
                    vz = vz * -1;
                }
                this.rotation = Math.atan2(vz, vx);
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class BasePlatform {
    }

    class TestPlatform extends BasePlatform {
        checkUpdate() {
        }
        login(callback) {
            callback && callback("shfdsaomghjgai123fdafda456");
        }
        getUserInfo(callback) {
            this.cb = callback;
            let uu = Laya.stage.getChildAt(0);
            uu.vvv.btn.on(Laya.Event.CLICK, this, this.clickFun, [uu.vvv.t1]);
        }
        clickFun(t) {
            LoginHttp.FRONT = "test" + t.text;
            Game.cookie.setCookie(CookieKey.USER_ID, { "userId": t.text });
            this.cb && this.cb();
        }
        onShare(callback) {
            callback && callback();
            Game.hero.reborn();
        }
    }

    class WXPlatform extends BasePlatform {
        constructor() {
            super();
            this.tag = 0;
        }
        checkUpdate() {
            Laya.Browser.window.wx.showShareMenu();
            var id = 'mss05Kw6QeiJbN73G30yFA';
            var url = 'https://mmocgame.qpic.cn/wechatgame/myCE4RvnnlWbLMDCe1kBOVfEy4RuicNqB65G9yDzdvib1zNFpniajf0xJxm4ewoRtAl/0';
            Laya.Browser.window.wx.onShareAppMessage(function () {
                return {
                    title: '魔界流浪的弓术大师',
                    imageUrlId: id,
                    imageUrl: url
                };
            });
            Laya.Browser.window.wx.setKeepScreenOn({
                keepScreenOn: true
            });
            if (Laya.Browser.window.wx.getUpdateManager) {
                console.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
                const updateManager = Laya.Browser.window.wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (result) {
                    if (result.hasUpdate) {
                        console.log("有新版本");
                        updateManager.onUpdateReady(function () {
                            console.log("新的版本已经下载好");
                            Laya.Browser.window.wx.showModal({
                                title: '更新提示',
                                content: '新版本已经下载，是否重启？',
                                success: function (result) {
                                    if (result.confirm) {
                                        updateManager.applyUpdate();
                                    }
                                }
                            });
                        });
                        updateManager.onUpdateFailed(function () {
                            console.log("新的版本下载失败");
                            Laya.Browser.window.wx.showModal({
                                title: '已经有新版本了',
                                content: '新版本已经上线啦，请您删除当前小游戏，重新搜索打开'
                            });
                        });
                    }
                    else {
                        console.log("没有新版本");
                    }
                });
            }
            else {
                console.log("有更新肯定要用户使用新版本，对不支持的低版本客户端提示");
                Laya.Browser.window.wx.showModal({
                    title: '温馨提示',
                    content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
                });
            }
            Laya.Browser.window.wx.onMemoryWarning((res) => {
                console.error("内存不足了", res);
                Laya.stage.event(GameEvent.MEMORY_WARNING);
            });
        }
        login(callback) {
            Laya.Browser.window.wx.login({
                success: (res) => {
                    if (res.code) {
                        callback && callback(res.code);
                    }
                }
            });
        }
        getUserInfo(callback) {
            if (this.userBtn) {
                return;
            }
            this.userBtn = Laya.Browser.window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    width: Laya.Browser.window.wx.getSystemInfoSync().windowWidth,
                    height: Laya.Browser.window.wx.getSystemInfoSync().windowHeight
                }
            });
            this.userBtn.onTap((resButton) => {
                if (resButton.errMsg == "getUserInfo:ok") {
                    Game.userHeadUrl = resButton.userInfo.avatarUrl;
                    Game.userName = resButton.userInfo.nickName;
                    this.filterEmoji();
                    this.userBtn.destroy();
                    callback && callback();
                }
                else {
                    console.log("授权失败");
                }
            });
        }
        wxAuthSetting() {
            console.log("wx.getSetting");
            Laya.Browser.window.wx.getSetting({
                success: (res) => {
                    console.log(res.authSetting);
                    var authSetting = res.authSetting;
                    if (authSetting["scope.userInfo"]) {
                        console.log("已经授权");
                    }
                    else {
                        console.log("未授权");
                    }
                }
            });
        }
        filterEmoji() {
            var strArr = Game.userName.split(""), result = "", totalLen = 0;
            for (var idx = 0; idx < strArr.length; idx++) {
                if (totalLen >= 16)
                    break;
                var val = strArr[idx];
                if (/[a-zA-Z]/.test(val)) {
                    totalLen = 1 + (+totalLen);
                    result += val;
                }
                else if (/[\u4e00-\u9fa5]/.test(val)) {
                    totalLen = 2 + (+totalLen);
                    result += val;
                }
                else if (/[\ud800-\udfff]/.test(val)) {
                    if (/[\ud800-\udfff]/.test(strArr[idx + 1])) {
                        idx++;
                    }
                    result += "?";
                }
            }
            Game.userName = result;
            console.log("过滤之后", Game.userName);
        }
        onShare(callback) {
            Laya.Browser.window.wx.shareAppMessage({
                title: "来吧，pk一下吧！",
                imageUrl: "https://img.kuwan511.com/arrowLegend/share.jpg",
                destWidth: 500,
                destHeight: 400
            });
            Laya.Browser.window.wx.onShow(res => {
                console.log("onShow", this.tag);
                if (this.tag == 1000) {
                    Game.hero.reborn();
                    Laya.Browser.window.wx.offShow();
                    Laya.Browser.window.wx.offHide();
                    this.tag = -1;
                }
            });
            Laya.Browser.window.wx.onHide(res => {
                this.tag = 1000;
                console.log("onHide");
            });
        }
    }

    class PlayerBuff {
        constructor() {
            this.skillCD = 0;
            this.chixuCD = 0;
            this.hurtValue = 0;
            this.nextTime = 0;
            this.startTime = 0;
            this.curTimes = 0;
        }
        exe(now) {
        }
    }

    class FireBuff extends PlayerBuff {
        constructor(id) {
            super();
            this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        }
        exe(now) {
            if (this.buff.times > 0 && this.curTimes > this.buff.times) {
                console.log("移除火焰buff");
                Game.buffM.removeBuff(this);
                return;
            }
            if (now > this.nextTime) {
                this.curTimes++;
                this.nextTime = this.startTime + this.buff.buffCD * this.curTimes;
                this.bullet.hurtValue = Math.floor(this.hurtValue * this.buff.damagePercent / 100);
                if (this.skill.skilltarget == 2) {
                    this.to.hit(this.bullet, true);
                }
            }
        }
    }

    class IceBuff extends PlayerBuff {
        constructor(id) {
            super();
            this.isExe = false;
            this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        }
        exe(now) {
            let nt = now - this.startTime;
            nt = nt / this.buff.buffCD;
            if (nt >= 1) {
                console.log("移除冰冻buff");
                Game.buffM.removeBuff(this);
                return;
            }
            let nt2 = now - this.startTime;
            nt2 = nt2 / this.buff.buffDot;
            if (nt2 >= 1) {
                this.to.offCie();
            }
            this.onCie();
        }
        onCie() {
            if (this.isExe) {
                return;
            }
            this.isExe = true;
            this.to.onCie();
            if (this.buff.damagePercent > 0) {
                if (this.skill.skilltarget == 2) {
                    this.bullet.hurtValue = Math.floor(this.hurtValue * this.buff.damagePercent / 100);
                    this.to.hit(this.bullet, true);
                }
            }
        }
    }

    class WudiBuff extends PlayerBuff {
        constructor(id) {
            super();
            this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        }
        exe(now) {
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
            if (now > this.skillCD) {
                this.skillCD = now + this.buff.buffCD;
                this.chixuCD = now + this.buff.buffDot;
                Game.hero.setWudi(true);
            }
            else if (now > this.chixuCD) {
                Game.hero.setWudi(false);
            }
        }
    }

    class ShitouAI extends FlowerAI {
        constructor(pro) {
            super(pro);
        }
        onExe() {
            this.checkHeroCollision();
            if (this.status == 0 && this.now >= this.nextTime) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.startAttack();
                this.nextTime = this.now + this.shooting.shootCd;
                if (Math.random() > 0.7) {
                    this.status = 1;
                }
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.nextTime = this.now + 1000;
                this.status = 2;
                this.pro.rotation(Math.floor(Math.random() * 8) * (Math.PI / 4));
            }
            else if (this.status == 2 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + 500;
                this.status = 0;
            }
            if (this.status == 2) {
                this.pro.move2D(this.pro.face2d);
                this.pro.play(GameAI.Run);
            }
        }
    }

    class FlyGameMove2 extends GameMove {
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            var hits = Game.map0.Flyharr;
            if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                if (vz != 0 && Game.map0.chechHitArrs(pro, vx, 0, hits)) {
                    vx = 0;
                }
                if (vx != 0 && Game.map0.chechHitArrs(pro, 0, vz, hits)) {
                    vz = 0;
                }
                if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                    return false;
                }
            }
            if (!this.Blocking(pro, vx, vz)) {
                return false;
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class BaseCookie {
    }

    class TestCookie extends BaseCookie {
        constructor() {
            super();
        }
        setCookie(code, data) {
            Laya.LocalStorage.setJSON(code, data);
        }
        getCookie(code, callback) {
            let data = Laya.LocalStorage.getJSON(code);
            callback && callback(data);
        }
        removeCookie(code) {
            Laya.LocalStorage.removeItem(code);
        }
        clearAll() {
            Laya.LocalStorage.clear();
        }
    }

    class WXCookie extends BaseCookie {
        constructor() {
            super();
            this.wx = Laya.Browser.window.wx;
        }
        setCookie(code, data1) {
            this.wx.setStorage({
                key: code,
                data: data1,
                success(res) {
                }
            });
        }
        getCookie(code, callback) {
            this.wx.getStorage({
                key: code,
                success(res) {
                    callback && callback(res.data);
                },
                fail(res) {
                    callback && callback(null);
                },
                complete(res) {
                }
            });
        }
        removeCookie(code) {
            this.wx.removeStorage({
                key: code,
                success(res) {
                }
            });
        }
        clearAll() {
            this.wx.clearStorage();
        }
    }

    class MyEffect {
        constructor() {
        }
        static initBtnEffect() {
            Laya.stage.on(Laya.Event.CLICK, null, MyEffect.clickFun);
        }
        static clickFun(e) {
            if (e.target instanceof Laya.Button) {
                if (e.target.anchorX == 0.5 && e.target.anchorY == 0.5) {
                    MyEffect.clickEffect(e.target);
                }
            }
        }
        static clickEffect(sp) {
            let t = new Laya.Tween();
            let s = ((sp.scaleX > 0) ? 1 : -1);
            t.from(sp, { scaleX: 0.9 * s, scaleY: 0.9 }, 80);
        }
    }

    class Main {
        constructor() {
            this.isSuccess = false;
            this.isInit = false;
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.stat)
                Laya.Stat.show();
            if (Laya.Browser.window.wx) {
                Laya.URL.basePath = "https://img.kuwan511.com/arrowLegend/" + Game.resVer + "/";
                Laya.MiniAdpter.nativefiles = ["loading/jiazai.jpg", "loading/btn_kaishi.png", "loading/loadingClip.png", "allJson.json"];
                Laya.Browser.window.wx.getSystemInfo({
                    success(res) {
                        let model = res.model;
                        if (model.search('iPhone X') != -1) {
                            App.top = 90;
                        }
                        GameBG.height = GameBG.width / res.windowWidth * res.windowHeight;
                    }
                });
            }
            if (Laya.Browser.onMiniGame == false) {
                Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
                Laya.stage.alignH = "center";
            }
            this._initView = new ui.test.initViewUI();
            Laya.stage.addChild(this._initView);
            this._initView.initTxt.text = "0%";
            Laya.loader.load(["h5/config.json", "loading/loadingClip.png", "loading/jiazai.jpg", "loading/btn_kaishi.png",], new Laya.Handler(this, this.onInitCom), new Laya.Handler(this, this.onInitProgress));
            App.init();
            MyEffect.initBtnEffect();
            Session.init();
        }
        onInitProgress(value) {
            value = value * 100;
            this._initView.initTxt.text = "" + value.toFixed(0) + "%";
        }
        onInitCom() {
            this.regClass();
            let config = Laya.loader.getRes("h5/config.json");
            console.log("config---", config);
            App.platformId = config.platformId;
            App.serverIP = config.platforms[App.platformId];
            if (!this.homePage) {
                this.homePage = new ui.game.homePageUI();
            }
            Laya.stage.addChild(this.homePage);
            let bc;
            if (App.platformId != PlatformID.WX) {
                bc = new TestCookie();
            }
            else if (App.platformId == PlatformID.WX) {
                bc = new WXCookie();
            }
            Game.cookie = bc;
            Game.cookie.getCookie(CookieKey.USER_ID, (res) => {
                if (res == null) ;
                else {
                    App.soundManager.setMusicVolume(res.state);
                    this.homePage.vvv.t1.text = res.userId;
                }
            });
            App.soundManager.pre = "h5/sounds/";
            Laya.stage.addChild(App.layerManager);
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res == null) {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    App.soundManager.setMusicVolume(1);
                }
                else {
                    App.soundManager.setMusicVolume(res.state);
                }
            });
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res == null) {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    App.soundManager.setSoundVolume(1);
                }
                else {
                    App.soundManager.setSoundVolume(res.state);
                }
            });
            Game.playBgMusic();
            this.authSetting();
        }
        authSetting() {
            this._initView && this._initView.removeSelf();
            let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
            if (!this.curBP) {
                this.curBP = new BP();
            }
            this.homePage.vvv.visible = (App.platformId == PlatformID.TEST || App.platformId == PlatformID.H5);
            this.curBP.getUserInfo(this.getUserInfoSuccess.bind(this));
        }
        getUserInfoSuccess() {
            if (this.isSuccess) {
                return;
            }
            this.isSuccess = true;
            console.log("授权成功，开始加载");
            this.homePage && this.homePage.removeSelf();
            this.loading = new ui.test.LoadingUI();
            this.loading.mouseEnabled = true;
            Laya.stage.addChild(this.loading);
            this.loading.txt.text = "0%";
            Laya.loader.load([
                { url: "res/atlas/main.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/guide.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/zhaohuan.atlas", type: Laya.Loader.ATLAS },
                { url: "h5/tables.zip", type: Laya.Loader.BUFFER }
            ], new Laya.Handler(this, this.onHandler), new Laya.Handler(this, this.onProgress));
        }
        onHandler() {
            console.log("加载完成");
            this.curBP.checkUpdate();
            new LoginHttp(new Laya.Handler(this, this.onSuccess)).checkLogin();
        }
        onSuccess(data) {
            console.log("登录成功");
            ReceiverHttp.create(new Laya.Handler(this, this.onReceive)).send();
        }
        onReceive(data) {
            if (this.isInit) {
                return;
            }
            console.log("获取玩家数据成功");
            this.isInit = true;
            new GameMain();
            this.loading.removeSelf();
        }
        onProgress(value) {
            value = value * 100;
            this.loading.txt.text = "" + value.toFixed(0) + "%";
        }
        regClass() {
            var REG = Laya.ClassUtils.regClass;
            REG("HIT_" + HitType.hit1, GameScaleAnimator1);
            REG("HIT_" + HitType.hit2, GameScaleAnimator2);
            REG("HIT_" + HitType.hit3, GameScaleAnimator4);
            REG("HIT_" + HitType.hit4, GameScaleAnimator3);
            REG("NPC1001", NPC_1001);
            REG("NPC1002", NPC_1002);
            REG("NPC1003", NPC_1003);
            REG(AttackType.TAG + AIType.NOTHAS, BaseAI);
            REG(AttackType.TAG + AIType.FLYHIT, FlyAndHitAi);
            REG(AttackType.TAG + AIType.BULLET, FlowerAI);
            REG(AttackType.TAG + AIType.STONE, StoneAI);
            REG(AttackType.TAG + AIType.SHITOUREN, ShitouAI);
            REG(AttackType.TAG + AIType.TREE, TreeAI);
            REG(AttackType.TAG + AIType.RANDOM_MOVE, RandMoveAI);
            REG(AttackType.TAG + AIType.MOVEHIT, MoveAndHitAi);
            REG(AttackType.TAG + AIType.REBOUND, ReboundAI);
            REG(AttackType.TAG + AIType.JUMP_FOLLOW, JumpFollowAI);
            REG(AttackType.TAG + AIType.RED_LINE, ArcherAI);
            REG(MoveType.TAG + MoveType.FLY, FlyGameMove);
            REG(MoveType.TAG + MoveType.MOVE, PlaneGameMove);
            REG(MoveType.TAG + MoveType.FIXED, FixedGameMove);
            REG(MoveType.TAG + MoveType.JUMP, JumpMove);
            REG(MoveType.TAG + MoveType.BACK, BackMove);
            REG(MoveType.TAG + MoveType.BOOM, FlyGameMove2);
            REG("p" + PlatformID.TEST, TestPlatform);
            REG("p" + PlatformID.H5, TestPlatform);
            REG("p" + PlatformID.WX, WXPlatform);
            REG("BUFF" + BuffID.WUDI_5009, WudiBuff);
            REG("BUFF" + BuffID.FIRE_2001, FireBuff);
            REG("BUFF" + BuffID.FIRE_5001, FireBuff);
            REG("BUFF" + BuffID.DU_2002, FireBuff);
            REG("BUFF" + BuffID.DU_5002, FireBuff);
            REG("BUFF" + BuffID.ICE_2003, IceBuff);
            REG("BUFF" + BuffID.ICE_5003, IceBuff);
        }
    }
    new Main();

}());
