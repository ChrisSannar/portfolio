// hotProperty.ts
import { useState, useEffect } from 'react';

interface IHotPropertyListener {
    key: string;
    subscriber: string;
    rerender: () => void;
}
let listeners: Array<IHotPropertyListener> = [];

export function setGlobalState<T>(newState: T, key?: string) {
    if (stateInstances.has(key)) {
        stateInstances.set(key, newState as T);
        listeners.forEach((listener) => {
            if (listener?.key === key) {
                listener.rerender();
            }
        });
    } else {
        throw new Error(`Key ${key} not found in hotProperty global state`);
    }
}

const stateInstances = new Map();
export interface IHotProperty<T> {
    getValue(): T;
    subscribe: (subscriber: string, log?: boolean) => T;
    set: (newState: T) => void;
    setFunc: (func: (value: T) => T) => void;
} 

export function hotProperty<T>(initialState: T, key: string): IHotProperty<T> {
    let globalState = stateInstances.get(key);
    if (!stateInstances.has(key)) {
        globalState = initialState;
        stateInstances.set(key, globalState as T);
    }

    return {
        getValue: (): T => {
            // Add a deep clone to prevent direct mutation
            const value = stateInstances.get(key) as T;
            return typeof value === 'object' ? {...value} : value;
        },
         // eslint-disable-next-line react-hooks/rules-of-hooks
        subscribe: (subscriber: string, log?: boolean): T => {
             // eslint-disable-next-line react-hooks/rules-of-hooks
            const [, setState] = useState(0);
            const rerender = () => setState(n => {
                if (log) console.log(subscriber, key, stateInstances.get(key));
                return n + 1;
            });

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                const newListener = { key, subscriber, rerender };
                // Prevent duplicate listeners
                if (!listeners.some(l => l.key === key && l.subscriber === subscriber)) {
                    listeners.push(newListener);
                }
                return () => {
                    listeners = listeners.filter((listener) => {
                        return !(listener.key === key && listener.subscriber === subscriber);
                    });
                };
            }, []);

            return stateInstances.get(key) as T ?? globalState as T;
        },
        set: (newState: T) => setGlobalState(newState, key),
        setFunc: function (func: (value: T) => T) {
            const currentValue = stateInstances.get(key) as T;
            setGlobalState(func(currentValue), key);
        },
    };
}
