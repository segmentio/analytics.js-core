import { readFileSync } from 'fs'

export interface Har {
  log: Log
}

interface Log {
  _recordingName: string
  creator: Creator
  entries: Entry[]
  pages: any[]
  version: string
}

interface Creator {
  comment: string
  name: string
  version: string
}

interface Entry {
  _id: string
  _order: number
  cache: Cache
  request: Request
  response: Response
  startedDateTime: string
  time: number
  timings: Timings
}

interface Cache {}

interface Request {
  bodySize: number
  cookies: any[]
  headers: Header[]
  headersSize: number
  httpVersion: string
  method: string
  postData: PostData
  queryString: any[]
  url: string
}

interface Header {
  name: string
  value: string
}

export interface PostData {
  mimeType: string
  params: any[]
  text: string
}

export interface Response {
  bodySize: number
  content: Content
  cookies: any[]
  headers: Header[]
  headersSize: number
  httpVersion: string
  redirectURL: string
  status: number
  statusText: string
}

interface Content {
  mimeType: string
  size: number
  text: string
}

interface Timings {
  blocked: number
  connect: number
  dns: number
  receive: number
  send: number
  ssl: number
  wait: number
}

export function parse() {
  const obj: Har = JSON.parse(
    // eslint-disable-next-line no-undef
    readFileSync(`${__dirname}/test_data/sample.har`, 'utf-8')
  )
  console.log(obj.log.entries)
}
