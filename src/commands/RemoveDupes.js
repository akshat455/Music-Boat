/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');
const Discord = require('discord.js');

class Removedupes extends Command {
    get name() {
        return 'removedupes';
    }

    get usage() {
        return 'Removedupes';
    }

    get description() {
        return 'Removes All Dupes';
    }

    async run(msg) {
        var seen = new Discord.Collection();

        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        dispatcher.queue.forEach(song => {
            if(!seen.has(song.track)) seen.set(song.track, song);
        });
        
        dispatcher.queue = seen.array();
        msg.channel.send(util.embed().setDescription('Removed all **Dupes**'));
    }
}
module.exports = Removedupes;
