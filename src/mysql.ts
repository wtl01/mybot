import { dateFormat } from "./util/dateUtil";

var mysql = require('mysql')
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'wechat'
})
connection.connect();
//插入数据
function insert(name:string,type:string){
    
    var sql = "INSERT INTO RECORD (NAME,SENDTIME,MESSAGETYPE) VALUES (?,NOW(),?)"
    var param=[name,type]
    connection.query(sql,param,function(err:any,result:any){
        if(err){
            console.log("插入失败")
            return
        }
        console.log("==========插入数据===========")
        console.log(result)
        console.log("==========插入数据===========")
    })
}
//更新数据
function update(name:string,type:string){
    var sql = "UPDATE RECORD SET SENDTIME=NOW(),MESSAGETYPE=? WHERE NAME=?"
    var param=[type,name]
    connection.query(sql,param,function(err:any,result:any){
        if(err){
            console.log("更新失败")
            return
        }
        console.log("==========更新数据===========")
        console.log(result)
        console.log("==========更新数据===========")
    }) 
}
//获取当天读经的人数
function count(){
   return new Promise(function(resolve, reject){
        var date = dateFormat("YYYYmmdd", new Date())
        var sql = "SELECT COUNT(*) count FROM RECORD WHERE DATE_FORMAT(sendtime,'%Y%m%d')=?";
        var param=[date]
        connection.query(sql,param,function(err:any,result:any){
            if(err){
                console.log("查询失败")
                return reject(err);
            }
            var temp = JSON.stringify(result);
            var r = JSON.parse(temp);
            console.log("==========查询数据===========")
            console.log(r)
            console.log("==========查询数据===========")
            resolve(r[0].count);

        }) 
    })
}
//查看用户今天是否已经插入数据
function query(name:string){
  return  new Promise(function(resolve:any,reject:any){
        var sql = "SELECT * FROM RECORD WHERE NAME = ?";
        var param=[name]
        connection.query(sql,param,function(err:any,result:any){
            if(err){
                console.log("查询失败")
                return reject(err);
            }
            var temp = JSON.stringify(result);
            var r = JSON.parse(temp);
            resolve(r.length>0?true:false)
        })
    })
}
export {insert,update,count,query}