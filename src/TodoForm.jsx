export default function TodoForm({setTitle, setText, onAdd}) {
    <div className="flex bg-gray-500 mb-2 gap-4 p-3 justify-center">
        <input value={task}
            onChange={ev => (setTask(ev.currentTarget.value))}
            className="rounded-md outline-none h-10 w-1/4 p-4 bg-gray-200" type="text" placeholder="Title goes here..."/>
        <input value={text}
            onChange={ev => (setText(ev.currentTarget.value))}
            className="rounded-md outline-none h-10 w-1/4 p-4 bg-gray-200" type="text" placeholder="Text goes here..."/>
        {/* <input className="rounded-md outline-none h-10 bg-gray-200" type="date" /> */}
        <button className="rounded-md bg-blue-500 h-10 px-5 text-white" onClick={add}>Add</button>
    </div>
}