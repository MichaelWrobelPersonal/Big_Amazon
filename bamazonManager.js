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
  managerService();
});

function managerService() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit the store"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products for Sale":
        showProducts();
        break;

      case "View Low Inventory":
        viewLowInventory();
         break;

        case "Add to Inventory":
        addToInventory();
        break;

        case "Add New Product":
        addNewProduct();
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
      connection.end();
    });
//    managerService();
}

function viewLowInventory() {
  var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products WHERE stock_quantity < 100";
  connection.query(query, "*", function(err, res) {
  if (err)
    throw(err)
  else 
    for (var i = 0; i < res.length; i++) {
      console.log("id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + "|| Price:  " + res[i].price + "|| Quantity: " + res[i].stock_quantity );
    }
    connection.end();
  });
//  managerService();
}

function addToInventory() {
    inquirer
      .prompt([{
        name: "item_id",
        type: "input",
        message: "What item would you like to add invetory to?"
      },
      {
        name: "item_qty",
        type: "input",
        message: "How many would you like to add?"
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
             updateProductStock(res[0].item_id, res[0].stock_quantity+parseInt(answer.item_qty));
        }
        connection.end();
      });
//         managerService();
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
//    managerService();
}

function addNewProduct() {
  inquirer
    .prompt([{
      name: "item_id",
      type: "input",
      message: "What item ID would you like to assign to this new product?"
    },
    {
      name: "product_name",
      type: "input",
      message: "What is the new product called?"
    },
    {
      name: "department_name",
      type: "input",
      message: "Which department will sell the new product?"
    },
    {
      name: "price",
      type: "input",
      message: "What is the price of this new product?"
    },
    {
      name: "stock_quantity",
      type: "input",
      message: "How many of the new item are to be stocked?"
    }
  ])
    .then(function(answer) {
      var query = "INSERT INTO `products` (`item_id, product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?, ?)";
      connection.query(query,
         [
           { item_id: answer.item_id },
           { product_name: answer.product_name },
           { department_name: answer.department_name },
           { price: answer.price },
           { stock_quantity: answer.stock_quantity }                      
         ],
        function(err, res) {
//        for (var i = 0; i < res.length; i++) {
//          console.log("id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + "|| Price:  " + res[i].price + "|| Quantity: " + res[i].stock_quantity );
//        }
        console.log("The following items has been added...")
        console.log("id: " + answer.item_id + " || Product: " + answer.product_name + " || Department: " + answer.department_name + "|| Price:  " + answer.price + "|| Quantity: " + answer.stock_quantity );
        connection.end();
      });
//      managerService();
    });
} 

