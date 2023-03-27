const winston=require("winston");

const logger=winston.createLogger({
    transports:[
        new winston.transports.File({
            filename:"logger.log",
            level:"info",
            format:winston.format.combine(winston.format.timestamp(),winston.format.json())
        }),
        new winston.transports.Console({
            level:"info",
            json:true
        })
    ]
})

module.exports={
    logger
}