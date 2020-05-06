import { Message, Room, FileBox } from "wechaty"
import { execute } from "./dbUtils"
import { dateFormat } from "./dateUtil"
import { writeExcle } from "./excleUtil"

async function personalMessageHandle(msg: Message) {
    const type = msg.type()
    //如果是消息类型
    const text = msg.text()
    if (type === Message.Type.Text && text.indexOf("名单") > -1) {
        let ary= text.split("名单");
        var temp = ary[0];
        //查询今天读经人员名单
        var countSql = "SELECT COUNT(*) count FROM RECORD WHERE DATE_FORMAT(sendtime,'%Y%m%d')=?"
        var querySql = "SELECT name,DATE_FORMAT(SENDTIME,'%Y-%m-%d %H:%i:%s') sendtime FROM RECORD WHERE DATE_FORMAT(SENDTIME,'%Y%m%d')=?"
        var response = ""
        let date = temp.substring(0,4)+"-"+temp.substring(4,6)+"-"+temp.substring(6,8);
        execute(countSql, temp).then(result => {
            if (result[0].count == 0) {
                msg.say(date+"日，共有0人读经")
                return
            } else {
                return execute(querySql, temp)
            }
        }).then(async result => {
            response = date+"日共有" + result.length + "人读经"
            await writeExcle(result,temp)
            msg.say(response)
            const fileBox = FileBox.fromFile('d:\\'+temp+'.xlsx');
            msg.say(fileBox)
        })
    }else if(text.indexOf("测试")>-1){
        msg.say("我在正常工作哦！")
    }
}
async function roomMessageHandle(msg: Message, room: Room) {
    //获取群名称
    const roomName = await room.topic();
    if (roomName === "西安教区西堂教友读经群") {
        //获取消息类型
        const type = msg.type()
        const text = msg.text()
        //监测是否是语音，小程序，文件，链接
        if (type === Message.Type.Audio || type === Message.Type.MiniProgram || type === Message.Type.Attachment || type === Message.Type.Url || (type === Message.Type.Text && text.indexOf("已读") > -1 && text.indexOf("福音") > -1)) {
            //查询用户今天是否有数据
            var sql = "SELECT * FROM RECORD WHERE NAME=? AND DATE_FORMAT(SENDTIME,'%Y%m%d')=?"
            var addSql = "INSERT INTO RECORD (NAME,SENDTIME,MESSAGETYPE) VALUES(?,now(),?)"
            var getCount = "SELECT COUNT(*) count from record where name=?"
            //获取发送人的
            const from = msg.from()
            var alias = await room.alias(from)
            var name = "";
            if (alias == null) {
                name = from.name();
            } else {
                name = alias;
            }
            var param = [name, dateFormat("YYYYmmdd", new Date())]
            var addParam = [name, msg.type()]
            execute(sql, param).then(result => {
                if (result.length == 0) {
                    return execute(addSql, addParam)
                }
            }).then(result => {
                execute(getCount, name).then(result => {
                    let count = result[0].count
                    room.say("您已恭读圣经" + count + "天，请继续保持，天主爱你！", from)
                })
            })
        }
        if (await msg.mentionSelf()) {
            var countSql = "SELECT COUNT(*) count FROM RECORD WHERE DATE_FORMAT(sendtime,'%Y%m%d')=?"
            var d = new Date()
            let date = dateFormat("YYYYmmdd", d)
            let respDate = dateFormat("YYYY-mm-dd", d)
            execute(countSql, date).then(result => {
                room.say(respDate + "日共有" + result[0].count + "人读经，请大家继续保持，天主爱你！")
                return
            })
    }
}
}
export { roomMessageHandle, personalMessageHandle }