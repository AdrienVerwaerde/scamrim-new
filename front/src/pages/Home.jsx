import { Box, Container, Typography } from '@mui/material'
import React from 'react'

export default function
    Home() {
    return (
        <Container maxWidth="xl">
            <Box sx={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <Typography variant = "h3" sx = {{ textAlign: 'center', mt: "15rem" }
            } > Welcome to the card upload dashboard</Typography>
            </Box >
        </Container >
    )
}
