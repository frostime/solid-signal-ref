/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-10-09 20:32:37
 * @FilePath     : /src/signal-ref.ts
 * @LastEditTime : 2024-10-09 21:59:40
 * @Description  : 
 */
import { createSignal, type Setter } from "solid-js";

interface SignalRef<T> {
    (): T;
    (value: T): T;
    value: T;
    update: (value: Parameters<Setter<T>>[0]) => void;
}

/**
 * 创建一个类似 Vue ref 的响应式信号，基于 SolidJS 的 createSignal
 * 
 * 这个函数返回一个对象，可以通过函数调用或 .value 属性来获取和设置值。
 * 它结合了 SolidJS 的响应式特性和类似 Vue ref 的使用方式。
 * 
 * 用法:
    ```js
    const count = useSignal(0);

    // 函数调用方式
    console.log(count()); // 获取值
    count(1); // 设置值

    // .value 属性方式
    console.log(count.value); // 获取值
    count.value = 2; // 设置值
    ```
 * 
 * @param initialValue - 信号的初始值
 * @returns 一个 RefSignal 对象，可以通过函数调用或 .value 属性来操作
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
        value: (param: Parameters<typeof setSignal>[0]) => setSignal(param),
        writable: false,
    })

    return refSignal;
};

export default useSignalRef;
