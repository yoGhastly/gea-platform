import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ name: "Diego" })
}

export async function POST(req: NextRequest) {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/ditto", {
    method: "GET"
  })

  const data = await res.json();
  return NextResponse.json(data);
}
