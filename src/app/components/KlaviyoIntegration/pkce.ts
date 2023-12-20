
export const createVerifierCode = (): string => {
  return base64Encode(randomCode())
}

export const createChallengeCode = async (verifierCode: string): Promise<string> => {
  return base64Encode(await sha256Hash(verifierCode))
}

function randomCode(): string {
  let array = new Uint8Array(32);
  array = crypto.getRandomValues(array);
  return String.fromCharCode.apply(null, Array.from(array))
}

function base64Encode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// NOTE: crypto.subtle is only available over HTTPS and localhost
const sha256Hash = async (challengeCode: string): Promise<string> => {
  const hashedString = await crypto.subtle.digest(
    { name: "SHA-256" },
    new TextEncoder().encode(challengeCode)
  )
  let str = "";
  new Uint8Array(hashedString).forEach(charCode => {
    str += String.fromCharCode(charCode)
  })
  return str
}