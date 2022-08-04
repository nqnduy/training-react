import { Children, createRef, Fragment, useEffect, useRef, useState } from 'react';
import React, { ComponentProps } from 'react';
import gsap from 'gsap';
import { useCounter, useCreation, useSet } from 'ahooks';
import MathExtra from 'plugins/utils/MathExtra';
import { isDOMTypeElement } from 'plugins/utils/ReactUtils';
import safeStringify from 'fast-safe-stringify';

const defaultDuration = 0.8,
    defaultEase = 'power2.out';

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

/**
 * @typedef TweenParams
 * @type {object}
 * @property {gsap.TweenTarget} target - Target of the tween.
 * @property {gsap.TweenVars} params - your name.
 * @property {(number|string)} at - Started time in miliseconds (ms).
 */

/**
 * @callback ReturnNumber
 * @returns {number}
 */

/**
 * @callback ControllerParams
 * @param {(TweenParams|TweenParams[])}
 */

/**
 * @typedef GsapController
 * @type {object}
 * @property {ControllerParams} apply -
 * @property {ControllerParams} concat -
 * @property {void} play -
 * @property {void} pause -
 * @property {void} restart -
 * @property {void} reverse -
 * @property {void} toggle -
 * @property {void} kill -
 * @property {void} seek -
 * @property {ReturnNumber} totalDuration -
 */
// { apply, add, play, pause, restart, reverse, toggle, kill, seek, totalDuration }
/**
 * The controller of your provided GSAP tweens:
 * @param  {(TweenParams[])} [tweens=[]]
 * @returns  {GsapController}
 */
