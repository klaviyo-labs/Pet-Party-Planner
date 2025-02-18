'use client'
import {Button, Container, Stack} from '@mui/material';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Cookie from "js-cookie";

export default function Settings() {

let integrationConnected = Cookie.get("integrationConnected") === 'true'
let settingTitle="Settings"
let settingText = "There are no connected integrations."
let integrationTitle = "Integrations"

// @ts-ignore
const uninstall = async (e) => {
  const token = Cookie.get("token")
  let userId: string = Cookie.get("userId") ?? ""

  try {
    const res = await fetch("/api/uninstall", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    console.log("Klaviyo integration disconnected.")
    Cookie.remove('integrationConnected')
  } catch (e) {
    console.error("Failed to fetch:", e);
    return new Response('Error occurred while revoking', {
      status: 500
    })
  }
  window.location.reload()
}

  if (integrationConnected) {
    settingText = "Klaviyo: connected"
  }
  function KLSettingsButton() {
    if (integrationConnected) {
      return (
        <Button 
          variant="contained"
          onClick = {(e) => uninstall(e)}>
          Remove integration
        </Button>
      )
    }
  }
  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography variant={"h1"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            {settingTitle}
          </Typography>
        </Box>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography variant={"h4"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            {integrationTitle}
          </Typography>
        </Box>
        <Box alignContent={"center"} sx={{paddingTop: 0}}>
          <p>{settingText}</p>
        </Box>
        {<KLSettingsButton/>}
      </Stack>
    </Container>
  )
}

