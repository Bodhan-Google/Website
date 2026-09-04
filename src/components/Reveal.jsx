import { motion as Motion, useReducedMotion } from 'motion/react';

const EASE = [0.25, 0.46, 0.45, 0.94];

// Fade-and-lift a block the first time it scrolls into view. Sections that
// would otherwise land fully formed get a little arrival of their own.
const Reveal = ({ as = 'div', children, className, delay = 0, y = 20, duration = 0.6, amount = 0.15, ...rest }) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        const Tag = as;
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }

    const Component = Motion[as] ?? Motion.div;

    return (
        <Component
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount }}
            transition={{ duration, ease: EASE, delay }}
            {...rest}
        >
            {children}
        </Component>
    );
};

export default Reveal;
