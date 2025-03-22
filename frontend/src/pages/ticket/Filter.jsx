import { Box, Button, Chip, IconButton, List, ListItem, MenuItem, Stack, Typography } from '@mui/material'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { CustomFilledInput } from '../../components/custom-input'
import { CustomInput, CustomMultibox, CustomSelect } from '../../components/custom-select'
import { CustomDatePicker } from '../../components/date-picker'
import { useData } from '../../context/DataContext'
import { AgentMultiSelect } from '../agent/AgentMultiSelect'
import { UserMultiSelect } from '../user/UserMultiSelect'

const updateValue = (filters, idx, value) => (
    [...filters.slice(0, idx), [filters[idx][0], filters[idx][1], value], ...filters.slice(idx + 1)]
)

export const Filter = ({ filters, setFilters }) => {

    const filterFields = [
        { label: 'Ticket #', value: 'number' },
        { label: 'Date Created', value: 'created' },
        { label: 'Subject', value: 'title' },
        { label: 'User', value: 'user_id' },
        { label: 'User Name', value: 'users.name' },
        { label: 'Priority', value: 'ticket_priorities.priority_desc' },
        { label: 'Status', value: 'ticket_statuses.name' },
        { label: 'Close Date', value: 'closed' },
        { label: 'Assignee', value: 'agent_id' },
        { label: 'Assignee Name', value: 'agents.name' },
        { label: 'Due Date', value: 'due_date' },
        { label: 'Last Updated', value: 'updated' },
        { label: 'Department', value: 'departments.name' },
        // { label: 'Last Message', value: 12 },
        // { label: 'Last Response', value: 13 },
        { label: 'Group', value: 'groups.name' },
        { label: 'Answered', value: 'answered' },
        { label: 'Overdue', value: 'overdue' }
    ]

    const filterOperations = {
        "number": [
            { label: "in", value: "in", type: "multiSelect" },
            { label: "not in", value: "!in", type: "multiSelect" }
        ],
        "created": [
            { label: "has a value", value: "is not" },
            { label: "does not have a value", value: "is" },
            { label: "is", value: "==", type: "dateSelect" },
            { label: "is not", value: "!=", type: "dateSelect" },
            { label: "before", value: "<", type: "dateSelect" },
            { label: "after", value: ">", type: "dateSelect" },
            { label: "between", value: "between", type: "dateSelectBetween" },
            { label: "not between", value: "!between", type: "dateSelectBetween" },
            { label: "period", value: "period", type: "periodSelect" }
        ],
        "title": [
            { label: "contains", value: "ilike", type: "textField" },
            { label: "doesn't contain", value: "not ilike", type: "textField" }
        ],
        "user_id": [
            { label: "has a value", value: "is not" },
            { label: "does not have a value", value: "is" },
        ],
        "users.name": [
            { label: "is in", value: "in", type: "userMultiSelect" },
            { label: "not in", value: "!in", type: "userMultiSelect" }
        ],
        "ticket_priorities.priority_desc": [
            { label: "in", value: "in", type: "priorityMultiSelect" },
            { label: "not in", value: "!in", type: "priorityMultiSelect" }
        ],
        "ticket_statuses.name": [
            { label: "in", value: "in", type: "statusMultiSelect" },
            { label: "not in", value: "!in", type: "statusMultiSelect" }
        ],
        "closed": [
            { label: "has a value", value: "is not" },
            { label: "does not have a value", value: "is" },
            { label: "is", value: "==", type: "dateSelect" },
            { label: "is not", value: "!=", type: "dateSelect" },
            { label: "before", value: "<", type: "dateSelect" },
            { label: "after", value: ">", type: "dateSelect" },
            { label: "between", value: "between", type: "dateSelectBetween" },
            { label: "not between", value: "!between", type: "dateSelectBetween" },
            { label: "period", value: "period", type: "periodSelect" }
        ],
        "agent_id": [
            { label: "has a value", value: "is not" },
            { label: "does not have a value", value: "is" },
        ],
        "agents.name": [
            { label: "is in", value: "in", type: "agentMultiSelect" },
            { label: "not in", value: "!in", type: "agentMultiSelect" }
        ],
        "due_date": [
            { label: "has a value", value: "is not" },
            { label: "does not have a value", value: "is" },
            { label: "is", value: "==", type: "dateSelect" },
            { label: "is not", value: "!=", type: "dateSelect" },
            { label: "before", value: "<", type: "dateSelect" },
            { label: "after", value: ">", type: "dateSelect" },
            { label: "between", value: "between", type: "dateSelectBetween" },
            { label: "not between", value: "!between", type: "dateSelectBetween" },
            { label: "period", value: "period", type: "periodSelect" }
        ],
        "updated": [
            { label: "is", value: "==", type: "dateSelect" },
            { label: "is not", value: "!=", type: "dateSelect" },
            { label: "before", value: "<", type: "dateSelect" },
            { label: "after", value: ">", type: "dateSelect" },
            { label: "between", value: "between", type: "dateSelectBetween" },
            { label: "not between", value: "!between", type: "dateSelectBetween" },
            { label: "period", value: "period", type: "periodSelect" }
        ],
        "departments.name": [
            { label: "in", value: "in", type: "departmentMultiSelect" },
            { label: "not in", value: "!in", type: "departmentMultiSelect" }
        ],
        "groups.name": [
            { label: "in", value: "in", type: "groupMultiSelect" },
            { label: "not in", value: "!in", type: "groupMultiSelect" }
        ],
        "answered": [
            { label: "is", value: "==", type: "trueFalseSelect" },
        ],
        "overdue": [
            { label: "is", value: "==", type: "trueFalseSelect" },
        ]
    }


    const handleAddNewFilter = () => {
        setFilters(p => [...p, ['', '', '']])
    }

    const removeFilter = (idx) => {
        setFilters([...filters.slice(0, idx), ...filters.slice(idx + 1)])
    }

    const handleFieldChange = (e, idx) => {
        const tempArr = [...filters]
        tempArr[idx] = [e.target.value, '', '']
        setFilters(tempArr)
    }

    const handleOperationChange = (e, idx) => {
        const tempArr = [...filters]
        const value = (e.target.value === 'is' || e.target.value === 'is not') ? null : ''
        tempArr[idx] = [tempArr[idx][0], e.target.value, value] // we can set this to '' or [] in the future to avoid array checks in elements with multiple select
        setFilters(tempArr)
    }

    // useEffect(() => {
    //     console.log(filters)
    // }, [filters])

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', pb: 2 }} height={500} >
            <Box sx={{ overflowY: 'auto' }} mb={2}>
                <List>
                    {filters.map((filter, idx) => (
                        <ListItem key={idx}>
                            <Stack spacing={1} direction='row' width='100%' alignItems={'center'}>
                                <CustomSelect
                                    label='Field'
                                    onChange={(e) => handleFieldChange(e, idx)}
                                    value={filter[0]}
                                    name='field'
                                    fullWidth
                                    options={filterFields}
                                    size={'small'}
                                />
                                {filter[0] && <CustomSelect
                                    label='Operation'
                                    onChange={(e) => handleOperationChange(e, idx)}
                                    value={filter[1]}
                                    name='operation'
                                    fullWidth
                                    options={filterOperations[filter[0]]}
                                    size={'small'}
                                />}
                                {filter[0] && filter[1] && filterOperations[filter[0]]?.find((obj) => (obj.value == filter[1]))?.type &&
                                    <InputComponent
                                        filters={filters}
                                        setFilters={setFilters}
                                        idx={idx}
                                        type={filterOperations[filter[0]].find((obj) => (obj.value == filter[1])).type}
                                    />
                                }
                            </Stack>
                            <IconButton onClick={() => removeFilter(idx)}>
                                <Trash2 />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Button
                sx={{
                    backgroundColor: 'transparent',
                    border: '1.5px solid #22874E',
                    color: '#22874E',
                    borderRadius: '12px',
                    width: '100%',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    lineHeight: 1,
                    textTransform: 'unset',
                    padding: '12px 10px',
                    transition: 'all 0.3s',

                    '&:hover': {
                        backgroundColor: '#f1f4f2',
                    },
                }}
                onClick={() => handleAddNewFilter()}
            >
                Add new filter
            </Button>
        </Box>
    )

}

const InputComponent = ({ filters, setFilters, idx, type }) => {

    const filterInputs = {
        multiSelect: MultiBox,
        dateSelect: DateSelect,
        dateSelectBetween: DateRangeSelect,
        periodSelect: PeriodSelect,
        textField: TextInput,
        userMultiSelect: UserMultiBox,
        priorityMultiSelect: PriorityMultiBox,
        statusMultiSelect: StatusMultiBox,
        agentMultiSelect: AgentMultiBox,
        departmentMultiSelect: DepartmentMultiBox,
        groupMultiSelect: GroupMultiBox,
        trueFalseSelect: TrueFalseSelect
    }

    const ComponentToRender = useMemo(() => (
        filterInputs[type]
    ), [type])

    return (
        <>
            <ComponentToRender
                filters={filters}
                setFilters={setFilters}
                idx={idx}
            />
        </>

    )
}

const MultiBox = ({ filters, setFilters, idx }) => {
    const handleMultiSelectChange = (values, idx) => {
        setFilters(updateValue(filters, idx, values))
    }
    return (
        <CustomMultibox
            clearIcon={false}
            options={[]}
            freeSolo
            multiple
            value={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            fullWidth
            size='small'
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Add values'
                    variant='filled'
                />
            )}
            renderTags={(values, getTagProps) =>
                values.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip label={option} key={key} {...tagProps} />
                })
            }
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
        />
    )
}

