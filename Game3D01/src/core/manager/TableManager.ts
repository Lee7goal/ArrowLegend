export default class TableManager {
	private map: any = {};
	private mapList: any = {};
	public constructor() {
	}

	public register(fileName: string, cla: any): void {
		this.map[fileName] = cla;
	}

	public getOneByName(fileName: string) {
		return this.map[fileName];
	}

	public getTable(tabelId: string): any {
		return this.mapList[tabelId];
	}

	public getDataByNameAndId(tabelId: string, id: number): any {
		var arr: any[] = this.getTable(tabelId);
		var len: number = arr.length;
		for (var i = 0; i < len; i++) {
			if (arr[i].id == id) {
				return arr[i];
			}
		}
	}

	public onParse(arr: any[]) {
		for (var i = 0; i < arr.length; i += 2) {
			var keyname = arr[i];
			var Cla = this.getOneByName(keyname);
			console.log(keyname);
			if (Cla == null) {
				console.error("没有注册表-------" + keyname);
				continue;
			}
			var contente: string = arr[i + 1];
			var resultArr: any[] = [];
			var strary: any[] = contente.split("\n");
			var tmp: String = strary[strary.length - 1];
			if (tmp === "") {
				strary.pop();
			}
			var head: String = String(strary[0]).replace("\r", "");
			var headary: any[] = head.split("\t");
			var contentary: any[] = strary.slice(1);
			var dataList: any[] = [];
			for (var k = 0; k < contentary.length; k++)  {
				var propstr: string = String(contentary[k]).replace("\r", "");
				var propary: any[] = propstr.split("\t");
				// console.log(propstr);
				var clazz = new Cla();
				for (var j = 0, len2 = propary.length; j < len2; j++) {
					var now: Object = clazz[headary[j]];
					var value: String = propary[j];
					if (typeof now === 'number') {
						//在as里 直接给int赋值 他会转成int 但是在js里 虽然类型声明的是int型 但赋值string的话 还是string
						now = parseInt(value + "");
						if( (now + "") != value ){
							now = parseFloat( value + "" );
						}
					} else {
						now = value;
					}
					clazz[headary[j]] = now;
				}
				dataList.push(clazz);
			}
			this.mapList[keyname] = dataList;

		}
	}
}