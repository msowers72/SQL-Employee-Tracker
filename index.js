const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');

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
      message: "What action would you like to do?",
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
        plusEmployees()
        break;
      case "Plus Department":
        plusDepartment()
        break;
      case "Plus Role":
        plusRole()
        break;
    }
  })
}

// Function is to view departsments
function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
    goPrompt();
  });
}

// Function is to view rolls
function viewRoles() {
  db.query('SELECT * FROM role', function (err, results) {
    console.table(results);
    goPrompt();
  });
}

// Function is to view employees
function viewEmployees() {
  db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
    goPrompt();
  });
}

function plusEmployees() {
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "First Name:"
    },
    {
      name: "last_name",
      type: "input",
      message: "Last Name:"
    },
    {
      name: "role",
      type: "list",
      message: "Role:",
      choices: selectRole()
    },
    {
      name: "manager",
      type: "list",
      message: "Manager:",
      choices: selectManger()
    },
  ])
    .then(function (data) {
      var roleId = selectRole().indexOf(data.role) + 1
      var managerid = selectManager().indexOf(data.choice) + 1

      db.query('INSERT INTO employee SET ?',
        {
          first_name: data.first_name,
          lastname: data.last_name,
          manager_id: managerid,
          role_id: roleId
        }, funciton(err)
      )
      console.table(data)
      goPrompt()
    })
}
// function for allstaff
 var allStaff = []
function selectRole() {
  db.query('SELECT title FROM role', function (err, res) {
    for (var i = 0; i < res.length; i++) {
      allStaff.push(res[i].title)
    }
  })
    return allStaff;
}

