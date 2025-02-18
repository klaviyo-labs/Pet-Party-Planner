'use client'
import {Button, Container, Stack} from '@mui/material';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
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

  function SettingsText() {
    if (integrationConnected) {
      return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography>Klaviyo: connected</Typography>
        </Grid>
        <Grid item xs={4}>
          {<KLSettingsButton/>}
        </Grid>
      </Grid>
      )
    } else {
      return <Box alignContent={"center"}>
      <Typography variant={"body1"} color={"text.primary"}>
        There are no connected integrations.
      </Typography>
    </Box>
    }


  }
  if (integrationConnected) {
    settingText = "Klaviyo: connected"
  }
  function KLSettingsButton() {
    if (integrationConnected) {
      return (
        <Button 
          variant="outlined"
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
          <Typography variant={"h2"} sx={{fontWeight: 'bold'}}>
            {settingTitle}
          </Typography>
        </Box>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography variant={"h5"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            {integrationTitle}
          </Typography>
        </Box>
        {<SettingsText/>}
      </Stack>
    </Container>
  )
}

