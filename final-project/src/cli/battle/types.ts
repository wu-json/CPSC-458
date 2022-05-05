/**
 * Represents a move made in a certain situation. The situation string
 * has the following string format:
 *
 * "my-hp:opponent-hp:my-status:opponent-status"
 *
 * This serves as the "index" to the Monte Carlo table.
 */
export type TrackedMove = {
  situation: string;
  moveName: string;
};
