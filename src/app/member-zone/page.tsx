"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Dashboard = dynamic(() => import("@/components/member/Dashboard"), {
  ssr: false,
});
const RealtimeMetric = dynamic(
  () => import("@/components/member/RealtimeMetric"),
  { ssr: false },
);
const SmartNotifications = dynamic(
  () => import("@/components/member/SmartNotifications"),
  { ssr: false },
);
const AiHealthInsights = dynamic(
  () => import("@/components/member/AiHealthInsights"),
  { ssr: false },
);
const QuickActions = dynamic(() => import("@/components/member/QuickActions"), {
  ssr: false,
});
const MyReport = dynamic(() => import("@/components/member/MyReport"), {
  ssr: false,
});
const UserProfile = dynamic(() => import("@/components/member/UserProfile"), {
  ssr: false,
});
const AccountSettings = dynamic(
  () => import("@/components/member/AccountSettings"),
  { ssr: false },
);
const ConnectDevices = dynamic(
  () => import("@/components/member/ConnectDevices"),
  { ssr: false },
);

function Card(props: {
  title: string;
  status?: string;
  children: React.ReactNode;
  tight?: boolean;
  nowrap?: boolean;
}) {
  const { title, status, children, tight, nowrap } = props;
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6`}
      style={{ writingMode: "horizontal-tb" as const, transform: "none" }}
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white/90">{title}</h2>
        {status ? (
          <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white/70">
            {status}
          </span>
        ) : (
          <span className="text-xs text-white/40">Live</span>
        )}
      </header>
      <div
        className={`${tight ? "" : "mt-1"} ${
          nowrap
            ? "break-words overflow-hidden text-ellipsis whitespace-normal"
            : ""
        }`}
        style={{
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function MemberZonePage() {
  const sections = useMemo(
    () => [
      { key: "dashboard", title: "Dashboard", node: <Dashboard /> },
      {
        key: "rtm",
        title: "Real-Time Metric",
        node: <RealtimeMetric />,
        nowrap: true,
      },
      {
        key: "notify",
        title: "Smart Notifications",
        node: <SmartNotifications />,
      },
      {
        key: "insights",
        title: "AI Health Insights",
        node: <AiHealthInsights />,
      },
      { key: "quick", title: "Quick Actions", node: <QuickActions /> },
      { key: "reports", title: "My Reports", node: <MyReport /> },
      { key: "profile", title: "Your Profile", node: <UserProfile /> },
      { key: "settings", title: "Account Settings", node: <AccountSettings /> },
      {
        key: "devices",
        title: "Connect Devices",
        node: <ConnectDevices />,
        tight: true,
      },
    ],
    [],
  );

  return (
    <main
      className="mx-auto max-w-[1200px] px-4 pb-12 pt-6 sm:px-6 lg:px-8"
      style={{ writingMode: "horizontal-tb" as const }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Member Zone</h1>
        <p className="mt-1 max-w-prose text-sm text-white/70">
          Personalized tools, real-time metrics, and high-quality health reports
          for daily use.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-2">
          <Card title="Dashboard">
            <Dashboard />
          </Card>
        </div>
        <div>
          <Card title="Real-Time Metric" nowrap>
            <RealtimeMetric />
          </Card>
        </div>

        <div>
          <Card title="Smart Notifications">
            <SmartNotifications />
          </Card>
        </div>
        <div>
          <Card title="AI Health Insights">
            <AiHealthInsights />
          </Card>
        </div>
        <div>
          <Card title="Quick Actions">
            <QuickActions />
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="My Reports">
            <MyReport />
          </Card>
        </div>
        <div>
          <Card title="Your Profile">
            <UserProfile />
          </Card>
        </div>

        <div>
          <Card title="Account Settings">
            <AccountSettings />
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Card title="Connect Devices" tight>
            <ConnectDevices />
          </Card>
        </div>
      </div>
    </main>
  );
}
