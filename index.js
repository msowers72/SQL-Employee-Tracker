// Dependencies used for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');

const allStaff = []
const theManagers = []

//Allows you to connect to the tracker_db database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tracker_db'
  },
  console.log(`Connected to the tracker_db database.`)
);



// funciton asking the user what functionality they would like to do question will display in the command line
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
    // switch replaces else if...selects parameter and javascript will look for the correct function
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

// view departments in the form of a table in the command line
function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
    goPrompt();
  });
}

// Function is to view rolls in the form of a table in the command line
function viewRoles() {
  db.query('SELECT * FROM role', function (err, results) {
    console.table(results);
    goPrompt();
  });
}

// Function is to view employees in the form of a table in the command line
function viewEmployees() {
  db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
    goPrompt();
  });
}

// Function allows you to add employees to your db and select the appropriate role
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
  // promise function 
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

// function for allstaff and has a for loop
function selectRole() {
  db.query('SELECT title FROM role', function (err, res) {
    for (var i = 0; i < res.length; i++) {
      allStaff.push(res[i].title)
    }
  })
  return allStaff;
}

// function selectManager and has a for loop
function selectManager() {
  db.query('SELECT first_name FROM employee WHERE manager_id IS NULL', function (err, res) {
    for (var i = 0; i < res.length; i++) {
      theManagers.push(res[i].first_name)
    }
  })
  return theManagers;
}

// add department function allows us to create a new function
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

//  add role function allows you to update role and slect salary
function plusRole() {
  db.query('SELECT role.title AS selectedTitle, role.salary AS selectedSalary FROM role', function (err, res) {
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
      // promise 
    ]).then(function (res) {
      db.query("INSERT INTO role SET ?",
        {
          title: res.selectedTitle,
          salary: res.selectedSalary,
        },
        function (err) {
          console.table(res)
          goPrompt()
        }
      )
    })
  })
}

//  add employee funciton and update the employee's role has a for loop
function plusEmployees() {
  db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id;', function (err, res) {
    inquirer.prompt([
      {
        type: "list",
        name: "updateId",
        message: "Select an employee to update: ",
        choices: function () {
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
      // promise
    ]).then(function (data) {
      var roleId = selectRole().indexOf(data.role) + 1
      db.query('UPDATE employee SET WHERE ?',
        {
          id: data.updateId,
          role_id: data.roleId
        }, function (err) {
        console.table(data)
        goPrompt()
      })
    })
  });
}

// fires my goPrompt...

goPrompt();