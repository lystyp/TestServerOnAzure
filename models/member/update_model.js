const db = require('../connection_db');
var TYPES = require('tedious').TYPES;
var Request = require('tedious').Request;

module.exports = function update(id, memberUpdateData) {
    let result = {};
    return new Promise((resolve, reject) => {
        let s = ""
        for (let i of Object.keys(memberUpdateData)){
            if (s != ""){
                s = s + ", " + i + " = " + '\'' + memberUpdateData[i] + '\'';
            } else {
                s = i + " = " + '\'' + memberUpdateData[i]+ '\'';
            }
        }
        db.query('UPDATE member_info SET ' + s + 'WHERE id = ' + id,
            function(err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "會員資料更新失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
                result.status = "會員資料更新成功。"
                result.memberUpdateData = memberUpdateData
                resolve(result)
            }
        );
    })
}