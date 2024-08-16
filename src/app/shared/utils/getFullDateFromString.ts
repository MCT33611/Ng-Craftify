export function getFullDateFromString(strDate : string){
    const date = new Date(strDate);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}