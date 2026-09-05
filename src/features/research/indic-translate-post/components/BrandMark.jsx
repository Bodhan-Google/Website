/**
 * Brand marks for the hero link chips.
 *
 * GitHub: the official single-path mark from simple-icons v13 (CC0). Monochrome by
 * design, so it takes `currentColor` and follows the chip's hover state.
 *
 * Hugging Face: the official full-colour logo, fetched from
 * huggingface.co/front/assets/huggingface_logo-noborder.svg and inlined verbatim --
 * nine paths in the brand's own #FFD21E / #FF9D0B / #FF323D / #3A3B45. Its own colours
 * are the point, so unlike the GitHub mark it does NOT inherit the chip's colour and
 * does not change on hover. The source file ships width/height but no viewBox, so the
 * 95x88 viewBox below is added here or nothing scales.
 *
 * Both marks remain trademarks of their owners; they are used here only to label links
 * to those platforms, which is what they are for. Neither can be loaded at runtime --
 * this app builds offline and the artifact CSP blocks external images -- and
 * hand-drawing a recognisable logo is worse than showing none.
 */

const GITHUB = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';

const GitHubMark = () => (
  <svg
    className="chip-mark"
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="currentColor"
    role="img"
    aria-label="GitHub"
    focusable="false"
  >
    <path d={GITHUB} />
  </svg>
);

