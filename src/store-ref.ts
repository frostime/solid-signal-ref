/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-10-10 20:58:46
 * @FilePath     : /src/solid-signal-ref/store-ref.ts
 * @LastEditTime : 2024-10-10 22:58:20
 * @Description  : 
 */
// 实现对 solid 的 store 的 ref 的封装
import { createStore, type Store, type SetStoreFunction } from "solid-js/store";

interface IStoreRef<T> {
    (): T;
    (...args: any): T;

    value: T;

    store: Store<T>;
    update: SetStoreFunction<T>;

    raw: [Store<T>, SetStoreFunction<T>];

    derived: (fn: (store: Store<T>) => any) => any;

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
        set: (value: T) => setStore(() => value),
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

    Object.defineProperty(refStore, 'derived', {
        value: (fn: (value: Store<T>) => any): any => {
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
