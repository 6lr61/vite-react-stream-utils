import { create } from "zustand";
import {
  makeBttvFragments,
  type BetterTTVEmote,
  type BetterTTVEmoteFragment,
} from "./betterttv";
import {
  makeSevenTvFragments,
  type SevenTvEmoteModel,
  type SevenTVEmoteFragment,
} from "./seventv";

interface EmoteState {
  bttv: {
    global: Record<string, BetterTTVEmoteFragment>;
    channel: Record<string, BetterTTVEmoteFragment>;
  };
  sevenTv: {
    global: Record<string, SevenTVEmoteFragment>;
    channel: Record<string, SevenTVEmoteFragment>;
  };
  setBttv: (emotes: BetterTTVEmote[], global?: boolean) => void;
  setSevenTv: (emotes: SevenTvEmoteModel[], global?: boolean) => void;
}

export const useEmotes = create<EmoteState>()((set) => ({
  bttv: {
    global: {},
    channel: {},
  },
  sevenTv: {
    global: {},
    channel: {},
  },
  setBttv: (rawEmotes: BetterTTVEmote[], global?: boolean) => {
    const emotes = makeBttvFragments(rawEmotes, global);

    set(({ bttv }) => {
      if (global) {
        return {
          bttv: {
            global: { ...bttv.global, ...emotes },
            channel: bttv.channel,
          },
        };
      } else {
        return {
          bttv: {
            global: bttv.global,
            channel: { ...bttv.channel, ...emotes },
          },
        };
      }
    });
  },
  setSevenTv: (rawEmotes: SevenTvEmoteModel[], global?: boolean) => {
    const emotes = makeSevenTvFragments(rawEmotes, global);

    set(({ sevenTv }: EmoteState) => {
      if (global) {
        return {
          sevenTv: {
            global: { ...sevenTv.global, ...emotes },
            channel: sevenTv.channel,
          },
        };
      } else {
        return {
          sevenTv: {
            global: sevenTv.global,
            channel: { ...sevenTv.channel, ...emotes },
          },
        };
      }
    });
  },
}));
