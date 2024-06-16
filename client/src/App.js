import React, { useState, useEffect } from 'react'
import logo from './public/TaskMaster_Logo.png'

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#85B7F9]">
      <img src={logo} alt="TaskMaster Logo" className="h-60 w-auto" />
      <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center">
      <div className="flex-grow mr-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task"
        />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
        Add task
      </button>
    </form>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          {data.length === 0 ? (
            <p>You have no tasks... Add some!</p>
          ) : (
            data.sort((a, b) => a.done - b.done).map((task, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4 transition-all duration-500 ease-in-out">
                <div className='flex justify-between items-center'>
                  <div className="flex items-center">
                    <div className="rounded-checkbox mr-4">
                      <input type="checkbox" id={`task-${task.id}`} checked={task.done} onChange={() => handleComplete(task)} />
                      <label htmlFor={`task-${task.id}`}></label>
                    </div>
                    <p className={`font-bold text-md ${task.done ? 'line-through' : ''}`}>{task.title}</p>
                  </div>
                  <button className="focus:outline-none ml-4" onClick={() => handleDelete(task.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-red-500 hover:shadow-svg-trash">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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