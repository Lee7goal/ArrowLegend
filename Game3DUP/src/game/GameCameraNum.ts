/**正交摄像机 数据计算类 H&K */
export default class GameCameraNum{
    /**Laya 摄像机X轴 旋转角度 */
    a:number;
    /**Laya 摄像机X轴 旋转弧度 */
    n:number;
    /**角度绝对值 */
    abs:number;
    /**角度 余角 */    
    a0:number;
    /**角度 余角 弧度*/
    n0:number;
    /** 余角的正切 用于计算 保持摄像机在视窗的中心点 */
    tan0:number;
    /** 余角的余弦 用于计算 正交摄像机在角度方向上的变形系数 制造虚假的2D与3D重合画面 */
    cos0:number;
    /**摄像机的Y轴 坐标 */
    y:number;
    /**摄像机的Z轴 坐标 */
    z:number;
    /**立方体的缩放 系数 */
    boxscale:Laya.Vector3;

    boxscale0:Laya.Vector3;
    /** 正交摄像机 数据计算类 a:x轴旋转角度 y:摄像机高度 */
    constructor(a:number,y:number){
        
        this.a = a;
        this.n = a*Math.PI/180;
        this.abs = Math.abs(a);

        this.a0 = 90 - this.abs;
        this.n0 = this.a0*Math.PI/180;
        this.tan0 = Math.tan(this.n0);
        this.cos0 = Math.cos(this.n0);

        this.y = y;
        this.z = y*this.tan0;

        this.boxscale = new Laya.Vector3(1,1,1/this.cos0);
        this.boxscale0 = new Laya.Vector3(1,1,(0.5)/this.cos0);

    }
}