import { Url, Email } from './common';

export type ForPressProps = {
  metaTitle: string,
  title: string,
  description: string,
  link: Url,
}

export type PRPerson = {
  name: string,
  nameDative: string,
  email: Email,
  role: string,
  photo: string,
}

export type PressReleases = {
  years: number[],
  pressReleases: PressRelease[],
}

export type PressRelease = {
  year?: number,
  cover: Url,
  downloadLink: Url,
  title: string,
  contents: string,
}

