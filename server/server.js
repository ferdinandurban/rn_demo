/**
 * Very simple NodeJS WebSockets server that handle a simple API for inserting and getting data from mem cache (tingodb)
 */

var ws = require('nodejs-websocket');
const args = process.argv;
var PORT = 3005;

if(args.length > 2){
	PORT = args[2];
}

var Db = require('tingodb')().Db,
	assert = require('assert');

var db = new Db('./', {});
var collection = db.collection("demo_collection");

console.log("Listenning on port " + PORT);
var server = ws.createServer(socketConnection).listen(PORT);

/**
 * Handle socket connection
 * @param {*} conn 
 */
function socketConnection(conn) {
	console.log('New connection established.', new Date().toLocaleTimeString());

	conn.on('text', (str) => {
		console.log('[>>] ' + str);

		message = JSON.parse(str);
		
		switch(message.method){
			case 'deleteAllData':
				deleteAllData((err, resp) => {
					if(err){
						handleError(resp, err.message, 'Getting data failed', 500);
					}

					
					var msg = {
						"type": "response",
						"method": "deleteAllData",
						"data": resp
					}
					console.log(msg);

					conn.sendText(JSON.stringify(msg));

					// create a new collection for the future
					createCollection('demo_collection', (err, coll) => {
						console.log(err);
						console.log(coll);
					});
				});
				break;

			case 'getAllData':
				getAllData((err, resp) => {
					if(err){
						handleError(resp, err.message, 'Getting data failed', 500);
					}
					
					var msg = {
						"type": "response",
						"method": "getAllData",
						"data": resp
					}
					console.log(msg);
					conn.sendText(JSON.stringify(msg));
				});
				break;

			case 'insertData':
				insertData(message.data, (err, resp) => {
					if(err){
						handleError(resp, err.message, 'Inserting data failed', 500);
					}
					var msg = {
						"type": "response",
						"method": "insertData",
						"data": resp
					}
					console.log(msg);
					conn.sendText(JSON.stringify(msg));
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
 * Creates a new collection
 * @param {*} name 
 * @param {*} cb 
 */
function createCollection(name, cb) {
	console.log('Creating a new collection');
	db.createCollection(name,(err, coll) => {
		if(err){
			return (err, null);
		}

		collection = coll;
		console.log('Collection created');

		return (null, coll);
	});
}

/**
 * Drop the collection
 * @return 	true when successfully drops the collection, 
 * 			false if the collection does not exists
 */
function deleteAllData(cb) {
	// drop the collection
	db.dropCollection('demo_collection', cb);
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
