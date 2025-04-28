//This function returns the timestamp the application started running.
var startTimestamp;
export function StartTimestamp() {
    if (!startTimestamp) startTimestamp = new Date();
    return startTimestamp;
};

//format: YYYY-MM-DD HH:mm:ss
export function TimestampFormatter(timestamp, format) {
    //return undefined if arguments are the wrong type.
    if (!(timestamp instanceof Date) || typeof format !== 'string') return undefined;

    let formattedDate = '';

    //Go for each character in string.
    for (let i = 0; i < format.length; i++) {
        //Escape character.
        if (format[i] === '\\') {
            i++;
            formattedDate += format[i];
            continue;
        }

        //year
        if (format.substring(i, i + 4) === 'YYYY') {
            formattedDate += timestamp.getFullYear();
            i += 3;
            continue
        }

        //month leading zero
        if (format.substring(i, i + 2) === 'MM') {
            if (timestamp.getMonth() + 1 < 10) formattedDate += '0'; //add leading zero.
            formattedDate += timestamp.getMonth() + 1;
            i += 1;
            continue;
        }

        //month
        if (format[i] === 'M') {
            formattedDate += timestamp.getMonth() + 1;
            continue;
        }

        //day leading zero
        if (format.substring(i, i + 2) === 'DD') {
            if (timestamp.getDate() + 1 < 10) formattedDate += '0'; //add leading zero.
            formattedDate += timestamp.getDate();
            i += 1;
            continue;
        }

        //day
        if (format[i] === 'D') {
            formattedDate += timestamp.getDate();
            continue;
        }
        
        //hour leading zero
        if (format.substring(i, i + 2) === 'HH') {
            if (timestamp.getHours() < 10) formattedDate += '0'; //add leading zero.
            formattedDate += timestamp.getHours();
            i += 1;
            continue;
        }

        //hour
        if (format[i] === 'H') {
            formattedDate += timestamp.getHours();
            continue;
        }

        //minutes leading zero
        if (format.substring(i, i + 2) === 'mm') {
            if (timestamp.getMinutes() < 10) formattedDate += '0'; //add leading zero.
            formattedDate += timestamp.getMinutes();
            i += 1;
            continue;
        }

        //minutes
        if (format[i] === 'm') {
            formattedDate += timestamp.getMinutes();
            continue;
        }

        //seconds leading zero
        if (format.substring(i, i + 2) === 'ss') {
            if (timestamp.getSeconds() < 10) formattedDate += '0'; //add leading zero.
            formattedDate += timestamp.getSeconds();
            i += 1;
            continue;
        }

        //seconds
        if (format[i] === 's') {
            formattedDate += timestamp.getSeconds();
            continue;
        }

        formattedDate += format[i]; //add the character to the string.
    }
    return formattedDate;
};