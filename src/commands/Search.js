/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');

class Search extends Command {
    get name() {
        return 'search';
    }

    get usage() {
        return 'search [search/link]';
    }

    get description() {
        return 'Automatically fetches the video(s) and joins the channel.';
    }

    _checkURL(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    async run(msg, args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel');
        if (!args[0])
            return await msg.channel.send('Admiral, you did not specify a link or search mode');
        // const dispatcher = this.client.queue.get(msg.guild.id);
        const node = this.client.shoukaku.getNode();
        const query = args.join(' ');
        if (!query) return msg.channel.send(util.embed().setAuthor(' |  Please Type In Something To Search', msg.author.displayAvatarURL({ dynamic : true })));

        try {
            let { tracks } = await node.rest.resolve(query, 'youtube');
            if (!tracks.length) return msg.channel.send(util.embed().setAuthor(' |  Couldn\'t find any results.', msg.author.displayAvatarURL({ dynamic : true })));

            tracks = tracks.slice(0, 10);

            const resultMessage = await msg.channel.send(util.embed()
                .setAuthor('Search Result', msg.author.displayAvatarURL({ dynamic : true }))
                .setDescription(tracks.map((x, i) => `\`${++i}.\` [${x.info.title}](${x.info.uri})(${util.millisToDuration(x.info.length)})`))
                .setFooter('Select from 1 to 10 or type "cancel" to cancel the command.'));

            const collector = await awaitMessages();
            if (!collector) return resultMessage.edit(util.embed().setAuthor(' |  Time is up Better Luck Next Time!', msg.author.displayAvatarURL({ dynamic : true })));
            const response = collector.first();

            if (response.deletable) response.delete();

            if (/^cancel$/i.exec(response.content))
                return resultMessage.edit(util.embed().setAuthor(' |  Cancelled', msg.author.displayAvatarURL({ dynamic : true })));
            
            const track = tracks[response.content - 1];
            track.requester = msg.author;
            const res = await this.client.queue.handle(node, track, msg);
            resultMessage.delete();
            await msg.channel.send(`Added the track **${track.info.title}** in queue!`).catch(() => null);
            if (res) await res.play();

        } catch (e) {
            console.log(e);
        }

        async function awaitMessages() {
            try {
                const collector = await msg.channel.awaitMessages(
                    m => m.author.equals(msg.author) && (/^cancel$/i.exec(m.content) || !isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10)),
                    {
                        time: 10000,
                        max: 1,
                        errors: ['time']
                    }
                );
                return collector;
            } catch(e) {
                return console.log(e);
            }
        }
    }
}
module.exports = Search;
