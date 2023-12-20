'use client'

import {useRouter} from "next/navigation";
import Cookie from "js-cookie";
import {useEffect, useState} from "react";
import {Button, Container, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ConnectToKlaviyo from "@/app/components/KlaviyoIntegration/ConnectToKlaviyo";
import PartiesTable from "@/app/dashboard/partiesTable";
import {Party} from "@/app/api/schemas/Party";

export default function Dashboard() {

  const router = useRouter()
  const integrationConnected = Cookie.get("integrationConnected") === 'true'
  // @ts-ignore
  const [data, setData ] = useState([] as Party[])

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const token = Cookie.get("token")
        const res = await fetch('/api/parties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const response = await res.json()

        if (response) {
          setData(response)
        }
      } catch (e) {
        console.log("Error Occurred")
      }
    }
    fetchParties()

  }, []);

  const createParty = (
    <Button
      variant="contained"
      onClick={(e) => router.push('/parties/create')}>
      Create a party
    </Button>
  )

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Box alignContent={"center"} sx={{paddingTop: 5}}>
          <Typography variant={"h1"} color={"text.secondary"} sx={{fontWeight: 'bold'}}>
            DASHBOARD
          </Typography>
        </Box>
        {!integrationConnected && <ConnectToKlaviyo />}
        {integrationConnected && createParty}
        {!!data.length && <PartiesTable data={data} />}
      </Stack>
    </Container>
  )
}