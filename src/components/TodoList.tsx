"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import scss from "./TodoList.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useDeleteTodoMutation,
  useDeleteTodosMutation,
  useGetTodosQuery,
  useIsEditIdTodosMutation,
  usePostTodosMutation,
  useUploadTodosMutation,
} from "../redux/api/todo";

interface IFTodos {
  _id: number;
  title: string;
  age: string;
  file: string[];
  createAt: string;
  updateAt: string;
}

interface IFTodo {
  _id: number;
  title: string;
  age: string;
  file: string;
  createAt: string;
  updateAt: string;
}

const api = process.env.NEXT_PUBLIC_API!;
const upload = process.env.NEXT_PUBLIC_UPLOAD!;

const TodoList = () => {
  const { register: registerAdd, handleSubmit: handleSubmitAdd } = useForm<IFTodos>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit } = useForm<IFTodos>();

  const [deleteTodoMutation] = useDeleteTodoMutation();
  const [postTodosMutation] = usePostTodosMutation();
  const [uploadTodosMutation] = useUploadTodosMutation();
  const [deleteTodosMutation] = useDeleteTodosMutation();
  const [isEditIdTodosMutation] = useIsEditIdTodosMutation();

  const { data: todosData } = useGetTodosQuery();
  const [todos, setTodos] = useState<IFTodo[]>([]);
  const [isEditId, setIsEditId] = useState<number | null>(null);

  useEffect(() => {
    if (todosData) {
      setTodos(todosData);
    }
  }, [todosData]);

  const onSubmit: SubmitHandler<IFTodos> = async (data) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);

    const { data: responseUpload } = await axios.post(upload, formData);

    const newData = {
      _id: data._id,
      title: data.title,
      age: data.age,
      file: responseUpload.url,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    const { data: responseTodo } = await postTodosMutation(newData);
    setTodos(responseTodo);
  };

  const onSubmitEdit: SubmitHandler<IFTodos> = async (data) => {
    const file = data.file[0];
    const formData = new FormData();
    formData.append("file", file);
    const { data: responseUpload } = await axios.post(upload, formData);

    const newData = {
      title: data.title,
      age: data.age,
      file: responseUpload.url,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    const { data: responseData } = await axios(`${api}/${isEditId}`, {
      method: 'PUT',
      data: newData
    });
    setTodos(responseData);
    setIsEditId(null);
  };

  const TodoDelete = async (_id: number) => {
    const { data } = await deleteTodoMutation(_id);
    setTodos(data);
  };

  const TodosDelete = async () => {
    const { data } = await deleteTodosMutation(api);
    setTodos(data);
  };

  return (
    <div className={scss.TodoList}>
      <h1>TodoList</h1>
      <form onSubmit={handleSubmitAdd(onSubmit)}>
        <input type="text" {...registerAdd("title", { required: true })} />
        <input type="number" {...registerAdd("age", { required: true })} />
        <input type="file" {...registerAdd("file", { required: true })} />
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => TodosDelete()}>Delete All</button>
      <div className={scss.EditTodos}>
        {todos.map((el) => (
          <div key={el._id}>
            {isEditId === el._id ? (
              <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                <input type="text" {...registerEdit("title", { required: true })} />
                <input type="number" {...registerEdit("age", { required: true })} />
                <input type="file" {...registerEdit("file", { required: true })} />
                <button type="submit">Edit</button>
                <button onClick={() => setIsEditId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <img src={el.file} alt={el.title} />
                <h4>My name: {el.title}</h4>
                <h5>My age: {el.age}</h5>
                <button onClick={() => setIsEditId(el._id)}>Edit</button>
                <button onClick={() => TodoDelete(el._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
