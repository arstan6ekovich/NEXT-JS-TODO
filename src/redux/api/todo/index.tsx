import { api as index } from "..";

const api = index.injectEndpoints({
  endpoints: (build) => ({
    GetTodos: build.query<TODO.GetTodosRes, TODO.GetTodosReq>({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["todo"],
    }),
    PostTodos: build.mutation<TODO.PostTodosRes, TODO.PostTodosReq>({
      query: (newData) => ({
        url: "/",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["todo"],
    }),
    DeleteTodo: build.mutation<TODO.DeleteTodoRes, TODO.DeleteTodoReq>({
      query: (_id) => ({
        url: `/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["todo"],
    }),
    DeleteTodos: build.mutation<TODO.DeleteTodoRes, TODO.DeleteTodoReq>({
      query: () => ({
        method: "DELETE",
      }),
      invalidatesTags: ["todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useDeleteTodoMutation,
  usePostTodosMutation,
  useDeleteTodosMutation,
} = api;
