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
      <header style={{ textAlign: "center", padding: "48px 0 24px 0" }}>
        <div style={{ display: "inline-block", marginBottom: 16 }}>
          <svg
            width="120"
            height="48"
            viewBox="0 0 120 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="18" width="32" height="12" rx="6" fill="#4E73DF" />
            <rect x="46" y="10" width="28" height="12" rx="6" fill="#F6C23E" />
            <rect x="78" y="26" width="28" height="12" rx="6" fill="#1CC88A" />
            <rect
              x="60"
              y="34"
              width="18"
              height="12"
              rx="6"
              fill="#4E73DF"
              style={{ filter: "drop-shadow(0 2px 6px rgba(78,115,223,0.18))" }}
            />
          </svg>
        </div>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 40,
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
            fontSize: 18,
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
