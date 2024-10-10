/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-10-09 20:32:37
 * @FilePath     : /src/solid-signal-ref/signal-ref.ts
 * @LastEditTime : 2024-10-10 12:09:39
 * @Description  : 
 */
import { createSignal, type Setter, type Accessor } from "solid-js";

interface SignalRef<T> {
    (): T;
    (value: T): T;

    value: T;

    signal: Accessor<T>;
    update: Setter<T>;

    raw: [Accessor<T>, Setter<T>];

    derived: (fn: (value: T) => any) => Accessor<any>;
}

const wrapSignalRef = <T>(signal: Accessor<T>, setSignal: Setter<T>): SignalRef<T> => {
    const refSignal = ((value?: T) => {
        if (value !== undefined) {
            setSignal(() => value as T);
            return value as T;
        }
        return signal();
    }) as SignalRef<T>;

    Object.defineProperty(refSignal, 'value', {
        get: signal, // 直接使用 signal 函数作为 getter
        set: (value: T) => setSignal(() => value),
    });
    Object.defineProperty(refSignal, 'signal', {
        value: signal,
        writable: false,
    });
    Object.defineProperty(refSignal, 'update', {
        value: setSignal,
        writable: false,
    });

    Object.defineProperty(refSignal, 'raw', {
        value: [signal, setSignal],
        writable: false,
    });

    Object.defineProperty(refSignal, 'derived', {
        value: (fn: (value: T) => T): Accessor<any> => {
            return () => fn(signal());
        },
        writable: false,
    });

    return refSignal;
}

/**
 * Create a signal ref with initial value, that significantly simplifies the use of signals in SolidJS.
 * 
 * @Usage
 * 
 * ```js
 * const ref = useSignalRef(0);
 * 
 * // Visit the signal
 * ref(); // 0
 * ref.value; // 0
 * ref.signal(); // 0, ref.signal is equivalent to signal()
 * 
 * // Update the signal
 * ref(1); // 1
 * ref.value = 2; // 2
 * ref.update(3); // 3, ref.update() is equivalent to setSignal()
 * 
 * // Get the raw signal's accessor and setter
 * const [rawSignal, setRawSignal] = ref.raw;
 * 
 * // Derive a new signal from the current signal
 * const derivedSignal = ref.derived((value) => value * 2); //equivelant to () => signal() * 2
 * ```
 * 
 * @param initialValue
 * @returns RefSignal
 */
const useSignalRef = <T>(initialValue: T): SignalRef<T> => {
    const [signal, setSignal] = createSignal<T>(initialValue);

    const refSignal = wrapSignalRef(signal, setSignal);

    return refSignal;
};

const createSignalRef = useSignalRef;

export {
    wrapSignalRef,
    useSignalRef,
    createSignalRef,
};
