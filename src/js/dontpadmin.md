# 不要艾戳主人辣

### 源代码

```js
import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import cfg from '../../lib/config/config.js'

export class chuo extends plugin {
    constructor() {
        super({
            name: '戳一戳',
            dsc: '戳一戳',
            event: 'notice.group.poke',
            priority: -500,
            rule: [
                {
                    fnc: 'chuochuo'
                }
            ]
        }
        )
    }


    async chuochuo(e) {
        if (cfg.masterQQ.includes(e.target_id)) {
            logger.info('[戳主人生效]')
            if (cfg.masterQQ.includes(e.operator_id) || e.self_id == e.operator_id) {
                return;
            }
            e.reply([
                segment.record('https://multimedia.nt.qq.com.cn/download?appid=1403&fileid=CgoxNjc3OTc5NjE2EhRfIsaWzwAfTqgQ_KLejwCo0lok5hjoMSD7CijCmKiPiK6HA1CA9SQ&rkey=CAMSePJhF3msER8nlbeSGHIFFWioPR4Zh8t3jPKgJjGmAp3XWVuytks5usOcKVac5FTLOjS5A8J0h7t2I0XXQUey1LP7UPwhUByYHEjPAZVxr2AQOsqFja5DmxTQnkqRQGdB3FlK_tStnEK4GTVIb5Oos6T-NuKdohbPHw')
            ], true, { recallMsg: 60 })
            await common.sleep(1000);
            e.group.pokeMember(e.operator_id);
            return true
        }
    }
}
```