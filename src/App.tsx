import { useEffect, useState } from "react";
import Timeline from "./modules/timeline";
import { fetchTimeline } from "./services/lanes-service";
import type { TimelineActivity } from "./modules/timeline/timeline.types";
import MainContainer from "./components/layout/main-container";
import Footer from "./components/layout/footer";
import Loading from "./components/layout/loading";
import InnerContainer from "./components/layout/inner-container";

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
    <div>
      <header style={{ textAlign: "center", padding: "24px 0 24px 0" }}>
        <div style={{ display: "inline-block", marginBottom: 8 }}>
          <img
            src="/favicon/favicon.svg"
            alt="LaneFlow Logo"
            width={64}
            height={64}
          />
        </div>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 32,
            color: "#4E73DF",
            margin: 0,
            letterSpacing: "-1px",
          }}
        >
          LaneFlow
        </h1>
        <p
          style={{
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 14,
            color: "#5A5C69",
            maxWidth: 540,
            margin: "16px auto 0 auto",
            lineHeight: 1.5,
          }}
        >
          LaneFlow is an interactive timeline component designed for clarity and
          efficiency. It automatically arranges events into compact horizontal
          lanes, allowing related activities to share space when possible. With
          support for zooming, drag-and-drop date adjustments, and inline
          editing, LaneFlow offers a sleek, user-friendly way to visualize
          chronological data.
        </p>
      </header>
      <MainContainer>
        <InnerContainer>
          {loading && <Loading>Loading timeline...</Loading>}
          {!loading && <Timeline items={items} />}
        </InnerContainer>
      </MainContainer>
      <Footer />
    </div>
  );
}
