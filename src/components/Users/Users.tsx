import { useEffect, useState, useRef } from "react";
import "./Users.css";
import userImage from "../../assets/User.svg";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Todo {
  userId: number;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  todoCount: number;
}

function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true); 

  useEffect(() => {
    isMounted.current = true; 

    const fetchData = async () => {
      try {
        setLoading(true);

        setTimeout(async () => {
          const [usersRes, todosRes] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/users"),
            fetch("https://jsonplaceholder.typicode.com/todos"),
          ]);

          const users: User[] = await usersRes.json();
          const todos: Todo[] = await todosRes.json();

          const todoCountMap = new Map<number, number>();

          todos.forEach((todo) => {
            todoCountMap.set(
              todo.userId,
              (todoCountMap.get(todo.userId) || 0) + 1
            );
          });

          const userTodoCount = users.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            todoCount: todoCountMap.get(user.id) || 0,
          }));

          if (isMounted.current) {
            setUsers(userTodoCount);
            setLoading(false);
          }
        }, 1000);
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
        if (isMounted.current) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false; 
    };
  }, []);

  if (loading) {
    return <p className="loading">Загрузка...</p>;
  }

  return (
    <>
      <div className="user-header">
        <div className="user-flex">
          <p>#</p>
          <p>USERNAME</p>
        </div>
        <p className="shift-left">TO-DO COUNT</p>
      </div>
      <div className="user-main">
        {users.map((user, index) => (
          <div key={user.id} className="user-table">
            <div className="user-flex">
              <p className="user-index">{index + 1}</p>
              <img className="user-image" src={userImage} alt="" />
              <p className="user-name">
                {user.username}{" "}
                <span className="user-email">({user.email})</span>
              </p>
            </div>
            <p className="count">{user.todoCount}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Users;