const HuggingFaceMark = () => (
  <svg
    className="chip-mark chip-mark-colour"
    viewBox="0 0 95 88"
    width="16"
    height="15"
    fill="none"
    role="img"
    aria-label="Hugging Face"
    focusable="false"
  >
      <path fill="#FFD21E" d="M47.21 76.5a34.75 34.75 0 1 0 0-69.5 34.75 34.75 0 0 0 0 69.5Z" />
      <path fill="#FF9D0B" d="M81.96 41.75a34.75 34.75 0 1 0-69.5 0 34.75 34.75 0 0 0 69.5 0Zm-73.5 0a38.75 38.75 0 1 1 77.5 0 38.75 38.75 0 0 1-77.5 0Z" />
      <path fill="#3A3B45" d="M58.5 32.3c1.28.44 1.78 3.06 3.07 2.38a5 5 0 1 0-6.76-2.07c.61 1.15 2.55-.72 3.7-.32ZM34.95 32.3c-1.28.44-1.79 3.06-3.07 2.38a5 5 0 1 1 6.76-2.07c-.61 1.15-2.56-.72-3.7-.32Z" />
      <path fill="#FF323D" d="M46.96 56.29c9.83 0 13-8.76 13-13.26 0-2.34-1.57-1.6-4.09-.36-2.33 1.15-5.46 2.74-8.9 2.74-7.19 0-13-6.88-13-2.38s3.16 13.26 13 13.26Z" />
      <path fill="#3A3B45" d="M39.43 54a8.7 8.7 0 0 1 5.3-4.49c.4-.12.81.57 1.24 1.28.4.68.82 1.37 1.24 1.37.45 0 .9-.68 1.33-1.35.45-.7.89-1.38 1.32-1.25a8.61 8.61 0 0 1 5 4.17c3.73-2.94 5.1-7.74 5.1-10.7 0-2.34-1.57-1.6-4.09-.36l-.14.07c-2.31 1.15-5.39 2.67-8.77 2.67s-6.45-1.52-8.77-2.67c-2.6-1.29-4.23-2.1-4.23.29 0 3.05 1.46 8.06 5.47 10.97Z" />
      <path fill="#FF9D0B" d="M70.71 37a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM24.21 37a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM17.52 48c-1.62 0-3.06.66-4.07 1.87a5.97 5.97 0 0 0-1.33 3.76 7.1 7.1 0 0 0-1.94-.3c-1.55 0-2.95.59-3.94 1.66a5.8 5.8 0 0 0-.8 7 5.3 5.3 0 0 0-1.79 2.82c-.24.9-.48 2.8.8 4.74a5.22 5.22 0 0 0-.37 5.02c1.02 2.32 3.57 4.14 8.52 6.1 3.07 1.22 5.89 2 5.91 2.01a44.33 44.33 0 0 0 10.93 1.6c5.86 0 10.05-1.8 12.46-5.34 3.88-5.69 3.33-10.9-1.7-15.92-2.77-2.78-4.62-6.87-5-7.77-.78-2.66-2.84-5.62-6.25-5.62a5.7 5.7 0 0 0-4.6 2.46c-1-1.26-1.98-2.25-2.86-2.82A7.4 7.4 0 0 0 17.52 48Zm0 4c.51 0 1.14.22 1.82.65 2.14 1.36 6.25 8.43 7.76 11.18.5.92 1.37 1.31 2.14 1.31 1.55 0 2.75-1.53.15-3.48-3.92-2.93-2.55-7.72-.68-8.01.08-.02.17-.02.24-.02 1.7 0 2.45 2.93 2.45 2.93s2.2 5.52 5.98 9.3c3.77 3.77 3.97 6.8 1.22 10.83-1.88 2.75-5.47 3.58-9.16 3.58-3.81 0-7.73-.9-9.92-1.46-.11-.03-13.45-3.8-11.76-7 .28-.54.75-.76 1.34-.76 2.38 0 6.7 3.54 8.57 3.54.41 0 .7-.17.83-.6.79-2.85-12.06-4.05-10.98-8.17.2-.73.71-1.02 1.44-1.02 3.14 0 10.2 5.53 11.68 5.53.11 0 .2-.03.24-.1.74-1.2.33-2.04-4.9-5.2-5.21-3.16-8.88-5.06-6.8-7.33.24-.26.58-.38 1-.38 3.17 0 10.66 6.82 10.66 6.82s2.02 2.1 3.25 2.1c.28 0 .52-.1.68-.38.86-1.46-8.06-8.22-8.56-11.01-.34-1.9.24-2.85 1.31-2.85Z" />
      <path fill="#FFD21E" d="M38.6 76.69c2.75-4.04 2.55-7.07-1.22-10.84-3.78-3.77-5.98-9.3-5.98-9.3s-.82-3.2-2.69-2.9c-1.87.3-3.24 5.08.68 8.01 3.91 2.93-.78 4.92-2.29 2.17-1.5-2.75-5.62-9.82-7.76-11.18-2.13-1.35-3.63-.6-3.13 2.2.5 2.79 9.43 9.55 8.56 11-.87 1.47-3.93-1.71-3.93-1.71s-9.57-8.71-11.66-6.44c-2.08 2.27 1.59 4.17 6.8 7.33 5.23 3.16 5.64 4 4.9 5.2-.75 1.2-12.28-8.53-13.36-4.4-1.08 4.11 11.77 5.3 10.98 8.15-.8 2.85-9.06-5.38-10.74-2.18-1.7 3.21 11.65 6.98 11.76 7.01 4.3 1.12 15.25 3.49 19.08-2.12Z" />
      <path fill="#FF9D0B" d="M77.4 48c1.62 0 3.07.66 4.07 1.87a5.97 5.97 0 0 1 1.33 3.76 7.1 7.1 0 0 1 1.95-.3c1.55 0 2.95.59 3.94 1.66a5.8 5.8 0 0 1 .8 7 5.3 5.3 0 0 1 1.78 2.82c.24.9.48 2.8-.8 4.74a5.22 5.22 0 0 1 .37 5.02c-1.02 2.32-3.57 4.14-8.51 6.1-3.08 1.22-5.9 2-5.92 2.01a44.33 44.33 0 0 1-10.93 1.6c-5.86 0-10.05-1.8-12.46-5.34-3.88-5.69-3.33-10.9 1.7-15.92 2.78-2.78 4.63-6.87 5.01-7.77.78-2.66 2.83-5.62 6.24-5.62a5.7 5.7 0 0 1 4.6 2.46c1-1.26 1.98-2.25 2.87-2.82A7.4 7.4 0 0 1 77.4 48Zm0 4c-.51 0-1.13.22-1.82.65-2.13 1.36-6.25 8.43-7.76 11.18a2.43 2.43 0 0 1-2.14 1.31c-1.54 0-2.75-1.53-.14-3.48 3.91-2.93 2.54-7.72.67-8.01a1.54 1.54 0 0 0-.24-.02c-1.7 0-2.45 2.93-2.45 2.93s-2.2 5.52-5.97 9.3c-3.78 3.77-3.98 6.8-1.22 10.83 1.87 2.75 5.47 3.58 9.15 3.58 3.82 0 7.73-.9 9.93-1.46.1-.03 13.45-3.8 11.76-7-.29-.54-.75-.76-1.34-.76-2.38 0-6.71 3.54-8.57 3.54-.42 0-.71-.17-.83-.6-.8-2.85 12.05-4.05 10.97-8.17-.19-.73-.7-1.02-1.44-1.02-3.14 0-10.2 5.53-11.68 5.53-.1 0-.19-.03-.23-.1-.74-1.2-.34-2.04 4.88-5.2 5.23-3.16 8.9-5.06 6.8-7.33-.23-.26-.57-.38-.98-.38-3.18 0-10.67 6.82-10.67 6.82s-2.02 2.1-3.24 2.1a.74.74 0 0 1-.68-.38c-.87-1.46 8.05-8.22 8.55-11.01.34-1.9-.24-2.85-1.31-2.85Z" />
      <path fill="#FFD21E" d="M56.33 76.69c-2.75-4.04-2.56-7.07 1.22-10.84 3.77-3.77 5.97-9.3 5.97-9.3s.82-3.2 2.7-2.9c1.86.3 3.23 5.08-.68 8.01-3.92 2.93.78 4.92 2.28 2.17 1.51-2.75 5.63-9.82 7.76-11.18 2.13-1.35 3.64-.6 3.13 2.2-.5 2.79-9.42 9.55-8.55 11 .86 1.47 3.92-1.71 3.92-1.71s9.58-8.71 11.66-6.44c2.08 2.27-1.58 4.17-6.8 7.33-5.23 3.16-5.63 4-4.9 5.2.75 1.2 12.28-8.53 13.36-4.4 1.08 4.11-11.76 5.3-10.97 8.15.8 2.85 9.05-5.38 10.74-2.18 1.69 3.21-11.65 6.98-11.76 7.01-4.31 1.12-15.26 3.49-19.08-2.12Z" />
  </svg>
);

