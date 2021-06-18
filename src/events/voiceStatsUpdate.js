/* eslint-disable linebreak-style */
const SenkuEvent = require('../abstract/SenkuEvent.js');
const util = require('../../util');
module.exports = {
    'voiceLeave': '60000',
};
class VoiceStateUpdate extends SenkuEvent {
    get name() {
        return 'VoiceStateUpdate';
    }

    get once() {
        return true;
    }

    async run(oldVoice, newVoice) {

        const player = this.client.queue.get(oldVoice.guild.id);

        if (!player) return;
        if (!newVoice.guild.members.cache.get(this.client.user.id).voice.channelID) player.destroy();
        if (oldVoice.id === this.client.user.id) return;
        if (!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelID) return;
        if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelID) {
            if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
                const vcName = oldVoice.guild.me.voice.channel.name;
                const embed = util.embed()
                    .setDescription(`Leaving **${vcName}** in ${this.voiceLeave / 1000} seconds because I was left alone.`);
                const msg = await player.textChannel.send(embed);
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(this.voiceLeave); 

                const vcMembers = oldVoice.guild.voice.channel.members.size;
                if (!vcMembers || vcMembers === 1) {
                    const newPlayer = this.client.queue.get(newVoice.guild.id);
                    if (newPlayer) {
                        player.destroy();
                    }
                    else { oldVoice.guild.voice.channel.disconnect(); }

                    const embed2 = util.embed()
                        .setDescription(`I left ch**${vcName}** because I was left alone.`);
                    return msg.edit(embed2, '');
                }
                else { return msg.delete(); }
            }
        }
        console.log("loaded voice")


    }
}
module.exports = VoiceStateUpdate;
