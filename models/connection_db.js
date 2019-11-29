// DataBase
var Connection = require('tedious').Connection;

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

module.exports = connection;