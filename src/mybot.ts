import { Wechaty, Message, Contact, Friendship } from "wechaty";
import { PuppetPadplus } from "wechaty-puppet-padplus";
import {generate} from "qrcode-terminal"
import {roomMessageHandle,personalMessageHandle} from "./util/message-utils"
const token = 'your token'
//定义群聊名称
const puppet = new PuppetPadplus({
  token,
})
const name  = 'mybot'
const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
  .on('scan', (qrcode) => {
    generate(qrcode, {
      small: false
    })
  })
  .on('message', async msg => {
    console.log(`msg : ${msg}`)
    //获取消息来源
    const contact = msg.from()
    //获取群聊名称
    const room = msg.room()
    if(room){
      //来自于群聊
      roomMessageHandle(msg,room)
    }else{
      //来自于个人
      personalMessageHandle(msg)
    }
}).on('friendship', async friendship=>{
  //处理好友申请
}).start()
