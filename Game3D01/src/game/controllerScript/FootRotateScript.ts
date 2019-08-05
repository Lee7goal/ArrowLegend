import Game from "../Game";

export default class FootRotateScript extends Laya.Script3D {

	private box: Laya.MeshSprite3D;
	constructor() {
		super();
	}

	/**
	 * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
	 */
	public onAwake(): void {
		//得到3D对象
		this.box = this.owner as Laya.MeshSprite3D;
	}

	public onStart(): void {
	}

	/**
	 * 覆写组件更新方法（相当于帧循环）
	 */
	public onUpdate(): void {
		if (!Game.executor.isRun)  {
			return;
		}
		this.box.transform.localRotationEulerY += 2;
	}

	public onDisable() {
	}
}