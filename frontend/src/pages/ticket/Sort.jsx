import { Box, Button, IconButton, List, ListItem, Stack } from "@mui/material"
import { Trash2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { CustomSelect } from "../../components/custom-select"
import PropTypes from "prop-types"

export const Sort = ({ sorts, setSorts }) => {

    Sort.propTypes = {
        sorts: PropTypes.array,
        setSorts: PropTypes.func,
    }

    const sortFields = [
        { label: 'Ticket #', value: 'number' },
        { label: 'Date Created', value: 'created' },
        { label: 'Close Date', value: 'closed' },
        { label: 'Due Date', value: 'due_date' },
        { label: 'Last Updated', value: 'updated' },
        // { label: 'Last Message', value: 12 },
        // { label: 'Last Response', value: 13 },
    ]

    const sortDirections = [
        { label: 'ascending', value: 1 },
        { label: 'descending', value: -1 }
    ]

    const internalSorts = useMemo(() => (
        sorts.map((sort) => {
            if (sort && sort.charAt(0) === '-') {
                return [sort.substring(1), -1]
            }
            else {
                return [sort, 1]
            }
        })
    ), [sorts])

    const handleFieldChange = (e, idx) => {
        const tempArr = [...sorts]
        let value = e.target.value

        if (value && internalSorts[idx][1] === -1) {
            value = '-' + value
        }
        tempArr[idx] = value
        setSorts(tempArr)
    }

    const handleOperationChange = (e, idx) => {
        const tempArr = [...sorts]
        let value = internalSorts[idx][0]
        if (e.target.value === -1) {
            value = '-' + value
        }
        tempArr[idx] = value
        setSorts(tempArr)
    }

    const handleAddNewSort = () => {
        setSorts(p => [...p, ''])
    }

    const removeSort = (idx) => {
        setSorts([...sorts.slice(0, idx), ...sorts.slice(idx + 1)])
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', pb: 2 }} height={500} >
            <Box sx={{ overflowY: 'auto' }} mb={2}>
                <List>
                    {internalSorts.map((sort, idx) => (
                        <ListItem key={sort[0]}>
                            <Stack spacing={1} direction='row' width='100%' alignItems={'center'}>
                                <CustomSelect
                                    label='Field'
                                    onChange={(e) => handleFieldChange(e, idx)}
                                    value={sort[0]}
                                    name='field'
                                    fullWidth
                                    options={sortFields}
                                    size={'small'}
                                />
                                {sort[0] && <CustomSelect
                                    value={sort[1]}
                                    label='Direction'
                                    onChange={(e) => handleOperationChange(e, idx)}
                                    name='direction'
                                    fullWidth
                                    hideEmptyOption
                                    options={sortDirections}
                                    size={'small'}
                                />}
                            </Stack>
                            <IconButton onClick={() => removeSort(idx)}>
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
                onClick={() => handleAddNewSort()}
            >
                Add new sort
            </Button>
        </Box >
    )

}
