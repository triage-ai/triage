import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
let localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat)
dayjs.extend(utc)

export default function formatDate(date, formatString) {
    return dayjs.utc(date).local().format(formatString)
}