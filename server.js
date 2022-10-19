const inquirer = require('inquirer');
const db = require('./config/connection');
require('console.table');

db.connect(() => {
    mainMenu();
});

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

function addDepartment() {
    db.query(`SELECT * FROM department`, () => {
        inquirer.prompt(addDepartmentQuestions)
            .then(response => {
                console.log(response);
                db.query(`INSERT INTO department (name) VALUES (?)`, (response.department));
            })
            .then(() =>
                viewDepartments()
            );
    });
};

function addRole() {

    db.query(`SELECT name as name, id as value FROM department`, (err, departmentData) => {
        db.query(`SELECT * FROM role`, () => {

            const addRoleQuestions = [
                {
                    type: "input",
                    name: "title",
                    message: "What role would you like to add?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departmentData
                }
            ];

            inquirer.prompt(addRoleQuestions)
                .then(response => {
                    const parameters = [response.title, response.salary, response.department_id];
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, parameters);
                })
                .then(() => {
                    viewRoles();
                });
        })
    });

};

function addEmployee() {

    db.query(`SELECT title AS name, id AS value FROM role`, (err, roleData) => {
        db.query(`SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee WHERE manager_id is null`, (err, managerData) => {

            const addEmployeeQuestions = [
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the first name?",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the last name?",
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "What is the employee's role?",
                    choices: roleData
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Who is the employee's manager?",
                    choices: managerData
                }
            ];

            inquirer.prompt(addEmployeeQuestions)
            .then(response => {
                const parameters = [response.first_name, response.last_name, response.role_id, response.manager_id];
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, parameters);
            })
            .then(() => {
                viewEmployees();
            });

        });
    });
};

function updateEmployee() {

    db.query(`SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee`, (err, employeeData) => {
        db.query(`SELECT title AS name, id AS value FROM role`, (err, roleData) => {

            const updateEmployeeQuestions = [
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee's role would you like to update?",
                    choices: employeeData
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Which role do you want to assign to the selected employee?",
                    choices: roleData
                }
            ];

            inquirer.prompt(updateEmployeeQuestions)
            .then(response => {
                const parameters = [response.role_id, response.employee];
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, parameters, () => {
                    viewEmployees();
                });
            });
        });
    });
};