import { Chip, Popper } from '@mui/material';
import { useState } from 'react';
import { CustomInput, CustomMultibox } from '../../components/custom-select';
// import { AddUser } from './AddUser';
import { useUserBackend } from '../../hooks/useUserBackend';

export const UserMultiSelect = ({ onChange, values, ...props }) => {
    const { getUserBySearch } = useUserBackend();
    const [userOptions, setUserOptions] = useState([]);

    const { mt, mb, ...otherProps } = props;

    const handleUserSearchChange = e => {
        if (e?.target?.value) {
            getUserBySearch(e.target.value)
                .then(res => {
                    let formattedData = res.data.map((user) => (user.firstname + ' ' + user.lastname))
                    setUserOptions(formattedData)
                })
                .catch(err => alert('User search failed'));
        }
    };

    return (
        <CustomMultibox
            clearIcon={false}
            options={userOptions}
            multiple
            value={values}
            fullWidth
            size='small'
            onInputChange={handleUserSearchChange}
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Users'
                    variant='filled'
                />
            )}
            renderTags={(values, getTagProps) =>
                values.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip label={option} key={key} {...tagProps} />
                })
            }
            renderOption={(props, item) => (
                <li
                    {...props}
                    key={item}
                >
                    {item}
                </li>
            )}
            PopperComponent={props => (
                <Popper
                    {...props}
                    style={{ maxWidth: 400 }}
                    placement="bottom-start"
                />
            )}
            onChange={onChange}
        />
    )
};