export default class GameCameraNum{
    a:number;
    n:number;
    abs:number;

    a0:number;
    n0:number;
    tan0:number;
    cos0:number;

    y:number;
    z:number;

    boxscale0:Laya.Vector3;
    boxscale:Laya.Vector3;

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