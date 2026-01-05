const mongoose = require('mongoose');
const config = require("../../config.json");
const Levels = require("discord.js-leveling");
// const { Routes, DataResolver } = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    async execute(client){

        mongoose.set("strictQuery",false);
        await mongoose.connect(config.mongodb || '',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        if(mongoose.connect)
        {
            console.log('MongoDb connection successful');
        }

        Levels.setURL(config.mongodb);

        console.log(`${client.user.username} is now online.`);
        
    },
};