const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');

const allStaff = []
const theManagers = []

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
  ]).then(function (data) {
    switch (data.choice) {
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
      choices: selectManager()
    }
  ])
    .then(function (data) {
      var roleId = selectRole().indexOf(data.role) + 1
      var managerid = selectManager().indexOf(data.choice) + 1

      db.query('INSERT INTO employee SET ?',
        {
          first_name: data.first_name,
          last_name: data.last_name,
          manager_id: managerid,
          role_id: roleId
        }, function (err) {
          console.table(data)
          goPrompt()
        })
    })
}
// function for allstaff

function selectRole() {
  db.query('SELECT title FROM role', function (err, res) {
    for (var i = 0; i < res.length; i++) {
      allStaff.push(res[i].title)
    }
  })
  return allStaff;
}

// function selectManager
function selectManager() {
  db.query('SELECT first_name FROM employee WHERE manager_id IS NULL', function (err, res) {
    for (var i = 0; i < res.length; i++) {
      theManagers.push(res[i].first_name)
    }
  })
  return theManagers;
}

// add department function
function plusDepartment() {
  {
    inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "Enter the new department name: "

      }
    ])
      .then(function (data) {

        db.query('INSERT INTO department SET ?',
          {
            name: data.department,
          }, function (err) {
          console.table(data)
          goPrompt()
        })
      })
  }
}

//  add role function
function plusRole()
{
  db.query('SELECT role.title AS selectedTitle, role.salary AS selectedSalary FROM role',function (err,res)
  {
    inquirer.prompt([
      {
        name: "selectedTitle",
        type: "input",
        message: "Enter the role you'd like to add: "
      },
      {
        name: "selectedSalary",
        type: "input",
        message: "What is the salary of this role?"
      }
    ]).then(function (res)
    {
      db.query("INSERT INTO role SET ?",
        {
          title: res.selectedTitle,
          salary: res.selectedSalary,
        },
        function (err)
        {
          console.table(res)
          goPrompt()
        }
      )
    })
  })
}

// updated add employee funciton
function plusEmployees()
{
  db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id;',function (err,res)
  {
    inquirer.prompt([
      {
        type: "list",
        name: "updateId",
        message: "Select an employee to update: ",
        choices: function ()
        {
          var allEmployees = []
          for (var i = 0; i < res.length; i++) {
            allEmployees.push(res[i].last_name)
          }
          return allEmployees
        },
      },
      {
        name: "role",
        type: 'list',
        message: "What is the Employee's new role?",
        choices: selectRole()
      },
    ]).then(function (data)
    {
      var roleId = selectRole().indexOf(data.role) + 1
      db.query('UPDATE employee SET WHERE ?',
        {
          id: data.updateId,
          role_id: data.roleId
        },function (err) 
      {
        console.table(data)
        goPrompt()
      })
    })
  });
}



goPrompt();