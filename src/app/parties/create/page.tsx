"use client";

import {Container, Stack, TextField, Button, Box, Alert} from "@mui/material";
import {Dispatch, SetStateAction, useState} from "react";
import { useRouter } from 'next/navigation'
import Cookie from "js-cookie"
import Typography from "@mui/material/Typography";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {PartyVerifier} from "@/app/api/parties/models";
import {raiseErrorFromMap} from "@/app/utils";

export default function createParties() {

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [addressAdditional, setAddressAdditional] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [nameError, setNameError] = useState(false)
  const [addressError, setAddressError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [stateError, setStateError] = useState(false)
  const [createError, setCreateError]: [boolean, ((value: (((prevState: boolean) => boolean) | boolean)) => void)] = useState(false)

  const fieldErrorMap = new Map<string, Dispatch<SetStateAction<boolean>>>([
    ["name", setNameError],
    ["address", setAddressError],
    ["city", setCityError],
    ["state", setStateError]
  ])

  const router = useRouter()

  // @ts-ignore
  const createParty = async (e) => {
    const party = PartyVerifier.safeParse({
      name,
      date: new Date(date.toString()),
      address,
      address2: addressAdditional,
      city,
      state
    })

    if (!party.success) {
      raiseErrorFromMap(party.error, fieldErrorMap)
      return
    }
    const token = Cookie.get("token")
    try {
      const res = await fetch("/api/parties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(party.data)
      })
      const responseJson = await res.json()
      router.push(`/parties/${responseJson.id}`)
    } catch (e) {
      setCreateError(true)
    }
  }

  return (
    <Container maxWidth="md" sx={{paddingTop: 5}}>
      <Stack spacing={2}>
        {createError && <Alert severity="error" onClose={() => {setCreateError(false)}}>Failed to create</Alert>}
        <Typography variant={"h2"}>
          Create a Party
        </Typography>
        <TextField
          error={nameError}
          value={name}
          label="Party Name"
          variant="outlined"
          onChange={(e) =>{
            setNameError(false)
            setName(e.target.value)}
          }
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Party Date"
            value={date}
            onChange={(newValue) => setDate(newValue || "")}
          />
        </LocalizationProvider>
        <TextField
          error={addressError}
          value={address}
          label="Address"
          variant="outlined"
          onChange={(e) => {
            setAddressError(false)
            setAddress(e.target.value)
          }}
        />
        <TextField
          label="Address cont. (optional)"
          value={addressAdditional}
          variant="outlined"
          onChange={(e) => {
            setAddressAdditional(e.target.value)
          }}
        />
        <TextField
          error={cityError}
          label="City"
          value={city}
          variant="outlined"
          onChange={(e) => {
            setCityError(false)
            setCity(e.target.value)
          }}
        />
        <TextField
          error={stateError}
          label="State (abbreviated)"
          value={state}
          variant="outlined"
          onChange={(e) => {
            setStateError(false)
            setState(e.target.value)
          }}
        />
      </Stack>
      <Box alignContent={"center"} sx={{paddingTop: 2}} >
        <Button
          variant="contained"
          onClick={(e) => createParty(e)}>
          Create
        </Button>
      </Box>

    </Container>
  )
}