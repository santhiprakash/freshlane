"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { AccountProfile, SavedAddress } from "@/lib/types";
import {
  clearAccount,
  createAddressId,
  getAccount,
  saveAccount,
} from "@/lib/account-store";
import { useBrowserHydrated } from "@/lib/use-browser-hydrated";

type ProfileFields = Pick<AccountProfile, "displayName" | "email" | "phone">;

interface AccountContextValue {
  profile: AccountProfile | null;
  hydrated: boolean;
  saveProfile: (fields: ProfileFields) => AccountProfile;
  signOut: () => void;
  addAddress: (address: Omit<SavedAddress, "id">) => SavedAddress;
  removeAddress: (id: string) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const hydrated = useBrowserHydrated();

  if (hydrated && !loaded) {
    setProfile(getAccount());
    setLoaded(true);
  }

  const saveProfile = useCallback((fields: ProfileFields) => {
    const current = getAccount();
    const next = saveAccount({
      displayName: fields.displayName,
      email: fields.email,
      phone: fields.phone,
      addresses: current?.addresses ?? [],
    });
    setProfile(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    clearAccount();
    setProfile(null);
  }, []);

  const addAddress = useCallback((address: Omit<SavedAddress, "id">) => {
    const current = getAccount();
    if (!current) {
      throw new Error("Save a guest profile before adding addresses");
    }
    const nextAddress: SavedAddress = {
      ...address,
      id: createAddressId(),
    };
    const next = saveAccount({
      ...current,
      addresses: [...current.addresses, nextAddress],
    });
    setProfile(next);
    return nextAddress;
  }, []);

  const removeAddress = useCallback((id: string) => {
    const current = getAccount();
    if (!current) return;
    const next = saveAccount({
      ...current,
      addresses: current.addresses.filter((addr) => addr.id !== id),
    });
    setProfile(next);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      hydrated: loaded,
      saveProfile,
      signOut,
      addAddress,
      removeAddress,
    }),
    [profile, loaded, saveProfile, signOut, addAddress, removeAddress]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
