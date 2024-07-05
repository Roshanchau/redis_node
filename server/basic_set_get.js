const Redis= require('ioredis');

const redisUdaharan=async()=>{
    // connect to Redis at 127.0.0.1 , port 6379
    const redisClient =new Redis({
        host:'127.0.0.1',
        port: 6379,
    });

    //  set key "myname" to have value "Roshan Chaudhary"
    await redisClient.set('myname', 'Roshan Chaudhary warrior');

    // get the value held at key "myname" and log it.
    const value= await redisClient.get('myname');
    console.log(value);


    // Disconnect from Redis
    redisClient.quit();
};

redisUdaharan();