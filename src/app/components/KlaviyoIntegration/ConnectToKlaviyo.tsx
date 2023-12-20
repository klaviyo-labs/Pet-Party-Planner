'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import {useRouter} from "next/navigation";
import {startRedirect} from "@/app/components/KlaviyoIntegration/OAuthSetup";

export default function ConnectToKlaviyo() {

  const router = useRouter()


  const startOAuthFlow = async () => {
    router.push(await startRedirect())
  }

  return (
    <Button
      variant="contained"
      onClick={() => startOAuthFlow()}
    >
      Connect To Klaviyo
    </Button>
  );
}