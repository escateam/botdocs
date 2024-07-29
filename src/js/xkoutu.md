# X抠图

### 源代码

```js
import fetch from 'node-fetch';

export class SkytntPlugin extends plugin {
  constructor () {
    super({
      name: 'anime-remove-background',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: "^#(抠图|去背景)$",
          fnc: 'handleMessage'
        }
      ]
    });

    this.apiBaseUrl = 'https://skytnt-anime-remove-background.hf.space/call/rmbg_fn';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  async handleMessage (e) {
    let imgURL = [];

    if (e.source) {
      const history = e.isGroup
        ? await e.group.getChatHistory(e.source.seq, 1)
        : await e.friend.getChatHistory(e.source.time, 1);

      const source = history.pop();
      imgURL = source.message.filter(i => i.type === "image").map(i => i.url);
    } else {
      imgURL = e.img;
    }

    if (imgURL.length === 0) {
      logger.mark(`[${logger.green(`${this.e.user_id}`)}] > [${logger.red('没有图片')}]`);
      e.reply('请发图文消息或引用图片消息',true);
      return;
    }

    if (imgURL.length > 1) {
      e.reply('只能一张图片哦', true);
      return;
    }

    e.reply('少女祈祷中...', true);

    try {
      const eventId = await this.getEventId(imgURL[0]);
      const result = await this.getResult(eventId);
      const cleanedResult = result.replace(/\/c/g, '');

      const imgs = cleanedResult.split(',').map(url => segment.image(url.trim()));
      e.reply(imgs, true);
    } catch (error) {
      this.handleError('处理图片时发生错误', error, e);
    }
  }

  async getEventId(imageUrl) {
    try {
      const response = await fetch(`${this.apiBaseUrl}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          data: [{ path: imageUrl }]
        })
      });

      const json = await response.json();
      console.log('API Response:', json);

      if (!json.event_id) {
        throw new Error('Invalid response structure');
      }

      return json.event_id;
    } catch (error) {
      console.error('Error fetching EVENT_ID:', error);
      throw error;
    }
  }

  async getResult(eventId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${eventId}`);
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const urls = data.map(item => item.url);
        return urls.join(', ');
      } else {
        const text = await response.text();
        const urlMatches = text.match(/"url": "([^"]+)"/g);

        if (urlMatches) {
          const urls = urlMatches.map(match => match.match(/"url": "([^"]+)"/)[1]);
          return urls.join(', ');
        } else {
          return '未在响应中找到任何 URL';
        }
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  }

  handleError(errorMessage, error, e) {
    logger.error(errorMessage, error);
    e.reply('处理图片时发生错误', true);
  }
}
```

<Share colorful />