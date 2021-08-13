INSERT INTO department (id, name)
VALUES 
(2001, "Legal"),
(2002, "Finance"),
(2003, "Benefits"),
(2004, "Executive"),
(2005, "Board");

INSERT INTO role (id, title, salary, department_id)
VALUES 
(1001, "General Counsel", 500000.00, 2001),
(1002, "Actuary", 100000.00, 2002),
(1003, "CHRO", 95000.00, 2003),
(1004, "CFO", 110000.00, 2004),
(1005, "Chairman", 1000000.00, 2005);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
(1000, "The", "Rock", 1001, NULL),
(2000, "Micky", "Mouse", 1002, 1000),
(3000, "The", "Superman", 1002, 1000),
(4000, "The", "Batman", 1004, 1000),
(5000, "The", "Hulk", 1003, 1000);








