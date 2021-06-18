const Command = require('../abstract/Command.js');
const util = require('../../util');
class Ping extends Command {
    get name() {
        return 'ping';
    }

    get usage() {
        return 'ping';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg) {
        let embed = util.embed()
            .setAuthor('🏓 Pinging')
            .addField('API Latency', '❔')
            .addField('Roundtrip', '❔')
            .addField('Websocket', '❔');
        const g = await msg.channel.send(embed);

        embed = util.embed()
            .setAuthor('🏓 Pong!')
            .addField('API Latency', `${util.getEmoji(g.createdTimestamp - msg.createdTimestamp)} ${g.createdTimestamp - msg.createdTimestamp}ms`)
            .addField('Roundtrip', `${util.getEmoji(new Date() - msg.createdTimestamp)} ${new Date() - msg.createdTimestamp}ms`)
            .addField('Websocket', `${util.getEmoji(msg.guild.shard.ping)} ${msg.guild.shard.ping}ms`);
        g.edit(embed);
    }
}
module.exports = Ping;
