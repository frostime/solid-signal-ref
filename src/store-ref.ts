/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-10-10 20:58:46
 * @FilePath     : /src/solid-signal-ref/store-ref.ts
 * @LastEditTime : 2024-12-22 13:02:04
 * @Description  : 
 */
// 实现对 solid 的 store 的 ref 的封装
import { createStore, type Store, type SetStoreFunction, unwrap } from "solid-js/store";

interface IStoreRef<T> {
    (): T;
    (...args: any): void;

    // The result of Accessor<T>, with proxy from solidjs
    value: T;

    store: Store<T>;
    update: SetStoreFunction<T>;

    raw: [Store<T>, SetStoreFunction<T>];

    // Purely unwrapped store value, without proxy
    unwrap: () => T;
    derived: <R>(fn: (store: Store<T>) => R) => () => R;

}

const wrapStoreRef = <T extends object>(store: Store<T>, setStore: SetStoreFunction<T>): IStoreRef<T> => {

    const refStore = (...args: any) => {
        if (args.length === 0) {
            return store;
        }
        //@ts-ignore
        return setStore(...args);
    }

    Object.defineProperty(refStore, 'value', {
        get: () =>store,
        set: setStore,
    });
    Object.defineProperty(refStore, 'store', {
        value: store,
        writable: false,
    });
    Object.defineProperty(refStore, 'update', {
        value: setStore,
        writable: false,
    });

    Object.defineProperty(refStore, 'raw', {
        value: [store, setStore],
        writable: false,
    });

    Object.defineProperty(refStore, 'unwrap', {
            value: () => {
                const unwrapped = unwrap(store);
                return unwrapped;
            },
            writable: false,
        });

    Object.defineProperty(refStore, 'derived', {
        value: <R>(fn: (value: Store<T>) => R): () => R => {
            return () => fn(store);
        },
        writable: false,
    });

    return refStore as IStoreRef<T>;
}


const useStoreRef = <T extends object>(initialValue: T): IStoreRef<T> => {
    const [store, setStore] = createStore<T>(initialValue);

    return wrapStoreRef(store, setStore);
}

const createStoreRef = useStoreRef;

export {
    createStoreRef,
    useStoreRef,
    wrapStoreRef,
    type IStoreRef,
}
