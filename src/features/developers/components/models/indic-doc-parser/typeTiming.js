// Shared timing for the output pane: the demo timeline has to reserve exactly
// as long for a block as the block will take to type itself out.
const CPS = 130;
const MIN_DURATION = 0.35;
const MAX_DURATION = 2.4;

export const typeDuration = (text) =>
    Math.min(MAX_DURATION, Math.max(MIN_DURATION, (text?.length ?? 0) / CPS));
