import { Children, createRef, Fragment, useEffect, useRef, useState } from 'react';
import React from 'react';
import gsap from 'gsap';
import { useCounter, useCreation, useSet } from 'ahooks';
import MathExtra from 'plugins/utils/MathExtra';

/**
 * @param  {object} props
 * @param  {number} [props.duration=0.5] Duration of the animation in miliseconds (ms)
 * @param  {('power2.out'|'power2.in'|'power2.inOut')} [props.ease='power2.out'] Duration of the animation in miliseconds (ms)
 */
export const useGsap = (props = {}) => {
    const { duration = 0.5, ease = 'power2.out', yoyo = false, repeat, delay } = props;

    const instance = useCreation(() => {
        const obj = { value: 0 };
        return obj;
    });
    const [, update] = useState();

    const tween = useCreation(() =>
        gsap.to(instance, {
            value: 1,
            duration,
            ease,
            yoyo,
            repeat,
            delay,
            onUpdate: () => {
                update({});
            },
        })
    );

    const play = () => {
        if (!tween.isActive()) tween.play();
    };
    const pause = () => {
        if (tween.isActive()) tween.pause();
    };
    const toggle = () => {
        if (tween.isActive()) {
            tween.pause();
        } else {
            tween.play();
        }
        update({});
    };
    const stop = () => {
        tween.pause(0);
        update({});
    };
    const reset = stop;
    const reverse = () => tween.reverse();
    const restart = () => {
        stop();
        play();
    };
    const kill = () => {
        tween.kill();
        tween.kill();
    };

    return [instance.value, { tween, play, pause, stop, reset, restart, toggle, reverse, kill }];
};

/**
 * @param  {React.Ref} ref
 * @param  {object} props
 * @param  {number} [props.duration=0.5] Duration of the animation in miliseconds (ms)
 * @param  {('power2.out'|'power2.in'|'power2.inOut')} [props.ease='power2.out'] Duration of the animation in miliseconds (ms)
 */
export const useGsapTarget = (ref, props = {}) => {
    // const { duration = 0.5, ease = "power2.out", yoyo = false, repeat, delay } = props;
    const [firstTime, setFirstTime] = useState(true);
    const [tween, setTween] = useState();
    const [initialValues, setInitialValues] = useState();

    useEffect(() => {
        if (ref.current) {
            // ("It's a new tween!");
            if (tween) {
                tween.pause(0);
                tween.kill();
            }
            const t = gsap.to(ref.current, props);
            // if (firstTime) {
            //   setFirstTime(false);
            // }
            // (gsap.getProperty(ref.current, "x"));
            setTween(t);
        }
    }, [ref.current]);

    const play = () => {
        if (!tween.isActive()) tween.play();
    };
    const pause = () => {
        if (tween.isActive()) tween.pause();
    };
    const toggle = () => {
        if (tween.isActive()) {
            tween.pause();
        } else {
            tween.play();
        }
        // update({});
    };
    const stop = () => {
        tween.pause(0);
        // update({});
    };
    const reset = stop;
    const reverse = () => tween.reverse();
    const restart = () => {
        stop();
        play();
    };
    const kill = () => {
        // tween.kill();
        gsap.killTweensOf(ref.current);
    };

    return { tween, play, pause, stop, reset, restart, toggle, reverse, kill };
};

// /**
//  * The controller of your provided GSAP tweens:
//  * @param  {gsap.core.Tween[]} tweens=[]
//  */
// export const useGsapController = (tweens = []) => {
//   const [_tweens, setTweens] = useState(tweens);

//   const play = () => _tweens.map((tween) => tween.start());
//   const pause = () => _tweens.map((tween) => tween.pause());
//   const toggle = () => {
//     _tweens.map((tween) => {
//       if (tween.isActive()) {
//         tween.pause();
//       } else {
//         tween.play();
//       }
//     });
//   };
//   const restart = () => _tweens.map((tween) => tween.restart());
//   const apply = (ts) => setTweens(ts);
//   const kill = () => _tweens.map((tween) => tween.kill());
//   const reverse = () => _tweens.map((tween) => tween.reverse());
//   const seek = (value) => _tweens.map((tween) => tween.seek(value));