const DateSelect = ({ filters, setFilters, idx }) => {
    const handleDateChange = (newValue) => {
        const value = newValue ? newValue.utc().format('YYYY-MM-DD') : null
        setFilters(updateValue(filters, idx, value))
    }
    return (
        <CustomDatePicker
            size='small'
            onChange={handleDateChange}
            value={filters[idx][2]}
            label={'Date'}
        />
    )
}

const DateRangeSelect = ({ filters, setFilters, idx }) => {
    const handleDateChange = (newValue, index) => {
        const value = newValue ? newValue.utc().format('YYYY-MM-DD') : null
        let arr = ['', '']

        if (filters[idx][2] instanceof Array) {
            arr = [...filters[idx][2]]
        }

        arr[index] = value
        setFilters(updateValue(filters, idx, arr))
    }
    return (
        <Box>
            <CustomDatePicker
                size='small'
                onChange={(newValue) => handleDateChange(newValue, 0)}
                value={filters[idx][2] instanceof Array ? filters[idx][2][0] : ''}
                label={'From'}
                mb={1}
            />
            <CustomDatePicker
                size='small'
                onChange={(newValue) => handleDateChange(newValue, 1)}
                value={filters[idx][2] instanceof Array ? filters[idx][2][1] : ''}
                label={'To'}
            />
        </Box>
    )
}