export const useGsapController = (tweens = [], options = {}) => {
    const { onChange = null } = options;
    const [timeline, setTimeline] = useState(gsap.timeline());
    // const timeline = useCreation(() => gsap.timeline());
    const [_tweens, setTweens] = useState(tweens);
    // const [_tweens, tweenSet] = useSet(tweens);
    // const [_ats, setAts] = useState([]);
    const [refs, setRefs] = useState([]);

    useEffect(() => {
        // (_tweens);
        timeline.clear();

        // ("_tweens", Array.from(_tweens));
        let rs = [];
        _tweens.map((t) => {
            rs.push(t.target);
        });
        setRefs(rs);
    }, [_tweens]);

    useEffect(() => {
        if (timeline.isActive()) return;
        // ("_tweens", _tweens);
        refs.map((ref, i) => {
            let t = _tweens[i];
            // ("t", t);
            if (ref.current) timeline.to(ref.current, t.params, t.at);
        });
        timeline.play();
        if (onChange) onChange();
    }, [refs, _tweens]);

    /**
     * @param  {(TweenParams|TweenParams[])} ts
     */
    const apply = (ts) => {
        // tweenSet.reset();
        // ("ts", ts);
        // const _ts = ts.length ? ts : [ts];
        // _ts.map((t) => tweenSet.add(t));
        setTweens(ts);
    };

    /**
     * @param  {(TweenParams|TweenParams[])} ts
     */
    const concat = (ts) => {
        // timeline.add(tween, position);
        // timeline.to(t.target, t.params, t.at);
        // tweenSet.add(t);
        const _ts = typeof ts.length == undefined ? [ts] : ts;
        setTweens([..._tweens, ..._ts]);
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
    const restart = () => {
        timeline.pause(0);
        timeline.play();
    };
    const kill = () => timeline.kill();
    const reverse = () => timeline.reverse();
    const seek = (value) => timeline.seek(value);

    const totalDuration = () => timeline.totalDuration();

    return { apply, concat, play, pause, restart, reverse, toggle, kill, seek, totalDuration };
};

/**
 * @param  {Object} props
 * @param  {any} props.children - The list of children components
 * @param  {(gsap.TweenVars|gsap.TweenVars[])} props.params - The GSAP tween parameters
 * @param  {GsapController} props.controller - The GSAP controller (ref of gsap timeline)
 * @param  {boolean} props.paused - Should the tween be paused at the beginning
 */
export const Gsap = ({ children, params, controller, paused, ...rest }) => {
    // const [refs, refSet] = useSet([]);
    // const [_tweens, tweenSet] = useSet(tweens.length ? tweens : [tweens]);

    const [refs, setRefs] = useState([]);
    // const [updateCount, { inc }] = useCounter(0);

    const [newChildren, setNewChildren] = useState(children);
    // const [_children, childrenSet] = useSet();
    const uniqueInt = useCreation(() => MathExtra.randInt(0, 9999999999));

    // const [_tweens, setTweens] = useState([]);
    const _controller = useGsapController();

    const orgChildren =
        children && children.type == Fragment
            ? children.props.children.length
                ? children.props.children
                : [children.props.children]
            : children.length
            ? children
            : [children];

    useEffect(() => {
        let _refs = [];

        const childrenWithProps = Children.map(orgChildren, (child, index) => {
            // Nếu là function component (ko có ref) thì bỏ qua!
            if (isDOMTypeElement(child)) {
                let newProps = { ...child.props };
                // (child);

                if (child.type == Gsap) console.warn("<Gsap> can't be a child of <Gsap>.");

                newProps.key = child.props.key || `gsap-child-${uniqueInt}-${index}`;
                newProps.ref = child.props.ref || createRef();

                // refSet.add(newProps.ref);
                _refs.push(newProps.ref);

                return React.cloneElement(child, newProps);
            }
            return child;
        });

        setNewChildren(childrenWithProps);
        setRefs(_refs);
    }, [orgChildren.length]);

    // (orgChildren);
    // let childrenProps = "";
    // orgChildren.map((child) => childrenProps += )

    useEffect(() => {
        // ("params.length", params.length);
        let ts = [];
        let _params = typeof params.length == 'undefined' ? [params] : params;
        // const {
        //   onStart,
        //   onStartParams,
        //   onUpdate,
        //   onUpdateParams,
        //   onComplete,
        //   onCompleteParams,
        //   onInterrupt,
        //   onInterruptParams,
        //   ...noCallbackParams
        // } = params;

        _params.map((p, k) => {
            // Default params:
            const { duration = defaultDuration, ease = defaultEase, delay = 0, stagger = 0, at = '>', ...restParams } = p;

            refs.map((ref, i) => {
                const t = {
                    target: ref,
                    params: {
                        duration,
                        ease,
                        delay: delay + stagger * i,
                        ...restParams,
                    },
                    at: at,
                };
                ts.push(t);
            });
        });

        // cast gsap controller parameters:
        if (controller) {
            controller.apply(ts);
        } else {
            _controller.apply(ts);
        }
    }, [refs, safeStringify(params)]);

    return newChildren;
};

/**
 * @param  {any} props
 * @param  {GsapController} props.controller
 * @param  {boolean} [props.paused=false]
 */
export const GsapTimeline = ({ children, controller, paused = false, ...params }) => {
    // const { duration = 0.8, ease = "power2.out", delay, stagger, ...restParams } = params;
    // const {
    //   onStart,
    //   onStartParams,
    //   onUpdate,
    //   onUpdateParams,
    //   onComplete,
    //   onCompleteParams,
    //   onInterrupt,
    //   onInterruptParams,
    //   ...noCallbackParams
    // } = restParams;

    // const [newChildren, setNewChildren] = useState();
    // const [ats, setAts] = useState();
    // const [tweens, setTweens] = useState([]);
    // const [counter, myCounter] = useCounter(0);

    // const [tweens, _tweens] = useSet([]);

    const _controller = useGsapController();

    const uniqueInt = useCreation(() => MathExtra.randInt(0, 9999999999));
    const [keys, setKeys] = useState('');

    // (orgChildren);

    const orgChildren =
        children && children.type == Fragment
            ? children.props.children.length
                ? children.props.children
                : [children.props.children]
            : children.length
            ? children
            : [children];

    const childrenWithProps = Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type == Gsap) {
            // ("child", child);
            let newProps = { ...child.props };
            // newProps.controller = controller || _controller;
            // _controller.concat(newProps.params);
            newProps.key = `gsap-timeline-item-${uniqueInt}-${index}`;
            newProps.className = newProps.className ? newProps.className + newProps.key : newProps.key;

            // return <Gsap {...newProps}>{child.props.children}</Gsap>;
            return React.cloneElement(child, newProps);
        }
        return child;
    });

    useEffect(() => {
        console.log('Keys updated:', keys);

        let refs = [];
        Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.type == Gsap) {
                // _controller.concat(child.props.params);
                // setKeys(keys + child.props.key + ",");
                console.log('child.props.params', child.props.params);
                console.log('child.props.ref', child.props.ref);
                // refs.push(child.ref)
            }
        });
    }, [keys]);

    return childrenWithProps;

    // useEffect(() => {
    //   const orgChildren =
    //     newChildren ??
    //     (children && children.type == Fragment
    //       ? children.props.children.length
    //         ? children.props.children
    //         : [children.props.children]
    //       : children.length
    //       ? children
    //       : [children]);

    //   const childrenWithProps = Children.map(orgChildren, (child, index) => {
    //     if (React.isValidElement(child) && child.type == Gsap) {
    //       let tweenProps = { ...child.props };
    //       delete tweenProps.children;

    //       let position = (_ats[index] = tweenProps.at || 0);
    //       delete tweenProps.at;

    //       // (tweenProps);

    //       // delete newProps.tweens;
    //       // (child.props.children);
    //       let childrenList =
    //         typeof child.props.children.length == "undefined" ? [child.props.children] : child.props.children;
    //       // (childrenList);
    //       let newChildrenList = [];
    //       childrenList.map((c) => {
    //         let np = { ...c.props };

    //         if (!np.ref) {
    //           np.ref = (r) => {
    //             console.log("!!!!", r);
    //             if (r) {
    //               // const t = gsap.to(r, { ...tweenProps });
    //               // t.pause(0);
    //               // ts.push(t);
    //               if (controller) {
    //                 _tweens.add({ target: r, params: { ...tweenProps }, at: position });
    //               }
    //             }
    //           };
    //         } else {
    //           np.ref((r) => {
    //             // ("????");
    //             // if (r && r.current) ts.push(gsap.to(r.current, { ...tweenProps }));
    //             if (controller) {
    //               // controller.addToTimeline({ target: r.current, params: { ...tweenProps } }, _ats[index]);
    //               // ts.push({ target: r.current, params: { ...tweenProps }, at: _ats[index] });
    //               _tweens.add({ target: r.current, params: { ...tweenProps }, at: position });
    //             }
    //           });
    //         }
    //         const nc = React.cloneElement(c, np);
    //         newChildrenList.push(nc);
    //       });
    //       return newChildrenList;
    //     }
    //     return child;
    //   });

    //   // setAts(_ats);
    //   // setTweens(ts);
    //   setNewChildren(childrenWithProps);
    //   // myCounter.inc(1);

    //   // (childrenIds);
    // }, []);

    // useEffect(() => {
    //   // ("tweens:", tweens);
    //   if (controller) {
    //     // controller.apply(tweens);
    //     // if (ats && ats.length > 0) {
    //     //   console.log(tweens, ats);
    //     //   controller.addList(tweens, ats);
    //     // } else {
    //     // controller.apply(tweens);
    //     // }
    //     // controller
    //     // ("tweens", Array.from(tweens));
    //     controller.addToTimeline(Array.from(tweens));
    //   }
    // }, [tweens]);

    // return newChildren ?? [];
};
