
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
