import { BRAND_NAME, BRAND_TAGLINE } from "@/app/lib/brand";
import "./Logo.css";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="goldora-logo">
      <div className="logo-icon">G</div>

      {!compact && (
        <div>
          <p className="logo-text">{BRAND_NAME}</p>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
            {BRAND_TAGLINE}
          </p>
        </div>
      )}
    </div>
  );
}