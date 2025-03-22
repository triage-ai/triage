import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CustomInput } from './custom-select';
dayjs.extend(utc)

export const CustomDatePicker = ({ value, onChange, label, ...props}) => {

    const {mb, mt, width, ...otherProps} = props

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                sx={{
                    mb: mb,
                    width: width
                }}
                {...otherProps}
                label={label}
                timezone='default'
                value={value ? dayjs.utc(value).local() : null}
                onError={(e) => { console.error(e) }}
                onChange={onChange}
                slotProps={{ field: { clearable: true }, textField: { variant: 'filled', fullWidth: true, size: 'small'} }}
                slots={{ textField: CustomInput }}
            />
        </LocalizationProvider>
    )

}