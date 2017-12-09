# CS232
Project for CS232 (Jay-Arr Buhain and Abraham Magpantay)

# PREPARATION FOR MONGODB SETUP
1. Download MongoDB installer at MongoDB Download Center https://www.mongodb.com/download-center#community
2. Install MongoDB in your machine
3. When installation is finished, we can now start setting up our database environment
4. Create the following folder in your C drive of any partition that you want to use. You can dwonload the
mongodb.zip file so that you won't need to create these folders. Under Local Disk (C:) we create three
subfolders namely: configReplSet, rs0 and rs1. Under configReplSet we create another subfolder with the
name cfg0, cfg1 and cfg2. Go to rs0 then create another subfolder namely rs0-0, rs0-1 and rs0-2. Lastly,
go to rs1 and create another subfolder namely rs1-0, rs1-1 and rs1-2. These folders will be used for our
environment setup

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


# SETTING UP REPLICA SETS IN MONGODB (rs0)
1. Open your cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located at on C:\Program Files\MongoDB\Server\3.4\bin

2. Once you are in the path of the bin folder, issue the command below:
   -  mongod --port 37011 --dbpath C:/mongodb/rs0/rs0-0 --replSet rs0 --shardsvr
   
3. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 37012 --dbpath F:/mongodb/rs0/rs0-1 --replSet rs0 --shardsvr
   
4. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 37013 --dbpath F:/mongodb/rs0/rs0-2 --replSet rs0 --shardsvr
   
5. In this step, you must have three MongoDB instance running in three different ports (37011, 37012 and 37103). Now we need to login to one of the MongoDB instance that we have created, to do this repeat step 1 then issue the command below. In our case we will login to the MongoDB instance at port 37011.
   -  mongo --port 37011

6. Once you are logged in in one of the MongoDB instance, isse the command below this will initiate the three MongoDB instance to be a Replica Sets with an id of rs0.
   -  rs.initiate({
        _id: "rs0",
        members: [
            { _id : 0, host : "localhost:37011" },
            { _id : 1, host : "localhost:37012" },
            { _id : 2, host : "localhost:37013" }
          ]
        })

# SETTING UP REPLICA SETS IN MONGODB (rs1)
1. Open your cmd then go to the bin folder of the MongoDB. By default, MongoDB bin folder can be located at on C:\Program Files\MongoDB\Server\3.4\bin

2. Once you are in the path of the bin folder, issue the command below:
   -  mongod --port 47011 --dbpath C:/mongodb/rs1/rs1-0 --replSet rs0 --shardsvr
   
3. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 47012 --dbpath F:/mongodb/rs1/rs1-1 --replSet rs0 --shardsvr
   
4. Repeat step 1 then issue the the command below, do not close the current cmd run another cmd instance:
   -  mongod --port 47013 --dbpath F:/mongodb/rs1/rs1-2 --replSet rs0 --shardsvr
   
5. In this step, you must have three MongoDB instance running in three different ports (47011, 47012 and 47103). Now we need to login to one of the MongoDB instance that we have created, to do this repeat step 1 then issue the command below. In our case we will login to the MongoDB instance at port 47011.
   -  mongo --port 47011

6. Once you are logged in in one of the MongoDB instance, isse the command below this will initiate the three MongoDB instance to be a Replica Sets with an id of rs0.
   -  rs.initiate({
        _id: "rs1",
        members: [
            { _id : 0, host : "localhost:47011" },
            { _id : 1, host : "localhost:47012" },
            { _id : 2, host : "localhost:47013" }
          ]
        })





You can download the data set on global terrorism attack here:  https://www.kaggle.com/START-UMD/gtd

Our MongoDB configured setup can be downloaded here: setup https://drive.google.com/open?id=1JOoO7vAZ724ukuhAtwTIwr_6kXGpOjl8
