//import express from '/node_modules/express';
import { createConnection } from 'mysql2';
const connection=createConnection({
    host:'localhost',
    localAddress:'127.0.0.1',
    user:'root',
    port:3306,
    password:'rouTer',
    database:"hospitalrecords"
})
connection.connect((error) => {
    if (error) {
      console.error('Connection error:', error);
      return;
    } else {
      console.log("Connection successful");
    }
  });
  //const app=express();
  //app.get('/api/data', (req, res) => {
    //connection.query('SELECT * FROM your_table', (error, results) => {
      //if (error) {
        //console.error('Error querying database:', error);
        //res.status(500).send({ message: 'Error querying database' });
      //} else {
       // res.send(results);
     // }
   // });
  //});
  
  
//app.listen(3000, () => {
    //console.log("Server is running on port 3306");
//});

