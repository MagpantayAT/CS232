map = function(){
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
	}

reduce = function(key, values){
		return { id : key, value : values };
	}

db.gtdc.mapReduce(map, reduce, {
		out: "successful_attacks_and_targets",
		query : { success : 1 },
		sharded: true
	})

results = db.runCommand({
	mapReduce: 'gtdc',
	map: map,
	reduce: reduce,
	out: {
		replace: "successful_attacks_and_targets",
		query : { success : 1 },		
		sharded: true
	}
});

########################################################################################### RQ1

//gets all successful attacks
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


//counts the attacks per year
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


// gets the highest attacks
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


########################################################################################### RQ2



// gets the most targeted by terrorist attacks
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

// gets the highest targeted by terrorist attacks
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


########################################################################################### RQ3

// gets the most targeted by terrorist attacks
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

// gets the highest targeted by terrorist attacks
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
