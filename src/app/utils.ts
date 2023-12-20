import {ZodError} from "zod";
import {Dispatch, SetStateAction} from "react";

export function raiseErrorFromMap(error: ZodError, errorMap: Map<string, Dispatch<SetStateAction<boolean>>>) {
  error.issues.forEach(issue => {
    issue.path.forEach(path => {
      const fn = errorMap.get(path.toString())
      if (fn) {
        // @ts-ignore
        fieldErrorMap.get(path.toString())(true)
      }
    })
  })
}