//   const totalDuration = () => _.last(_tweens).totalDuration();

//   return { apply, play, pause, restart, reverse, toggle, kill, seek, totalDuration };
// };

/**
 * The controller of your provided GSAP tweens:
 * @param  {gsap.core.Tween[]} tweens=[]
 */
export const useGsapController = (tweens = [], options = {}) => {
    const { onChange = null } = options;
    // const [timeline, setTimeline] = useState(gsap.timeline());
    const timeline = useCreation(() => gsap.timeline());
    const [_tweens, setTweens] = useState(tweens);
    const [_ats, setAts] = useState([]);

    useEffect(() => {
        // (_tweens);
        timeline.clear();
        _tweens.map((t, i) => {
            timeline.add(t, _ats.length > 0 ? _ats[i] : 0);
        });

        if (onChange) onChange();
    }, [_tweens, _ats]);

    const apply = (ts, ats) => {
        setTweens(ts);
    };
    const add = (tween, position) => {
        timeline.add(tween, position);
    };
    const addList = (tweens, positions) => {
        setAts(positions);
        setTweens(tweens);
    };
    const addToTimeline = (tweens) => {
        timeline.clear();
        // ("tweens", tweens);
        tweens.map((tween) => {
            timeline.to(tween.target, tween.params, tween.at);
        });
        if (onChange) onChange();
    };
    const play = () => timeline.play();
    const pause = () => timeline.pause();
    const toggle = () => {
        if (timeline.isActive()) {
            timeline.pause();
        } else {
            timeline.play();
        }
    };
    const restart = () => timeline.restart();
    const kill = () => timeline.kill();
    const reverse = () => timeline.reverse();
    const seek = (value) => timeline.seek(value);

    const totalDuration = () => timeline.totalDuration();

    return { apply, add, addList, addToTimeline, play, pause, restart, reverse, toggle, kill, seek, totalDuration };
};

/**
 * @param  {React.ComponentProps} props
 * @param  {any} props.children
 * @param  {gsap.core.Tween[]} props.tweens
 * @param  {useGsapController} props.controller
 * @param  {boolean} props.paused
 */
export const Gsap = ({ children, tweens, controller, paused, ...params }) => {
    const { duration = 0.8, ease = 'power2.out', delay = 0, stagger, at, ...restParams } = params;
    const { onStart, onStartParams, onUpdate, onUpdateParams, onComplete, onCompleteParams, onInterrupt, onInterruptParams, ...tweenParams } =
        restParams;

    const [refs, setRefs] = useState([]);
    const [updateCount, { inc }] = useCounter(0);
    const [newChildren, setNewChildren] = useState(children);
    const uniqueInt = useCreation(() => MathExtra.randInt(0, 9999999999));
    const [_tweens, setTweens] = useState([]);

    const orgChildren =
        children && children.type == Fragment
            ? children.props.children.length
                ? children.props.children
                : [children.props.children]
            : children.length
            ? children
            : [children];
    // (orgChildren);
    // let childrenProps = "";
    // orgChildren.map((child) => childrenProps += )

    useEffect(() => {
        // setRefs()
        let tmpRefs = [];
        const childrenWithProps = Children.map(orgChildren, (child, index) => {
            if (React.isValidElement(child)) {
                let newProps = { ...child.props };
                // (child);

                // Nếu là function component (ko có ref) thì bỏ qua!
                // (child.type)
                if (typeof child.type == 'string' || child.type.prototype.render) {
                    newProps.key = child.props.key || `gsap-child-${uniqueInt}-${index}`;
                    newProps.ref = child.props.ref || createRef();
                    tmpRefs.push(newProps.ref);
                }

                return React.cloneElement(child, newProps);
            }
            return child;
        });

        setNewChildren(childrenWithProps);
        setRefs(tmpRefs);
        inc(1);
    }, [orgChildren.length, JSON.stringify(tweenParams)]);

    useEffect(() => {
        if (updateCount > 0) {
            // do st
            // (`[UPDATED #${childrenMounted}]`, refs);
            let ts = [];
            refs.map((ref, i) => {
                const ele = ref.current;
                if (ele) {
                    const t = gsap.to(ele, { duration, ease, delay: delay ? delay + stagger * i : stagger * i, ...tweenParams });
                    if (paused) t.pause();
                    ts.push(t);
                }
            });
            setTweens(ts);

            // cast gsap controller:
            if (controller) {
                if (!at) {
                    controller.apply(ts);
                } else {
                    ts.map((t) => controller.add(t, at));
                }
            }
        }
    }, [updateCount, JSON.stringify(tweenParams)]);

    useEffect(() => {
        if (tweens) tweens(_tweens);
    }, [_tweens]);

    return newChildren;
};

