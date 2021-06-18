/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');

class Queue extends Command {
    get name() {
        return 'queue';
    }

    get usage() {
        return 'queue';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        const queue = dispatcher.queue.map((t, i) => `${++i}. ${t.info.title} [${util.millisToDuration(t.info.length)}]`);
        const chunked = util.chunk(queue, 10).map(x => x.join('\n'));

        try {   
            const queueMsg = await msg.channel.send(`\n    ⬐ current track \n0. ${dispatcher.current.info.isStream ? '[LIVE]' : ''}${dispatcher.current.info.title} [${util.millisToDuration(dispatcher.current.info.length - dispatcher.player.position)} Left]\n    ⬑ current track\n${chunked == '' ? ' This is the end of the queue!' : '' + chunked[0]}`, { code: 'nim' });
            if (chunked.length > 1) await util.pagination(queueMsg, msg.author, chunked);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
            console.log(`${e}`);
        }
    }
}
module.exports = Queue;
