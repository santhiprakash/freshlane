"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { useAccount } from "@/lib/account-context";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-sage/50 px-3 py-2 text-forest placeholder:text-forest/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

export default function AccountPage() {
  const { profile, hydrated, saveProfile, signOut, addAddress, removeAddress } =
    useAccount();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-forest">
          My Account
        </h1>
        <p className="mt-1 text-sm text-forest/50">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">My Account</h1>
      <p className="mt-1 text-forest/60">
        Guest profile stored in this browser — not a server login
      </p>

      {!profile ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuestRegisterForm onSave={saveProfile} />
          <Link
            href="/orders"
            className="flex h-fit items-center gap-4 rounded-2xl border border-sage/50 bg-white p-5 transition-all hover:border-forest hover:shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/30 text-forest">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-medium text-forest">Order History</h3>
              <p className="text-sm text-forest/60">
                Track orders placed in this browser — no profile required
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ProfileCard
            profile={profile}
            onSave={saveProfile}
            onSignOut={signOut}
          />
          <div className="space-y-4">
            <AddressBook
              addresses={profile.addresses}
              defaultName={profile.displayName}
              defaultPhone={profile.phone}
              onAdd={addAddress}
              onRemove={removeAddress}
            />
            <Link
              href="/orders"
              className="flex items-center gap-4 rounded-2xl border border-sage/50 bg-white p-5 transition-all hover:border-forest hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/30 text-forest">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-medium text-forest">Order History</h3>
                <p className="text-sm text-forest/60">
                  View and track orders placed in this browser
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function GuestRegisterForm({
  onSave,
}: {
  onSave: (fields: {
    displayName: string;
    email: string;
    phone: string;
  }) => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please enter a name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter an email.");
      return;
    }
    setError("");
    onSave({
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <section className="rounded-2xl border border-sage/50 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/30 text-forest">
          <User className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-forest">
            Save a guest profile
          </h2>
          <p className="text-sm text-forest/60">
            Stored locally for this demo so checkout can prefill your details.
            There is no password and nothing is sent to a server.
          </p>
        </div>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          autoComplete="name"
          className={inputClass}
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          autoComplete="email"
          className={inputClass}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          autoComplete="tel"
          className={inputClass}
        />
        {error && (
          <p className="text-sm text-terracotta" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full">
          Save profile
        </Button>
      </form>
    </section>
  );
}

function ProfileCard({
  profile,
  onSave,
  onSignOut,
}: {
  profile: {
    displayName: string;
    email: string;
    phone: string;
  };
  onSave: (fields: {
    displayName: string;
    email: string;
    phone: string;
  }) => void;
  onSignOut: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  const startEditing = () => {
    setDisplayName(profile.displayName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim()) return;
    onSave({
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-sage/50 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-lg font-semibold text-cream">
          {profile.displayName.charAt(0).toUpperCase()}
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-forest">
            {profile.displayName}
          </h2>
          <p className="text-sm text-forest/60">{profile.email}</p>
        </div>
      </div>

      {editing ? (
        <form className="mt-6 space-y-3" onSubmit={handleSave}>
          <input
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            className={inputClass}
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className={inputClass}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className={inputClass}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save changes</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6 space-y-2 text-sm">
          <p>
            <span className="text-forest/60">Phone: </span>
            {profile.phone || "Not added"}
          </p>
          <div className="flex flex-wrap gap-2 pt-3">
            <Button type="button" onClick={startEditing}>
              Edit profile
            </Button>
            <Button type="button" variant="outline" onClick={onSignOut}>
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </Button>
          </div>
          <p className="pt-2 text-xs text-forest/50">
            Sign out clears this guest profile only. Your orders stay in this
            browser.
          </p>
        </div>
      )}
    </section>
  );
}

function AddressBook({
  addresses,
  defaultName,
  defaultPhone,
  onAdd,
  onRemove,
}: {
  addresses: {
    id: string;
    label: string;
    name: string;
    phone: string;
    pincode: string;
    address: string;
  }[];
  defaultName: string;
  defaultPhone: string;
  onAdd: (address: {
    label: string;
    name: string;
    phone: string;
    pincode: string;
    address: string;
  }) => void;
  onRemove: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("Home");
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setLabel("Home");
    setName(defaultName);
    setPhone(defaultPhone);
    setPincode("");
    setAddress("");
    setError("");
    setAdding(false);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !pincode.trim() || !name.trim()) {
      setError("Name, address, and pincode are required.");
      return;
    }
    onAdd({
      label: label.trim() || "Home",
      name: name.trim(),
      phone: phone.trim(),
      pincode: pincode.trim(),
      address: address.trim(),
    });
    resetForm();
  };

  return (
    <section className="rounded-2xl border border-sage/50 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/30 text-forest">
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="font-display text-lg font-semibold text-forest">
            Saved Addresses
          </h2>
        </div>
        {!adding && (
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding(true)}>
            Add
          </Button>
        )}
      </div>

      {addresses.length === 0 && !adding && (
        <p className="mt-4 text-sm text-forest/60">
          No saved addresses yet. Add one to prefill checkout.
        </p>
      )}

      {addresses.length > 0 && (
        <ul className="mt-4 space-y-3">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-sage/40 px-3 py-3"
            >
              <div>
                <p className="font-medium text-forest">{addr.label}</p>
                <p className="text-sm text-forest/70">{addr.name}</p>
                <p className="text-sm text-forest/60">
                  {addr.address}, {addr.pincode}
                </p>
                {addr.phone && (
                  <p className="text-sm text-forest/60">{addr.phone}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(addr.id)}
                className="text-sm font-medium text-terracotta hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <form className="mt-4 space-y-3" onSubmit={handleAdd}>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (Home, Work)"
            className={inputClass}
          />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={inputClass}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className={inputClass}
          />
          <input
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            className={inputClass}
          />
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full address"
            rows={2}
            className={inputClass}
          />
          {error && (
            <p className="text-sm text-terracotta" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm">
              Save address
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
