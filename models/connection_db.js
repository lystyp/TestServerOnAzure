// DataBase
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
  server: process.env.SQL_URL,
  authentication: {
      type: 'default',
      options: {
          userName: process.env.SQL_USER_NAME, // update me
          password: process.env.SQL_PASSWORD // update me
          
      }
  },
  options: {
      database: process.env.SQL_DATABASE_NAME,
      encrypt: true
  }
}


var connection = new Connection(config);
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
  }
});

// Request有一個很廢的地方是它沒有做queue之類的控管，所以他在目前的request尚未完成之前，不能call下一個request，不然會掛掉
let cmdQueue = [];
connection.query = (cmd, callback)=> {
  console.log('Query db : ' + cmd);
  cmdQueue.push({'cmd': cmd, 'callback': callback});
  if (cmdQueue.length == 1) {
    queryFunc(cmdQueue[0].cmd, cmdQueue[0].callback);
  }
}

function queryFunc(cmd, callback){
  let error = undefined;
  let result = [];
  request = new Request(cmd, (err, rowCount, rows) => {
    if (err) {
      error = err;
    } 
  });

  request.on('row', function(columns) {
    data = {}
    columns.forEach(function(column) {
      data[column.metadata.colName] = column.value;
    });
    result.push(data);
  });

  request.on('requestCompleted', function() {
    if (error) {
      setTimeout(callback, 0, error, undefined);
    } else {
      setTimeout(callback, 0, undefined, result);
    }
    cmdQueue.shift();
    if (cmdQueue.length > 0) {
      queryFunc(cmdQueue[0].cmd, cmdQueue[0].callback);
    }
  });
  connection.execSql(request);
}


module.exports = connection;