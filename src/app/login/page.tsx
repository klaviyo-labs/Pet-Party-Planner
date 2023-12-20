"use client";

import {Container, Stack, TextField, Button, Box} from "@mui/material";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import {useCookies} from "react-cookie";
import Cookie from "js-cookie"
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {execOnce} from "next/dist/shared/lib/utils";
export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setError] = useState(false)

  const [cookies, setCookie] = useCookies(['token']);

  const router = useRouter()

  // @ts-ignore
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) throw new Error("Login failed")
      const { token, accountInfo } = await response.json();
      setCookie('token', token)
      Cookie.set("userId", accountInfo.userId)
      Cookie.set("integrationConnected", accountInfo.integrationConnected || false)
      router.replace("/dashboard")
    } catch (error) {
      console.error(error);
      setError(true)
    }
  };

  return (
    <Container maxWidth="md" sx={{paddingTop: 5}}>
      <Stack spacing={2}>
        <TextField
          error={hasError}
          label="Username"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          error={hasError}
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>
      <Box alignContent={"center"} sx={{paddingTop: 1}} >
        <Button
          variant="contained"
          onClick={(e) => handleLogin(e)}>
          Login
        </Button>
      </Box>
      <Box>
        <Typography>Dont have an account? </Typography>
        <Link href={"/create"}><Typography>Click Here</Typography></Link>
      </Box>

    </Container>
  )
}