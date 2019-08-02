import GamePro from "../GamePro";


export abstract class GameAI {
    static NormalAttack: string = "Attack";
    // static JumpAttack:string = "JumpAttack";
    // static ArrowAttack:string = "Attack";
    // static SpinAttack:string = "SpinAttack";
    static Idle: string = "Idle";
    static Die: string = "Die";
    static Run: string = "Run";
    static TakeDamage: string = "TakeDamage";

    static SkillStart: string = "SkillStart";
    static SkillLoop: string = "SkillLoop";
    static SkillEnd: string = "SkillEnd";

    abstract exeAI(pro: GamePro): boolean;
    abstract starAi();
    abstract stopAi();
    /**遭到攻击 */
    abstract hit(pro: GamePro);
    die():void{};

    
    protected run_: boolean = false;
}