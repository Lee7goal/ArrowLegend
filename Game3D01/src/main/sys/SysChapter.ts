import App from "../../core/App";
import SysMap from "./SysMap";

export default class SysChapter{
    static NAME:string = 'sys_stagemap.txt';
    constructor() {}
    public id:number = 0;
    public stageName:string = '';
    public stageImage:string = '';
    public beforeId:number = 0;
    public npcDamagescale:number = 0;
    public npcHealthscale:number = 0;
    public description:number = 0;
    public blueDiamond:string = '';
    public redDiamond:string = '';


    static dropIndex:number;
    static blueNum:number;
    static redNum:number;
    public static randomDiamond(chapterId:number):void
    {
        let totolNum:number = SysMap.getTotal(chapterId);
        SysChapter.dropIndex = Math.ceil(totolNum * Math.random());
        console.log("钻石掉落的关卡数",SysChapter.dropIndex);

        let sys:SysChapter = App.tableManager.getDataByNameAndId(SysChapter.NAME,chapterId);

        let blueArr:string[] = sys.blueDiamond.split(',');
        let blueRate:number = Number(blueArr[0]);
        
        let blueNum:number = Number(blueArr[1]);

        let redArr:string[] = sys.redDiamond.split(',');
        let redRate:number = Number(redArr[0]);
        
        let redNum:number = Number(redArr[1]);

        let nullRate:number = 1000 - blueRate - redRate;
        blueRate = blueRate / 1000 * 360;
        redRate = redRate / 1000 * 360;
        nullRate = nullRate / 1000 * 360;

        let rand:number = Math.random();
        rand = rand * 360;
        SysChapter.blueNum  = SysChapter.redNum = 0;
        if(rand <= blueRate && blueRate >=0)
        {
            SysChapter.blueNum = blueNum;
            console.log("掉落蓝钻",SysChapter.blueNum);
        }
        else if(rand > blueRate && rand <= blueRate + redRate)
        {
            SysChapter.redNum = redNum;
            console.log("掉落红钻",SysChapter.redNum);
        }
    }

    public static reandomHeart():number
    {
        let chapterId:number = 1;
        return chapterId;
    }
}