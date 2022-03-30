const express = require('express')
const fileUpload = require('express-fileupload')
var cors = require('cors')
var morgan=require('morgan')
var bodyParser = require('body-parser')
const app = express()


/*******************************/
const redis = require('redis');
/*******************************/


app.use(express.static('files'));
app.use(fileUpload())
app.use(cors())

app.use(bodyParser.json({limit: "90mb"}));
app.use(bodyParser.urlencoded({limit: "90mb", extended: true, parameterLimit:50000}));

app.use(morgan("dev"));


//**********************************************/
const client = redis.createClient(6379,'127.0.0.1');

client.on('connect', function() {
  console.log('Connected!');
  
});

client.hmset('frameworks_hash', {
  'javascript': 'ReactJS',
  'css': 'TailwindCSS',
  'node': 'Express'
});

client.set('framework', 'Angular',function(error, result){
    if(error) throw error;
    console.log("result: ",result)
}); 

client.rpush(['frameworks_list', 'ReactJS', 'Angular'], function(error, result) {
    if(error) throw error;
    console.log("result: ",result);
});

//*****PubSub ********//

const subscriber = redis.createClient()

subscriber.on("message", (channel, message) => {
  console.log("El dato recibido fue : " + message+" desde el canal: "+channel)
})

subscriber.subscribe("canalPrueba")

//**********************************************



app.listen(3000,"0.0.0.0",() => console.log('Corriendo en el puerto 3000..'))