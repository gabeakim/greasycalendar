import React from 'react';
import styles from './TaskCreationForm.module.css';


export default function TaskCreationForm({ addTask }) {

    function submitHandler(formData) {
        console.log(formData.get("start"))
        addTask(formData.get("label"), formData.get("color"), new Date(formData.get("start")), formData.get("duration"));
    }

    return (
        <>
            <div>TaskCreationForm</div>
            <form action={submitHandler}>
                <input type="text" name="label" placeholder="Enter task name" />
                <input type="color" name="color" placeholder="Enter task color" />
                <input type="number" name="duration" placeholder="Duration (minutes)" />
                <input type="date" name="start" placeholder="Start time (timestamp)" />
                <button type="submit"></button>
            </form>
        </>
    );
}
