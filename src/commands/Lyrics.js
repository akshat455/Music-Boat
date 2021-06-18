/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');
const { splitMessage } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

class Lyrics extends Command {
    get name() {
        return 'lyrics';
    }

    get usage() {
        return 'lyrics';
    }

    get description() {
        return 'lyrics of song';
    }

    async run(msg,args) {
        const embed = util.embed();
        const dispatcher = this.client.queue.get(msg.guild.id);

        let lyrics;
        let search;
        if (args[0]) {
            search = args.join(' ');
        }
        
        if (!args[0] && !dispatcher) {
            embed
                .setDescription('incorrect usage');
            return msg.channel.send(embed);
        }
        
        if (!args[0] && dispatcher.current) {
            search = dispatcher.current.info.title;

        }

        
        try {

            if (!msg.member.voice.channelID)
                return await msg.channel.send('Admiral, you are not in a voice channel to perform this');

            if (!dispatcher)
                return await msg.channel.send('Nothing is playing in this guild.');
            if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
                return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
            lyrics = await lyricsFinder(search, '');
            if (!lyrics) lyrics = `cannont find lyrics for \`${search}\``;
        } catch (err) {
            lyrics = `cannont find lyrics for \`${search}\``;
        }

        embed
            .setDescription(lyrics);

        if (embed.description != ` ok\`${search}\``) {
            embed.setTitle(search);
            if (dispatcher && !args[0]) embed.setURL(dispatcher.current.info.uri);
        }

        const splitDescription = splitMessage(lyrics, {
            maxLength: 2048,
            char: '\n',
            prepend: '',
            append: ''
        });

        splitDescription.forEach(async (m) => {
            embed.setDescription(m);
            msg.channel.send(embed);
        });

    }
}

module.exports = Lyrics;
