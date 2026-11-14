/**
 * CodeXa Studio IDE — Platform Release Notification Store
 */

export interface ReleaseSubscription {
  id: string;
  email: string;
  platform: string;
  createdAt: string;
  ipAddress?: string;
}

class NotificationStore {
  private subscriptions: Map<string, ReleaseSubscription> = new Map();

  constructor() {
    // Seed initial test record
    this.subscriptions.set("sub_01", {
      id: "sub_01",
      email: "engineer@codxa-agency.online",
      platform: "windows",
      createdAt: new Date().toISOString(),
    });
  }

  public subscribe(email: string, platform: string, ipAddress?: string): ReleaseSubscription {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPlatform = (platform || "windows").trim().toLowerCase();

    // Check if duplicate already exists for this email + platform
    const existing = Array.from(this.subscriptions.values()).find(
      (sub) => sub.email === normalizedEmail && sub.platform === normalizedPlatform
    );
    if (existing) {
      return existing; // Idempotent return
    }

    const newSub: ReleaseSubscription = {
      id: "sub_" + Math.random().toString(36).substring(2, 9),
      email: normalizedEmail,
      platform: normalizedPlatform,
      createdAt: new Date().toISOString(),
      ipAddress,
    };

    this.subscriptions.set(newSub.id, newSub);
    return newSub;
  }

  public getSubscriptions(): ReleaseSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  public getCount(): number {
    return this.subscriptions.size;
  }
}

export const notificationStore = new NotificationStore();
