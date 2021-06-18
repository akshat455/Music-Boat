const SenkuEvent = require('../abstract/SenkuEvent.js');


class GuildCreate extends SenkuEvent {
    get name() {
        return 'guildCreate';
    }

    get once() {
        return false;
    }

    async run(guild) {
        this.client.logger.log(this.constructor.name, `New guild => ${guild.name} with ${guild.memberCount} members`);
        await this.client.settings.createDefaults(guild.id);
    }
}
module.exports = GuildCreate;