/**
 * Image marks for the organisations whose logos are files rather than paths.
 *
 * bodhan: public/images/bodhan_mark.svg -- the current vector mark, taken from the
 *   sibling IndicOCR post's asset set (/assets/logos/bodhan-logo.svg) rather than the
 *   older 460x460 bodhan_mark.png already in this repo, which is the same origami mark
 *   at a lighter stroke weight.
 * ai4bharat: public/images/logo_ai4bharat.png -- this repo's own asset, 398x400, used
 *   by the previous version of this page.
 * bhashini: public/images/bhashini_mark.png -- their GitHub organisation avatar, 168px.
 *   Replaces a 48x48 crop of bhashini.gov.in/favicon.ico, which was all that was
 *   reachable before: their site is a client-rendered SPA that answers every asset path
 *   with the app shell, so no logo file could be fetched from it.
 *
 * There is no AIKosh asset -- its site returns the app shell for every path too, and it
 * has no reachable icon -- so that chip stays a wordmark.
 */
// Prefixed with Vite's BASE_URL, not written as a root-absolute path. Vite rewrites the
// asset URLs it can see -- the ones in index.html and in imported modules -- but a string
// literal like '/images/x.png' is opaque to it and would stay pointing at the domain root.
// This page is destined for bodhan.ai/research/blogs/indic-translate, a sub-path, where
// three logos would then have 404'd.
const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;

const IMAGE_MARKS = {
  bodhan: { src: asset('bodhan_mark.svg'), label: 'Bodhan.AI' },
  ai4bharat: { src: asset('logo_ai4bharat.png'), label: 'AI4Bharat' },
  bhashini: { src: asset('bhashini_mark.png'), label: 'Bhashini' },
  // Downloaded by hand by the user, because aikosh.indiaai.gov.in could not serve it:
  // every asset path there answers 200 with the SPA's own index.html and `x-cache: Error
  // from cloudfront`, verified over repeated retries and in a real browser that never got
  // past the site's loader.
  //
  // It is the site's 32x32 favicon, and ink runs off all four edges of it (left 21px,
  // right 7, top 15, bottom 30 -- the bounding box is the whole canvas), so it is a zoomed
  // crop of a wider wordmark rather than a complete mark. It reads fine at the 20px the
  // chip renders it at; replacing this one file with a fuller logo is all that would be
  // needed if AIKosh publishes one.
  aikosh: { src: asset('aikosh_mark.png'), label: 'AIKosh' },
};

const ImageMark = ({ src }) => (
  // Decorative: every mark on this page sits next to the organisation's name in text,
  // so an alt would be read out twice.
  <img className="chip-mark" src={src} alt="" width="20" height="20" loading="lazy" />
);

// Documentation's mark. Unlike the two above this is a plain icon rather than anyone's
// logo, so it is drawn here: a stroked outline reads better than a filled one at 14px,
// and it takes currentColor so it follows the chip's hover state like the GitHub mark.
const BookMark = () => (
  <svg
    className="chip-mark"
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Documentation"
    focusable="false"
  >
    <path d="M4 4.6A2.6 2.6 0 0 1 6.6 2H19a1 1 0 0 1 1 1v13.4a1 1 0 0 1-1 1H6.6A2.6 2.6 0 0 0 4 21V4.6Z" />
    <path d="M4 20.9A2.6 2.6 0 0 1 6.6 18.4H20" />
  </svg>
);

const MARKS = { github: GitHubMark, huggingface: HuggingFaceMark, book: BookMark };

const BrandMark = ({ name }) => {
  const Mark = MARKS[name];
  if (Mark) return <Mark />;
  const image = IMAGE_MARKS[name];
  return image ? <ImageMark src={image.src} /> : null;
};

export default BrandMark;
