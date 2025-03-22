import { useParams } from "react-router-dom"
import { WhiteContainer } from "../../components/white-container"
import { Layout } from "../../components/layout"
import { Box, Hidden, Skeleton, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useTicketBackend } from "../../hooks/useTicketBackend"
import { TicketX } from "lucide-react"
import { EditableInput, EditableSelect } from "../../components/editable-input"
import { DepartmentSelect } from "../department/DepartmentSelect"
import { useData } from "../../context/DataContext"

export const TicketView = () => {
    const { number } = useParams()

    const { getTicketByNumber } = useTicketBackend()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(false)

    const {formattedDepartments, refreshDepartments} = useData()

    useEffect(() => {
        setLoading(true)
    
        getTicketByNumber(number)
            .then(res => {
                setTicket(res.data)
            })
            .catch(() => {
                console.error('Error while fetching ticket by number')
            })
        setLoading(false)
    }, [])

    const handleChange = (name, value) => {
        // console.log(name)
        // console.log(value)
        setTicket(
            p => ({
                ...p,
                [name]: value
            })
        )
    }

    return (
        <Layout
            title={'Ticket #' + number}
            subtitle={''}
            buttonInfo={{
                hidden: false
            }}
        >
            <WhiteContainer noPadding>

                {
                    loading ?
                        <Box
                            sx={{
                                width: '100%',
                                // height: '60vh', // whitecontainer min height
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: '65%'
                            }}
                        >
                            <Skeleton variant="rounded" width={210} height={60} />
                            <Skeleton variant="rounded" width={210} height={60} />
                            <Skeleton variant="rounded" width={210} height={60} />
                        </Box>
                    :
                    !ticket ?
                        <Box
                            sx={{
                                width: '100%',
                                height: '60vh', // whitecontainer min height
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: '65%'
                            }}
                        >
                            <TicketX size={80} />
                            <Typography fontWeight={600} variant="h2">
                                You can't view this ticket
                            </Typography>
                            <Typography variant="subtitle2">
                                It may have been deleted or you don't have permission to view it.
                            </Typography>
                        </Box>
                    :
                    <Box
                        width={'100%'}
                    >
                        <EditableInput
                            name='title'
                            value={ticket.title}
                            variant="h1"
                            handleChange={handleChange}
                        />
                        
                        <EditableSelect
                            name='dept_id'
                            value={ticket.dept_id}
                            variant="h4"
                            handleChange={handleChange}
                            SelectComponent={DepartmentSelect}
                            refresh={refreshDepartments}
                            options={formattedDepartments}
                        />

                

                    </Box>
                }



            </WhiteContainer>

        </Layout>
    )


}