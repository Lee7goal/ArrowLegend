export default class GridType {
    /**是否是水点 */
    public static isRiverPoint(type:Number):boolean
    {
        return type >= 100 && type < 200;
    }

     /**是否是九宫格水 */
     public static isRiverScale9Grid(type:Number):boolean
     {
         return type > 200 && type < 300;
     }

      /**是否是九宫格水 */
      public static isRiverScale9Grid2(type:Number):boolean
      {
          return type > 900 && type < 1000;
      }

     /**是否是横水 */
     public static isRiverRow(type:Number):boolean
     {
         return type > 400 && type < 500;
     }

     /**是否是纵水 */
     public static isRiverCol(type:Number):boolean
     {
         return type > 300 && type < 400;
     }

    /**是否是陷进 */
    public static isThorn(type:Number):boolean
    {
        return type >= 500 && type<600;
    }

    public static isFlower(type:Number):boolean
    {
        return type >= 801 && type<=804;
    }

    public static isWall(type:Number):boolean
    {
        return type>=600 && type<700;
    }
    /**是否是栅栏 */
    public static isFence(type:Number):boolean
    {
        return type>=700 && type<800;
    }

    public static isRiverCube(type:Number):boolean
    {
        return type==900;
    }

    public static isMonster(type:Number):boolean
    {
        return type > 10000;
    }

}