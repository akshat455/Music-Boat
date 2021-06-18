const { ShardingManager } = require('kurasuta');
const { Constants, Intents, Util } = require('discord.js');
const { join } = require('path');
const { token } = require('./config.json');
const mongoose = require('mongoose');
const { mongo } = require('../config.json');

const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = Intents.FLAGS;

const SenkuClient = require('./src/Senku.js');

const customClientOptions = {
    messageCacheMaxSize: 1,
    messageCacheLifetime: 1800,
    disableMentions: 'everyone',
    restRequestTimeout: 30000,
    intents: [ GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS ]
};

const sharderOptions = {
    clientOptions: Util.mergeDefault(Constants.DefaultOptions, customClientOptions),
    client: SenkuClient,
    timeout: 90000,
    token
};


mongoose.connect("mongodb+srv://Cluster0:Cluster0@cluster0.sx0dg.mongodb.net/data", {
    useUnifiedTopology : true,
    useNewUrlParser: true,
}).then(console.log('connected to mongo db'));

const sharder = new ShardingManager(join(__dirname, '/src/SenkuBaseCluster.js .js'), sharderOptions);

sharder.spawn();

