import axios from "axios";
import React, { useRef } from 'react';
import { useEffect, useState } from "react"

export default function Todo({username, setUsername}){
    
    const [items, setItems] = useState([]);
    const backendUrl = 'http://localhost:4001/api/todos';

    console.log('Todo renders !');

    const add = (title, text) => {
        axios.post(backendUrl, {title, text}, {withCredentials: true})
        .then(res => setItems([...items, {_id: res.data.id, title, text, completed: false}]))
        .catch(err => console.log("Frontend Error: ", err));
    }

    const del = (id) => {
        console.log('Entered deletion section !')
        if(!id) return;
        const payload = {
            method: "DELETE",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({id}),
            credentials: 'include',
        }
        fetch(backendUrl, payload).then(res => res.json()).then(data => console.log(data.msg)).catch(err => console.log("Error del: ", err));

        console.log("after the call is made")
        setItems(items.filter(item => item._id !== id))
    }

    const handleCheckbox = (event, index) => {

        axios.put(backendUrl, {id: items[index]._id}, {withCredentials: true})
        .then(res => console.log(res.data.msg)).catch(err => console.log('Axios Error: ', err));

        const newArr = [...items];
        newArr[index] = {...items[index], completed: event.target.checked}
        setItems(newArr);
        event.target.disabled = true;
    }

    useEffect(()=>{
        console.log('Todo In the useEffect section !')
        axios.get(backendUrl, {withCredentials: true}).then(res => setItems(res.data.todos)).catch(err => console.log("Error: ", err));
        console.log(items)
    }, []);
    
    return(
        <div className="h-screen bg-[url('./assets/todo_back.jpg')] bg-cover">
            <TodoHead setUsername={setUsername} username={username}/>
            <TodoForm add={add} />
            <TodoList items={items} del={del} handleCheckbox={handleCheckbox}/>
        </div>
    )
}

const TodoHead = React.memo(({setUsername, username}) => {
    console.log('TodoHead renders !');

    const logout = () => {
        axios.get('http://localhost:4001/user/logout', {withCredentials: true}).then(res => {console.log('Logged out !'); setUsername('');})
        .catch(err => console.log('Error: ', err));
    }

    useEffect(()=> {
        axios.get("http://localhost:4001/api/todos/?getName=some", {withCredentials: true})
        .then(res => {setUsername(res.data.userName)}).catch(err => console.log("Axios Error: ", err));
    }, [])
    return (
        <>
            <h1 className="text-[40px] text-center bg-gray-300 mb-2 p-3 font-bold text-gray-700">
                Todo app
            </h1>
            <p className="absolute left-0 top-0 m-5 text-[30px] font-bold px-4 cursor-default bg-clip-text text-transparent bg-gradient-to-r from-pink-500 from-10% via-blue-500 via-30% to-red-500 to-90% transition ease-in-out delay-100 hover:translate-x-1 hover:scale-110">
                {username.charAt(0).toUpperCase() + username.slice(1)}
            </p>
            <button className="absolute right-0 top-0 m-5 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={logout}>
                Logout
            </button>
        </>
    )
})

const TodoForm = React.memo(({add})=>{
    console.log('TodoForm renders !');
    const titleRef = useRef();
    const textRef = useRef();
    
    const handleClick = () => {
        if(!titleRef.current.value) return alert('Title section is required');
        if(!textRef.current.value) return alert('Text section is required');

        add(titleRef.current.value, textRef.current.value);

        titleRef.current.value = '';
        textRef.current.value = '';
    }
    
    return (
        <div className="flex bg-gradient-to-r from-violet-400 from-10% via-pink-400 via-70% to-blue-400 to-90% mb-1 gap-4 p-3 justify-center">
                <input ref={titleRef}
                    className="rounded-md outline-none h-10 w-1/4 p-4 bg-gray-200" type="text" placeholder="Title goes here..."/>
                <input ref = {textRef}
                    className="rounded-md outline-none h-10 w-1/4 p-4 bg-gray-200" type="text" placeholder="Text goes here..."/>
                <button className="rounded-md bg-blue-400 hover:bg-blue-500 border border-white h-10 px-5 text-white" onClick={handleClick}>Add</button>
            </div>
    )
})

