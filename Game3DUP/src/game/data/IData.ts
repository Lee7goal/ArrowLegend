export default interface IData{
    /**
     * 从服务器请求到数据 并且设置
     * @param data 
     */
    setData(data:any):void;
    /**
     * 存储数据
     * @param data 
     */
    saveData(data:any):void;
    /**
     * 第一次运行初始化数据
     * @param data 
     */
    initData(data:any):void;
}