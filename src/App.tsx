import { useEffect, useState } from "react";
import Timeline from "./modules/timeline";
import { fetchTimeline } from "./services/lanes-service";
import type { TimelineActivity } from "./modules/timeline/timeline.types";

export default function App() {
  const [items, setItems] = useState<TimelineActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const items = await fetchTimeline();
      setItems(items);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <main>
      <h1>Timeline</h1>
      {loading && <p>Loading...</p>}
      {!loading && <Timeline items={items} />}
    </main>
  );
}
