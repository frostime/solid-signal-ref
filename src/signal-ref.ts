/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-10-09 20:32:37
 * @FilePath     : /src/signal-ref.ts
 * @LastEditTime : 2024-10-09 22:53:43
 * @Description  : 
 */
import { createSignal, type Setter } from "solid-js";

interface SignalRef<T> {
    (): T;
    (value: T): T;
    value: T;
    update: Setter<T>;
}

/**
 * @param initialValue
 * @returns RefSignal
 */
const useSignalRef = <T>(initialValue: T): SignalRef<T> => {
    const [signal, setSignal] = createSignal<T>(initialValue);

    const refSignal = ((value?: T) => {
        if (value !== undefined) {
            setSignal(() => value as T);
            return value as T;
        }
        return signal();
    }) as SignalRef<T>;

    Object.defineProperty(refSignal, 'value', {
        get: () => signal(),
        set: (param: Parameters<typeof setSignal>[0]) => setSignal(param),
    });
    Object.defineProperty(refSignal, 'update', {
        value: setSignal,
        writable: false,
    })

    return refSignal;
};

export default useSignalRef;
