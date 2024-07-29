# 网页截图预览

### 源代码

> [!tip]
> 使用本插件需安装get-urls依赖 <br>
> 请在云崽根目录执行
> ```bash
> pnpm i get-urls -w
> ```

```js
import puppeteer from 'puppeteer';
import getUrls from 'get-urls';
import os from 'os';
import { exec } from 'child_process';
let jting = false;
let taskCount = 0; // 这个不能改！

// 作者admilk，https://gitee.com/adrae/js-plugins

async function killAllChromeProcesses() {
    const platform = os.platform();
    let command;

    if (platform === 'linux') {
        command = 'pkill -f chrome';
    } else if (platform === 'win32') {
        command = 'taskkill /IM chrome.exe /F';
    } else {
        logger.info('[plugins/example/WebView.js][网页截图] 不支持的操作系统');
        return;
    }

    await exec(command, (err, stdout, stderr) => {
        logger.info(`[plugins/example/WebView.js][网页截图] 成功杀死所有Chrome进程，包括崽的`);
    });
    return;
}
global.结束浏览器 = killAllChromeProcesses

await killAllChromeProcesses();
let black = [111,222]//黑名单群
let browsers = [];
let numBrowsers = 1; // 初始启动的浏览器数量
const maxBrowsers = 10; // 最大浏览器数量
const minBrowsers = 1; // 最小浏览器数量
const browserRestartThreshold = 10; // 每个浏览器的截图任务最大多少张
const idleTimeout = 2000; // 浏览器空闲时间（单位：毫秒）
const aw = 20; // 最高处理链接数量
//trss插件可以使用rj 结束浏览器(true)  来结束浏览器进程
async function initPuppeteer() {
    try {
        for (let i = 0; i < numBrowsers; i++) {
            const browser = await puppeteer.launch({
                args: [
                    "--disable-gpu",
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--no-zygote"
                ]
            });
            browsers.push({ browser, lastUsed: Date.now(), callCount: 0 });
        }
        logger.info(`[plugins/example/WebView.js][网页截图] 成功启动 ${numBrowsers} 个 Puppeteer 浏览器`);
    } catch (err) {
        logger.error('[plugins/example/WebView.js][网页截图] 启动 Puppeteer 时发生错误:', err);
    }
}

initPuppeteer();

// 定期自动重启浏览器
const browserRestartIntervalauto = setInterval(async () => {
    await restart(true);
}, 30 * 60 * 1000);

const browserCloseInterval = setInterval(async () => {
    await delbrowser();
}, 0.1 * 60 * 1000);

async function delbrowser(all = false) {
    if (jting && !all) return;
    const now = Date.now();
    let idleBrowsers = all ? browsers : browsers.filter(b => (now - b.lastUsed) > idleTimeout);
    const browsersToClose = all ? Math.max(0, idleBrowsers.length - minBrowsers) : idleBrowsers.length;

    if (browsersToClose > 0 && (numBrowsers > minBrowsers || all)) {
        for (let i = 0; i < browsersToClose; i++) {
            if (numBrowsers <= minBrowsers) break;
            numBrowsers--;
        }
        await 结束浏览器()
        await adjustBrowsers(numBrowsers)
        await logger.info(`[plugins/example/WebView.js][网页截图] 已将浏览器数量减少到 ${numBrowsers}`);
    }
}
global.减少浏览器 = delbrowser

async function adjustBrowsers(targetNumBrowsers, force = false) {
    if (!force) targetNumBrowsers = Math.max(minBrowsers, Math.min(maxBrowsers, targetNumBrowsers));

    if (targetNumBrowsers > numBrowsers) {
        for (let i = numBrowsers; i < targetNumBrowsers; i++) {
            const browser = await puppeteer.launch({
                args: [
                    "--disable-gpu",
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--no-zygote"
                ]
            });
            browsers.push({ browser, lastUsed: Date.now(), callCount: 0 });
        }
        logger.info(`[plugins/example/WebView.js][网页截图] 已将浏览器数量增加到 ${targetNumBrowsers}`);
    } else if (targetNumBrowsers < numBrowsers) {
        for (let i = numBrowsers; i > targetNumBrowsers; i--) {
            const browserToClose = browsers.pop();
            await browserToClose.browser.close();
        }
        logger.info(`[plugins/example/WebView.js][网页截图] 已将浏览器数量减少到 ${targetNumBrowsers}`);
    }
    numBrowsers = targetNumBrowsers;
}
global.增加浏览器 = adjustBrowsers

async function restartBrowser(browserInfo) {
    logger.info('[plugins/example/WebView.js][网页截图] 重启浏览器实例...');
    try {
        await browserInfo.browser.close();
    } catch (error) {
        logger.error('[plugins/example/WebView.js][网页截图] 关闭浏览器实例时出错:', error);
    }
    const newBrowser = await puppeteer.launch({
        args: [
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--no-zygote"
        ]
    });
    browserInfo.browser = newBrowser;
    browserInfo.callCount = 0;
    browserInfo.lastUsed = Date.now();
    logger.info('[plugins/example/WebView.js][网页截图] 重启浏览器实例成功');
}

async function checkAndRestartBrowsers() {
    for (let i = 0; i < browsers.length; i++) {
        const browserInfo = browsers[i];
        try {
            const pages = await browserInfo.browser.pages();
            if (pages.length === 0) {
                throw new Error('No pages found in browser instance');
            }
        } catch (error) {
            if (error.message.includes("Tab target session")) {
                logger.error('[plugins/example/WebView.js][网页截图] 检测到 "Tab target session is not defined" 错误，延迟重启浏览器实例:', error);
                await new Promise(resolve => setTimeout(resolve, 5000));

                await restartBrowser(browserInfo);
            } else {
                logger.error('[plugins/example/WebView.js][网页截图] 浏览器检测失败，正在重启:', error);
                await restartBrowser(browserInfo);
            }
        }
    }
}

export class Webviewer extends plugin {
    constructor(e) {
        super({
            name: '网页截图预览',
            priority: -1,
            event: 'message'
        });
        this.WebPreview(e);
    }

    async WebPreview(e) {
        try{
        if (black.includes(e.group_id)) return false
        } catch {}
        let urls = [];
        try {
            for (const i of e.message) {
                if (i.type === 'text') {
                    const url = Array.from(getUrls(i.text));
                    urls.push(...url);
                }
            }
        } catch (error) {
            return false;
        }

        for (const item of e.message) {
            if (item.type === 'json') {
                const forwards = await this.getMessage(item);
                for (const forwardItem of forwards) {
                    if (forwardItem.type === 'text') {
                        const url = Array.from(getUrls(forwardItem.text));
                        urls.push(...url);
                    }
                }
            }
        }

        urls = [...new Set(urls)];
        if (urls.length > aw) {
            logger.info('[plugins/example/WebView.js][网页截图] URL 过多，停止截图');
            return false;
        }

        if (urls.length > 0) {
            logger.info('[plugins/example/WebView.js][网页截图] 开始截图');
            jting = true;
            taskCount++; // 任务数量统计
            try {
                const targetBrowsers = Math.ceil(urls.length / 1);
                const requiredBrowsers = Math.min(maxBrowsers, targetBrowsers > numBrowsers ? targetBrowsers : numBrowsers);
                await adjustBrowsers(requiredBrowsers);
                await checkAndRestartBrowsers();
                const results = await this.processUrlsInBatches(urls);
                const segments = results.filter(result => result).map(result => segment.image(result));
                if (segments.length > 1) await 拆分消息(segments, e, 500);
                else await this.reply(segments);
            } catch (err) {
                logger.error('[plugins/example/WebView.js][网页截图] 处理 URL 时发生错误:', err.message);
                return false;
            } finally {
                taskCount--; 
                if (taskCount === 0) {
                    jting = false; // 关闭截图ing
                    await delbrowser(true);
                }
            }
        }

        return false;
    }

    async processUrlsInBatches(urls) {
        const results = [];
        const batchSize = Math.ceil(urls.length / browsers.length);

        const batches = [];
        for (let i = 0; i < urls.length; i += batchSize) {
            batches.push(urls.slice(i, i + batchSize));
        }

        const promises = batches.map(async (batch, index) => {
            let browserInfo = browsers[index];
            if (!browserInfo) {
                logger.error('[plugins/example/WebView.js][网页截图] 浏览器实例未找到，无法进行截图');
                return [];
            }

            const processUrl = async (url, browser) => {
                try {
                    if (url.includes('gchat.qpic.cn')) {
                        return url;
                    } else {
                        const page = await browser.newPage();
                        await page.setViewport({ width: 1280, height: 800 });
                        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                        const img = await page.screenshot({ fullPage: true });
                        await page.close();
                        return img;
                    }
                } catch (err) {
                    if (err.message.includes('Connection closed')) {
                        logger.error(`[plugins/example/WebView.js][网页截图] 浏览器实例已关闭，正在重启: ${url}`, err.message);
                        await restartBrowser(browserInfo);

                        // 使用重启后的浏览器实例
                        const newBrowser = browserInfo.browser;
                        try {
                            const page = await newBrowser.newPage();
                            await page.setViewport({ width: 1280, height: 800 });
                            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                            const img = await page.screenshot({ fullPage: true });
                            await page.close();
                            return img;
                        } catch (retryErr) {
                            logger.error(`[plugins/example/WebView.js][网页截图] 重试截图错误 ${url}`, retryErr.message);
                            return null;
                        }
                    } else {
                        logger.error(`[plugins/example/WebView.js][网页截图] 截图错误 ${url}`, err.message);
                        return null;
                    }
                }
            };

            // 检查浏览器实例是否可用
            try {
                const pages = await browserInfo.browser.pages();
                if (pages.length === 0) {
                    throw new Error('No pages found in browser instance');
                }
            } catch (error) {
                logger.error('[plugins/example/WebView.js][网页截图] 浏览器实例不可用，正在重启:', error);
                await restartBrowser(browserInfo);
            }

            browserInfo.lastUsed = Date.now();
            browserInfo.callCount++;

            const batchResults = await Promise.all(batch.map(url => processUrl(url, browserInfo.browser)));

            return batchResults;
        });

        const allResults = await Promise.all(promises);

        allResults.forEach(batchResults => {
            results.push(...batchResults.filter(result => result !== null));
        });

        return results;
    }

    async getMessage(item) {
        let msgs = [];
        const data = parseData(item.data);

        const resid = item.type === 'json' && data?.meta?.detail?.resid ? data.meta.detail.resid : null;
        if (resid) {
            const res = await Bot.getForwardMsg(resid);
            if (res) {
                for (const i of res) {
                    for (const ii of i.message) {
                        const nestedData = parseData(ii.data);
                        const nestedResid = ii.type === 'json' && nestedData?.meta?.detail?.resid ? nestedData.meta.detail.resid : null;

                        if (nestedResid) {
                            const nestedMsgs = await this.getMessage(ii);
                            msgs = msgs.concat(nestedMsgs);
                        } else {
                            msgs.push(ii);
                        }
                    }
                }
            }
        } else {
            msgs.push(item);
        }

        return msgs;
    }
}

function parseData(data) {
    try {
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

async function 拆分消息(messages, e, sl = 100, fh = false) {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  const chunkArray = function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  };

  const batches = chunkArray(messages, sl);
  const forwardMessages = [];

  for (const batch of batches) {
    const forwardMsg = await e.runtime.common.makeForwardMsg(e, batch);
    forwardMessages.push(forwardMsg);
  }

  let finalForwardMsg = forwardMessages.length > 1 ? await e.runtime.common.makeForwardMsg(e, forwardMessages) : forwardMessages[0];
  if (forwardMessages.length > sl) {
    const nestedBatches = chunkArray(forwardMessages, sl);
    finalForwardMsg = await 拆分消息(nestedBatches, e, sl, true);
  }

  if (!fh) {
    await e.reply(finalForwardMsg);
  } else {
    return finalForwardMsg;
  }
}
async function restart(f = false) {
    await Promise.all(browsers.map(b => b.browser.close()));
    browsers = [];
    numBrowsers = Math.max(minBrowsers, f ? numBrowsers + 1 : numBrowsers - 1); // 根据标志位决定是否增加浏览器数量
    logger.info(`[plugins/example/WebView.js][网页截图] 已将浏览器数量调整到 ${numBrowsers}`);
    await initPuppeteer();
}

function clearIntervals() {
    clearInterval(browserRestartIntervalauto);
    clearInterval(browserCloseInterval);
}
```

<Share colorful />