function TodoList({items, del, handleCheckbox}) {
    console.log('TodoList renders !');
    return (
        <div className="py-5 flex flex-col items-center gap-5 backdrop-blur-sm h-3/4">
           {items.map((data, index)=>(
            <div key={index} className="flex justify-between gap-2 w-3/5">
                <input type="checkbox" className="text-black bg-pink-600 accent-pink-300 focus:accent-pink-500" onChange={(e) => handleCheckbox(e, index)} disabled = {data.completed} checked = {data.completed}/>
                <p className={`bg-gray-200 p-2 rounded-md w-5/6 ${data.completed ? 'line-through':''}`}>
                <span className="font-semibold">{data.title.charAt(0).toUpperCase() + data.title.slice(1)}</span> 
                : {data.text.charAt(0).toUpperCase() + data.text.slice(1)}
                </p>
                {/* <button onClick={() => del(data._id)} className="px-5 rounded-md bg-red-100 text-red-900 border border-red-900">Remove</button> */}
                <button onClick={() => del(data._id)} className="rounded-md bg-red-100 text-red-900 border border-red-900">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="80" height="30" viewBox="0 0 512 512">
                        <path fill="#EF4823" d="M388.9,372.5c-0.8-0.3-1.6-0.7-2.3-1.3c-11.7-9.4-20.2-22.2-28.8-34.3c-8.9-12.6-19.1-24.1-28.8-36.1c-5.2-6.4-10.2-12.9-15.2-19.5c-3.2-5.8-6.6-11.5-10.1-17.2c2-3.4,3.9-6.8,5.7-10.3c0,0.1,0.1,0.1,0.1,0.2c9.9-13.7,20-27.3,30.6-40.5c18.8-23.5,38.1-46.5,56.5-70.2c-18.8-24.5-36.7-49.6-51.9-76.4c-4.3,8.9-8.1,18-11.7,27.2c-6.2,15.8-12.8,31.4-20.5,46.6c-10.9,21.6-22.6,43-35.1,63.8l0.4,0.7c-0.9,1.2-1.8,2.4-2.7,3.6c-1.9,2-3.8,3.9-5.6,5.8c-2.6-4-5.2-8.1-7.9-12.1c-0.4-0.6-0.7-1.1-1.1-1.7c-16-26.8-31.3-54.1-45.7-81.8c-5.5-10.6-11.8-20.8-17.7-31.3c-4.9-8.7-10.7-18.1-13.1-27.9c-20,10.8-39.7,23-55.5,39.4c3,1.6,5.8,3.5,8.4,5.7c9.8,8.2,17.5,18.7,25.3,28.8c8.7,11.3,17.9,22.1,26.7,33.2c18.1,23,35.3,46.6,53.2,69.8c0.1-0.1,0.2-0.3,0.3-0.4c2.4,3.6,4.8,7.2,7.6,10.4c-0.7,1.3-1.4,2.7-2.1,4c-1.7,2.5-3.3,5-4.9,7.5c-0.1-0.1-0.2-0.2-0.3-0.4c-14.6,20.6-30.2,40.4-47,59.2c-17.1,19.3-35.4,41.5-58.2,54.7c0.6,1.3,0.7,2.8,0.3,4.1c9,9.2,21.1,15.2,29.6,25c7.9,9,14.9,18.8,23,27.6c8.3-22.3,21.9-42.6,36-61.7c14.1-19.1,28.7-37.9,42.8-57c2.5-2.9,4.8-6,7.1-9.1c2.6-2.9,5.3-5.7,7.6-8.7c4.1,4.4,7.9,9,12.4,13c9.7,12.6,19,25.4,27.6,38.7c17.8,27.6,30.2,58,46.3,86.6c9.5-16.3,20.3-32.5,25.4-50.6c-1.8-1.2-3.5-2.8-5.4-4.6C389.7,374.2,389.2,373.4,388.9,372.5z"></path>
                        <path d="M389.5,356.8c0,0-0.1,0-0.1,0c-8-7.9-14.4-17.3-20.9-26.5c-8.9-12.7-19-24.1-28.8-36.1c-7.8-9.6-15.3-19.4-22.5-29.4c10.4-14.4,20.9-28.8,32-42.7c19.9-24.9,40.4-49.3,59.9-74.5c1.6-2.1,2.6-5.3,0.8-7.6c-21.2-27.5-41.5-55.8-58.1-86.3c0.1-0.2,0.2-0.4,0.3-0.5c-1.6-2.7-3-5.6-4.3-8.5c-0.7-1.2-1.3-2.3-2-3.5c-0.1,0.1-0.3,0.1-0.4,0.2c-1.5,0.8-2.8,1.6-4.1,2.4c-0.3,0.1-0.5,0.2-0.8,0.3c-1.2,4.2-2.9,8.4-5.1,12.1c0.1,0.2,0.2,0.3,0.3,0.5c-12.4,23.8-20.3,50-32.2,74.1c-10.3,20.8-21.5,41.3-33.4,61.4c-14.8-24.9-28.9-50.1-42.3-75.7c-2.8-5.4-5.8-10.7-8.8-16.1c-4.9-6.8-9.2-14-12.4-21.7c-2.8-4.8-5.6-9.8-7.8-14.9c-3.7-6.3-6.8-12.8-10-19.3c-1.2-0.1-2.4,0.1-3.7,0.7c-24,12.5-47.8,26.7-66.5,46.5c-1.2,1.3-1.7,2.8-1.7,4.2c4.9,6.6,9.6,13.4,14.1,20.2c5.7,5,10.5,11.2,15,16.9c8,10.1,16.3,20.1,24.2,30.2c11.3,14.4,22.7,28.8,33.9,43.3c10.4,13.6,20.3,27.6,30.8,41.1c-14,20-29.2,39.3-45.3,57.7c-9.7,11.1-19.8,22.1-30.2,32.6c-8.9,9-18.5,17.5-29.5,23.8c-0.2,0.1-0.5,0.2-0.7,0.3l-6.1,3.2c-4.1,2.1-3.8,6.3-1.4,9c0.1,1,0.4,2,0.9,2.8c8.9,12.7,22.7,20,33.8,30.4c12,11.4,20.4,26.1,32.7,37.4c3.6,3.3,9.1,1.5,10.4-3.1c7.3-25.4,22.8-48.2,38.5-69.2c15.5-20.8,31.3-41.4,46.7-62.3c7.4,9.5,14.5,19.2,21.4,29.1c10.5,15.2,20,31.1,28.3,47.6c8.2,16.1,15.7,32.6,24.5,48.4c2,3.7,4.2,7.4,6.4,11c2.4,4,8.7,3.9,10.9-0.3c11.7-22.1,27.7-43.3,33.2-68.1c-2.8-2.4-5.4-4.8-7.8-7.2C397.5,366.7,392.8,362,389.5,356.8z M370.5,430.2c-16.1-28.5-28.5-59-46.3-86.6c-8.6-13.3-17.9-26.1-27.6-38.7c-4.5-4-8.3-8.6-12.4-13c-2.4,3-5,5.9-7.6,8.7c-2.2,3.1-4.6,6.2-7.1,9.1c-14.2,19.1-28.7,37.8-42.8,57c-14.1,19-27.7,39.3-36,61.7c-8.1-8.8-15.2-18.6-23-27.6c-8.5-9.8-20.6-15.8-29.6-25c0.5-1.3,0.3-2.8-0.3-4.1c22.9-13.1,41.1-35.4,58.2-54.7c16.7-18.8,32.4-38.6,47-59.2c0.1,0.1,0.2,0.2,0.3,0.4c1.6-2.5,3.2-5,4.9-7.5c0.7-1.3,1.4-2.7,2.1-4c-2.8-3.2-5.2-6.8-7.6-10.4c-0.1,0.1-0.2,0.3-0.3,0.4c-17.9-23.1-35.1-46.8-53.2-69.8c-8.8-11.2-18-22-26.7-33.2c-7.8-10.1-15.5-20.5-25.3-28.8c-2.6-2.2-5.4-4.1-8.4-5.7c15.8-16.4,35.5-28.6,55.5-39.4c2.4,9.8,8.2,19.2,13.1,27.9c5.9,10.4,12.1,20.7,17.7,31.3c14.4,27.7,29.7,55,45.7,81.8c0.4,0.6,0.8,1.1,1.1,1.7c2.7,4,5.3,8,7.9,12.1c1.8-2,3.7-3.9,5.6-5.8c0.9-1.2,1.8-2.4,2.7-3.6l-0.4-0.7c12.5-20.9,24.2-42.2,35.1-63.8c7.7-15.2,14.2-30.8,20.5-46.6c3.6-9.2,7.4-18.3,11.7-27.2c15.2,26.8,33.2,51.9,51.9,76.4c-18.5,23.7-37.7,46.8-56.5,70.2c-10.6,13.3-20.7,26.8-30.6,40.5c0-0.1-0.1-0.1-0.1-0.2c-1.7,3.5-3.6,6.9-5.7,10.3c3.6,5.6,6.9,11.3,10.1,17.2c4.9,6.6,10,13.1,15.2,19.5c9.7,12,19.9,23.4,28.8,36.1c8.6,12.1,17.1,24.9,28.8,34.3c0.7,0.6,1.5,1,2.3,1.3c0.3,0.9,0.8,1.7,1.6,2.5c1.8,1.8,3.5,3.4,5.4,4.6C390.7,397.7,379.9,413.9,370.5,430.2z"></path>
                    </svg>
                </button>
            </div>
            ))}
        </div>
    )
}