const PeriodSelect = ({ filters, setFilters, idx }) => {

    const handlePeriodChange = (e) => {
        setFilters(updateValue(filters, idx, e.target.value))
    }

    const options = [
        { label: 'Today', value: 'td' },
        { label: 'This Week', value: 'tw' },
        { label: 'This Month', value: 'tm' },
        { label: 'This Year', value: 'ty' },
    ]

    return (
        <CustomSelect
            label='Period'
            onChange={handlePeriodChange}
            value={filters[idx][2]}
            name='period'
            fullWidth
            options={options}
            size={'small'}
        />
    )

}

const TextInput = ({ filters, setFilters, idx }) => {

    const handleTextChange = (e) => {
        setFilters(updateValue(filters, idx, e.target.value))
    }

    return (
        <CustomFilledInput
            onChange={handleTextChange}
            value={filters[idx][2]}
            label='Text'
            fullWidth
        />
    )
}

const AgentMultiBox = ({ filters, setFilters, idx }) => {
    const handleMultiSelectChange = (values, idx) => {
        const value = values.map((agent) => (agent.firstname ? agent.firstname + ' ' + agent.lastname : agent))
        setFilters(updateValue(filters, idx, value))
    }

    return (
        <AgentMultiSelect
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
            values={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            size='small'
        />
    )
}

const UserMultiBox = ({ filters, setFilters, idx }) => {
    const handleMultiSelectChange = (values, idx) => {
        const value = values.map((user) => (user.firstname ? user.firstname + ' ' + user.lastname : user))
        setFilters(updateValue(filters, idx, value))
    }

    return (
        <UserMultiSelect
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
            values={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            size='small'
        />
    )
}

const PriorityMultiBox = ({ filters, setFilters, idx }) => {
    const { formattedPriorities, refreshPriorities } = useData();
    const priorities = useMemo(() => (
        formattedPriorities.map((obj) => obj.label)
    ), [formattedPriorities])
    useEffect(() => {
        refreshPriorities()
    }, [])
    const handleMultiSelectChange = (values, idx) => {
        setFilters(updateValue(filters, idx, values))
    }
    return (
        <CustomMultibox
            clearIcon={false}
            options={priorities}
            multiple
            value={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            fullWidth
            size='small'
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Add Priorities'
                    variant='filled'
                />
            )}
            renderTags={(values, getTagProps) =>
                values.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip label={option} key={key} {...tagProps} />
                })
            }
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
        />
    )
}

