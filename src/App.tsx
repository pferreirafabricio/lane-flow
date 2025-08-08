import { useEffect, useState } from "react";
import Timeline from "./Timeline";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/mock-data.json")
      .then((res) => {
        console.log("fetching items from mock-data.json");
        console.log("items", res);

        return res;
      })
      .then((res) => res.json())
      .then(setItems)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  console.log("items", items);

  return (
    <div className="App">
      <h1>Timeline</h1>
      {loading && <p>Loading...</p>}
      {!loading && <Timeline items={items} />}
    </div>
  );
}
