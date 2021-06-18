/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');

class Nowplaying extends Command {
    get name() {
        return 'nowplaying';
    }

    get usage() {
        return 'Nowplaying';
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
        const progress = util.progress(dispatcher.player.position, dispatcher.current.info.length);
        const thumbnail = `https://img.youtube.com/vi/${dispatcher.current.info.identifier}/hqdefault.jpg`;

        msg.channel.send(util.embed()
            .setAuthor(' |   Now Playing', msg.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(thumbnail)
            .setDescription(` ${dispatcher.current.info.isStream ? '[**◉ LIVE**]' : ''}\n**${dispatcher.current.info.title}**${dispatcher.current.info.isStream ? '' : `\n ${util.millisToDuration(dispatcher.player.position)} ${progress.bar} ${util.millisToDuration(dispatcher.current.info.length)}`}`));

    }
}
module.exports = Nowplaying;
