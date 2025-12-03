"use client";
import { useCommonMutationApi } from "@/api-hooks/mutation-common";
import { useState } from "react";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { mutate, isPending: loading } = useCommonMutationApi({
    method: "PATCH",
    url: "/user/update-user",
    successMessage: "Password updated successfully",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ oldPassword, newPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-(--color-primary-background) border border-(--color-border-gray) rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold text-(--color-dark-text) mb-4">
        Change password
      </h2>

      <label className="block text-sm text-(--color-dark-text) mb-1">
        Old password
      </label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full rounded-md border border-(--color-border-gray) bg-(--color-white) text-(--color-dark-text) px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-primary-blue) mb-4"
        placeholder="Enter old password"
        autoComplete="current-password"
        required
      />

      <label className="block text-sm text-(--color-dark-text) mb-1">
        New password
      </label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-md border border-(--color-border-gray) bg-(--color-white) text-(--color-dark-text) px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-primary-blue) mb-6"
        placeholder="Enter new password"
        autoComplete="new-password"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-md bg-(--color-primary-blue) text-(--color-white) px-4 py-2 font-medium hover:bg-(--color-dark-blue) disabled:opacity-60"
      >
        {loading ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