const StatusMultiBox = ({ filters, setFilters, idx }) => {
    const { formattedStatuses, refreshStatuses } = useData();
    const statuses = useMemo(() => (
        formattedStatuses.map((obj) => obj.label)
    ), [formattedStatuses])
    useEffect(() => {
        refreshStatuses()
    }, [])
    const handleMultiSelectChange = (values, idx) => {
        setFilters(updateValue(filters, idx, values))
    }
    return (
        <CustomMultibox
            clearIcon={false}
            options={statuses}
            multiple
            value={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            fullWidth
            size='small'
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Add Statuses'
                    variant='filled'
                />
            )}
            renderTags={(values, getTagProps) =>
                values.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip label={option} key={key} {...tagProps} />
                })
            }
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
        />
    )
}

const DepartmentMultiBox = ({ filters, setFilters, idx }) => {
    const { formattedDepartments, refreshDepartments } = useData();
    const departments = useMemo(() => (
        formattedDepartments.map((obj) => obj.label)
    ), [formattedDepartments])
    useEffect(() => {
        refreshDepartments()
    }, [])
    const handleMultiSelectChange = (values, idx) => {
        setFilters(updateValue(filters, idx, values))
    }
    return (
        <CustomMultibox
            clearIcon={false}
            options={departments}
            multiple
            value={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            fullWidth
            size='small'
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Add Departments'
                    variant='filled'
                />
            )}
            renderTags={(values, getTagProps) =>
                values.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip label={option} key={key} {...tagProps} />
                })
            }
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
        />
    )
}

const GroupMultiBox = ({ filters, setFilters, idx }) => {
    const { formattedGroups, refreshGroups } = useData();
    const groups = useMemo(() => (
        formattedGroups.map((obj) => obj.label)
    ), [formattedGroups])
    useEffect(() => {
        refreshGroups()
    }, [])
    const handleMultiSelectChange = (values, idx) => {
        setFilters(updateValue(filters, idx, values))
    }
    return (
        <CustomMultibox
            clearIcon={false}
            options={groups}
            multiple
            value={filters[idx][2] instanceof Array ? filters[idx][2] : []}
            fullWidth
            size='small'
            renderInput={props => (
                <CustomInput
                    {...props}
                    label='Add Groups'
                    variant='filled'
                />
            )}
            renderTags={(values, getTagProps) =>
                values.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip label={option} key={key} {...tagProps} />
                })
            }
            onChange={(e, values) => handleMultiSelectChange(values, idx)}
        />
    )
}

const TrueFalseSelect = ({ filters, setFilters, idx }) => {
    const handleChange = (e) => {
        setFilters(updateValue(filters, idx, e.target.value))
    }
    const options = [
        { label: 'true', value: 1 },
        { label: 'false', value: 0 }
    ]

    return (
        <CustomInput
            select
            fullWidth
            size='small'
            variant='filled'
            label='Value'
            value={filters[idx][2]}
            onChange={handleChange}
        >
            <MenuItem value="">
                <Typography variant="subtitle2">- Choose value -</Typography>
            </MenuItem>
            {options?.map(option => (
                <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                    {option.label}{' '}
                    {option.sublabel && (
                        <Typography
                            variant="caption"
                            sx={{ lineHeight: 1, color: '#545555' }}
                        >
                            ({option.sublabel})
                        </Typography>
                    )}
                </MenuItem>
            ))}
        </CustomInput>
    )
}