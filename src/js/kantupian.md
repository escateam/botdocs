# 看图片

### 源代码

```js
import fetch from 'node-fetch';
/*欢迎使用HL 看图片.js  gitee  https://gitee.com/fox-glaze*/
export class example extends plugin {
  constructor() {
    super({
      name: '提取',
      dsc: 'HL',
      event: 'message',
      priority: -114514,
      rule: [
        {
          reg: '^#看图片$',
          fnc: 'fetchImageInfo'
        }
      ]
    });
  }

  async fetchImageInfo(e) {
    logger.info('[HL插件] 执行 fetchImageInfo');

    const source = e.source;
    logger.info(`Source: ${JSON.stringify(source)}`);

    if (!source || !source.seq) {
      e.reply('无法获取 source 或 source 中没有 seq');
      return false;
    }

    const seq = source.seq;
    logger.info(`提取到的 seq: ${seq}`);

    try {
      const history = await e.group.getChatHistory(seq, 1);
      logger.info(`获取到的历史记录: ${JSON.stringify(history)}`);

      const imagesInfo = this.extractImageInfo(history);

      if (imagesInfo.length === 0) {
        e.reply('未找到图片信息');
        return false;
      }

      const messages = this.formatImageMessages(imagesInfo);

      const aw = this.e.runtime.common.makeForwardMsg(e, messages, '图片信息');
      await e.reply(aw);

      return true;
    } catch (error) {
      logger.error(`获取历史记录失败: ${error}`);
      e.reply('获取历史记录失败');
      return false;
    }
  }

  extractImageInfo(history) {
    const imagesInfo = [];

    for (const record of history) {
      for (const item of record.message) {
        if (item.type === 'image') {
          const fileSizeInBytes = item.size;
          const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
          const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

          imagesInfo.push({
            url: item.url,
            file: item.file,
            raw_message: record.raw_message,
            size: {
              bytes: fileSizeInBytes,
              kb: fileSizeInKB,
              mb: fileSizeInMB
            }
          });
        }
      }
    }

    return imagesInfo;
  }

  formatImageMessages(imagesInfo) {
    const messages = ['-----------[图片信息]-----------'];

    for (const image of imagesInfo) {
      messages.push(
        `图片链接: ${image.url}`,
        `图片文件名: ${image.file}`,
        `图片外显: ${image.raw_message}`,
        `图片大小: ${image.size.bytes} bytes`,
        `图片大小 (KB): ${image.size.kb} KB`,
        `图片大小 (MB): ${image.size.mb} MB`
      );
    }

    messages.push('----------------------');
    return messages;
  }
}
```

<Share colorful />