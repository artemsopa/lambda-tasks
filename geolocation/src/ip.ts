import readFile from "./files";

const getDataMap = async (filePath: string) => {
    const data: string[] = (await readFile(filePath)).slice(1, -1).split(/"\r\n"/);
    const map = new Map();
    for (let item of data) {
        const line = item.split('","')
        map.set({
            a: Number(line[0]),
            b: Number(line[1]),
        }, {
            c: line[2],
            d: line[3],
        });
    }
    return map;
}


const getDecimalIP = (ip: string) => {
    return ip.split('.').reduce((ipInt: number, octet: string) => { return (ipInt << 8) + parseInt(octet, 10) }, 0) >>> 0;
}

const getGeolocationByIP = async (filePath: string, ip: string) => {
    const decimalIP = getDecimalIP(ip);
    const map = await getDataMap(filePath);
    for (let [key, body] of map.entries()) {
        if (decimalIP >= key.a && decimalIP <= key.b) {
            return { ip: { simple: ip, decimal: decimalIP }, range: { min: key.a, max: key.b }, country: { abbreviation: body.c, title: body.d } };
        }
    }
    return { ip: ip, message: 'ERROR! Cannot get GEO!' }
}

export default getGeolocationByIP;