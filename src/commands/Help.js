/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');
const misc = require('../../misc.json');

class Help extends Command {
    get name() {
        return 'help';
    }

    get usage() {
        return 'help';
    }

    get description() {
        return 'help';
    }


    async run(msg) {

        const embed = util.embed()
            .setTitle('>  Music-Boat  Commands List')
            .setDescription(`My Prefix is ${misc.prefix}`)
            .addField('**❯ Music**:','`Play`,`Forward`, `Rewind`, `Lyrics`, `Pause`, `Queue`, `Replay`, `Search`, `Seek`, `Seek2`, `Skip`, `Skipto`, `Stop`, `Ping`, `Remove`, `Removedupes`, `Clear`,  `Volume`, `Shuffle`, `Nowplaying`, `Move`')
            .addField('**❯ Filters**:','`Bassboost`, `Rate`, `Pitch`, `Speed`, `Rotation`, `Nightcore`, `Vaporwave`,`ClearFilters`')
            .addField('**❯ Utility**','`help`,`invite`,`stats`')
        msg.channel.send(embed);
                
    }
}
module.exports = Help;
