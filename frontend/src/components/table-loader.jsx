import { Skeleton, TableCell, TableRow } from "@mui/material";

export const TableRowsLoader = ({ rowsNum, colNum }) => {
    return [...Array(rowsNum)].map((row, index) => (
        <TableRow key={index}>
            {[...Array(colNum)].map((col, index) => (
                <TableCell key={index} component="th" scope="row">
                    <Skeleton variant="text" />
                </TableCell>
            ))}
        </TableRow>
    ));
};