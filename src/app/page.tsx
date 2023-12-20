'use client'
import {Container, Grid, Stack} from '@mui/material';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {margin} from "@mui/system";

export default function Home() {
  return (
    <Container maxWidth="md">
        <Grid container sx={{paddingTop: 5}}
              spacing={2} direction="column"
              alignItems="center"
              justifyContent="center"
        >
          <Grid item xs={12} alignContent={"center"}>
            <Typography variant={"h1"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            Pet Party Planner
          </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h5"}>
              Welcome to a sample Klaviyo application.
            </Typography>
          </Grid>
          <Grid item xs={12} >
            <Typography>
              This application includes examples of the following:
            </Typography>
            <Typography sx={{marginLeft: 2, marginTop: 1}}>
                1. Starting the OAuth flow and creating access and refresh tokens
                <br/>
                2. Fetching an account's public key via OAuth
                <br/>
                3. Creating a list via OAuth
                <br/>
                4. Subscribing users to a list via Klaviyo Client API endpoints
                <br/>
                5. Viewing Profiles in a list via OAuth
          </Typography>
          </Grid>
        </Grid>
    </Container>
  )
}
