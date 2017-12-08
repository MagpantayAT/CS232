<?php

	$data = array(
				array("year" => 1970, "attacks" => 300)
			);
	
	
	for($y = 1970, $a = 102; $y < 2016; $y++, $a++){
		array_push($data, array("year" => $y, "attacks" => $a));
	}
	echo json_encode($data);
	
?>