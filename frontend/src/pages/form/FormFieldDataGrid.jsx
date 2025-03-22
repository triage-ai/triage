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
import { useFormBackend } from "../../hooks/useFormBackend";

function EditToolbar(props) {
    const { rows, setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = rows.length === 0 ? 0 : rows.at(-1).id + 1
        setRows((oldRows) => [
            ...oldRows,
            { id, name: '', label: '', type: "text", isNew: true },
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

export const FormFieldDataGrid = ({ rows, setRows, form_id }) => {

    const [rowModesModel, setRowModesModel] = useState({});
    const { createFormField, updateFormField, removeFormField } = useFormBackend();

    useEffect(() => {
        const initialRowModes = {}
        rows.forEach(row => (
            initialRowModes[row.id] = { mode: GridRowModes.View, fieldToFocus: "label" }
        ))
        setRowModesModel(initialRowModes)
    }, [])

    const columns = [
        {
            field: "label",
            headerName: "Label",
            editable: true,
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            // preProcessEditCellProps: (params) => {
            //     const isValid = params.props.value !== '';
            //     return { ...params.props, error: !isValid };
            // },
        },
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
            field: "type",
            headerName: "Type",
            editable: true,
            type: "singleSelect",
            valueOptions: ["text", "number"],
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
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
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
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
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
        removeFormField({ field_id: row.field_id })
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
            form_id: form_id,
            field_id: newRow.field_id ?? null,
            order_id: 0,
            type: newRow.type,
            label: newRow.label,
            name: newRow.name,
            configuration: newRow.configuration ?? "{}",
            hint: newRow.hint ?? ''
        }

        let res;

        try {
            if (newRow?.isNew) {
                res = await createFormField(obj)
            }
            else {
                res = await updateFormField(obj)
            }
            updatedRow = {
                ...res.data,
                isNew: false,
                id: newRow.id
            }
        }
        catch (e) {
            console.error(e)
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
        />
    )

}