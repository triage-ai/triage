import { Box } from '@mui/material';
import {
	DataGrid
} from '@mui/x-data-grid';
import { useMemo } from "react";

const CustomDataGrid = ({ rows, setRows, columns, rowModesModel, setRowModesModel, onRowModesModelChange, onRowEditStop, processRowUpdate, disableColumnMenu, EditToolbar, props }) => {

	const slotProps = useMemo(() => (
		{
			toolbar: { rows, setRows, setRowModesModel, ...props },
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


	return (
		<Box
			sx={{
				height: 500,
				width: "100%",
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
				columns={columns}
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={onRowModesModelChange}
				onRowEditStop={onRowEditStop}
				processRowUpdate={processRowUpdate}
				slots={slots}
				slotProps={slotProps}
				disableColumnMenu={disableColumnMenu}
			/>
		</Box>
	);
}


export default CustomDataGrid;