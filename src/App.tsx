import "./App.css";
import Users from "./components/Users/Users.tsx";

function App() {
  return (
    <>
      <div className="app">
        <div className="content">
          <div className="header">
            <h1>User To-DO Table</h1>
            <p>User task table for effective planning.</p>
          </div>
          <Users />
        </div>
      </div>
    </>
  );
}

export default App;
