const SenkuEvent = require('../abstract/SenkuEvent.js');


class Ready extends SenkuEvent {
    get name() {
        return 'ready';
    }

    get once() {
        return true;
    }

    async run() {
        this.client.logger.debug(`${this.client.user.username}`, `Ready! Serving ${this.client.guilds.cache.size} guild(s) with ${this.client.users.cache.size} user(s)`);
        if (!this.interval) {
            await this.client.user.setActivity(`-help`);
            const statuses =  [
                `-help | ${this.client.guilds.cache.size} guilds`,
                
            ];
            this.interval = setInterval(() => {
                const current = statuses.shift();
                this.client.user.setActivity(current);
                statuses.push(current);
            }, 300000);
        }
        if (this.client.spotify) await this.client.spotify.requestToken();


        console.log('ready done')
    }
}
module.exports = Ready;
