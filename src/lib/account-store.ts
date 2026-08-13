import type { AccountProfile, SavedAddress } from "@/lib/types";

export const ACCOUNT_STORAGE_KEY = "freshlane-account";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeAddress(raw: unknown): SavedAddress | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== "string" || !raw.id) return null;
  if (typeof raw.address !== "string") return null;
  return {
    id: raw.id,
    label: typeof raw.label === "string" && raw.label.trim() ? raw.label : "Home",
    name: typeof raw.name === "string" ? raw.name : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    pincode: typeof raw.pincode === "string" ? raw.pincode : "",
    address: raw.address,
  };
}

function normalizeProfile(raw: unknown): AccountProfile | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.displayName !== "string" || !raw.displayName.trim()) return null;
  const addresses = Array.isArray(raw.addresses)
    ? raw.addresses
        .map(normalizeAddress)
        .filter((addr): addr is SavedAddress => addr !== null)
    : [];
  return {
    displayName: raw.displayName.trim(),
    email: typeof raw.email === "string" ? raw.email.trim() : "",
    phone: typeof raw.phone === "string" ? raw.phone.trim() : "",
    addresses,
  };
}

export function getAccount(): AccountProfile | null {
  if (!canUseStorage()) return null;
  try {
    const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!stored) return null;
    return normalizeProfile(JSON.parse(stored));
  } catch {
    return null;
  }
}

export function saveAccount(profile: AccountProfile): AccountProfile {
  const next: AccountProfile = {
    displayName: profile.displayName.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    addresses: profile.addresses,
  };
  if (canUseStorage()) {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function clearAccount(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(ACCOUNT_STORAGE_KEY);
}

export function getDefaultAddress(
  profile: AccountProfile | null
): SavedAddress | undefined {
  if (!profile || profile.addresses.length === 0) return undefined;
  return profile.addresses[profile.addresses.length - 1];
}

export function createAddressId(): string {
  return `addr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
