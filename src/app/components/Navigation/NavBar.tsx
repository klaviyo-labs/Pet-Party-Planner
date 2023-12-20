"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation'
import {useCookies} from "react-cookie";
import { usePathname } from 'next/navigation'


export default function NavBar() {

  const [cookies, setCookie] = useCookies(['token']);

  const router = useRouter()
  const pathname = usePathname()



  const logout = () => {
    router.push('/logout')
  }

  const login = () => {
    router.push('/login')
  }

  const logoutLoginButton = () => {

    if (cookies.token) {
      return <Button color="inherit" onClick={() => logout()} >Logout</Button>
    }

    return <Button color="inherit" onClick={() => login()}>Login</Button>
  }

  const homeButton = () => {
    if (cookies.token) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  if (pathname.includes("/view")) return <></>
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button
            color={"inherit"}
            onClick={() => homeButton()}
            variant={"text"}
          >
            Pet Party Planner
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {logoutLoginButton()}
        </Toolbar>
      </AppBar>
    </Box>
  );
}