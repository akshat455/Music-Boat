/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');
const config = require('../../config.json');
const prefix = config.prefix;

class Equalizer extends Command {
    get name() {
        return 'Equalizer';
    }

    get usage() {
        return 'Equalizer';
    }

    get description() {
        return 'custom Equalizer';
    }

    async run(msg,args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
  
        if (!args[0]) {
            const embed = util.embed()
                .setAuthor('Custom Equalizer')
                .setDescription('There are 14 bands that can be set from -10 to 10. Not all bands have to be filled out.')
                .addField('Example Equalizer:', `${config.prefix}eq 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n${prefix}eq 2 3 0 8 0 5 0 -5 0 0`);
            return msg.channel.send(embed);
        }
        else if (args[0] == 'off' || args[0] == 'reset') {
            dispatcher.player.setEqualizer(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
        }
    
        const bands = args.join(' ').split(/[ ]+/);
        let bandsStr = '';
        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            if (isNaN(bands[i])) return msg.channel.send(`Band #${i + 1} is not a valid number. Please type \`${prefix}eq\` for info on the equalizer command.`);
            if (bands[i] > 10) return msg.channel.send(`Band #${i + 1} must be less than 10. Please type \`${prefix}eq\` for info on the equalizer command.`);
        }
    
        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            dispatcher.player.setEqualizer([{ band: i, gain: bands[i] / 10 }]);
            bandsStr += `${bands[i]} `;
        }
    
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const embed = util.embed()
            .setDescription(`Custom Equalizer: \`${bandsStr}\``);
        await delay(5000);

        msg.channel.send(embed);
    }
}
module.exports = Equalizer;
