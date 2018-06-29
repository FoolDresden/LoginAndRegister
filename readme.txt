Clone the project. 
Pre installed:
1. Node
2. Mongo

Run "mongod --dbpath ./" in a folder where you want it to store database data.
Run "node makeAdmin.js" to make an admin with Username: "admin" and Password:"password". Use only admin account to make courses
After setting up mongod, run the project through "node server.js"
Goto localhost:3000
Automatic redirect is yet to come. 
Endpoints:
localhost:3000/
localhost:3000/login
localhost:3000/register
localhost:3000/courses
localhost:3000/coursecart
localhost:3000/addcourse
There are no error messages for wrong input. To be added.

