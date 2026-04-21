import { Dashboard } from "@/components/Dashboard";
import featuresData from "@/data/features.json";
import type { FeaturesData } from "@/lib/types";

// ISR: 6시간마다 페이지 재생성 (백그라운드에서)
// 나중에 changelog 자동 fetch 스크립트와 결합하면 실시간 업데이트 가능
export const revalidate = 21600;

export default function HomePage() {
  const data = featuresData as FeaturesData;
  return <Dashboard data={data} />;
}
