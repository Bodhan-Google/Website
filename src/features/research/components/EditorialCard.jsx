import { useId } from 'react';
import { cn } from '../../../utils/tailwindUtils';

export const InnerPanel = ({ as: Component = 'div', className = '', children, ...props }) => (
    <Component className={cn('editorial-panel', className)} {...props}>
        {children}
    </Component>
);

const EditorialCard = ({
    as: Component = 'section',
    eyebrow,
    title,
    description,
    metric,
    metrics,
    footer,
    className = '',
    children,
}) => {
    const titleId = useId();
    const descId = useId();

    return (
        <Component
            className={cn('editorial-card', className)}
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
        >
            <header className="editorial-card-header">
                {eyebrow && <p className="editorial-card-eyebrow">{eyebrow}</p>}
                <h3 id={titleId} className="editorial-card-title">
                    {title}
                </h3>
                {description && (
                    <p id={descId} className="editorial-card-description">
                        {description}
                    </p>
                )}
                {metric}
                {metrics}
            </header>

            {children}

            {footer && <p className="editorial-card-footer">{footer}</p>}
        </Component>
    );
};

export default EditorialCard;
