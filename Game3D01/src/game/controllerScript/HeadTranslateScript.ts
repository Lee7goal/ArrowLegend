export default class HeadTranslateScript extends Laya.Script3D {
    
    private flag:boolean = false;
    private box:Laya.MeshSprite3D;
    constructor() {
		super();
	}
    
    
	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	public onAwake():void {
		//得到3D对象
        this.box = this.owner as Laya.MeshSprite3D;
        this.flag = true;
	}
	
	public onStart():void {
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	public onUpdate():void {
        if(this.flag)
        {
            this.box.transform.translate(new Laya.Vector3(0,-0.02,0),false)
        }
        else{
            this.box.transform.translate(new Laya.Vector3(0,0.02,0),false)
        }
        if(this.box.transform.localPositionX >= -1)
        {
            this.flag = true;
        }
        else if(this.box.transform.localPositionX <= -1.5)
        {
            this.flag = false;
        }
        console.log(this.box.transform.localPositionX);
        
	}
	
	public onDisable() {
	}
}