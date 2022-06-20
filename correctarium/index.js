const reqX = {
    language: "en",
    mimetype: "none|doc|docx|rtf|other",
    count: 1333,
};

//"none|doc|docx|rtf|other",

const getPrice = (req) => {
    let symbolPrice = 0;
    if (req.language === 'en') {
        symbolPrice = req.count < 1000 ? 120 : req.count * 0.12;
    }
    else if (req.language === 'ua' || req.language === 'ru') {
        symbolPrice = req.count < 1000 ? 50 : req.count * 0.05;
    }
    let price = 0;
    const types = req.mimetype.split('|');
    types.forEach((item) => price += (item === 'doc' || item === 'docx' || item === 'rtf') ? symbolPrice : symbolPrice * 1.2);
    return price.toFixed(2);
};

const getWorkTimestamp = (req) => {
    let timePerOne = 0;
    if (req.language === 'en') {
        timePerOne = req.count < 334 ? 60 : 30 + req.count / 5.55;
    }
    else if (req.language === 'ua' || req.language === 'ru') {
        timePerOne = req.count < 1334 ? 60 : 30 + req.count / 22.2;
    }
    let time = 0;
    const types = req.mimetype.split('|');
    types.forEach((item) => time += (item === 'doc' || item === 'docx' || item === 'rtf') ? timePerOne : timePerOne * 1.2);
    return Math.ceil(time * 60 * 1000);
};

const getKyivTimestamp = () => { return (Date.now() + 3 * 60 * 60 * 1000) };

const getDeadlineTimestamp = (msWork) => {
    const timeNow = getKyivTimestamp();
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

const getResponse = (req) => {
    const price = getPrice(req);
    const msTime = getWorkTimestamp(req);
    const msDeadline = getDeadlineTimestamp(msTime);
    const deadline = new Date(msDeadline).toUTCString();
    return {
        price: price,
        time: Math.ceil(msTime / (60 * 60 * 1000)),
        deadline: Math.round(msDeadline / 1000),
        deadline_date: deadline,
    }
}

console.log(getResponse(reqX));
//console.log(new Date(getKyivTimestamp()).getHours() - new Date().getHours());