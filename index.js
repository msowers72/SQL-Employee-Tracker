const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');

//data base
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tracker_db'
  },
  console.log(`Connected to the tracker_db database.`)    
);

goPrompt();

function goPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "Check Departments",
        "Check Roles",
        "Check Employees",
        "Plus Employee",
        "Plus Role",
        "Plus Department"
      ]
    }
  ]).then(function (input) {
    switch (input.choice) {
      case "Check Departments":
        viewDepartments()
        break;
      case "Check Roles":
        viewRoles()
        break;
      case "Check Employees":
        viewEmployees()
        break;
      case "Plus Employee":
        viewEmployee()
        break;
      case "Plus Role":
        viewRole()
        break;
    }
  })
}

function getInfo() {
db.query('SELECT * FROM department', function (err, results) {
  console.log(results);
});

}