export default class GridType {
    /**是否是河水 */
    public static isRiver(type:Number):boolean
    {
        return type >= 20 && type <= 43;
    }
    /**是否是陷进 */
    public static isThorn(type:Number):boolean
    {
        return type == 50;
    }

    public static isWall(type:Number):boolean
    {
        return type>=60 && type<70 || type == 1;
    }
}