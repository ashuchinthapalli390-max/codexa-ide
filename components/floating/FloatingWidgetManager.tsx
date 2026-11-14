"use client";

import React, { useState, useEffect } from "react";
import { SpecialOfferFloatingWidget } from "@/components/promotions/SpecialOfferFloatingWidget";
import { ReleaseNotificationModal } from "@/components/notifications/ReleaseNotificationModal";

export function FloatingWidgetManager() {
  const [notificationState, setNotificationState] = useState<{
    isOpen: boolean;
    platform: string;
  }>({
    isOpen: false,
    platform: "windows",
  });

  useEffect(() => {
    const handleOpenNotification = (e: Event) => {
      const customEvent = e as CustomEvent<{ platform?: string }>;
      setNotificationState({
        isOpen: true,
        platform: customEvent.detail?.platform || "windows",
      });
    };

    const handleCloseNotification = () => {
      setNotificationState((prev) => ({ ...prev, isOpen: false }));
    };

    window.addEventListener("open-release-notification", handleOpenNotification);
    window.addEventListener("close-release-notification", handleCloseNotification);

    return () => {
      window.removeEventListener("open-release-notification", handleOpenNotification);
      window.removeEventListener("close-release-notification", handleCloseNotification);
    };
  }, []);

  return (
    <>
      {/* Floating Offer Pill (Hidden when Notification Panel is expanded to prevent collision) */}
      <SpecialOfferFloatingWidget isHidden={notificationState.isOpen} />

      {/* Release Notification Modal (Portal attached to body) */}
      <ReleaseNotificationModal
        isOpen={notificationState.isOpen}
        platform={notificationState.platform}
        onClose={() => setNotificationState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
