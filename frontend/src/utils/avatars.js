import pf1 from "../assets/pf1.jpeg";
import pf2 from "../assets/pf2.jpeg";
import pf3 from "../assets/pf3.jpeg";
import pf4 from "../assets/pf4.jpeg";
import pf5 from "../assets/pf5.jpeg";

export const AVATARS = [pf1, pf2, pf3, pf4, pf5];

export const AVATAR_ASSET_MAP = {
  "pf1.jpeg": pf1,
  "pf2.jpeg": pf2,
  "pf3.jpeg": pf3,
  "pf4.jpeg": pf4,
  "pf5.jpeg": pf5,
};

export const DEFAULT_AVATAR_SRC = pf5;

export const resolveAvatarSrc = (value) => {
  const raw = String(value || "").trim();

  if (!raw) return DEFAULT_AVATAR_SRC;
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  return AVATAR_ASSET_MAP[raw] || DEFAULT_AVATAR_SRC;
};
