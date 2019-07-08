export default class HeadTranslateScript extends Laya.Script3D {
    
    private flag:boolean = true;
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
        this.box.transform.localPositionY = 3;
        
	}
	
	public onStart():void {
	}
	
	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	public onUpdate():void {
        if(this.flag)
        {
            this.box.transform.localPositionY += 0.05;
        }
        else{
            this.box.transform.localPositionY -= 0.05;
        }
        if(this.box.transform.localPositionY >= 5)
        {
            this.flag = false;
        }
        else if(this.box.transform.localPositionY <= 3)
        {
            this.flag = true;
        }
        console.log(this.box.transform.localPositionY);
	}
	
	public onDisable() {
	}
}