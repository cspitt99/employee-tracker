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