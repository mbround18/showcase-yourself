export interface Repository {
  name: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
}

export interface Experience {
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  highlights: string[]
}

export interface Education {
  school: string
  credential: string
  date?: string
  details?: string
}

export interface ShowcaseData {
  name: string
  github_username?: string
  profile: {
    tag_line: string
    summary: string
    actively_looking: boolean
    location: string
    blog: string
  }
  links: { name: string; url: string }[]
  skills: string[]
  pinned_repositories?: Repository[]
  top_repositories?: Repository[]
  experience?: Experience[]
  education?: Education[]
}

export async function fetchShowcase(): Promise<ShowcaseData> {
  const response = await fetch("/showcase.json")
  if (!response.ok) {
    throw new Error(`Failed to load /showcase.json: HTTP ${response.status}`)
  }
  return response.json()
}
