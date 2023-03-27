const redis=require("redis");

const client=redis.createClient({url:"redis://default:iFCgcYowyYu9UH4TGDeBOwymYvzl8wNZ@redis-18107.c305.ap-south-1-1.ec2.cloud.redislabs.com:18107"});

client.on("error",err=>{console.log("redis error",err.message)});

client.connect();

module.exports={
    client
}