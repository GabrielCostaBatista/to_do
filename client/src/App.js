import React, { useState, useEffect } from 'react'

function App() {
  
  const [data, setData] = useState([]) // Change initial state to an empty array

  useEffect(() => {
  fetch('/tasks')
    .then(res => res.json())
    .then(data => {
    setData(data)
    console.log(data)
    })
  }, [])

  return (
  <div>
    <div>App</div>
    <div>
    {(typeof data.tasks === 'undefined') ? (
      <p>Loading...</p>
    ) : (
      data.tasks.map((task, index) => (
        <p key={index}>{task}</p>
      ))
    )}
    </div>
  </div>
  )
}

export default App
