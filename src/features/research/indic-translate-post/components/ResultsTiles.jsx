import { useState } from 'react';
import BlogChart from './charts/BlogChart';
import Reveal from './Reveal';
import { formatBlogText } from '../lib/formatBlogText';
import { resolveChart } from '../data/charts';

// One results hub with four tiles, one visible at a time. The four benchmark
// categories were separate sections once; consolidating them keeps the page from
// reading as a wall of charts before the reader has seen what the model does.
//
// Only the active tile is mounted, so the other three cost nothing -- and no chart
// ever measures its width inside a hidden container, which would size it to zero.

const Charts = ({ refs }) =>
  refs?.map((ref) => {
    const chart = resolveChart(ref);
    if (!chart) return null;
    return (
      <Reveal key={chart.id ?? ref}>
        <BlogChart chart={chart} />
      </Reveal>
    );
  }) ?? null;

// The summary carries the heading, so the chart inside drops its own title rather than
// repeating it -- and the wrapper is not a card, so there is no card nested inside a card.
//
// The chart mounts on open and not before. Recharts measures its container to size the
// SVG, and a container inside a closed <details> has no box, so a pre-mounted chart
// renders at zero and only recovers when the ResizeObserver fires. Mounting on toggle
// removes that round trip -- and a closed disclosure costs nothing.
const CollapsedChart = ({ chartRef }) => {
  const [open, setOpen] = useState(false);
  const chart = resolveChart(chartRef);
  if (!chart) return null;
  return (
    <details className="chart-collapse" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{chart.title}</summary>
      {open && <BlogChart chart={{ ...chart, title: undefined }} />}
    </details>
  );
};

const CollapsedCharts = ({ refs }) =>
  refs?.map((ref) => <CollapsedChart key={ref} chartRef={ref} />) ?? null;

const HumanEval = ({ humanEval }) => (
  <div style={{ marginTop: 28 }}>
    <h4 className="research-type-h4" style={{ marginBottom: 10 }}>
      {humanEval.heading}
      {humanEval.previousModel && <span className="prev-tag">previous model</span>}
    </h4>
    <Charts refs={humanEval.charts} />
    <CollapsedCharts refs={humanEval.collapsedCharts} />
    {humanEval.note && (
      <p className="chart-note">
        <span className="dot" aria-hidden="true" />
        <span>{humanEval.note}</span>
      </p>
    )}
  </div>
);

const SubViews = ({ subViews }) => {
  const [active, setActive] = useState(subViews[0].id);
  const view = subViews.find((v) => v.id === active);

  return (
    <>
      <div className="ex-view-toggle" role="group" aria-label="Sentence or document level">
        {subViews.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`ex-view-btn${v.id === active ? ' is-active' : ''}`}
            aria-pressed={v.id === active}
            onClick={() => setActive(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <Charts refs={view.charts} />
      {view.note && (
        <p className="chart-note">
          <span className="dot" aria-hidden="true" />
          <span>{view.note}</span>
        </p>
      )}
    </>
  );
};

const ResultsTiles = ({ section }) => {
  const { tiles } = section;
  const [active, setActive] = useState(tiles[0].id);
  const tile = tiles.find((t) => t.id === active);

  return (
    <div style={{ marginTop: 20 }}>
      <div className="tile-toggle" role="tablist" aria-label="Evaluation category">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tile-tab-${t.id}`}
            aria-selected={t.id === active}
            aria-controls={`tile-panel-${t.id}`}
            className={`tile-btn${t.id === active ? ' is-active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            <span className="tile-btn-title">{t.label}</span>
            <span className="tile-btn-sub">{t.sub}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`tile-panel-${tile.id}`} aria-labelledby={`tile-tab-${tile.id}`}>
        <div className="tile-intro">
          <h3>{tile.heading}</h3>
          {tile.content.map((p, i) => (
            <p key={i} className="research-type-body">
              {formatBlogText(p)}
            </p>
          ))}
        </div>

        {tile.subViews ? (
          <SubViews subViews={tile.subViews} />
        ) : (
          <>
            <Charts refs={tile.charts} />
            <CollapsedCharts refs={tile.collapsedCharts} />
            {tile.humanEval && <HumanEval humanEval={tile.humanEval} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsTiles;
