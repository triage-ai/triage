import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
import { useData } from '../../context/DataContext';

function EditToolbar(props) {
    const { rows, setRows } = props;

    const handleClick = () => {
        let column_id = rows.reduce((acc, value) => {
            return acc > value.column_id ? acc : value.column_id;
        }, 0);
        setRows((oldRows) => [
            ...oldRows,
            { column_id: column_id + 1, name: "", default_column_id: 1 },
        ]);
        // setRowModesModel((oldModel) => ({
        // 	...oldModel,
        // 	[id]: { mode: GridRowModes.Edit, fieldToFocus: "label" },
        // }));
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export const ColumnsDataGrid = ({ rows, setRows }) => {


    const { refreshDefaultColumns, defaultColumns } = useData()
    const [columnMapping, setColumnMapping] = useState({})

    useEffect(() => {
        refreshDefaultColumns()
        // const initialRowModes = {}
        // rows.forEach(row => (
        //     initialRowModes[row.id] = { mode: GridRowModes.View, fieldToFocus: "label" }
        // ))
        // setRowModesModel(initialRowModes)
    }, [])

    useEffect(() => {
        let mapping = {}
        defaultColumns.forEach(column => (mapping[column.default_column_id] = column))
        setColumnMapping(mapping)
    }, [defaultColumns])

    const slotProps = useMemo(() => (
        {
            toolbar: { rows, setRows },
        }
    ),
        [rows]
    )

    const slots = useMemo(() => ({
        toolbar: EditToolbar
    }
    ),
        [EditToolbar]
    )

    const columns = useMemo(() => {
        return [
            {
                field: "name",
                headerName: "Name",
                editable: true,
                flex: 1,
                sortable: false,
                filterable: false,
                hideable: false,
            },
            {
                field: "default_column_id",
                headerName: "Type",
                editable: true,
                type: "singleSelect",
                valueOptions: defaultColumns.map((d) => d.default_column_id),
                getOptionValue: (value) => {
                    return value
                },
                getOptionLabel: (value) => {
                    return columnMapping[value]?.name ?? ''
                },
                flex: 1,
                sortable: false,
                filterable: false,
                hideable: false,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                width: 100,
                cellClassName: "actions",
                getActions: ({ id }) => {
                    return [
                        <GridActionsCellItem
                            key={id}
                            icon={<X />}
                            label="Delete"
                            onClick={handleDeleteClick(id)}
                            color="inherit"
                        />
                    ];
                },
            }
        ]
    })

    const validateRow = (row) => {
        return row.name !== '' && row.type !== '';
    }

    const handleDeleteClick = (column_id) => () => {
        setRows(rows.filter((row) => row.column_id !== column_id));
    };

    const processRowUpdate = async (newRow, oldRow) => {
        setRows(rows.map((row) => (row.column_id === newRow.column_id ? newRow : row)));
        return newRow;
    };

    return (
        <Box
            sx={{
                height: 500,
                width: "100%",
                pb: 2,
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
                "&.Mui-focused fieldset": {
                    border: "none",
                },
                "&:hover fieldset": {
                    border: "none",
                },
                '& fieldset': { borderRadius: 0, p: 0, m: 0, border: "none" },
                '& .MuiFilledInput-root': {
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    textAlign: 'left',
                },
                '& .Mui-error': {
                    bgcolor: '#f57f8b'
                },
            }}
        >
            <DataGrid
                rows={rows}
                setRows={setRows}
                columns={columns}
                slots={slots}
                slotProps={slotProps}
                getRowId={(row) => row.column_id}
                processRowUpdate={processRowUpdate}
                disableColumnMenu
                hideFooter
            />
        </Box>
    )

}