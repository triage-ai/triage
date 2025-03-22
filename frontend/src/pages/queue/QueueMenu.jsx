import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Filter } from "../ticket/Filter";
import { Sort } from "../ticket/Sort";
import { CrudColumnsDataGrid } from "./CrudColumnsDataGrid";

export const QueueMenu = ({ rows, setRows, filters, setFilters, sorts, setSorts, setIsValid, queue_id }) => {

    QueueMenu.propTypes = {
        rows: PropTypes.array,
        setRows: PropTypes.func,
        filters: PropTypes.array,
        setFilters: PropTypes.func,
        sorts: PropTypes.array,
        setSorts: PropTypes.func,
        setIsValid: PropTypes.func,
        queue_id: PropTypes.number,
    }

    const [value, setValue] = useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setIsValid(validateRows() && validateFilters() && validateSorts())
    }, [filters, sorts])

    const validateRows = () => {

        for (const row of rows) {
            if (row.default_column_id === 0 || row.name === '') {
                return false
            }
        }
        return true
    }

    const validateFilters = () => {
        for (const filter of filters) {
            if (!filter[0] || !filter[1] || (filter[2] === '' || filter[2]?.length === 0)) {
                return false
            }
        }
        return true
    }

    const validateSorts = () => {
        for (const sort of sorts) {
            if (!sort) {
                return false
            }
        }
        return true
    }

    const tabSwitcher = (value) => {
        if (value === 'one') {
            return <Filter filters={filters} setFilters={setFilters} />
        }
        else if (value === 'two') {
            return <Sort sorts={sorts} setSorts={setSorts} />
        }
        else {
            return <CrudColumnsDataGrid
                rows={rows}
                setRows={setRows}
                queue_id={queue_id}
            />
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>

            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="secondary tabs example"
            >
                <Tab value="one" label="Filter" />
                <Tab value="two" label="Sort" />
                <Tab value="three" label="Columns" />
            </Tabs>

            {tabSwitcher(value)}
            {/* <CircularButton
                sx={{ py: 2, px: 6 }}
                position={'absolute'}
                bottom={12}
                onClick={submitSearch}
                disabled={!isValid}
            >
                Search
            </CircularButton> */}
        </Box>
    )

}