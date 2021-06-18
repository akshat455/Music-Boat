/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');
const config = require('../../config.json');

class Move extends Command {
    get name() {
        return 'move';
    }

    get usage() {
        return 'move';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg,args) {
        const from = args[0] ? parseInt(args[0], 10) : null;
        const to = args[1] ? parseInt(args[1], 10) : null;
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        if (from === null || to === null)
            return msg.channel.send(util.embed().setAuthor(` |  Please Check. Example Usage e.g. ${config.prefix}Move 2 1`, msg.author.displayAvatarURL({ dynamic : true })));

        if (from === to || (isNaN(from) || from < 1 || from > dispatcher.queue.length) || (isNaN(to) || to < 1 || to > dispatcher.queue.length))
            return msg.channel.send(util.embed().setAuthor(' |  Number Is Invalid Or Exceeds Queue Length.', msg.author.displayAvatarURL({ dynamic : true })));

        const moved = dispatcher.queue[from - 1];

        util.moveArrayElement(dispatcher.queue, from - 1, to - 1);

        msg.channel.send(`**${moved.info.title}** to \`${to}\``);
    }
}
module.exports = Move;
