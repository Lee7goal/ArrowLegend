export default class LogType{
    public static HEART:number = 100;
    public static LOGIN_TIME:number = 0;
    public static ERROR_ITEM_NULL:number = 1;
    public static LOGIN_INFO:number = 2;
    /**
     * 登陆http的状态 正常是200
     */
    public static LOGIN_STATUS:number = 3;

    public static WX_HIDE:number = 4;
    public static WX_SHOW:number = 5;
    public static LOAD_ERROR:number = 6;

    public static HANGUP_START:number = 7;
    public static HANGUP_OVER:number = 8;

    /**
     * 记录玩家数据
     */
    public static PLAYER_DATA:number = 9;

    /**
     * 新玩家
     */
    public static NEW_PLAYER:number = 10;

    

    public static CODE_ERROR:number = 11;


    public static LOAD_CONFIG:number = 13;
    public static LOAD_VERSION:number = 14;
    public static LOAD_fileconfig:number = 15;
    public static LOAD_CONFIGZIP:number = 16;
    public static LOAD_CONFIG_ERR:number = 17;

    /**
     * 广告加载失败
     */
    public static AD_FAIL:number = 18;

    /**
     * 广告显示成功
     */
    public static AD_SUC:number = 19;

    /**
     * 广告播放完毕
     */
    public static AD_SUC_OVER:number = 20;

    /**
     * 失败2
     */
    public static AD_FAIL_2:number = 21;

    public static OPEN_TASK:number = 22;

    public static OPEN_TIANFU:number = 23;

    public static CLOSE_ZHUAN_PAN:number = 24;
    
    public static OPEN_ZHUAN:number = 25;

    public static AD_ZHUAN:number = 26;

    /**
     * 玩家一进入游戏 点击屏幕开始
     */
    public static NEWER_FIRST_CLICK:number = 1000;

    /**
     * 打开角色面板
     */
    public static NEWER_OPEN_ROLE:number = 1001;
    /**
     * 指导装备装备
     */
    public static NEWER_EQUIP:number = 1002;
    /**
     * 你变的越来越强大
     */
    public static NEWER_YUELAIYUEQIANGDA:number = 1005;

    /**
     * 半血
     */
    public static NEWER_HALF:number = 1006;

    /**
     * 醒来
     */
    public static NEWER_XINGLAI:number = 1007;

    /**
     * 点城市
     */
    public static NEWER_CLICK_CITY:number = 1008;

    /**
     * 点关
     */
    public static NEWER_CLICK_STAGE:number = 1009;
}