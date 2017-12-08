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

	$c = $m->selectDB("gtdb")->selectCollection("successful_attacks_per_year");
	$year = array(
	      array(
	          '$group' => array("_id" => array("year" => '$_id'),
	                            "mostAttack" => array('$max' => '$value')
	                      )
	        ),
	      array(
	          '$sort' => array("_id" => 1)
	        )
	  );

	$results = $c->aggregate($year);

	$db = $m->selectDB("gtdb");
	$col = $db->selectCollection("gtdc");

	//var_dump($results);
	$years_attacks = array();
	foreach ($results as $key => $val) {
		for ($i=0; $i < count($val) ; $i++) {

			$year_of_attack = $val[$i]["_id"];
            $attacks = $val[$i]["mostAttack"];

            if($year_of_attack["year"] == null)
				break;

            //echo $year_of_attack["year"] . " ".$attacks."<br>";
            $un = $col->find(array("iyear" => $year_of_attack["year"], "success" => 0));
			array_push($years_attacks, array("year" => $year_of_attack["year"], "s_attacks" => $attacks, "u_attacks" => $un->count()));
		}
	}

	echo json_encode($years_attacks);


/*
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
*/

?>