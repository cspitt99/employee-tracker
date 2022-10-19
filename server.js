const inquirer = require('inquirer');

const mainMenuQuestions = [{
    type: "list",
    name: "menu",
    message: "What would you like to do?",
    choices: ['View all departments', "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
}];

function mainMenu() {

    inquirer.prompt(mainMenuQuestions)
        .then(response => {
            if (response.menu === 'View all departments') {
                viewDepartments();
            } else if (response.menu === 'View all roles') {
                viewRoles();
            } else if (response.menu === 'View all employees') {
                viewEmployees();
            } else if (response.menu === 'Add a department') {
                addDepartment();
            } else if (response.menu === 'Add a role') {
                addRole();
            } else if (response.menu === 'Add an employee') {
                addEmployee();
            } else if (response.menu === 'Update an employee role') {
                updateEmployee();
            } else if (response.menu === 'Quit') {
                close();
            }
        })
};

const addDepartmentQuestions = [{
    type: "input",
    name: "department",
    message: "What department would you like to add?"
}];

function viewDepartments() {

    db.query('SELECT * FROM department', (err, data) => {
        console.table(data);
        mainMenu();
    })

};

function viewRoles() {

    db.query(`
    SELECT
    role.id,
    role.title,
    role.salary
    FROM role`, (err, data) => {
        console.table(data);
        mainMenu();
    })

};

function viewEmployees() {

    db.query(`
    SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name as department,
    role.salary,
    CONCAT(mgr.first_name, " " , mgr.last_name) as manager
    FROM employee
    LEFT JOIN role ON role.id= employee.role_id
    LEFT JOIN department ON role.department_id=department.id
    LEFT JOIN employee as mgr ON employee.manager_id = mgr.id
    `, (err, data) => {
        console.table(data);
        mainMenu();
    });
};