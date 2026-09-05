import { Navigate, useParams } from 'react-router-dom';
import { getPostBySlug, postPath, BLOG_LIST_PATH } from '../data/posts';

/**
 * Old links used /research/<slug>. Posts now live under /research/blogs/<slug>
 * or /research/publication/<slug> depending on category; send the visitor to
 * the right one, or to the blog listing if the slug is unknown.
 */
const LegacyPostRedirect = () => {
    const { slug } = useParams();
    const post = getPostBySlug(slug);
    return <Navigate to={post ? postPath(post) : BLOG_LIST_PATH} replace />;
};

export default LegacyPostRedirect;
