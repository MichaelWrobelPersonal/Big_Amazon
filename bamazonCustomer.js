var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  customerService();
});

function customerService() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Take a look at the shop",
        "Order something",
        "Exit the store"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Take a look at the shop":
        showProducts();
        break;

      case "Order something":
        placeOrder();
        break;

      case "Exit the store":
        connection.end();
        console.log("\nGoodbye, come back soon.\n\n");
        break;
      }
    });
}

function showProducts() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products";
    connection.query(query, "*", function(err, res) {
    if (err)
        throw(err)
    else
      for (var i = 0; i < res.length; i++) {
          console.log("id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + "|| Price:  " + res[i].price + "|| Quantity: " + res[i].stock_quantity );
      }
      console.log("Done wi loop");
      connection.end();
      console.log("disconnected");
//      customerService();
    });
}

function placeOrder() {
    inquirer
      .prompt([{
        name: "item_id",
        type: "input",
        message: "What item would you like to purchase?"
      },
      {
        name: "item_qty",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ])
      .then(function(answer) {
        var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products WHERE item_id=?";
        connection.query(query, { item_id: answer.item_id }, function(err, res) {
          if (err)
            throw(err)
          else
          {
            for (var i = 0; i < res.length; i++) {
              console.log("id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + "|| Price:  " + res[i].price + "|| Quantity: " + res[i].stock_quantity );
            }
            if (res[0].stock_quantity > answer.item_qty)
            {
               updateProductStock(res[0].item_id, res[0].stock_quantity-answer.item_qty);
               console.log("\n\nYour cost is: $" + (parseInt(answer.item_qty) * parseFloat(res[0].price)) + "\n\n" );
            }
           else
               console.log("Insufficient quantity in stock, try again.");
          } 
          connection.end();
//          customerService();
        });
      });
}  

function updateProductStock(choosen_item_id, updated_qty) {
    console.log("Updating Stock Quantity...\n");
    var query = connection.query(
      "UPDATE bamazon.products SET ? WHERE ?",
      [
        {
          stock_quantity: updated_qty
        },
        {
          item_id: choosen_item_id
        }
      ],
      function (err, res) {
        if (err) {
            throw err;
        }
        console.log(res.affectedRows + " stock quantity updated!\n");
      }
    );
    console.log(query.sql);
}


