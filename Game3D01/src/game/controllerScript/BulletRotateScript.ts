export default class BulletRotateScript extends Laya.Script3D {
    private qiu:Laya.MeshSprite3D;
    private ball:Laya.MeshSprite3D;
    private trail:Laya.MeshSprite3D;
    constructor() {
		super();
	}
	
	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	public onAwake():void {
        //得到3D对象
        let box = this.owner as Laya.MeshSprite3D;
        this.qiu = box.getChildAt(0) as Laya.MeshSprite3D;
        this.qiu.transform.localRotationEulerX=45;
        this.ball = this.qiu.getChildAt(0) as Laya.MeshSprite3D;
        // this.trail = box.getChildAt(1) as Laya.MeshSprite3D;
        // this.trail.transform.localScaleZ = 0.5;
	}
	
	public onStart():void {
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	public onUpdate():void {
        this.ball.transform.localRotationEulerY += 5;
        // this.box.transform.localRotationEulerY++;
        // if(this.trail.transform.localScaleZ < 2)
        // {
        //     this.trail.transform.localScaleZ += 0.008;
        // }
	}
	
	public onDisable() {
	}
}