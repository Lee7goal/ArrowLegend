export default class Equip{
    constructor(){
        
    }

    public hp:number = 0;
    public atk:number = 0;
    public def:number = 0;
    public crit:number = 0;
    public moveSpeed:number = 0;
    public atkSpeed:number = 0;
    /**
     * 暴击效果
     */
    public critEffect:number = 0;
    /**
     * 闪避
     */
    public dodge:number = 0;

    public copy():Equip{
        let e = new Equip();
        e.hp = this.hp;
        e.atk = this.atk;
        e.def = this.def;
        e.crit = this.crit;
        e.moveSpeed = this.moveSpeed;
        e.atkSpeed = this.atkSpeed;
        e.critEffect = this.critEffect;
        e.dodge = this.dodge;
        return e;
    }

    public reset0():void{
        this.hp = 0;
        this.atk = 0;
        this.def = 0;
        this.crit = 0;
        this.moveSpeed = 0;
        this.atkSpeed = 0;
        this.critEffect = 0;
    }

    public addPercent( e:Equip ):void{
        this.hp = this.v1( this.hp , e.hp );
        this.atk = this.v1( this.atk , e.atk );
        this.def = this.v1( this.def, e.def );
        this.crit = this.v1( this.crit , e.crit );
        this.moveSpeed = this.v1( this.moveSpeed , e.moveSpeed );
        this.atkSpeed = this.v1( this.atkSpeed , e.atkSpeed );
        this.critEffect = this.v1( this.critEffect , e.critEffect );
        this.dodge = this.v1( this.dodge , e.dodge );
    }

    private v1( v:number , per:number ):number{
        return v * (1 + per);
    }
}