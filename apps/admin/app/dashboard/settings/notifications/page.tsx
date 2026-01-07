'use client';

import { useState } from 'react';
import { Mail, Smartphone, MessageSquare, Save } from 'lucide-react';

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    questCompleted: true,
    newFollower: true,
    frameInteraction: false,
    weeklyDigest: true,
    systemUpdates: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    questCompleted: true,
    newFollower: false,
    frameInteraction: true,
    directMessages: true,
  });

  const [inAppNotifications, setInAppNotifications] = useState({
    questCompleted: true,
    newFollower: true,
    frameInteraction: true,
    comments: true,
    mentions: true,
  });

  const handleSave = () => {
    alert('Notification preferences saved!');
  };

  const NotificationToggle = ({
    label,
    description,
    enabled,
    onChange,
  }: {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
  }) => (
    <div className="flex items-start justify-between p-4 bg-neutral-900 rounded-lg">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        <div className="text-sm text-neutral-400 mt-1">{description}</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-neutral-700'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Notification Settings</h1>
        <p className="mt-2 text-neutral-400">
          Configure how you want to receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-white">Email Notifications</h2>
        </div>

        <div className="space-y-3">
          <NotificationToggle
            label="Quest Completed"
            description="Get notified when you complete a quest"
            enabled={emailNotifications.questCompleted}
            onChange={(val) =>
              setEmailNotifications({ ...emailNotifications, questCompleted: val })
            }
          />
          <NotificationToggle
            label="New Follower"
            description="Receive an email when someone follows you"
            enabled={emailNotifications.newFollower}
            onChange={(val) =>
              setEmailNotifications({ ...emailNotifications, newFollower: val })
            }
          />
          <NotificationToggle
            label="Frame Interactions"
            description="Get notified about interactions with your frames"
            enabled={emailNotifications.frameInteraction}
            onChange={(val) =>
              setEmailNotifications({ ...emailNotifications, frameInteraction: val })
            }
          />
          <NotificationToggle
            label="Weekly Digest"
            description="Receive a weekly summary of your activity"
            enabled={emailNotifications.weeklyDigest}
            onChange={(val) =>
              setEmailNotifications({ ...emailNotifications, weeklyDigest: val })
            }
          />
          <NotificationToggle
            label="System Updates"
            description="Important updates about the CastQuest platform"
            enabled={emailNotifications.systemUpdates}
            onChange={(val) =>
              setEmailNotifications({ ...emailNotifications, systemUpdates: val })
            }
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="text-success" size={24} />
          <h2 className="text-xl font-bold text-white">Push Notifications</h2>
        </div>

        <div className="space-y-3">
          <NotificationToggle
            label="Quest Completed"
            description="Push notification when you complete a quest"
            enabled={pushNotifications.questCompleted}
            onChange={(val) =>
              setPushNotifications({ ...pushNotifications, questCompleted: val })
            }
          />
          <NotificationToggle
            label="New Follower"
            description="Instant notification for new followers"
            enabled={pushNotifications.newFollower}
            onChange={(val) =>
              setPushNotifications({ ...pushNotifications, newFollower: val })
            }
          />
          <NotificationToggle
            label="Frame Interactions"
            description="Real-time updates on frame activity"
            enabled={pushNotifications.frameInteraction}
            onChange={(val) =>
              setPushNotifications({ ...pushNotifications, frameInteraction: val })
            }
          />
          <NotificationToggle
            label="Direct Messages"
            description="Get notified about new direct messages"
            enabled={pushNotifications.directMessages}
            onChange={(val) =>
              setPushNotifications({ ...pushNotifications, directMessages: val })
            }
          />
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-secondary" size={24} />
          <h2 className="text-xl font-bold text-white">In-App Notifications</h2>
        </div>

        <div className="space-y-3">
          <NotificationToggle
            label="Quest Completed"
            description="Show in-app notification for quest completions"
            enabled={inAppNotifications.questCompleted}
            onChange={(val) =>
              setInAppNotifications({ ...inAppNotifications, questCompleted: val })
            }
          />
          <NotificationToggle
            label="New Follower"
            description="In-app alert for new followers"
            enabled={inAppNotifications.newFollower}
            onChange={(val) =>
              setInAppNotifications({ ...inAppNotifications, newFollower: val })
            }
          />
          <NotificationToggle
            label="Frame Interactions"
            description="Real-time frame interaction notifications"
            enabled={inAppNotifications.frameInteraction}
            onChange={(val) =>
              setInAppNotifications({ ...inAppNotifications, frameInteraction: val })
            }
          />
          <NotificationToggle
            label="Comments"
            description="Notifications when someone comments on your content"
            enabled={inAppNotifications.comments}
            onChange={(val) =>
              setInAppNotifications({ ...inAppNotifications, comments: val })
            }
          />
          <NotificationToggle
            label="Mentions"
            description="Get notified when you're mentioned"
            enabled={inAppNotifications.mentions}
            onChange={(val) =>
              setInAppNotifications({ ...inAppNotifications, mentions: val })
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Save size={18} />
          Save Preferences
        </button>
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

