"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import {
  Settings2,
  Video,
  FileText,
  Save,
  RotateCcw,
  Megaphone,
  Users,
  Bell,
  Link2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

const INITIAL_FEATURES = [
  {
    id: "videoUploads",
    title: "Video Uploads",
    description: "Allow users to upload video content",
    enabled: true,
  },
  {
    id: "comments",
    title: "Comments",
    description: "Allow users to comment on posts",
    enabled: true,
  },
  {
    id: "directMessaging",
    title: "Direct Messaging",
    description: "Enable user-to-user messaging",
    enabled: true,
  },
  {
    id: "registration",
    title: "New User Registration",
    description: "Allow new users to sign up",
    enabled: true,
  },
  {
    id: "dailyRewards",
    title: "Daily Rewards",
    description: "Enable daily login bonuses",
    enabled: true,
  },
];

const INITIAL_LIMITS = {
  maxVideoSize: "500",
  maxImageSize: "10",
  maxVideoLength: "60",
  postsPerHour: "10",
};

const INITIAL_CONTENT_SETTINGS = {
  allowTextPosts: true,
  allowImagePosts: true,
  allowVideoPosts: true,
  allowLinks: true,
};

const INITIAL_REFERRAL_SETTINGS = {
  enabled: true,
  referrerReward: "100",
  newUserReward: "50",
  minimumReferrals: "1",
};

const INITIAL_AD_SETTINGS = {
  enabled: true,
  feedAds: true,
  rewardedAds: false,
  frequency: "5",
};

const INITIAL_NOTIFICATION_SETTINGS = {
  pushEnabled: true,
  newFollowers: true,
  postInteractions: true,
  announcements: true,
};

