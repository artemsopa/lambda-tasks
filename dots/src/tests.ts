export default function testsInit(word: string, arr: string[]): void {
    if (!isArrLength(word, arr)) {
        console.log("wrong array length!")
    }
    if (!isArrDuplicate(arr)) {
        console.log("there are duplicates!")
    }
    console.log("well done!")
}

function isArrLength(word: string, arr: string[]): boolean {
    return Math.pow(2, word.length - 1) == arr.length;
}

function isArrDuplicate(arr: string[]): boolean {
    return arr.length == [...new Set(arr)].length;
}
