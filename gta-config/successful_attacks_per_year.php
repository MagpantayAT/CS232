<?php
	
	/*
		connecting mongo to php
		https://stackoverflow.com/questions/32134416/adding-mongodb-extension-for-php-5-6-xampp
		
		find
		http://php.net/manual/en/mongocollection.find.php
	*/
	
	// connect to mongodb
	//echo extension_loaded("mongo") ? "loaded\n" : "not loaded\n";
	//$m = new MongoClient("mongodb://127.0.0.1:27017");
	
	include 'mongo.php';

	// select a database
	$db = $m->selectDB("gtdb"); // where testdb is already existing Database

	// select collection from database
	$collection = $db->selectCollection("successful_attacks_per_year");
	$cursor = $collection->find();
	$year_attacks = array();


	$c = $db->selectCollection("gtdc");


	foreach ($cursor as $data) {
		//unsunccessful
		$un = $c->find(array("iyear" => $data['_id'], "success" => 0));
		//echo $data['_id'] . " " . $un->count();
    	//echo "<br>";

		array_push($year_attacks, array("year" => $data['_id'], "s_attacks" => $data['value'], "u_attacks" => $un->count()));
    	//echo $data['_id'];

	}

	echo json_encode($year_attacks);


?>