/**
 * @param  {React.ComponentProps} props
 * @param  {any} props.children
 * @param  {gsap.core.Tween[]} props.tweens
 * @param  {useGsapController} props.controller
 * @param  {boolean} props.paused
 */
export const GsapTimeline = ({ children, controller, paused, ...params }) => {
    const { duration = 0.8, ease = 'power2.out', delay, stagger, ...restParams } = params;
    const {
        onStart,
        onStartParams,
        onUpdate,
        onUpdateParams,
        onComplete,
        onCompleteParams,
        onInterrupt,
        onInterruptParams,
        // ...tweenParams
    } = restParams;

    const [newChildren, setNewChildren] = useState();
    const [ats, setAts] = useState();
    // const [tweens, setTweens] = useState([]);
    const [counter, myCounter] = useCounter(0);

    const [tweens, _tweens] = useSet([]);

    // const _controller = useGsapController(tweens);

    // (orgChildren);

    const play = () => {
        if (controller) controller.play();
        console.log('controller', controller);
    };

    useEffect(() => {
        const orgChildren =
            newChildren ??
            (children && children.type == Fragment
                ? children.props.children.length
                    ? children.props.children
                    : [children.props.children]
                : children.length
                ? children
                : [children]);

        let count = 0;
        // let ts = [];
        let _ats = [];

        const childrenWithProps = Children.map(orgChildren, (child, index) => {
            if (React.isValidElement(child)) {
                if (child.type == Gsap) {
                    let tweenProps = { ...child.props };
                    delete tweenProps.children;

                    let position = (_ats[index] = tweenProps.at || 0);
                    delete tweenProps.at;

                    // (tweenProps);

                    // delete newProps.tweens;
                    // (child.props.children);
                    let childrenList = typeof child.props.children.length == 'undefined' ? [child.props.children] : child.props.children;
                    // (childrenList);
                    let newChildrenList = [];
                    childrenList.map((c) => {
                        let np = { ...c.props };

                        if (!np.ref) {
                            np.ref = (r) => {
                                console.log('!!!!', r);
                                if (r) {
                                    // const t = gsap.to(r, { ...tweenProps });
                                    // t.pause(0);
                                    // ts.push(t);
                                    if (controller) {
                                        _tweens.add({ target: r, params: { ...tweenProps }, at: position });
                                    }
                                }
                            };
                        } else {
                            np.ref((r) => {
                                // ("????");
                                // if (r && r.current) ts.push(gsap.to(r.current, { ...tweenProps }));
                                if (controller) {
                                    // controller.addToTimeline({ target: r.current, params: { ...tweenProps } }, _ats[index]);
                                    // ts.push({ target: r.current, params: { ...tweenProps }, at: _ats[index] });
                                    _tweens.add({ target: r.current, params: { ...tweenProps }, at: position });
                                }
                            });
                        }
                        const nc = React.cloneElement(c, np);
                        newChildrenList.push(nc);
                    });
                    return newChildrenList;
                }
            }
            return child;
        });

        // setAts(_ats);
        // setTweens(ts);
        setNewChildren(childrenWithProps);
        // myCounter.inc(1);

        // (childrenIds);
    }, []);

    useEffect(() => {
        // ("tweens:", tweens);
        if (controller) {
            // controller.apply(tweens);
            // if (ats && ats.length > 0) {
            //   console.log(tweens, ats);
            //   controller.addList(tweens, ats);
            // } else {
            // controller.apply(tweens);
            // }
            // controller
            // ("tweens", Array.from(tweens));
            controller.addToTimeline(Array.from(tweens));
        }
    }, [tweens]);

    return newChildren ?? [];
};
