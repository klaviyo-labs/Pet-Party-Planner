'use client'

import {Button, CircularProgress, Container, Grid, Stack, TextField} from '@mui/material';
import Typography from "@mui/material/Typography";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Party} from "@/app/api/schemas/Party";
import * as React from "react";
import Box from "@mui/material/Box";
import {AttendeeVerifier} from "@/app/api/schemas/Attendee";
import {raiseErrorFromMap} from "@/app/utils";
import Link from "next/link";

interface RenderState {
  party: Party | null,
  error: boolean,
  loading: boolean
}

export default function Party({params}: { params: { id: string } }) {

  const [renderState, setRenderState] = useState({
  party: null,
  loading: true,
  error: false
} as RenderState)

  // form info
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [petType, setPetType] = useState("")
  const [petName, setPetName] = useState("")

  // form errors
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [petTypeError, setPetTypeError] = useState(false)
  const [petNameError, setPetNameError] = useState(false)

  const errorMap = new Map<string, Dispatch<SetStateAction<boolean>>>([
    ['firstName', setFirstNameError],
    ['lastName', setLastNameError],
    ['email', setEmailError],
    ['petType', setPetTypeError],
    ['petName', setPetNameError]
  ])

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const res = await fetch(`/api/parties/render/${params.id}`, {})
        const party: Party = await res.json()
        setRenderState({
          party,
          loading: false,
          error: false
        })
      } catch (e) {
        setRenderState({
          party: null,
          loading: false,
          error: true
        })
      }
    }
    fetchParty()

  }, []);

  const errorMessage = () => {
    return (
      <Typography variant={"h1"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
        An Error Occurred
      </Typography>
    )
  }

  const formSubmit = async () => {
    const attendee = AttendeeVerifier.safeParse({
      firstName,
      lastName,
      email,
      petType,
      petName,
    })
    if (!attendee.success) {
      raiseErrorFromMap(attendee.error, errorMap)
      return
    }

    const userId = params.id.split("-")[0]

    const data = {
      listId: renderState.party?.listId || "",
      userId: userId
    }
    const searchParams = new URLSearchParams(data);
      const url = `/api/profiles?${searchParams.toString()}`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(attendee.data)
    }
    const res = await fetch(url, options)
    setFirstName("")
    setLastName("")
    setEmail("")
    setPetType("")
    setPetName("")
  }

  return (
    <Container maxWidth="lg">
      {renderState.loading && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{minHeight: '100vh'}}
        >
          <Grid item xs={3}>
            <CircularProgress/>
          </Grid>
        </Grid>
      )}
      {renderState.error && errorMessage()}
      {!!renderState.party && (
        <Box sx={{borderRadius: 5, marginTop: 10, bgcolor: "lightgrey"}}>
          <Stack padding={5}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant={"h2"} color={"text.secondary"} sx={{fontWeight: 'bold', paddingTop: 2}}>
                  {renderState.party.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box borderTop={3} sx={{marginTop: 2, marginBottom: 2}}/>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"h5"} color={"text.secondary"}>
                  When:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"h5"} color={"text.secondary"}>
                  {new Date(renderState.party.date).toDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"h5"} color={"text.secondary"}>
                  Location:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color={"text.secondary"}>
                 {renderState.party.address}
                </Typography>
                <Typography color={"text.secondary"}>
                  {renderState.party.address2}
                </Typography>
                <Typography color={"text.secondary"} sx={{paddingBottom: 2}}>
                  {renderState.party.city}, {renderState.party.state}
                </Typography>
              </Grid>
            </Grid>


            <Box borderTop={2} >
              <Stack spacing={2} sx={{paddingTop: 2}}>
                <TextField
                  error={firstNameError}
                  value={firstName}
                  label="First Name"
                  variant="outlined"
                  onChange={(e) => {
                    setFirstNameError(false)
                    setFirstName(e.target.value)
                  }}
                />
                <TextField
                  error={lastNameError}
                  value={lastName}
                  label="Last Name"
                  variant="outlined"
                  onChange={(e) => {
                    setLastNameError(false)
                    setLastName(e.target.value)
                  }}
                />
                <Typography color={"red"}>
                  Note: If you have double opt-in enabled for email consent,
                  an email will be sent to the below email address to confirm their subscription.
                  For testing purposes, we recommend only inputting email addresses you have access to. See <Link href={"https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api"}>this article</Link> to learn more about email consent.
                </Typography>
                <TextField
                  error={emailError}
                  value={email}
                  label="Email"
                  variant="outlined"
                  onChange={(e) => {
                    setEmailError(false)
                    setEmail(e.target.value)
                  }}
                />
                <TextField
                  error={petTypeError}
                  value={petType}
                  label="Pet Species"
                  variant="outlined"
                  onChange={(e) => {
                    setPetTypeError(false)
                    setPetType(e.target.value)
                  }}
                />
                <TextField
                  error={petNameError}
                  value={petName}
                  label="Pet Name"
                  variant="outlined"
                  onChange={(e) => {
                    setPetNameError(false)
                    setPetName(e.target.value)
                  }}
                />
                <Box>
                  <Button variant={"contained"} onClick={() => formSubmit()}>
                  Register
                </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Container>

  )
}
