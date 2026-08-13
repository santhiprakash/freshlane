import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-4 py-16 text-center">
      <div className="mx-auto flex justify-center text-sage">{icon}</div>
      <h2 className="mt-4 font-display text-2xl font-semibold text-forest">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-forest/60">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
