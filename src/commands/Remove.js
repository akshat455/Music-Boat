/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class Remove extends Command {
    get name() {
        return 'remove';
    }

    get usage() {
        return 'remove';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg,args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        if (!args[0]) return msg.channel.send(util.embed().setAuthor(' |  Please Type In A Number To Remove From The Queue',  msg.author.displayAvatarURL({ dynamic : true })));

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > dispatcher.queue.length)
            return msg.channel.send(util.embed().setAuthor(' |  Please Provide Correct Number To Remove The Song',  msg.author.displayAvatarURL({ dynamic : true })));
    
    
        const removed = dispatcher.queue.splice(--iToRemove, 1)[0];
        msg.channel.send(util.embed()
            .setDescription(`Removed From The Queue \n[${removed.info.title}](${removed.info.uri})`)
        );
    }
}
module.exports = Remove;
