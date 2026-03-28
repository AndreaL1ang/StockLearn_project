import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Explore } from "./pages/Explore";
import { StockDetail } from "./pages/StockDetail";
import { Portfolio } from "./pages/Portfolio";
import { AIInsights } from "./pages/AIInsights";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "explore", Component: Explore },
      { path: "stock/:symbol", Component: StockDetail },
      { path: "portfolio", Component: Portfolio },
      { path: "ai-insights", Component: AIInsights },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);