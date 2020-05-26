# mybot

#### 1.特别鸣谢

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

#### 2.项目背景

因为家人信奉天主教，神父为督促微信群内成员每日诵读圣经，在群内发起圣经打卡，每日将诵读圣经的录音或者圣经已读文本发送至群内，由人工统计诵读人数，记录诵读时间等，并获取诵读人员名单。因为微信群内成员日益增多，人工统计效率低且工作量大，家人本着奉献精神求助于我，希望我能用代码为神父分担一部分工作。在寻找完诸多项目，以及破解微信的种种限制之下，最终选择了

[WECHATY-PUPPET-PADPLUS]: https://github.com/wechaty/wechaty-puppet-padplus

，并且参与了一些测试工作，现将代码开源。帮助更多的开发者

**因为本人是java出身，对TS并不是很了解，代码中诸多纰漏请各位海涵，并能予以指正，万分感谢**

#### 3.开发环境

1.操作系统：window 10 家庭中文版

2.Node版本：10.16.3 （wechaty 推荐使用10.15版本，不建议使用过高版本）

3.TS版本：3.7.2 

4.python 版本：2.7（Windows安装wechaty项目所需moudle时需要用到python编译，并且只能使用2.7版本）

#### 4.项目搭建

此部分内容属于小白内容，大神可自行忽略

##### 1.新建项目

在任意目录下新建路径，并使用cmd进入该目录，进入后运行命名

```
tsc -init 
```

执行完命令后会在该目录下新建**tsconfig.json**配置文件，打开此文件，找到**target**属性，如果值为**es6**，请将其修改为**es5**,接下来执行以下命名，初始化项目

```
npm init
```

执行命名后可一路回车，直至出现**Is this OK? (yes)**，回车后目录中会出现**package.json**文件，此文件暂时不做任何改动

##### 2.安装依赖

执行以下命令，安装wechaty所需依赖，安装过程中可能会出现诸多问题，请不要紧张，都是正常现象，首先请确认开发环境中所需版本是否正确，如果确认环境没有任何问题后，删除**node_modules**目录和**package-lock.json**文件，继续运行一下命名，直至安装成功

```
npm install wechaty@latest

npm install wechaty-puppet-padplus@latest

npm install qrcode-terminal
```

因为本人项目中使用了mysql数据库以及导出excle，以下依赖可酌情添加

```
npm install mysql

npm install node-excel-export
```

##### 3.编写程序

在当前目录中新建ts文件(文件名自定，此处本人使用mybot命名）拷贝以下代码

```js
// bot.js
import { Wechaty } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import QrcodeTerminal from 'qrcode-terminal'

const token = 'your-token'

const puppet = new PuppetPadplus({
  token,
})

const name  = 'your-bot-name'

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true
      })
    }
  })
  .on('message', msg => {
    console.log(`msg : ${msg}`)
  })
  .start()
```

##### 4.运行项目

替换token后，先编译ts文件，运行一下命令

```
tsc mybot.ts
```

执行完成后会生成mybot.js

执行命令启动机器人

```
node mybot.js
```

执行完命名后出现二维码，说明项目运行成功，扫码登录即可，如果发现二维码混乱，无法扫描请将源代码中**samll:true**修改为**small:false**即可。
