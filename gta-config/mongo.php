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

		try {
			$m = new MongoClient("localhost:27019");		
		} catch (Exception $e) {
			echo "Can't connect to mongo host";
			echo "<br>";
			//echo $e; 
		}
	

/*
	// select a database
	$db = $m->selectDB("gtdb"); // where testdb is already existing Database

	// select collection from database
	$collection = $db->selectCollection("gtdc");

	
	$value = array('success' => 0, 'iyear' => 1970);

	var_dump($value);

	$cursor = $collection->find($value);


	foreach ($cursor as $data) {
    	echo $data['region_txt'];
    	echo "<br>";
	}
*/

?>