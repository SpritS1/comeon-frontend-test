import type { StaticImageData } from "next/image";
import feastingFox from "@/assets/game-icon/feasting_fox.png";
import bookOfInferno from "@/assets/game-icon/book_of_inferno_logo.png";
import warpWreckers from "@/assets/game-icon/warp_wreckers_powerglyph_logo.png";
import renoSevens from "@/assets/game-icon/renoseverns_logo_one_line_shadow.png";
import scatterMonsters from "@/assets/game-icon/scatter-monster-logo.png";

// Presentation-only metadata keyed by the API's game `code`. In a real casino
// this is the sort of CMS-managed styling that lives alongside the game feed:
// the per-title art gradient, a marketing tag, and a short featured tagline.
export type GameMeta = {
  logo: StaticImageData;
  tag: string;
  tagline: string;
  gradient: string;
};

export const GAME_META: Record<string, GameMeta> = {
  bookofinferno94: {
    logo: bookOfInferno,
    tag: "Adventure",
    tagline:
      "Unearth ancient riches in a blazing underworld adventure where expanding symbols set every free spin alight.",
    gradient:
      "radial-gradient(120% 130% at 50% 0%, #8a2310 0%, #3a0d06 52%, #150502 100%)",
  },
  scattermonsters: {
    logo: scatterMonsters,
    tag: "Cluster Pays",
    tagline:
      "Cute creatures, monstrous wins. Cascading clusters keep the reels tumbling for combo after combo.",
    gradient:
      "radial-gradient(120% 130% at 50% 0%, #3f2d6b 0%, #211738 52%, #0f0a1c 100%)",
  },
  warpwreckers: {
    logo: warpWreckers,
    tag: "Power Glyph",
    tagline:
      "Blast through neon galaxies collecting Power Glyphs that fuse into screen-wide cosmic multipliers.",
    gradient:
      "radial-gradient(120% 130% at 50% 0%, #124b39 0%, #10261f 52%, #061310 100%)",
  },
  feastingfox: {
    logo: feastingFox,
    tag: "Barnyard",
    tagline:
      "A hungry fox raids the henhouse in a rustic barnyard romp full of wild feathers and bonus feasts.",
    gradient:
      "radial-gradient(120% 130% at 50% 0%, #6a4a20 0%, #3a2711 52%, #1b1208 100%)",
  },
  renosevens: {
    logo: renoSevens,
    tag: "Classic",
    tagline:
      "Classic Vegas sevens with a diamond-studded twist — pure retro thrills and glittering line wins.",
    gradient:
      "radial-gradient(120% 130% at 50% 0%, #17497b 0%, #0d2740 52%, #06111d 100%)",
  },
};

// The hero slot in the lobby. Curated rather than data-driven so marketing
// controls what gets top billing.
export const FEATURED_CODE = "bookofinferno94";

const FALLBACK: GameMeta = {
  logo: feastingFox,
  tag: "Slots",
  tagline: "",
  gradient:
    "radial-gradient(120% 130% at 50% 0%, #2a2f1c 0%, #15180f 52%, #0a0b09 100%)",
};

export function metaFor(code: string): GameMeta {
  return GAME_META[code] ?? FALLBACK;
}
