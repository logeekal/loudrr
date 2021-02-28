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
      <CommentWidget domainKey={"667c5db7-178b-40a6-93fd-9e38077edda4"} />
    </div>
  );
}

export default App;
