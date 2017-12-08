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
		out: "unsuccessful_attacks_target",
		//query : { success : 0 },
		sharded: true
	}
)



db.unsuccessful_attacks_target.mapReduce(
	function(){
		
		emit(this.value.year, this.value.success);
	},

	function(key, values){
		var s = 0;
		var u = 0;
		values.forEach(
				function(element){
					if(element == 0)
						s++;
					else
						u++;
				}
			);
		return { _id : key, value: { "s" : s, "u" : u};
	},

	{
		out: "unsuccessful_attacks_per_year",
		sharded: true
	}
)