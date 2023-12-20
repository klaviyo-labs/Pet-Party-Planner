"use client";

import {Container, Stack, TextField, Button, Box} from "@mui/material";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function CreateAccount() {

  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("")

  const checkPasswordMatchError = (password: String, passwordMatch: String) => {
    return !!(password && passwordMatch && passwordMatch !== password)
  }

  const readyForSubmit = (email: String, password: String, passwordMatch: String) => {
    return !!(email && password && passwordMatch && checkPasswordMatchError(password, passwordMatch))
  }

  // @ts-ignore
  const createAccount = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {

      const response = await fetch("/api/users", {
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
      router.push("/login")
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <Container maxWidth="md" sx={{paddingTop: 5}}>
      <Stack spacing={2}>
        <TextField
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          error={checkPasswordMatchError(password, passwordMatch)}
          label="Password"
          type="password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          error={checkPasswordMatchError(password, passwordMatch)}
          label="Confirm Password"
          type="password"
          variant="outlined"
          onChange={(e) => setPasswordMatch(e.target.value)}
        />
      </Stack>
      <Box alignContent={"center"} sx={{paddingTop: 1}} >
        <Button
          disabled={readyForSubmit(email, password, passwordMatch)}
          variant="contained"
          onClick={(e) => createAccount(e)}>
          Create Account
        </Button>
      </Box>
    </Container>
  )
}