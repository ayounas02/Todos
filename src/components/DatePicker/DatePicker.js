import React from 'react';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  TextField,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import useStore from '../../store';

function DatePicker({ id, dueDate }) {
  const today = new Date().setHours(0, 0, 0, 0);
  const todos = useStore(state => state.todos);
  const setTodos = useStore(state => state.setTodos);

  function selectDueDate(id, dueDate) {
    if (dueDate < today) {
      alert('Due date can not be past date');
      return;
    }
    let index = todos?.findIndex((todo) => todo.id === id);
    if (todos[index]?.completed) {
      alert('This task is already completed. You can uncheck it to set due date.');
      return;
    }
    console.log(dueDate);
    console.log(dueDate.toISOString())
    console.log(JSON.stringify({
      dueDate: dueDate,
    }))
    let x = `${dueDate.getFullYear().toString()}-${dueDate.getMonth().toString()}-${dueDate.getDate().toString()}`;
    console.log(x);
    fetch(`http://localhost:3001/dueDate/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",

      body: {
        dueDate: x,
      },
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        dueDate: dueDate,
      };
      setTodos(newTodos);
    });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Select Due date"
        inputFormat="MM/dd/yyyy"
        value={dueDate ? dueDate : null}
        minDate={!dueDate ? today : null}
        onChange={(selectedDate) => {
          selectDueDate(id, selectedDate);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export default DatePicker;