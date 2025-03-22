import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CustomInput } from './custom-select';
dayjs.extend(utc)

export const CustomDateTimePicker = ({ defaultValue, onChange }) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label="Due Date"
                timezone='default'
                defaultValue={defaultValue ? dayjs.utc(defaultValue).local() : null}
                onError={(e) => { console.error(e) }}
                onChange={onChange}
                slotProps={{ field: { clearable: true }, textField: { variant: 'filled', fullWidth: true } }}
                disablePast
                slots={{ textField: CustomInput }}
            />
        </LocalizationProvider>
    )

}
