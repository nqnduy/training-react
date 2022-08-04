import { useEffect, useRef } from 'react';

/**
useAnimationFrame(e => {
    console.log(e.delta, e.time);
}, []);
 */

// Reusable component that also takes dependencies
const useNextFrame = (cb, deps) => {
    if (typeof window == 'undefined') return;

    const frame = useRef();
    const last = useRef(performance.now());
    const init = useRef(performance.now());

    const animate = () => {
        const now = performance.now();
        const time = (now - init.current) / 1000;
        const delta = (now - last.current) / 1000;
        // In seconds ~> you can do ms or anything in userland
        cb({ time, delta });
        last.current = now;
        frame.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        frame.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame.current);
    }, deps); // Make sure to change it if the deps change
};

export default useNextFrame;
