import type { EventTypeEnum } from 'api-typings';

interface TeamEntry {
  name: string;
  persons: string [];
}

interface IEvent_body {
  id: number
  description: string
  image: string
  name: string
  project_title: null | string
  team: TeamEntry[]
}

interface IItems {
  readonly id: number;
  type: EventTypeEnum;
  event_body: IEvent_body;
  date_time: string;
  paid?: boolean;
  url: string;
  place: string;
}

export type IMainAfisha = {
  title: string;
  description: string;
  button_label: string;
  items: Array<IItems>;
}
