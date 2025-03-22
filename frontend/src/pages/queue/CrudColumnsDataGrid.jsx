import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';
import {
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes, GridToolbarContainer
} from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import CustomDataGrid from "../../components/data-grid";
import { useData } from '../../context/DataContext';
import { useColumnBackend } from '../../hooks/useColumnBackend';

function EditToolbar(props) {
    const { rows, setRows, setRowModesModel, queue_id } = props;

    const handleClick = () => {
        const id = rows.length === 0 ? 0 : rows.at(-1).id + 1
        setRows((oldRows) => [
            ...oldRows,
            { id, name: '', default_column_id: 1, queue_id: queue_id, sort: id, width: 100, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "label" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Add field
            </Button>
        </GridToolbarContainer>
    );
}

export const CrudColumnsDataGrid = ({ rows, setRows, queue_id }) => {

    const [rowModesModel, setRowModesModel] = useState({});
    const { createColumn, updateColumn, removeColumn } = useColumnBackend();
    const { refreshDefaultColumns, defaultColumns } = useData()
    const [columnMapping, setColumnMapping] = useState({})

    useEffect(() => {
        refreshDefaultColumns()
        const initialRowModes = {}
        rows.forEach(row => (
            initialRowModes[row.id] = { mode: GridRowModes.View, fieldToFocus: "label" }
        ))
        setRowModesModel(initialRowModes)
    }, [])

    useEffect(() => {
        let mapping = {}
        defaultColumns.forEach(column => (mapping[column.default_column_id] = column))
        setColumnMapping(mapping)
    }, [defaultColumns])

    const columns = [
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
            field: "sort",
            headerName: "Order",
            editable: true,
            type: 'number',
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
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={1}
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={2}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        key={3}
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={4}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        }
    ]

    const validateRow = (row) => {
        return row.name !== '' && row.label !== '' && row.type !== '';
    }

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (id) => () => {
        const row = rows.find(row => row.id === id)
        removeColumn({ column_id: row.column_id })
            .then(() => {
                setRows(rows.filter((row) => row.id !== id));
            })
            .catch(e => {
                console.error(e)
            })

    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow, oldRow) => {

        if (!validateRow(newRow)) {
            setRows(rows.filter((row) => (row.id !== newRow.id)));
            return newRow?.isNew ? { ...oldRow, _action: 'delete' } : oldRow
        }

        let updatedRow = oldRow;
        const obj = {
            queue_id: queue_id,
            sort: newRow.sort,
            default_column_id: newRow.default_column_id,
            name: newRow.name,
            width: newRow.width,
            column_id: newRow.column_id
        }

        let res;

        try {
            if (newRow?.isNew) {
                res = await createColumn(obj)
            }
            else {
                res = await updateColumn(obj)
            }
            updatedRow = {
                ...res.data,
                isNew: false,
                id: newRow.id
            }
        }
        catch (e) {
            console.error(e)
            if (newRow?.isNew) {
                return {...oldRow, _action: 'delete'}
            }
            return oldRow;
        }

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return (
        <CustomDataGrid
            rows={rows}
            setRows={setRows}
            columns={columns}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            EditToolbar={EditToolbar}
            disableColumnMenu
            queue_id={queue_id}
        />
    )

}