"use client";

import {useEffect,} from "react";
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";
import {Container, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Cookie from "js-cookie";

export default function LogoutPage() {

  const [cookies, setCookie] = useCookies(['token']);


  useEffect(() => {
    setCookie('token', null)
    Cookie.remove('integrationConnected')
    Cookie.remove('userId')
  }, []);

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            Logging out!
          </Typography>
        </Box>
      </Stack>
    </Container>
  )
}