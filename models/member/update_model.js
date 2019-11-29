const db = require('../connection_db');
var TYPES = require('tedious').TYPES;
var Request = require('tedious').Request;

module.exports = function update(id, memberUpdateData) {
    let result = {};
    return new Promise((resolve, reject) => {
        request = new Request('UPDATE member_info SET @data WHERE id = @id',
            function(err, rowCount, rows) {
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
        request.addParameter('data', TYPES.NVarChar, memberUpdateData);
        request.addParameter('id', TYPES.Int, id);
        db.execSql(request);
    })
}