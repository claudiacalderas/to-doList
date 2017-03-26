
/* Weekend challenge #3
   TO DO Application */

	
CREATE TABLE "lists" (
	"list_id" SERIAL PRIMARY KEY,
	"list_name" VARCHAR(30) NOT NULL
);

CREATE TABLE "tasks" (
	"task_id" SERIAL PRIMARY KEY,
	"task_description" VARCHAR(30) NOT NULL,
	"priority" INT,
	"list_id" INT REFERENCES "lists",
	"done" BOOLEAN NOT NULL,
	"due_date" DATE,
	"notes" VARCHAR(200)
);

/* Sample Data */
INSERT INTO lists 
VALUES (1, 'Things to do today'),
(2, 'Things to do next week');

INSERT INTO tasks 
VALUES (1, 'Rise', 1, 1, true, '2017-03-25', ''), 
(2, 'Wash', 1, 1, true, '2017-03-25', ''),
(3, 'Breakfast', 1, 1, true, '2017-03-25', ''),  
(4, 'Work', 1, 1, false, '2017-03-25', 'Weekend Challenge #3'), 
(5, 'Read', 2, 1, false, '2017-03-25', 'Inner Engineering -Sadhguru'),
(6, 'Supper', 1, 1, false, '2017-03-25', ''),
(7, 'Clean', 3, 1, false, '2017-03-25', 'Do laundry, start spring cleaning'),
(8, 'Diversion or conversation', 1, 1, false, '2017-03-25', ''),
(9, 'Examination of the day', 1, 1, false, '2017-03-25', ''),
(10, 'Sleep', 1, 1, false, '2017-03-25', '');


