const express = require('express');
      const cors = require('cors');
      const mysql = require('mysql');

      const equipments = require('./app/equipments');
      const categories = require('./app/categories');
      const locations = require('./app/locations');

      const app = express();
      app.use(express.json());
      app.use(express.static('public'))
      app.use(cors());

      const connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'user',
          password : 'password',
          database : 'office',
          multipleStatements: true
      });

      const port = 8000;

      app.use('/equipments', equipments(connection));
      app.use('/categories', categories(connection));
      app.use('/locations', locations(connection));

      connection.connect((err) => {
          if (err) {
              console.error('error connecting: ' + err.stack);
              return;
          }

          console.log('connected as id ' + connection.threadId);
          app.listen(port, () => {
              console.log('Server started on  port')
          });
      });
