const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const coreDB = require('qaq-core-db');
const util = require('qaq-core-util');
const cors = require('cors');

const buzzer = require('./buzzer/buzzer.router');

const app = express();
const hostname = '0.0.0.0';
const port = 8012;

util.cachedUrl="52.74.209.117:80";


app.use(compression());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());


app.use("/",buzzer);


 app.listen(port, hostname, () => {
    util.getCache("clientModuleKeys",util.cachedUrl).then(data => {
		if(data!=''){
         var result = JSON.parse(data);
		 var moduleDtl = result['WHi6SRLY6#$82bzJf@4IUx9oHSLbn2qH']||'';
		 var poolNme = moduleDtl.pool||'TPOOL';
		 let poolList=[];
		 poolList.push(poolNme);
		 coreDB.initializePoolsList(poolList).then(poolsList => {
             coreDB.poolsList=poolsList;
               console.log(`transactionPools Created `);
                     console.log(`Server running at http://${hostname}:${port}/`);
            });
		}
		});
		});