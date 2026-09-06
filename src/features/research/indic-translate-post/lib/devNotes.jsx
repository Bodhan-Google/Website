/**
 * Development-only annotations.
 *
 * The example notes that quote a selection score ("top-scoring ... judge score 5/5")
 * are useful while we are choosing examples and wrong for a client-facing page: they
 * expose the judge, the metric and the filtering. They are kept behind this flag rather
 * than deleted, so the selection is still auditable, and rendered with a loud badge so
 * they cannot ship unnoticed.
 *
 * Set SHOW_DEV_NOTES to false for the published build.
 */
export const SHOW_DEV_NOTES = false;

export const DevNote = ({ children }) => {
  if (!SHOW_DEV_NOTES) return null;
  return (
    <p className="ex-note dev-note">
      <span className="dev-badge">dev only</span>
      {children}
    </p>
  );
};
