import { Chip, Popper } from '@mui/material';
import { useState } from 'react';
import { CustomInput, CustomMultibox } from '../../components/custom-select';
// import { AddAgent } from './AddAgent';
import { useAgentBackend } from '../../hooks/useAgentBackend';

export const AgentMultiSelect = ({ onChange, values, ...props }) => {
    const { getAgentBySearch } = useAgentBackend();
    const [agentOptions, setAgentOptions] = useState([]);

    const { mt, mb, ...otherProps } = props;

    const handleAgentSearchChange = e => {
        if (e?.target?.value) {
            getAgentBySearch(e.target.value)
                .then(res => {
                    let formattedData = res.data.map((agent) => (agent.firstname + ' ' + agent.lastname))
                    formattedData.push('Me')
                    setAgentOptions(formattedData)
                })
                .catch(err => alert('Agent search failed'));
        }
    };

    return (
        <CustomMultibox
            clearIcon={false}
            options={agentOptions}
            multiple
            value={values}
            fullWidth
            size='small'
            onInputChange={handleAgentSearchChange}
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Agents'
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