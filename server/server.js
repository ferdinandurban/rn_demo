// Very simple websocket server: echo incoming message to all connected clients
var ws = require('nodejs-websocket');
const args = process.argv;
var PORT = 3005;

if(args.length > 2){
	PORT = args[2];
}

var Db = require('tingodb')().Db,
	assert = require('assert');

var db = new Db('./data', {});
var collection = db.collection("demo_collection");

console.log("Listenning on port " + PORT);
var server = ws.createServer(socketConnection).listen(PORT);

function socketConnection(conn) {
	console.log('New connection established.', new Date().toLocaleTimeString());

	conn.on('text', (str) => {
		console.log('[>>] ' + str);

		message = JSON.parse(str);
		
		switch(message.method){
			case 'getAllData':
				getAllData((err, resp) =>{
					if(err){
						handleError(resp, err.message, 'Getting data failed', 500);
					}
					
					console.log('[<<] ' + JSON.stringify(resp));
					conn.sendText(JSON.stringify(resp));
				});
				break;
			case 'insertData':
				insertData(message.data, (err, resp) => {
					if(err){
						handleError(resp, err.message, 'Inserting data failed', 500);
					}

					console.log('[<<] ' + JSON.stringify(resp));
					conn.sendText(JSON.stringify(resp));
				});
				break;
			default:
				console.log(str.method);
				break;

		}
		
		
	});
	
	conn.on('close', (code, reason) => {		
		console.log('Connection closed.', new Date().toLocaleTimeString());
	});
}

/**
 * Handle errors during WS communication
 * @param {*} res 
 * @param {*} reason 
 * @param {*} message 
 * @param {*} code 
 */
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
	console.log(res);
    res.status(code || 500).json({
        "error": message
    });
}

/**
 * getting all data from the DB
 * @param {*} cb - calback function with params (isError, JSON data)
 */
function getAllData(cb){
	collection
		.find({})
		.toArray((err, docs) => {
			if (err) {
				console.log(err);
				return cb(true, null);
			} else {
				return cb(false, docs);
			}
		});
}

/**
 * insert a data into database
 * @param {*} data 
 * @param {*} cb 
 */
function insertData(data, cb){
	collection.insert(data,
		(err, result) => {	
			return cb(err, result);
		});
}
