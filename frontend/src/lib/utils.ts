import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTokenFromCookie(name: string): string | undefined {
  const cookies = document.cookie.split('; '); // Split cookies by '; ' to get individual "key=value" pairs
  console.log('cookies: ', cookies)
  for (const cookie of cookies) {

    const [key, value] = cookie.split('='); // Split each "key=value" pair
    console.log('cookies: ', cookies, key, value)
    if (key === name) {
      return value; // Return the value if the key matches
    }
  }

  return undefined; // Return undefined if the cookie is not found
}

export function setCookie(cname:any, cvalue:any, exdays:any) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname:any) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

