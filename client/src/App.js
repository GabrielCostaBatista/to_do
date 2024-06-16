import React, { useState, useEffect } from 'react'

function App() {
  
  const [data, setData] = useState([])
  const [newTask, setNewTask] = useState('') 

  useEffect(() => {
    fetch('/tasks')
      .then(res => res.json())
      .then(data => {
        setData(data)
        console.log(data)
      })
  }, [])

  const handleSubmit = (e) => { 
    e.preventDefault()
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTask }),
    })
      .then(res => res.json())
      .then(data => {
        setData(prevData => [...prevData, data]) 
        setNewTask('') 
      })
  }

  const handleDelete = (id) => { 
    fetch(`/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setData(prevData => prevData.filter(task => task.id !== id)) 
      })
  }

  const handleComplete = (task) => { // Modified complete handler
    fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done: !task.done }), // Toggle the completed status
    })
      .then(res => res.json())
      .then(updatedTask => {
        setData(prevData => prevData.map(t => t.id === task.id ? updatedTask : t)) // Update the completed task in the existing tasks
      })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="New task"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Add task
            </button>
          </div>
        </form>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {data.length === 0 ? (
            <p>Loading...</p>
          ) : (
            data.map((task, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <div className='flex flex-col'>
                  <p className="font-bold text-xl mb-2">{task.title}</p>
                  <p className="text-gray-700 text-base">{task.done ? 'Completed' : 'Not Completed'}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                  <button className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${task.done ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'}`} onClick={() => handleComplete(task)}>
                    {task.done ? 'Uncomplete' : 'Complete'} {/* Change button text based on completed status */}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App