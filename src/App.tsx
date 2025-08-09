import { useEffect, useState } from "react";
import Timeline from "./modules/timeline";
import { fetchTimeline } from "./services/lanes-service";
import type { TimelineActivity } from "./modules/timeline/timeline.types";
import MainContainer from "./components/layout/main-container";
import Footer from "./components/layout/footer";
import Loading from "./components/layout/loading";
import InnerContainer from "./components/layout/inner-container";
import AppHeader from "./components/layout/app-header";

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
      <AppHeader />
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
