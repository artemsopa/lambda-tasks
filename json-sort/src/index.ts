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

const getAllDone = (urls: string[]) => {
    urls.forEach(async (url: string) => {
        try {
            const reponse = await axios.get(url);
            const prop = getProp(reponse.data);
            console.log(url +": isDone - " + prop)
        } catch (e) {
            console.error(e);
        }
    })
}

const getProp = (o: any) => {
    if("isDone" in o){
        return o.isDone;
    }
    else {
        for(var prop in o) {
            if(typeof(o[prop]) === 'object') {
                if("isDone" in o[prop]){
                    return o[prop].isDone;
                }
            }
        }
    }
}

getAllDone(urls);