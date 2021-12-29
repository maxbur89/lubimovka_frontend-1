import { Url } from "shared/types";

export type PressRelease = {
  year?: number,
  cover: Url,
  downloadLink: Url,
  title: string,
  contents: string,
}
