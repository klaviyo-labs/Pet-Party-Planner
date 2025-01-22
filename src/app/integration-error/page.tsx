'use client'
import {Container, Stack} from '@mui/material';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSearchParams } from 'next/navigation';

export default function IntegrationError() {
  const searchParams = useSearchParams();

  let errorText="An error occurred. Please try again later."
  if(searchParams.get('error')=='denial'){
    errorText = "In order to use this app, you need to grant access to your Klaviyo account. Please reconnect and click Accept to grant access to Klaviyo."
  } 

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography variant={"h2"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            {errorText}
          </Typography>
        </Box>
      </Stack>
    </Container>
  )
}