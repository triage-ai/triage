import { Box, IconButton, InputBase, MenuItem, Paper, Select, TextField, Typography, useTheme } from "@mui/material"
import { Check, RefreshCcw, TreeDeciduousIcon, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export const EditableInput = ({ handleChange, value, variant, name }) => {

    const [editMode, setEditMode] = useState(false)
    const theme = useTheme()
    const ref = useRef()

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleChange(name, ref.current.value)
            setEditMode(false)
        }
    }

    // useEffect(() => {
    //     console.log(editMode)
    // }, [editMode])

    return (
        <Box
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    // console.log('we hit this')
                    setEditMode(false)
                }
            }}>
            {
                editMode ?
                    <Box display='flex' flexDirection='column' position={'relative'}>
                        <TextField
                            size="small"
                            autoFocus
                            multiline
                            fullWidth
                            inputRef={ref}
                            defaultValue={value}
                            onKeyDown={handleEnter}
                            slotProps={{
                                input: {
                                    style: {
                                        ...theme.typography[variant],
                                        resize: 'both',
                                        padding: '0px',
                                    },
                                }
                            }}
                        />
                        <Paper sx={{ width: 'fit-content', alignSelf: 'flex-end', padding: '4px', position: 'absolute', top: '100%', tabIndex: 0 }}>
                            <IconButton
                                sx={{ border: '1.5px solid #E5EFE9', borderRadius: '6px', mr: '4px' }}
                                onClick={() => {
                                    setEditMode(false)
                                }}
                            >
                                <X size={15} color='red' />
                            </IconButton>
                            <IconButton
                                sx={{ border: '1.5px solid #E5EFE9', borderRadius: '6px' }}
                                onClick={() => {
                                    handleChange(name, ref.current.value)
                                    setEditMode(false)
                                }}
                            >
                                <Check size={15} color='green' />
                            </IconButton>
                        </Paper>
                    </Box>
                    :
                    <Typography
                        variant={variant}
                        onClick={(e) => {
                            setEditMode(true)
                        }}>
                        {value}
                    </Typography>
            }
        </Box>
    )
}

export const EditableSelect = ({ handleChange, value, variant, name, refresh, options }) => {

    const [editMode, setEditMode] = useState(false)
    const theme = useTheme()
    const ref = useRef(null)

    useLostFocus(ref, editMode, setEditMode)

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleChange(name, ref.current.value)
            setEditMode(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    return (
        <Box
            width='fit-content'
            // onBlur={(e) => {
            //     if (!e.currentTarget.contains(e.relatedTarget)) {
            //         console.log(e.currentTarget)
            //         console.log(e.relatedTarget)
            //         setEditMode(false)
            //     }
            // }}
        >
            {
                editMode ?
                    <Box display='flex' flexDirection='column' position={'relative'} width='fit-content' ref={ref}

                    >
                        <TextField
                            select
                            sx={{
                                p: 0,
                                width: 'fit-content'
                            }}
                            size="small"
                            autoFocus
                            multiline
                            defaultValue={value}
                            onKeyDown={handleEnter}
                            slotProps={{
                                input: {
                                    style: {
                                        ...theme.typography[variant],
                                        resize: 'both',
                                        padding: '0px',
                                    },
                                }
                            }}
                        >
                            {
                                options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Typography variant={variant}>
                                            {option.label}

                                        </Typography>
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                        <Paper sx={{ display: 'flex', width: 'fit-content', alignSelf: 'flex-end', padding: '4px', position: 'absolute', top: '100%', tabIndex: 0, flexDirection: 'row' }}>
                            <IconButton
                                sx={{ border: '1.5px solid #E5EFE9', borderRadius: '6px', mr: '4px' }}
                                onClick={() => {
                                    setEditMode(false)
                                }}
                            >
                                <X size={15} color='red' />
                            </IconButton>
                            <IconButton
                                sx={{ border: '1.5px solid #E5EFE9', borderRadius: '6px' }}
                                onClick={() => {
                                    handleChange(name, ref.current.value)
                                    setEditMode(false)
                                }}
                            >
                                <Check size={15} color='green' />
                            </IconButton>
                        </Paper>
                    </Box>
                    :
                    <Typography
                        variant={variant}
                        onClick={(e) => {
                            // console.log('on click typography')
                            setEditMode(true)
                        }}>
                        {options.find(option => option.value === value)?.label ?? ''}
                    </Typography>
            }
        </Box>
    )
}

function useLostFocus(ref, editMode, setEditMode) {
    useEffect(() => {

        function handleClickOutside(event) {
            // console.log('does the ref contain?:', ref?.current?.contains(event.target))
            if (ref.current && !ref.current.contains(event.target)) {
                // console.log('this should flase')
                setEditMode(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}