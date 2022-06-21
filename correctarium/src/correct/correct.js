// const reqX = {
//     language: "en",
//     mimetype: "none|doc|docx|rtf|other",
//     count: 1333,
// };

//"none|doc|docx|rtf|other",

class Correct {
    getPrice = (lang, count, types) => {
        let symbolPrice = 0;
        if (lang === 'en') {
            symbolPrice = count < 1001 ? 120 : count * 0.12;
        }
        else if (lang === 'ua' || lang === 'ru') {
            symbolPrice = count < 1001 ? 50 : count * 0.05;
        }
        let price = 0;
        types = types.split('|');
        types.forEach((item) => price += (item === 'doc' || item === 'docx' || item === 'rtf') ? symbolPrice : symbolPrice * 1.2);
        return price.toFixed(2);
    };

    getWorkTimestamp = (lang, count, types) => {
        let timePerOne = 0;
        if (lang === 'en') {
            timePerOne = count < 334 ? 60 : 30 + count / 5.55;
        }
        else if (lang === 'ua' || lang === 'ru') {
            timePerOne = count < 1334 ? 60 : 30 + count / 22.2;
        }
        let time = 0;
        types = types.split('|');
        types.forEach((item) => time += (item === 'doc' || item === 'docx' || item === 'rtf') ? timePerOne : timePerOne * 1.2);
        return Math.ceil(time * 60 * 1000);
    };

    getKyivTimestamp = () => { return (Date.now() + 3 * 60 * 60 * 1000) };

    getDeadlineTimestamp = (timeNow, msWork) => {
        const dateNow = new Date(timeNow);

        let deadline = timeNow;
        const msTimeNow = dateNow.getUTCHours() * 60 * 60 * 1000 + dateNow.getMinutes() * 60 * 1000 + dateNow.getSeconds() * 1000 + dateNow.getMilliseconds();
        if (dateNow.getUTCHours() < 10) {
            const timeLeft = 10 * 60 * 60 * 1000 - msTimeNow;
            deadline += timeLeft;
        }
        else if (dateNow.getUTCHours() > 18) {
            const timeLeft = 24 * 60 * 60 * 1000 - msTimeNow;
            deadline += timeLeft + 10 * 60 * 60 * 1000;
        }
        else if (dateNow.getUTCHours() > 9 && dateNow.getUTCHours() < 19) {
            const timeLeft = 19 * 60 * 60 * 1000 - msTimeNow;
            msWork -= timeLeft;
            const timeNext = timeLeft + 15 * 60 * 60 * 1000;
            deadline += timeNext;
        }
        const daysLeft = Math.ceil((msWork / (60 * 60 * 1000)) / 9);
        const msLastDay = msWork - ((daysLeft - 1) * 9 * 60 * 60 * 1000);
        deadline += (daysLeft - 1) * 24 * 60 * 60 * 1000 + msLastDay;

        return deadline;
    }

    getResponse = (lang, count, types) => {
        const price = this.getPrice(lang, count, types);
        const msTime = this.getWorkTimestamp(lang, count, types);
        const timeNow = this.getKyivTimestamp();
        const msDeadline = this.getDeadlineTimestamp(timeNow, msTime);
        const deadline = new Date(msDeadline).toUTCString();
        return {
            price: price,
            time: Math.ceil(msTime / (60 * 60 * 1000)),
            deadline: Math.round(msDeadline / 1000),
            deadline_date: deadline,
        }
    }
}

module.exports = Correct;