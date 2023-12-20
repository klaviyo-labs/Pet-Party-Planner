'use client'

import {Container, Stack, Button, Snackbar, Grid, CircularProgress} from '@mui/material';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Cookie from "js-cookie";
import {Party} from "@/app/api/schemas/Party";
import {GetListMemberResponseCollectionDataInner} from "klaviyo-api/model/getListMemberResponseCollectionDataInner";
import * as React from "react";
import AttendeeList from "@/app/parties/[id]/AttendeeList";

export default function Party({ params }: { params: { id: string } }) {

  const [party, setParty ] = useState({
    id: params.id,
    name: '',
    address: '',
    address2: '',
    state: '',
    city: '',
    listId: ''
  } as Party )
  const [attendees, setAttendees] = useState([] as Array<GetListMemberResponseCollectionDataInner>)
  const [clipboardSnack, setClipboardSnack] = useState(false)

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const token = Cookie.get("token")
        const res = await fetch(`/api/parties/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const response = await res.json()
        const party: Party = response.party
        const attendees: Array<GetListMemberResponseCollectionDataInner> = response.attendees
        if (party) {
          setParty(party)
        }
        if (attendees) {
          setAttendees(attendees)
        }
      } catch (e) {
        console.log("Error Occurred")
      }
    }
    fetchParty()

  }, []);

  const onShareClick = () => {
    const userId = Cookie.get('userId')
    const url = `localhost:3000/view/parties/${userId}-${party.id}`
    setClipboardSnack(true)
    navigator.clipboard.writeText(url)
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} sx={{paddingTop: 5}}>
        <Grid item xs={10}>
          <Typography variant={"h3"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
          {party.name}
        </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={"contained"}
            color={"inherit"}
            onClick={() => onShareClick()}
          >
            Share
          </Button>
        </Grid>
      </Grid>
      {attendees.length > 0 && <AttendeeList data={attendees} />}
      {attendees.length === 0 && (
         <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{minHeight: '100vh'}}
        >
          <Grid item xs={3}>
            <Typography variant={"h5"} color={"text.secondary"}>
            No Attendees, Share your Signup Form
          </Typography>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={clipboardSnack}
        onClose={() => setClipboardSnack(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </Container>

  )
}
