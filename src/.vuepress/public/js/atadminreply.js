import cfg from '../../lib/config/config.js'


//插件作者：煌（2608259582） 于2022/02/04编写，请勿私自转载，首发摆烂群（891838593）.


export class atmaster extends plugin {
	constructor() {
		super({
			name: '艾特主人回复',
			dsc: '艾特主人回复',
			event: 'message',
			priority: 0,
			rule: [
				{
					reg: '',
					fnc: 'atmaster'
				}
			]
		})
	}

	async atmaster(e) {
		// let url = 'http://api.caonm.net/api/dm/index.php'//现用api.
		let url = 'https://www.dmoe.cc/random.php'//备用api1.
		//let url = 'https://api.yimian.xyz/img?type=moe'//备用api2.
		//let url = 'https://api.vvhan.com/api/acgimg'//备用api3.
		//let url = 'http://api.caonm.net/api/kun/k.php'//小黑子api.
		let master = cfg.masterQQ
		let atQQ = e.at
		if (master.indexOf(atQQ) > -1) {
			/* 主人判断 */
			if (e.isMaster) {
				/* 回复消息. */
				e.reply([
					"主人，你一定是想看看图片.\n改善下心情的对吧.",
				], true)
				//setTimeout(async() => {//延时发送
				e.reply([
					segment.image(url) //图片.
				], true); //图片.])
				//}, 3000)//单位毫秒
				return true;
			}
			/* 回复消息. */
			e.reply([
				segment.at(e.user_id), "\n",
				"小黑子，艾特主人干嘛！！！",
			], true);
			//setTimeout(async() => {//延时发送
			e.reply([
				//segment.at(e.user_id), "\n",
				"滚去看图片！！！",
				segment.image(url) //图片.
			], true); //图片.])
			//}, 3000)//单位毫秒
		}
		return false;
	}
}
