import logo from "./logo.svg";
import "./App.css";
import CommentWidget from "@loudrr-app/widget";
// import "@loudrr/widget/dist/index.css"

function App() {
  return (
    <div
      className="App"
      style={{
        width: "1000px",
        margin: "auto",
      }}
    >
      <CommentWidget domainKey={"b83283b8-03de-43d6-8712-d13997289fdd"} />
    </div>
  );
}

export default App;
