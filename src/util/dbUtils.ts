var mysql = require('mysql')
var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wechat'
})
/**
 * 执行SQL语句的
 */
function execute(sql: string, param: any) {
    return new Promise<any>(function (reslove, reject) {
        pool.getConnection(function(err,connection){
            if(err){
                return;
            }
            //开启事务
            connection.query(sql, param, function (err: any, result: any) {
                if (err) {
                    console.log("操作失败")
                    return reject(err);
                }
                var temp = JSON.stringify(result);
                var data = JSON.parse(temp);
                connection.release()
                reslove(data);
            })
        })
    })
}
export { execute }
