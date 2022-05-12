import axios from "axios"

const urls: string[] = [
    "https://jsonbase.com/lambdajson_type1/793",
    "https://jsonbase.com/lambdajson_type1/955",
    "https://jsonbase.com/lambdajson_type1/231",
    "https://jsonbase.com/lambdajson_type1/931",
    "https://jsonbase.com/lambdajson_type1/93",
    "https://jsonbase.com/lambdajson_type2/342",
    "https://jsonbase.com/lambdajson_type2/770",
    "https://jsonbase.com/lambdajson_type2/491",
    "https://jsonbase.com/lambdajson_type2/281",
    "https://jsonbase.com/lambdajson_type2/718",
    "https://jsonbase.com/lambdajson_type3/310",
    "https://jsonbase.com/lambdajson_type3/806",
    "https://jsonbase.com/lambdajson_type3/469",
    "https://jsonbase.com/lambdajson_type3/258",
    "https://jsonbase.com/lambdajson_type3/516",
    "https://jsonbase.com/lambdajson_type4/79",
    "https://jsonbase.com/lambdajson_type4/706",
    "https://jsonbase.com/lambdajson_type4/521",
    "https://jsonbase.com/lambdajson_type4/350",
    "https://jsonbase.com/lambdajson_type4/64"
]

const getProp = (o: any): any => {
    if ("isDone" in o) {
        return o.isDone;
    }
    else {
        for (let prop in o) {
            if (o[prop] instanceof Object && !Array.isArray(o[prop])) {
                return getProp(o[prop])
            }
        }
    }
}

const tryRequest = async (url: string, tryNum: number, reqNum: number = 0) => {
    if (reqNum < tryNum) {
        try {
            return await axios.get(url);
        } catch (e) {
            console.log(`ERROR! Trying request again... ${reqNum + 1}`);
            await tryRequest(url, tryNum, ++reqNum);
        }
    }
}

const getAllDone = async (urls: string[], tryNum: number) => {
    let countTrue = 0, countFalse = 0;
    for (let i = 0; i < urls.length; i++) {
        try {
            const response = await tryRequest(urls[i], tryNum)
            const prop = getProp(response!.data);
            console.log(urls[i] + "\t: isDone - " + prop)
            prop ? countTrue++ : countFalse++
        } catch (e) {
            console.log(`ERROR! Cannot get response: ${urls[i]}\n`);
        }
    }
    console.log("True: " + countTrue + "\nFalse: " + countFalse);
}

getAllDone(urls, 3);