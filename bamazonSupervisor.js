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
  supervisorService();
});

function supervisorService() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit the store"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Product Sales by Department":
        showDepartments();
        break;

      case "Create New Department":
        createDepartment();
        break;

      case "Exit the store":
        connection.end();
        console.log("\nGoodbye, come back soon.\n\n");
        break;
      }
    });
}

function showDepartments() {
    var query = "SELECT DISTINCT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM products RIGHT JOIN departments ON departments.department_name=products.department_name ORDER BY departments.department_id";
    connection.query(query, "*", function(err, res) {
    if (err)
      throw(err)
    else
      for (var i = 0; i < res.length; i++)
      {        
        let sales = parseFloat(res[i].product_sales);
        let profit =  (sales - parseFloat(res[i].over_head_costs));
        if (res[i].product_sales == null)
        {
            sales = 0.0;
            profit = 0.0 -  parseFloat(res[i].over_head_costs);
        }
        console.log("id: " + res[i].department_id + " || Department: " + res[i].department_name + " || Overhead: " + res[i].over_head_costs + "|| Sales: " + sales + "|| Profit: " + profit );
      }
      connection.end();
    });
//    supervisorService();
}

function createDepartment() {
  inquirer
    .prompt([{
      name: "department_id",
      type: "input",
      message: "What item ID would you like to assign to this department?"
    },
    {
      name: "department_name",
      type: "input",
      message: "What is the new department called?"
    },
    {
      name: "overhead_costs",
      type: "input",
      message: "How much does it cost to run this department?"
    }
    ])
    .then(function(answer) {
//      var query = "INSERT INTO `departments` VALUES (?, ?, ?)";
      var query = "INSERT INTO departments (department_id, department_name, over_head_costs) VALUES (?, ?, ?)";
      connection.query(query,
         [
           { department_id: answer.department_id },
           { department_name: answer.department_name },
           { over_head_costs: answer.overhead_costs }                     
         ],
        function(err, res) {
        if (err)
          throw(err)
        else
        {
           console.log("The following department has been added...");
           console.log("id: " + answer.department_id + " || Department: " + answer.department_name + " || Overhead: " + answer.overhead_costs /* + "|| Sales:  " + res[0].product_sales + "|| Profit: " +  (parseFloat(res[0].product_sales) - parseFloat(res[0].overhead_costs)) */ );
         }
        connection.end();
      });
//      managerService();
    });
} 

