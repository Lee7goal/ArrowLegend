export default class GridType {
    /**是否是河水 */
    public static isRiverPoint(type:Number):boolean
    {
        return type >= 100 && type < 200;
    }

     /**是否是河水 */
     public static isRiver(type:Number):boolean
     {
         return type >= 200 && type < 500;
     }

    /**是否是陷进 */
    public static isThorn(type:Number):boolean
    {
        return type >= 500 && type<600;
    }

    public static isWall(type:Number):boolean
    {
        return type>=600 && type<700 || type == 1;
    }

}