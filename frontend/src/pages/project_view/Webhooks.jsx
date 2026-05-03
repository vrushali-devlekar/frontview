import React from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import { Webhook as WebhookIcon, Plus, Settings } from "lucide-react";
import GlassButton from "../../components/ui/GlassButton";
import {
  PageShell,
  PageHeader,
  Card,
  EmptyState,
} from "../../components/layout/PageLayout";

export default function Webhooks() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        navMode={navMode}
        toggleNavMode={toggleNavMode}
      />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader
            title="Webhooks"
            subtitle="Manage your project webhooks and integrations"
          >
            <GlassButton
              variant="primary"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
            >
              <Plus size={14} /> New Webhook
            </GlassButton>
          </PageHeader>

          <Card
            noPad
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20"
          >
            <EmptyState
              icon={WebhookIcon}
              title="No webhooks configured"
              subtitle="Create webhooks to integrate with external services"
            >
              <GlassButton
                variant="primary"
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              >
                <Plus size={14} /> Create Webhook
              </GlassButton>
            </EmptyState>
          </Card>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
