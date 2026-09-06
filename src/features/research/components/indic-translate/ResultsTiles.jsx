import { useLayoutEffect, useRef, useState } from 'react';
import { canAnimate, gsap, refreshTriggers } from '../../../../utils/motion';
import BlogChart from '../charts/BlogChart';
import { resolveChart } from '../../data/charts';
import { formatBlogText } from '../../utils/formatBlogText';

/**
 * One results hub with four tiles, one visible at a time.
 *
 * The four benchmark categories were separate sections once; consolidating them
 * keeps the page from reading as a wall of charts before the reader has seen what
 * the model does.
 *
 * Only the active tile is mounted, so the other three cost nothing — and no chart
 * ever measures its width inside a hidden container, which would size it to zero.
 * Switching tiles therefore mounts fresh charts, which is why the panel fades its
 * new content in rather than swapping it instantly.
 */

const Charts = ({ refs }) =>
    refs?.map((ref) => {
        const chart = resolveChart(ref);
        if (!chart) return null;
        return <BlogChart key={chart.id ?? ref} chart={chart} />;
    }) ?? null;

/**
 * A secondary chart behind a disclosure.
 *
 * The wrapper is deliberately not a card: the chart inside brings its own, and
 * nesting the two doubles every border and inset. The summary carries the
 * heading, so the chart drops its own rather than repeating it.
 *
 * The chart mounts on first open. A closed <details> is display:none, and these
 * are the two heaviest figures on the page — a 22×14 value matrix each — so
 * rendering them into a zero-height box that most readers never expand is work
 * for nothing.
 */
const CollapsibleChart = ({ chart }) => {
    const [opened, setOpened] = useState(false);

    return (
        <details
            className="chart-collapse"
            onToggle={(event) => {
                if (event.currentTarget.open) setOpened(true);
                // A 22-row matrix opening or closing moves everything under it.
                refreshTriggers();
            }}
        >
            <summary>{chart.title}</summary>
            {opened && <BlogChart chart={{ ...chart, title: undefined }} />}
        </details>
    );
};

const CollapsedCharts = ({ refs }) =>
    refs?.map((ref) => {
        const chart = resolveChart(ref);
        if (!chart) return null;
        return <CollapsibleChart key={chart.id ?? ref} chart={chart} />;
    }) ?? null;

const Note = ({ children }) => (
    <p className="chart-note">
        <span className="dot" aria-hidden="true" />
        <span>{children}</span>
    </p>
);

const HumanEval = ({ humanEval }) => (
    <div className="human-eval">
        <h4 className="human-eval-heading">
            {humanEval.heading}
            {humanEval.previousModel && <span className="prev-tag">previous model</span>}
        </h4>
        <Charts refs={humanEval.charts} />
        <CollapsedCharts refs={humanEval.collapsedCharts} />
        {humanEval.note && <Note>{humanEval.note}</Note>}
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
            {view.note && <Note>{view.note}</Note>}
        </>
    );
};

const ResultsTiles = ({ section }) => {
    const { tiles } = section;
    const [active, setActive] = useState(tiles[0].id);
    const tile = tiles.find((t) => t.id === active);
    const panelRef = useRef(null);
    const indicatorRef = useRef(null);
    const tablistRef = useRef(null);
    const placedRef = useRef(false);

    // The pill slides between tabs instead of blinking from one to the next, so the
    // eye can follow which category it landed on.
    //
    // It is positioned from the active tab's measured box, so it has to re-measure
    // whenever that box moves: on a tab change, on a resize, and — the case that
    // bites — the first time the tablist has a box at all, which is not mount if the
    // article opened in a background tab.
    useLayoutEffect(() => {
        const list = tablistRef.current;
        const pill = indicatorRef.current;
        if (!list || !pill) return undefined;

        const place = (animate) => {
            const current = list.querySelector('[aria-selected="true"]');
            if (!current || !current.offsetWidth) return;

            const target = {
                x: current.offsetLeft,
                y: current.offsetTop,
                width: current.offsetWidth,
                height: current.offsetHeight,
                autoAlpha: 1,
            };

            if (animate && canAnimate()) {
                gsap.to(pill, { ...target, duration: 0.42, ease: 'power3.out', overwrite: true });
            } else {
                gsap.set(pill, target);
            }
        };

        // Jump into place the first time; slide on every later tab change.
        place(placedRef.current);
        placedRef.current = true;

        const observer = new ResizeObserver(() => place(false));
        observer.observe(list);
        return () => observer.disconnect();
    }, [active]);

    // Each newly mounted panel rises in. Charts measure their own width on mount, so
    // only opacity and transform move here — nothing that takes the panel out of flow.
    useLayoutEffect(() => {
        const node = panelRef.current;
        if (!node) return undefined;

        const tween = gsap.fromTo(
            node,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: true }
        );
        // A suspended ticker would leave the panel — and every chart in it — at
        // opacity 0, so jump it to the end rather than fading nothing in.
        if (!canAnimate()) tween.progress(1);
        return () => tween.kill();
    }, [active]);

    // Switching category swaps one set of charts for another of a different
    // height, so every trigger below the hub is measuring against a stale page.
    useLayoutEffect(() => {
        refreshTriggers();
    }, [active]);

    return (
        <div className="results-hub">
            <div className="tile-toggle" role="tablist" aria-label="Evaluation category" ref={tablistRef}>
                <span className="tile-pill" aria-hidden="true" ref={indicatorRef} />
                {tiles.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        id={`tile-btn-tab-${t.id}`}
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

            <div
                role="tabpanel"
                id={`tile-panel-${tile.id}`}
                aria-labelledby={`tile-btn-tab-${tile.id}`}
                className="tile-panel"
                ref={panelRef}
            >
                <div className="tile-intro">
                    <h3>{tile.heading}</h3>
                    {tile.content.map((paragraph, i) => (
                        <p key={i} className="research-type-body">
                            {formatBlogText(paragraph)}
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
