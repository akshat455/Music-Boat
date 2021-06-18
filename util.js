/* eslint-disable linebreak-style */
const { MessageEmbed, Permissions } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
module.exports = class Util {
    static embed() {
        return new MessageEmbed()
            .setColor('#ffffff');
    }

    static durationToMillis(dur) {
        return dur.split(':').map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    static millisToDuration(ms) {
        return prettyMilliseconds(ms, { colonNotation: true, secondsDecimalDigits: 0 });
    }

    static chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }

    static isValidURL(url) {
        return /^https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
            .test(url);
    }

    static shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static get paginationEmojis() {
        return ['◀', '⛔', '▶'];
    }


    static async pagination(msg, author, contents, init = true, currPage = 0) {
        if (init) for (const emoji of this.paginationEmojis) await msg.react(emoji);

        const collector = msg.createReactionCollector((reaction, user) => {
            return this.paginationEmojis.includes(reaction.emoji.name) && user.id === author.id;
        }, {
            max: 1,
            time: 30000
        });

        collector
            .on('collect', (reaction) => {
                reaction.users.remove(author);

                const emoji = reaction.emoji.name;
                if (emoji === this.paginationEmojis[0]) currPage--;
                if (emoji === this.paginationEmojis[1]) return collector.stop();
                if (emoji === this.paginationEmojis[2]) currPage++;
                currPage = (currPage % contents.length + contents.length) % contents.length;
                const music = msg.client.queue.get(msg.guild.id);

                msg.edit(`\`\`\`prolog\n    ⬐ current track\n${music.current.info.isStream ? '[**◉ LIVE**]' : ''}${music.current.info.title} [${this.millisToDuration(music.current.info.length - music.player.position)} Left]\n    ⬑ current track\n${contents[currPage] == '' ? 'This is the end of the queue!' : '' + contents[currPage]}\`\`\``);

                this.pagination(msg, author, contents, false, currPage);
            })
            .on('end', (_, reason) => {
                if (['time', 'user'].includes(reason)) msg.reactions.removeAll();
            });
    }
    /**
     * @param {import("discord.js").PermissionResolvable} memberPerms
     * @param {import("discord.js").PermissionResolvable} requiredPerms
     * @returns {import("discord.js").PermissionString[]}
     */
    static missingPerms(memberPerms, requiredPerms) {
        return new Permissions(memberPerms).missing(new Permissions(requiredPerms));
    }

    static moveArrayElement(arr, fromIndex, toIndex) {
        arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
        return arr;
    }
    static progress(current, total, size = 11) {
        const percent = current / total * size;
        const progbar = new Array(size).fill('━');
        progbar[Math.round(percent)] = '●';
        return {
            bar: progbar.join(''),
            percent
        };
    } 

    static getEmoji(amount) {
        let emoji;
        if (amount <= 120) {
            emoji = '🟢';
        } else if (amount <= 800) {
            emoji = '🟡';
        } else {
            emoji = '🔴';
        }
        return emoji;
    }
    static read24hrFormat(text) {
        let j = 0;
        let k = 0;
        let ms = 0;
        if (!text) return ms = 0;
        const result = text.split(/:/);
        if (!result) {
            throw new TypeError(`Can't convert: "${text}" into milliseconds.`);
        } else if (result.length > 3) {
            throw new TypeError(`Can't convert: "${text}" because it's too long. Max format: 00:00:00."`);
        }
        if (result.length === 3) {
            result.push('00');
        }
        for (let i = result.length - 1; i >= 0; i--) {
            k = Math.abs(parseInt(result[i]) * 1000 * Math.pow(60, j < 3 ? j : 2));
            j++;
            ms += k;
        }
        if (isFinite(ms)) {
            return ms;
        } else {
            throw new TypeError('Final value is greater than Number can hold.');
        }
    }
    
    static getReadableTime(ms) {
        if (!ms || ms && !isFinite(ms)) {throw new TypeError('You need to pass a total number of milliseconds! (That number cannot be grater than Number limits)');}
        if (typeof ms !== 'number') {throw new TypeError(`You need to pass a number! Instead receinved: ${typeof ms}`);}
        const t = this.getTimeObject(ms);
        const reply = [];
        if (t.years) {
            reply.push(`${t.years} yrs`);
        }
        if (t.months) {
            reply.push(`${t.months} mo`);
        }
        if (t.days) {
            reply.push(`${t.days} d`);
        }
        if (t.hours) {
            reply.push(`${t.hours} hrs`);
        }
        if (t.minutes) {
            reply.push(`${t.minutes} min`);
        }
        if (t.seconds) {
            reply.push(`${t.seconds} sec`);
        }
        if (reply.length > 0) {
            return reply.join(', ');
        } else {
            return '0sec';
        }
    }
    
    static getTimeObject(ms) {
        if (!ms || typeof ms !== 'number' || !isFinite(ms)) {throw new TypeError('Final value is greater than Number can hold or you provided invalid argument.');}
        const result = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: Math.floor(ms),
        };
        // Calculate time in rough way
        while (result.milliseconds >= 1000) {
            if (result.milliseconds >= 3.154e+10) {
                result.years++;
                result.milliseconds -= 3.154e+10;
            }
            if (result.milliseconds >= 2.592e+9) {
                result.months++;
                result.milliseconds -= 2.592e+9;
            }
            if (result.milliseconds >= 8.64e+7) {
                result.days++;
                result.milliseconds -= 8.64e+7;
            }
            if (result.milliseconds >= 3.6e+6) {
                result.hours++;
                result.milliseconds -= 3.6e+6;
            }
            if (result.milliseconds >= 60000) {
                result.minutes++;
                result.milliseconds -= 60000;
            }
            if (result.milliseconds >= 1000) {
                result.seconds++;
                result.milliseconds -= 1000;
            }
        }
        // Make it smooth, aka sort
        if (result.seconds >= 60) {
            result.minutes += Math.floor(result.seconds / 60);
            result.seconds = result.seconds - Math.floor(result.seconds / 60) * 60;
        }
        if (result.minutes >= 60) {
            result.hours += Math.floor(result.minutes / 60);
            result.minutes = result.minutes - Math.floor(result.minutes / 60) * 60;
        }
        if (result.hours >= 24) {
            result.days += Math.floor(result.hours / 24);
            result.hours = result.hours - Math.floor(result.hours / 24) * 24;
        }
        if (result.days >= 30) {
            result.months += Math.floor(result.days / 30);
            result.days = result.days - Math.floor(result.days / 30) * 30;
        }
        if (result.months >= 12) {
            result.years += Math.floor(result.months / 12);
            result.months = result.months - Math.floor(result.months / 12) * 12;
        }
        return result;
    }

};
