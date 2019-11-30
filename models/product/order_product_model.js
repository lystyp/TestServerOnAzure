const db = require('../connection_db');

module.exports = async function orderProduct(orderList) {
    let id = await getOrderID() + 1;
    for (i in orderList['order_info']) {
        let productId = i
        let productQuantity = orderList['order_info'][productId]
        info = await getProductInfo(productId);
        const orderData = {
            'order_id': id,
            'member_id': orderList['memberID'],
            'product_id': productId,
            'order_quantity': productQuantity,
            'order_price': productQuantity * info.price,
            'order_date': orderList['orderDate'],
            'is_complete': 0
        };
        let s_col = ""
        let s_val = ""
        for (let i of Object.keys(orderData)){
            if (s_col != ""){
                s_col = s_col + "," + i;
            } else {
                s_col = i;
            }
        }

        for (let i of Object.values(orderData)){
            if (s_val != ""){
                s_val = s_val + "," + '\'' + i + '\'';
            } else {
                s_val = '\'' + i + '\'';
            }
        }
        db.query('INSERT INTO order_list (' + s_col + ') VALUES (' + s_val + ')', function (err, rows) {
            if (err) {
                console.log(err);
                throw "訂單輸入失敗!"
            }
        })
    }
}

const getProductInfo = (productID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product WHERE id = ' + productID, function (err, rows) {
        if (err) {
            console.log(err);
            reject(err);
            return;
        }
        resolve(rows[0]);
        })
    })
}

// 取得訂單id
const getOrderID = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT MAX(order_id) AS id FROM order_list', function (err, rows, fields) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(rows[0].id);
      })
    })
}

