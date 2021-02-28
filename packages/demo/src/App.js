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
      <CommentWidget domainKey={"362ac97c-26ec-40ab-80ea-f22044768d2c"} />
    </div>
  );
}

export default App;
