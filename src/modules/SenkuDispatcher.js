const util = require('../../util');
class SenkuDispatcher {
    constructor(options) {

        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.loop = false;
        this.queue = [];
        this.previous = null;
        this.current = null;
        this.textChannel = null;


        this.player.on('start', () =>
            this.text.send(`Now Playing: **${this.current.info.title} (${util.millisToDuration(this.current.info.length)})**`)
                .catch(() => null)
        );
        this.player.on('end', () => {

          
            this.play()
                .catch(error => {
                    this.previous = this.current;
                    this.current = null;
                    if (this.loop === 1) this.queue.unshift(this.previous);
                    else if (this.loop === 2) this.queue.push(this.previous);
                    this.queue.length = 0;
                    this.destroy();
                    this.client.logger.error(error);
                });
        });
        for (const playerEvent of ['closed', 'error', 'nodeDisconnect']) {
            this.player.on(playerEvent, data => {
                if (data instanceof Error || data instanceof Object) this.client.logger.error(data);
                this.previous = this.current;
                this.current = null;
                if (this.loop === 1) this.queue.unshift(this.previous);
                else if (this.loop === 2) this.queue.push(this.previous);
                this.loop = 0;
                this.queue = [];
                this.queue.length = 0;
                this.destroy();
            });
        }
    }


    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        await this.player.playTrack(this.current.track);
    }
    setTextCh(text) {
        this.textChannel = text;
    }



    destroy(reason) {
        this.client.logger.debug(this.constructor.name, `Destroyed the player dispatcher @ guild "${this.guild.id}"`);
        if (reason) this.client.logger.debug(this.constructor.name, reason);
        this.loop = 0;
        this.queue.length = 0;
        this.player.disconnect();
        this.client.logger.debug(this.player.constructor.name, `Destroyed the connection @ guild "${this.guild.id}"`);
        this.client.queue.delete(this.guild.id);
        this.text.send('Left the channel due to empty queue.').catch(() => null);
    }
}
module.exports = SenkuDispatcher;
