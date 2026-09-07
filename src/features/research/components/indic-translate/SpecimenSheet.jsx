import TranslateExamplesGallery from '../../../developers/components/models/indic-translate/TranslateExamplesGallery';
import '../../../developers/components/models/indic-translate/translate.css';

/**
 * The specimen sheet: one language, every capability, all real recorded output.
 *
 * Same component as the model page's examples gallery, embedded under the blog's
 * `.itb-embed` scope so it drops the standalone page's section padding and its
 * own hero header. Where the try-it block above is about watching a translation
 * happen, this is about reading what came out — including the full document pair
 * with its headings, tables and code fences intact.
 */
const SpecimenSheet = () => (
    <div className="itr-page itb-embed itb-embed-wide">
        <TranslateExamplesGallery />
    </div>
);

export default SpecimenSheet;
