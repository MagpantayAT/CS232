/*
	****************************************************************************
		MapReduce for Global Terrorism Database
		by: Jay-Arr Buhain & Abraham Magpantay
	****************************************************************************
*/


/*
	**************************************** MapReduce for Hypothesis
		MapReduce 			: gets all successful attacks
		Output Collection	: successful_attacks_and_targets
	****************************************
*/ 
db.gtdc.mapReduce(
	function(){
		var value = {
			year : this.iyear,
			success : this.success,
			region_id : this.region,
			region_txt : this.region_txt,
			attack_type_id : this.attacktype1,
			attack_type_txt : this.attacktype1_txt,
			target_type_id : this.targtype1,
			target_type_txt : this.targtype1_txt
		};

		emit(this.eventid, value);
	},

	function(key, values){
		return { id : key, value : values };
	},

	{
		out: "successful_attacks_and_targets",
		query : { success : 1 },
		sharded :true
	}
)

/*
	**************************************** MapReduce for RQ1 ********************************
		MapReduce 			: counts the successful attacks per year
		Input Collection	: successful_attacks_and_targets
		Output Collection	: successful_attacks_per_year
	****************************************
*/

db.successful_attacks_and_targets.mapReduce(
	function(){
		emit(this.value.year, this.value.success);
	},

	function(key, values){
		return Array.sum(values);
	},

	{
		out: "successful_attacks_per_year",
		sharded: true
	}
)


/*
	**************************************** Aggregate Function for RQ1
		Input Collection	: successful_attacks_per_year
		Output				: Year with the most number of successful terrorist attacks
	****************************************
*/

db.successful_attacks_per_year.aggregate(
	{
		"$group":{ 
        	"_id": {year : "$_id"},
        	"mostAttack": { "$max": "$value" }
    	}
	},
	{
		"$sort" : { mostAttack : -1 }
	},
	{
		"$limit" : 1
	}
)


/*
	**************************************** MapReduce for RQ2 ********************************
		MapReduce 			: gets the most targeted by terrorist attacks
		Input Collection	: successful_attacks_and_targets
		Output Collection	: most_successful_attack_target
	****************************************
*/

db.successful_attacks_and_targets.mapReduce(
	function(){
		emit(this.value.target_type_txt, this.value.success);
	},

	function(key, values){
		return Array.sum(values);
	},

	{
		out: "most_successful_attack_target",
		sharded: true
	}
)

/*
	**************************************** Aggregate Function for RQ2
		Input Collection	: most_successful_attack_target
		Output				: Most target by terrorist attacks
	****************************************
*/

db.most_successful_attack_target.aggregate(
	{
		"$group":{ 
        	"_id": {terroristTarget : "$_id"},
        	"mostTarget": { "$max": "$value" }
    	}
	},
	{
		"$sort" : { mostTarget : -1 }
	},
	{
		"$limit" : 1
	}
)


/*
	**************************************** MapReduce for RQ3 ********************************
		MapReduce 			: gets the most attack type used by terrorist
		Input Collection	: successful_attacks_and_targets
		Output Collection	: most_successful_attack_type
	****************************************
*/

db.successful_attacks_and_targets.mapReduce(
	function(){
		emit(this.value.attack_type_txt, this.value.success);
	},

	function(key, values){
		return Array.sum(values);
	},

	{
		out: "most_successful_attack_type",
		sharded: true
	}
)

/*
	**************************************** Aggregate Function for RQ3
		Input Collection	: most_successful_attack_type
		Output				: The most attack type used
	****************************************
*/

db.most_successful_attack_type.aggregate(
	{
		"$group":{ 
        	"_id": {terroristAttackType : "$_id"},
        	"mostAttackTypeUsed": { "$max": "$value" }
    	}
	},
	{
		"$sort" : { mostAttackTypeUsed : -1 }
	},
	{
		"$limit" : 1
	}
)
