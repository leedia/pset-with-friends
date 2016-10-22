var MongoClient = require('mongodb').MongoClient;
 
var myCollection;
var db = MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err)
        console.log("Error: ", err);
    console.log("Connected to mongoDB!");
    userinfo = db.collection('test_collection');
    sessioninfo = db.collection('session_collection');

    //add user entry on registration
    userinfo.insert(
    	{
    		email: "testemail",
    		password: "testpassword",
    		usrname: "User1", 
    		rating: 10,
    		courses: []
    	}, function (err, result) {
      	if (err) {
        	console.log(err);
      	} else {
        	console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
    	}
    })

	//add session entry
	sessioninfo.insert(
    	{
    		course: "Math",
    		location: "Lamont",
    		availability: {
    			start_time: NULL,
    			end_time: NULL
    		},
    		members: [], //committed members only
    		rating: 10 //starts as rating of user who started sesh, then dynamically averages
    	}, function (err, result) {
      	if (err) {
        	console.log(err);
      	} else {
        	console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
    	}
    })

	//Update User based on Profile Registration
	var uemail = "testemail";
	var uname = "User";
	var ucourse = {
		cname: "Math",
    	groupsize: 4,
    	proficiency: 5,
    	suggested_sessions: [],
    	saved_sessions: [],
   		committed_sessions: []
	};
	userinfo.update({email: uemail}, 
		{$set: {
			name: uname}, {w:1}, function(err, result) {
				console.log("Updated: ", result);
			}});
	userinfo.find({email: uemail}).toArray(function (err, result) {
    	//console.log(result);
    	if (err) {
        	console.log(err);
    	} else if (result.length) {
        	console.log('Found: ', result[0]);
        	result[0].courses.push(ucourse);
        	result[0].usrname = uname;
        	console.log('Now: ', result[0]);
    	} else {
        	console.log('No document(s) found with defined "find" criteria!');
    	}
  	})


    //Automatic Updater for Users
    userinfo.find({rating: 10}).toArray(function (err, result) {
    	//console.log(result);
    	if (err) {
        	console.log(err);
    	} else if (result.length) {
        	console.log('Found: ', result[0]);
        	result[0].courses.saved_sessions.push(1);
        	console.log('Now: ', result[0])
    	} else {
        	console.log('No document(s) found with defined "find" criteria!');
    	}
  	})

  	//Automatic Updater for Sessions
  	sessioninfo.find({rating: 10}).toArray(function (err, result) {
    	//console.log(result);
    	if (err) {
        	console.log(err);
    	} else if (result.length) {
        	console.log('Found: ', result[0]);
        	console.log('Now: ', result[0])
    	} else {
        	console.log('No document(s) found with defined "find" criteria!');
    	}
  	})

  	//remove all user data
    //userinfo.remove({});

    db.close();
});