const TABS = [
  { id: "features", label: "Feature Toggles", icon: Settings2 },
  { id: "content", label: "Content Settings", icon: FileText },
  { id: "referral", label: "Referral Program", icon: Link2 },
  { id: "ads", label: "Ad Configuration", icon: Megaphone },
  { id: "notifications", label: "Push Notifications", icon: Bell },
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[18px] w-[34px] shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-200 ${
        checked ? "bg-[#5946b8]" : "bg-gray-300"
      }`}
    >
      <span
        className={`h-[12px] w-[12px] rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[19px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function SettingRow({ title, description, checked, onChange }) {
  return (
    <div className="flex min-h-[49px] items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <div className="min-w-0">
        <h3 className="text-[12px] font-medium text-gray-800">
          {title}
        </h3>
        <p className="mt-0.5 text-[10px] leading-4 text-gray-500">
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}

function SectionCard({ title, description, icon: Icon, children }) {
  return (
    <section className="border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-[#5946b8]">
              <Icon size={15} />
            </div>
          )}

          <div>
            <h2 className="text-[13px] font-semibold text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-[10px] leading-4 text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 sm:py-4">
        {children}
      </div>
    </section>
  );
}

function Field({ label, value, onChange, suffix, min = 1 }) {
  return (
    <label className="block min-w-0">
      <span className="text-[10px] font-medium text-gray-600">
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min={min}
          step="1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`mt-1.5 h-[36px] w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
            suffix ? "pr-14" : ""
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 mt-[3px] -translate-y-1/2 text-[10px] text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SaveButton({ onClick, children = "Save Changes" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[32px] items-center justify-center gap-2 rounded-md bg-[#5946b8] px-3 py-2 text-[10px] font-medium text-white transition hover:bg-[#4936a3] focus:outline-none focus:ring-2 focus:ring-violet-200"
    >
      <Save size={12} />
      {children}
    </button>
  );
}

function ConfirmationModal({
  type,
  onClose,
  onConfirm,
  createBackup,
  setCreateBackup,
  notifyTeam,
  setNotifyTeam,
}) {
  const isReset = type === "reset";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className="w-full max-w-[480px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <h2
              id="confirmation-title"
              className="text-[15px] font-semibold tracking-tight text-gray-900"
            >
              {isReset
                ? "Reset to Default Settings"
                : "Save Configuration Changes"}
            </h2>

            <p className="mt-1 text-[11px] text-gray-500">
              {isReset
                ? "This action cannot be undone"
                : "Confirm settings update"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-5 pt-5">
          <div
            className={`rounded-md border px-3 py-3 ${
              isReset
                ? "border-rose-200 bg-rose-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-800">
              <AlertTriangle
                size={13}
                className={
                  isReset ? "text-amber-500" : "text-amber-600"
                }
              />
              {isReset ? "Warning" : "Important"}
            </p>

            <p className="mt-1.5 text-[10px] leading-5 text-gray-600">
              {isReset
                ? "This will reset all settings to their default values. Any custom configurations will be lost."
                : "These changes will affect all users once applied. Make sure you have reviewed all settings carefully."}
            </p>
          </div>
        </div>

        <p className="px-5 pt-3 text-center text-[10px] leading-4 text-gray-500">
          {isReset
            ? "Are you sure you want to proceed? This will affect all platform features and user experience."
            : "Confirm that you want to continue with your configuration changes."}
        </p>

        {!isReset && (
          <div className="space-y-2 px-5 pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-[10px] text-gray-700">
              <input
                type="checkbox"
                checked={createBackup}
                onChange={(event) =>
                  setCreateBackup(event.target.checked)
                }
                className="h-3.5 w-3.5 accent-[#5946b8]"
              />
              Create backup before applying changes
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-[10px] text-gray-700">
              <input
                type="checkbox"
                checked={notifyTeam}
                onChange={(event) =>
                  setNotifyTeam(event.target.checked)
                }
                className="h-3.5 w-3.5 accent-[#5946b8]"
              />
              Notify development team
            </label>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-[10px] font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[10px] font-medium text-white transition focus:outline-none focus:ring-2 ${
              isReset
                ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-200"
                : "bg-[#5946b8] hover:bg-[#4936a3] focus:ring-violet-200"
            }`}
          >
            {isReset ? (
              <RotateCcw size={12} />
            ) : (
              <Save size={12} />
            )}
            {isReset ? "Reset to Defaults" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppConfigurationPage() {
  const [activeTab, setActiveTab] = useState("features");

  const [features, setFeatures] = useState(
    INITIAL_FEATURES.map((feature) => ({ ...feature }))
  );

  const [limits, setLimits] = useState({ ...INITIAL_LIMITS });

  const [contentSettings, setContentSettings] = useState({
    ...INITIAL_CONTENT_SETTINGS,
  });

  const [referralSettings, setReferralSettings] = useState({
    ...INITIAL_REFERRAL_SETTINGS,
  });

  const [adSettings, setAdSettings] = useState({
    ...INITIAL_AD_SETTINGS,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    ...INITIAL_NOTIFICATION_SETTINGS,
  });

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [createBackup, setCreateBackup] = useState(true);
  const [notifyTeam, setNotifyTeam] = useState(true);

  const [savedMessage, setSavedMessage] = useState("");
  const [pendingSaveType, setPendingSaveType] = useState("configuration");

  const activeTabLabel =
    TABS.find((tab) => tab.id === activeTab)?.label || "Configuration";

  function updateFeature(id, enabled) {
    setFeatures((current) =>
      current.map((feature) =>
        feature.id === id ? { ...feature, enabled } : feature
      )
    );

    setSavedMessage("");
  }

  function updateLimit(key, value) {
    setLimits((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  }

  function updateSetting(setter, key, value) {
    setter((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  }

  function openSaveModal(type = "configuration") {
    setPendingSaveType(type);
    setSavedMessage("");
    setShowSaveModal(true);
  }

  function confirmSaveChanges() {
    // TODO: Connect this action to the backend configuration API.
    // Settings currently remain in React state and are not persisted.

    setShowSaveModal(false);

    setSavedMessage(
      pendingSaveType === "limits"
        ? "Upload limits confirmed in this session. Backend saving is not connected."
        : "Configuration confirmed in this session. Backend saving is not connected."
    );
  }

  function applyResetDefaults() {
    setFeatures(INITIAL_FEATURES.map((feature) => ({ ...feature })));
    setLimits({ ...INITIAL_LIMITS });
    setContentSettings({ ...INITIAL_CONTENT_SETTINGS });
    setReferralSettings({ ...INITIAL_REFERRAL_SETTINGS });
    setAdSettings({ ...INITIAL_AD_SETTINGS });
    setNotificationSettings({ ...INITIAL_NOTIFICATION_SETTINGS });

    setShowResetModal(false);
    setSavedMessage(
      "Default values restored in this session. Save to apply them."
    );
  }

  function validatePositiveNumbers(settings) {
    return Object.values(settings).every((value) => {
      const number = Number(value);

      return (
        String(value).trim() !== "" &&
        Number.isFinite(number) &&
        number > 0 &&
        Number.isInteger(number)
      );
    });
  }

  function saveLimits() {
    if (!validatePositiveNumbers(limits)) {
      setSavedMessage(
        "Enter a valid positive whole number for every upload limit."
      );
      return;
    }

    openSaveModal("limits");
  }

  function saveCurrentSettings() {
    let valid = true;

    if (
      activeTab === "referral" &&
      !validatePositiveNumbers({
        referrerReward: referralSettings.referrerReward,
        newUserReward: referralSettings.newUserReward,
        minimumReferrals: referralSettings.minimumReferrals,
      })
    ) {
      valid = false;
    }

    if (
      activeTab === "ads" &&
      !validatePositiveNumbers({
        frequency: adSettings.frequency,
      })
    ) {
      valid = false;
    }

    if (!valid) {
      setSavedMessage(
        "Enter valid positive whole numbers for all numeric settings."
      );
      return;
    }

    openSaveModal("configuration");
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa] text-gray-900">
      <Sidebar />

      <main className="min-h-screen min-w-0 md:ml-[250px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-medium text-gray-400">
              <span>Platform Settings</span>
              <span>/</span>
              <span className="text-[#5946b8]">
                App Configuration
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              App Configuration
            </h1>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Manage platform settings, features, and content.
            </p>
          </div>

          <div className="mb-4 border border-gray-200 bg-white px-2 py-2 shadow-sm">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSavedMessage("");
                    }}
                    className={`flex min-h-[34px] shrink-0 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[10px] font-medium transition sm:flex-1 ${
                      isActive
                        ? "bg-[#5946b8] text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {activeTab === "features" && (
              <>
                <SectionCard
                  title="Platform Features"
                  description="Control which features are available to users across Postam."
                  icon={Settings2}
                >
                  <div>
                    {features.map((feature) => (
                      <SettingRow
                        key={feature.id}
                        title={feature.title}
                        description={feature.description}
                        checked={feature.enabled}
                        onChange={(value) =>
                          updateFeature(feature.id, value)
                        }
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <SaveButton
                      onClick={() => openSaveModal("configuration")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="inline-flex min-h-[32px] items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-[10px] font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-100"
                    >
                      <RotateCcw size={12} />
                      Reset to Defaults
                    </button>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Upload Limits"
                  description="Set the maximum file sizes and posting limits allowed on the platform."
                  icon={Video}
                >
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <Field
                      label="Max Video Size (MB)"
                      value={limits.maxVideoSize}
                      suffix="MB"
                      onChange={(value) =>
                        updateLimit("maxVideoSize", value)
                      }
                    />

                    <Field
                      label="Max Image Size (MB)"
                      value={limits.maxImageSize}
                      suffix="MB"
                      onChange={(value) =>
                        updateLimit("maxImageSize", value)
                      }
                    />

                    <Field
                      label="Max Video Length (minutes)"
                      value={limits.maxVideoLength}
                      suffix="minutes"
                      onChange={(value) =>
                        updateLimit("maxVideoLength", value)
                      }
                    />

                    <Field
                      label="Posts per Hour (Limit)"
                      value={limits.postsPerHour}
                      suffix="posts"
                      onChange={(value) =>
                        updateLimit("postsPerHour", value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={saveLimits}
                    className="mt-5 flex min-h-[32px] w-full items-center justify-center gap-2 rounded-md bg-[#5946b8] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#4936a3] focus:outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    <Save size={12} />
                    Save Limits
                  </button>
                </SectionCard>
              </>
            )}

            {activeTab === "content" && (
              <SectionCard
                title="Content Settings"
                description="Manage the types of content users can publish."
                icon={FileText}
              >
                <SettingRow
                  title="Text Posts"
                  description="Allow users to publish text-only posts."
                  checked={contentSettings.allowTextPosts}
                  onChange={(value) =>
                    updateSetting(setContentSettings, "allowTextPosts", value)
                  }
                />

                <SettingRow
                  title="Image Posts"
                  description="Allow users to share images in their posts."
                  checked={contentSettings.allowImagePosts}
                  onChange={(value) =>
                    updateSetting(setContentSettings, "allowImagePosts", value)
                  }
                />

                <SettingRow
                  title="Video Posts"
                  description="Allow video content in the feed."
                  checked={contentSettings.allowVideoPosts}
                  onChange={(value) =>
                    updateSetting(setContentSettings, "allowVideoPosts", value)
                  }
                />

                <SettingRow
                  title="External Links"
                  description="Allow links to external websites."
                  checked={contentSettings.allowLinks}
                  onChange={(value) =>
                    updateSetting(setContentSettings, "allowLinks", value)
                  }
                />

                <div className="mt-4">
                  <SaveButton onClick={saveCurrentSettings} />
                </div>
              </SectionCard>
            )}

            {activeTab === "referral" && (
              <SectionCard
                title="Referral Program"
                description="Configure referral rewards and encourage users to invite friends."
                icon={Users}
              >
                <div className="mb-4">
                  <SettingRow
                    title="Enable Referral Program"
                    description="Allow users to invite friends and earn rewards."
                    checked={referralSettings.enabled}
                    onChange={(value) =>
                      updateSetting(setReferralSettings, "enabled", value)
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Referrer Reward (Points)"
                    value={referralSettings.referrerReward}
                    onChange={(value) =>
                      updateSetting(setReferralSettings, "referrerReward", value)
                    }
                  />

                  <Field
                    label="New User Reward (Points)"
                    value={referralSettings.newUserReward}
                    onChange={(value) =>
                      updateSetting(setReferralSettings, "newUserReward", value)
                    }
                  />

                  <Field
                    label="Minimum Referrals"
                    value={referralSettings.minimumReferrals}
                    onChange={(value) =>
                      updateSetting(setReferralSettings, "minimumReferrals", value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <SaveButton onClick={saveCurrentSettings} />
                </div>
              </SectionCard>
            )}

            {activeTab === "ads" && (
              <SectionCard
                title="Ad Configuration"
                description="Manage ad placements and how frequently ads appear in the feed."
                icon={Megaphone}
              >
                <SettingRow
                  title="Enable Advertisements"
                  description="Allow ads to appear across the platform."
                  checked={adSettings.enabled}
                  onChange={(value) =>
                    updateSetting(setAdSettings, "enabled", value)
                  }
                />

                <SettingRow
                  title="Feed Advertisements"
                  description="Show sponsored content in the main feed."
                  checked={adSettings.feedAds}
                  onChange={(value) =>
                    updateSetting(setAdSettings, "feedAds", value)
                  }
                />

                <SettingRow
                  title="Rewarded Advertisements"
                  description="Allow users to earn points by watching ads."
                  checked={adSettings.rewardedAds}
                  onChange={(value) =>
                    updateSetting(setAdSettings, "rewardedAds", value)
                  }
                />

                <div className="mt-4 max-w-sm">
                  <Field
                    label="Show an ad every"
                    value={adSettings.frequency}
                    suffix="posts"
                    onChange={(value) =>
                      updateSetting(setAdSettings, "frequency", value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <SaveButton onClick={saveCurrentSettings} />
                </div>
              </SectionCard>
            )}

            {activeTab === "notifications" && (
              <SectionCard
                title="Push Notifications"
                description="Choose which notifications Postam sends to its users."
                icon={Bell}
              >
                <SettingRow
                  title="Push Notifications"
                  description="Enable or disable push notifications platform-wide."
                  checked={notificationSettings.pushEnabled}
                  onChange={(value) =>
                    updateSetting(setNotificationSettings, "pushEnabled", value)
                  }
                />

                <SettingRow
                  title="New Followers"
                  description="Notify users when someone follows them."
                  checked={notificationSettings.newFollowers}
                  onChange={(value) =>
                    updateSetting(setNotificationSettings, "newFollowers", value)
                  }
                />

                <SettingRow
                  title="Post Interactions"
                  description="Notify users about likes and comments."
                  checked={notificationSettings.postInteractions}
                  onChange={(value) =>
                    updateSetting(setNotificationSettings, "postInteractions", value)
                  }
                />

                <SettingRow
                  title="Platform Announcements"
                  description="Send important platform updates to users."
                  checked={notificationSettings.announcements}
                  onChange={(value) =>
                    updateSetting(setNotificationSettings, "announcements", value)
                  }
                />

                <div className="mt-4">
                  <SaveButton onClick={saveCurrentSettings} />
                </div>
              </SectionCard>
            )}

            {savedMessage && (
              <div
                role="status"
                className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-xs ${
                  savedMessage.startsWith("Enter")
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {savedMessage.startsWith("Enter") ? (
                  <AlertTriangle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <Check
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <span>{savedMessage}</span>
              </div>
            )}

            <p className="px-1 pb-4 text-[10px] leading-5 text-gray-400">
              Editing: {activeTabLabel}. Settings remain in page state
              until you connect the configuration API.
            </p>
          </div>
        </div>
      </main>

      {showSaveModal && (
        <ConfirmationModal
          type="save"
          onClose={() => setShowSaveModal(false)}
          onConfirm={confirmSaveChanges}
          createBackup={createBackup}
          setCreateBackup={setCreateBackup}
          notifyTeam={notifyTeam}
          setNotifyTeam={setNotifyTeam}
        />
      )}

      {showResetModal && (
        <ConfirmationModal
          type="reset"
          onClose={() => setShowResetModal(false)}
          onConfirm={applyResetDefaults}
          createBackup={createBackup}
          setCreateBackup={setCreateBackup}
          notifyTeam={notifyTeam}
          setNotifyTeam={setNotifyTeam}
        />
      )}
    </div>
  );
}