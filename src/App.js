import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

//access local storage
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return[]
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({show: false, msg:'', type:'',})
  const handleSubmit = (e) => {
    e.preventDefault()

    //if no item entered
    if(!name) {
      // display alert
      showAlert(true,'danger','please enter value')
    }
    //when editing make sure there is some value
    else if(name && isEditing) {
      //deal with new edits
      setList(list.map((item) => {
        if(item.id === editID) {
          return{...item, title:name}
        }
          return item
        } )
      )
      //reset the to do list submission box
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'item has been changed')
    } else {
      // show alert
      showAlert(true,'success','item has been added to the list')
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list,newItem])
      setName('')
    }
  }

  //Alert messages for all actions in to do list
  const showAlert = (show=false,type='',msg='') => {
    setAlert({show,type,msg})
  }

  //Alert and clear the list
  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([])
  }

  //Alert and remove a specific item from list
  const removeItem = (id) => {
    showAlert(true, 'danger', 'item has been removed');
    setList(list.filter((item) => (item.id !== id)))
  }

  //Edit a specific item within the list
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id)
    setName(specificItem.title)
  }

  //Every time the list has been modified, the local storage will save the list
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))  
  }, [list])

  //What the user will see on the screen
  return (
  <section className= 'section-center'> 
    <form className = "todo-form" onSubmit={handleSubmit}>    
      {alert.show && <Alert {...alert} removeAlert={showAlert} list ={list}/>}
      <h3>To-Do List</h3>
      <div className = 'form-control'>
        <input 
          type ='text' 
          className = 'todo' 
          placeholder = 'e.g. Eggs'  
          value = {name} 
          onChange={(e) => setName(e.target.value)} 
          />
        <button type = 'submit' className = 'submit-btn'>
          {isEditing ? 'edit' : 'submit'}
        </button>
      </div>

    </form> 

    {list.length > 0 && (     //Display list as long as 1 index in list array
      <div className = 'todo-container'> 
        <List items = {list} removeItem={removeItem} editItem={editItem}/>
        <button className = 'clear-btn' onClick={clearList}
        >Clear Items</button>
      </div>
      
    )}
  </section>
  );
}

export default App
