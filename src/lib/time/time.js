/**
 * This function runs on startup and sets the start timestamp
 * then returns the start timestamp after that.
 * @returns {Date}
 */
var startTimestamp;
export function StartTimestamp() {
    if (!startTimestamp) startTimestamp = new Date();
    return startTimestamp;
};

/**
 * Returns a formatted string of the timestamp.
 * The format string can contain the following characters:
 * YYYY - year, M - month, D - day, H - hour, m - minutes, s - seconds.
 * MM, DD, HH, mm, ss - but contain a leading zero. eg. april = 04 
 * The format string can also contain escape characters, which are repreceded by two backslashes \\.
 * For example, the format string 'YYYY-M-D H:m:s' will return '2023-4-1 12:0:0'.
 * or '\\YYYYY-\\MMM-\\DDD \\HHH:\\mmm:\\sss' will return 'Y2023-M04-D01 H12:m00:s00'.
 * @param {Date} timestamp 
 * @param {string} format 
 * @returns {string | undefined} 
 */
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