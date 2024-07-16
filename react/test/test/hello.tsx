import React from 'react'
export type DataType = {
  name: string
}
export type PropsType = {
  data: DataType
}
export default function App({ data }: PropsType) {
  return (
    <div>
      <div className="text-red-500 p-2 text-xs m-80">Hello, {data.name}!</div>
      <div className="text-green-500 p-2 text-xl m-80">Hello</div>
    </div>
  )
}