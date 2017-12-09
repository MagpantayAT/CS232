# CS232
Project for CS232 (Jay-Arr Buhain and Abraham Magpantay)

# A. Preparation for MongoDB setup
1. Download MongoDB installer at MongoDB Download Center https://www.mongodb.com/download-center#community
2. Install MongoDB in your machine
3. When installation is finished, we can now start setting up our database environment
4. Create the following folder in your C drive of any partition that you want to use. You can dwonload the
mongodb.zip file so that you won't need to create these folders. Under Local Disk (C:) we create three
subfolders namely: configReplSet, rs0 and rs1. Under configReplSet we create another subfolder with the
name cfg0, cfg1 and cfg2. Go to rs0 then create another subfolder namely rs0-0, rs0-1 and rs0-2. Lastly,
go to rs1 and create another subfolder namely rs1-0, rs1-1 and rs1-2. These folders will be used for our
environment setup.

Local Disk (C:)
  - mongodb
    - configReplSet
      - cfg0
      - cfg1
      - cfg2
  - rs0
    - rs0-0
    - rs0-1
    - rs0-2
  - rs1
    - rs1-0
    - rs1-1
    - rs1-2

# B. Setting up Replica Set (rs0)
1. Open your cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located on C:\Program Files\MongoDB\Server\3.4\bin

2. Once you are in the path of the bin folder, issue the command below:
   -  mongod --port 37011 --dbpath C:/mongodb/rs0/rs0-0 --replSet rs0 --shardsvr
   
3. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 37012 --dbpath F:/mongodb/rs0/rs0-1 --replSet rs0 --shardsvr
   
4. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 37013 --dbpath F:/mongodb/rs0/rs0-2 --replSet rs0 --shardsvr
   
5. In this step, you must have three MongoDB instance running in three different ports (37011, 37012 and 37103). Now we need to login to one of the MongoDB instance that we have created, to do this repeat step 1 then issue the command below. In our case we will login to the MongoDB instance at port 37011.
   -  mongo --port 37011

6. Once you are logged in in one of the MongoDB instance, isse the command below this will initiate the three MongoDB instance to be a Replica Sets with an id of rs0. This Replica set will be used as a Shard later on.
   -  rs.initiate({
        _id: "rs0",
        members: [
            { _id : 0, host : "localhost:37011" },
            { _id : 1, host : "localhost:37012" },
            { _id : 2, host : "localhost:37013" }
          ]
        })

# C. Setting up Replica Set (rs1)
1. Open your cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located on C:\Program Files\MongoDB\Server\3.4\bin

2. Once you are in the path of the bin folder, issue the command below:
   -  mongod --port 47011 --dbpath C:/mongodb/rs1/rs1-0 --replSet rs0 --shardsvr
   
3. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 47012 --dbpath F:/mongodb/rs1/rs1-1 --replSet rs0 --shardsvr
   
4. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 47013 --dbpath F:/mongodb/rs1/rs1-2 --replSet rs0 --shardsvr
   
5. In this step, you must have three MongoDB instance running in three different ports (47011, 47012 and 47103). Now we need to login to one of the MongoDB instance that we have created, to do this repeat step 1 then issue the command below. In our case we will login to the MongoDB instance at port 47011.
   -  mongo --port 47011

6. Once you are logged in in one of the MongoDB instance, isse the command below this will initiate the three MongoDB instance to be a Replica Sets with an id of rs1. This Replica set will be used as a Shard later on.
   -  rs.initiate({
        _id: "rs1",
        members: [
            { _id : 0, host : "localhost:47011" },
            { _id : 1, host : "localhost:47012" },
            { _id : 2, host : "localhost:47013" }
          ]
        })
        
# D. Setting up Replica Set (configReplSet)
1. Open your cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located at on C:\Program Files\MongoDB\Server\3.4\bin

2. Once you are in the path of the bin folder, issue the command below:
   -  mongod --configsvr --replSet configReplSet --port 27011 --dbpath F:/mongodb/configReplSet/cfg0
   
3. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --configsvr --replSet configReplSet --port 27012 --dbpath F:/mongodb/configReplSet/cfg1
   
4. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --configsvr --replSet configReplSet --port 27013 --dbpath F:/mongodb/configReplSet/cfg2
   
5. In this step, you must have three MongoDB instance running in three different ports (27011, 27012 and 27013). Now we need to login to one of the MongoDB instance that we have created, to do this repeat step 1 then issue the command below. In our case we will login to the MongoDB instance at port 27011.
   -  mongo --port 27011

6. Once you are logged in in one of the MongoDB instance, isse the command below this will initiate the three MongoDB instance to be a Replica Sets with an id of configReplSet. This Replica set will be used as a our Config server later on.
   -  rs.initiate({
        _id: "configReplSet",
        configsvr: true,
            { _id : 0, host : "localhost:27011" },
            { _id : 1, host : "localhost:27012" },
            { _id : 2, host : "localhost:27013" }
          ]
        })

# E. Setting up Mongos and enabling Shard
1.  By this time, we already have running nine MongoDB instances in our machine with this we must have at least nine cmd running. Open another cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located on C:\Program Files\MongoDB\Server\3.4\bin

2.  To settup the routing service of MongoDB issue the command below. This will allow us to use our configReplSet Replica Set as our Config Server that will hold our two Replica Set Shards rs0 and rs1:
    - mongos --configdb configReplSet/localhost:27011,localhost:27012,localhost:27013 --port 27019

3.  Onced issued, routing service will be running now. With this open another cmd and repeat step 1. We will now login to mongos using the command below:
    - mongo --port 27019

4.  You will be in the mongos prompt. Here we will add the rs0 and rs1 as Shard server. Run the command below:
    
    Adding rs0 and its MongoDB instances as Shards
    - sh.addShard("rs0/localhost:37011")
    - sh.addShard("rs0/localhost:37012")
    - sh.addShard("rs0/localhost:37013")
    
    Adding rs1 and its MongoDB instances as Shards
    - sh.addShard("rs1/localhost:47011")
    - sh.addShard("rs1/localhost:47012")
    - sh.addShard("rs1/localhost:47013")
    
5.  Now we have two Shard server, rs0 and rs1. We will now create our database and enable sharding on it. To do this run the follwing commands:

    5.1 Create a database named gtdb.
    - use gtdb
    
    5.2 Create collection under gtdb with name gtdc.
    - db.createCollection("gtdc")
    
    5.3 Enable Sharding on gtdb database.
    - sh.enableSharding("gtdb")
    
    5.4 Since our collection is still empty, we need to create index for it that will be used as the basis for Sharding.
    - db.gtbc.createIndex( { eventid : 1 } )
    
    5.6 We will enable Sharding on our collection tieh eventid as our Shard Key.
    - sh.shardCollection("gtdb.gtdc", { "eventid" : 1 } )

6.  We now have enabled Sharding on our database and the collection. To ensure balancing to our Shards, you can issue the following commad:
    To check balancer is running
    - sh.isBalancerRunning()
    Enable balancer state and start the balancer
    - sh.setBalancerState(true)
    - sh.startBalancer()
    
# F. Loading our datasets
1.  You can download the dataset on global terrorism attack here:  https://www.kaggle.com/START-UMD/gtd

2.  The file is in .csv format, you need to convert it to json using: http://www.csvjson.com/csv2json

3.  Copy your .json dataset to the bin folder of the MongoDB, in our case we name our dataset json as gtd.json by default MongoDB bin folder can be located on C:\Program Files\MongoDB\Server\3.4\bin

4.  Open cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located on C:\Program Files\MongoDB\Server\3.4\bin then issue the import command below:
    - mongoimport --port 27019 --db gtdb --collection gtdc --file gtd.json --type json --jsonArray

5.  Wait until the import to finish

# G. Running MapReduce
1.  To run our MapReduce functions, go back to your mongos prompt or login again using the step on E.3

2.  Open the MapReduce.js on this git and run the MapReduce functions. Follow the order by which the functions are arranged.

3.  To enable Sharding on the collection produced by the MapReduce Function, issue the command on E.5 at 5.6 

4.  You can download our MongoDB configured setup here: setup https://drive.google.com/open?id=1JOoO7vAZ724ukuhAtwTIwr_6kXGpOjl8
