const db = require('../connection_db');
var TYPES = require('tedious').TYPES;
var Request = require('tedious').Request;

module.exports = function getInfo(id) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM member_info WHERE id = ' + id, function(err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "登入失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                } 
                resolve(rows);
        });
    })
}