import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { REGULAR_SERVICE_LOCATIONS } from "@/lib/regular-service-area";

type LocationSwitcherProps = {
  locale: "en" | "fr";
  currentSlug: string;
  basePath: "/dog-poop-cleanup" | "/fr/ramassage-dejections";
  mobile?: boolean;
};

export default function LocationSwitcher({
  locale,
  currentSlug,
  basePath,
  mobile = false,
}: LocationSwitcherProps) {
  const isFrench = locale === "fr";
  const currentLocation =
    REGULAR_SERVICE_LOCATIONS.find((location) => location.slug === currentSlug) ??
    REGULAR_SERVICE_LOCATIONS[0];

  if (mobile) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{isFrench ? "Villes" : "Locations"}</p>
        <div className="space-y-1">
          {REGULAR_SERVICE_LOCATIONS.map((location) => {
            const href = `${basePath}/${location.slug}`;
            const isCurrent = location.slug === currentLocation.slug;

            return (
              <Link
                key={location.slug}
                href={href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                  isCurrent
                    ? "border border-brand-green/20 bg-[#eef7f0] font-semibold text-brand-green"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-green"
                }`}
              >
                <span>{isFrench ? location.nameFr : location.name}</span>
                {isCurrent && <MapPin className="h-4 w-4" />}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-[#d7e6da] bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-green hover:text-brand-green"
        aria-label={isFrench ? "Parcourir les villes desservies" : "Browse served locations"}
      >
        <span>{isFrench ? "Villes" : "Locations"}</span>
        <span className="text-brand-green">{isFrench ? currentLocation.nameFr : currentLocation.name}</span>
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>

      <div className="invisible absolute left-0 top-full z-50 mt-3 w-64 max-h-[21rem] overflow-y-auto rounded-2xl border border-[#d7e6da] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(17,24,39,0.08)] transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {REGULAR_SERVICE_LOCATIONS.map((location) => {
          const href = `${basePath}/${location.slug}`;
          const isCurrent = location.slug === currentLocation.slug;

          return (
            <Link
              key={location.slug}
              href={href}
              className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                isCurrent
                  ? "bg-[#eef7f0] font-semibold text-brand-green ring-1 ring-brand-green/20"
                  : "text-gray-700 hover:bg-gray-50 hover:text-brand-green"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span>{isFrench ? location.nameFr : location.name}</span>
                {isCurrent && <MapPin className="h-4 w-4" />}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
