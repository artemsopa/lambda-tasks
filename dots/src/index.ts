import testsInit from "./tests";

let str: string = "abcd"

function init(str: string): void {
    let res = getAllDots(str);
    console.log(res);
    testsInit(str, res);
}

function getAllDots(str: string): string[] {
    let arr: string[] = []
    if (str.length == 1) {
        arr.push(str)
    }
    else {
        let last = (str[str.length - 1]);
        str = str.slice(0, -1);

        let dots = getAllDots(str)

        dots.map((item: string) => {
            arr.push(`${item}${last}`)
            arr.push(`${item}.${last}`)
        })
    }

    return arr
}

init(str);