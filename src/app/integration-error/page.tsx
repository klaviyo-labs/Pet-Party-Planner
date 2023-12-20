'use client'
import {Container, Stack} from '@mui/material';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function IntegrationError() {

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography variant={"h1"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            ERROR OCCURRED
          </Typography>
        </Box>
      </Stack>
    </Container>
  )
}