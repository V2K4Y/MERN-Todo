export default function TodoItem({item, onCheckboxChange, onRemove}) {
    return (
        <div key={index} className="flex justify-between gap-2 w-3/5">
            <input type="checkbox" onChange={(e) => handleCheckbox(e, index)} disabled = {data.completed} checked = {data.completed}/>
            <p className={`bg-gray-200 p-2 rounded-md w-5/6 ${data.completed ? 'line-through':''}`}>
              <span className="font-semibold">{data.title}</span> : {data.text}
            </p>
            <button onClick={() => del(data._id)} className="px-5 rounded-md bg-red-300 text-red-900">Remove</button>
        </div>
    )
}