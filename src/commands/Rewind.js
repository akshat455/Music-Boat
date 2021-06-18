/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');
const rewindNum = 10;
class Rewind extends Command {
    get name() {
        return 'rewind';
    }

    get usage() {
        return 'rewind';
    }

    get description() {
        return 'rewinds';
    }

    async run(msg,args) {
        try {
            const dispatcher = this.client.queue.get(msg.guild.id);
            if (args[0] && !isNaN(args[0])) {
                if (dispatcher.player.position - args[0] * 1000 < dispatcher.current.info.length) {
                    dispatcher.player.seekTo(dispatcher.player.position - args[0] * 1000);
                    return msg.channel.send(`Rewinded to ${util.millisToDuration(dispatcher.player.position)}`);
                }
                else { return msg.channel.send('Cannot forward beyond the song\'s duration.'); }
            }
            else if (args[0] && isNaN(args[0])) { return msg.reply('Invalid argument, must be a number.\nCorrect Usage: forward <seconds>'); }
    
            if (!args[0]) {
                if (dispatcher.player.position - rewindNum * 1000 < dispatcher.current.info.length) {
                    dispatcher.player.seekTo(dispatcher.player.position - rewindNum * 1000);
                    return msg.channel.send(`Rewinded to ${util.millisToDuration(dispatcher.player.position)}`);
                }
                else {
                    return msg.channel.send('Cannot forward beyond the song\'s duration.');
                }
            }
        } catch (e) {
            return console.log(e);
        }
    }
}
module.exports = Rewind;
