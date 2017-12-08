------------- rs0
->	create replica sets named rs0 of 3 members as shards

cd C:\mongodb\bin\
mongod --port 37011 --dbpath F:/mongodb/rs0/rs0-0 --replSet rs0 --shardsvr
cd C:\mongodb\bin\
mongod --port 37012 --dbpath F:/mongodb/rs0/rs0-1 --replSet rs0 --shardsvr
cd C:\mongodb\bin\
mongod --port 37013 --dbpath F:/mongodb/rs0/rs0-2 --replSet rs0 --shardsvr

->	login to one mongod instance then initiate them

cd C:\mongodb\bin\
mongo --port 37011
rs.initiate(
  {
    _id: "rs0",
    members: [
      { _id : 0, host : "localhost:37011" },
      { _id : 1, host : "localhost:37012" },
      { _id : 2, host : "localhost:37013" }
    ]
  }
)

------------- rs1
->  create replica sets rs1 as shardsvr with 3 members
cd C:\mongodb\bin\
mongod --port 47011 --dbpath F:/mongodb/rs1/rs1-0 --replSet rs1 --shardsvr
cd C:\mongodb\bin\
mongod --port 47012 --dbpath F:/mongodb/rs1/rs1-1 --replSet rs1 --shardsvr
cd C:\mongodb\bin\
mongod --port 47013 --dbpath F:/mongodb/rs1/rs1-2 --replSet rs1 --shardsvr

->  login to one mongod instance of rs1 then initiate them

cd C:\mongodb\bin\
mongo --port 47011

rs.initiate(
  {
    _id: "rs1",
    members: [
      { _id : 0, host : "localhost:47011" },
      { _id : 1, host : "localhost:47012" },
      { _id : 2, host : "localhost:47013" }
    ]
  }
)


------------- configReplSet
->	deploy config server replica sets
cd C:\mongodb\bin\
mongod --configsvr --replSet configReplSet --port 27011 --dbpath F:/mongodb/configReplSet/cfg0
cd C:\mongodb\bin\
mongod --configsvr --replSet configReplSet --port 27012 --dbpath F:/mongodb/configReplSet/cfg1
cd C:\mongodb\bin\
mongod --configsvr --replSet configReplSet --port 27013 --dbpath F:/mongodb/configReplSet/cfg2

->	login to one confgsvr instance then initiate them as confgsvr
cd C:\mongodb\bin\
mongo --port 27011

rs.initiate(
  {
    _id: "configReplSet",
    configsvr: true,
    members: [
      { _id : 0, host : "localhost:27011" },
      { _id : 1, host : "localhost:27012" },
      { _id : 2, host : "localhost:27013" }
    ]
  }
)

->	connect to mongos with mongos --configdb for confgsvr replset

cd C:\mongodb\bin\
mongos --configdb configReplSet/localhost:27011,localhost:27012,localhost:27013 --port 27019

->	wait then look for the port in netstat or define it using --port
->	login to mongos

cd C:\mongodb\bin\
mongo --port 27019

-> once logged in, add rs0 as your 1st shard and rs1 as your 2nd shard

sh.addShard("rs0/localhost:37011")
sh.addShard("rs0/localhost:37012")
sh.addShard("rs0/localhost:37013")

sh.addShard("rs1/localhost:47011")
sh.addShard("rs1/localhost:47012")
sh.addShard("rs1/localhost:47013")

-> create the database and the collection
use gtdb
db.createCollection("gtdc")

->	enable sharding on your database

show dbs
use gtdb
sh.enableSharding("gtdb")

->  create an index for your collection and enable sharding

db.gtbc.createIndex( { eventid : 1 } )
sh.shardCollection("gtdb.gtdc", { "eventid" : 1 } )

->  check balancer if running, if not run it and start

sh.isBalancerRunning()
sh.setBalancerState(true)
sh.startBalancer()

->  confirm sharding and balancing

use gtdb
db.stats()
db.printShardingStatus()

->  once done setting up, import the data in mongos

cd C:\mongodb\bin\
mongoimport --port 27019 --db gtdb --collection gtdc --file gtd.csv --type csv --headerline

#################################  DONE ########################################
https://www.youtube.com/watch?v=8kZIS5vUq7I


https://docs.mongodb.com/manual/tutorial/convert-replica-set-to-replicated-shard-cluster/#convert-add-initial-shard
https://docs.mongodb.com/manual/tutorial/deploy-shard-cluster/


db.gtdc.ensureIndex({eventid : 1})
use gtdb
db.gtdc.drop()
db.dropDatabase()

rs.slaveOk() -> allows you to query on secondary

->  deleting a mapreduce collection
db.getCollection("successful attacks").drop()

configReplSet --rs for configsvr
	config0	-- configsvr rs member 1 port 27011
	config1
	config2

rs0	--rs for 1st shard
	rs0-0	-- rs member 1 port 37011
	rs0-1
	rs0-2

rs1 --rs for 2nd shard
	rs1-0	-- rs member 1 port 47011
	rs1-1
	rs1-2



#################################  Backing up mongodb and restore ########################################

mongodump --out [path] --collection [collection_name] --db [database_name] --port [port_no]

mongorestore --port [port_number] [path to the backup]


#################################  Map Reduce gets year and successful attacks ###########################

db.gtdc.mapReduce(
	function(){
		emit(this.iyear, this.success);
	},

	function(key, values){
		return Array.sum(values);
	},

	{
		out: "successful_attacks",
		sharded: true
	}
)

db.gtdc.find({iyear:2016, success:1}).count()

#################################  Map Reduce gets year and successful attacks and targets ###########################

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
		out: "successful_attacks_target",
		query : { success : 1 },
		sharded: true
	}
)

db.successful_attacks_target.find({ "value.year" : 1970}).count()

db.successful_attacks_target.mapReduce(
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

db.successful_attacks_target.mapReduce(
	function(){
		var id = {
			region_id : this.value.region_id,
			region_txt : this.value.region_txt
		};
		
		emit( id, this.value.success);
	},

	function(key, values){
		return Array.sum(values);
	},

	{
		out: "successful_attacks_per_region",
		sharded: true
	}
)

db.successful_attacks_target.distinct("value.region_txt")

#################################  query array of arrays ###########################
db.successful_attacks_target.find({ "value.year" : 1970 }).count()

db.successful_attacks_target.find({ "value" : { year : 1970, "success" : 0,
		"attack_type" : "Assassination",
		"target" : "Private Citizens & Property"} })

db.gtdc.find({ iyear : 1970, success : 0, attacktype1_txt : "Assassination", targtype1_txt : "Private Citizens & Property"}, {_id : 0, iyear : 1})

db.gtdc.find({ iyear : 1970}).count()


https://www.google.com.ph/search?q=create+line+graph+php&rlz=1C1GGRV_enPH774&oq=create+line+graph+php&aqs=chrome..69i57.8057j0j1&sourceid=chrome&ie=UTF-8#kpvalbx=1

https://pecl.php.net/package/mongo?jmp=docs

https://www.tutorialspoint.com/mongodb/mongodb_php.htm