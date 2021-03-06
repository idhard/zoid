/* @flow */

import { getDomain, isSameDomain, type CrossDomainWindowType } from 'cross-domain-utils/src';

import type { Component } from '../component';
import type { PropsType, MixedPropDefinitionType } from '../component/props';

import type { ChildHelpers } from './index';

export function normalizeChildProp<T, P>(component : Component<P>, props : (PropsType<P>), key : string, value : T, helpers : ChildHelpers<P>) : ?T  {

    // $FlowFixMe
    const prop : MixedPropDefinitionType<P> = component.getPropDefinition(key);

    if (!prop) {
        return value;
    }

    if (typeof prop.childDecorate === 'function') {
        const { close, focus, onError, onProps, resize, getParent, getParentDomain, show, hide } = helpers;
        return prop.childDecorate({ value, close, focus, onError, onProps, resize, getParent, getParentDomain, show, hide });
    }

    return value;
}

// eslint-disable-next-line max-params
export function normalizeChildProps<P>(parentComponentWindow : CrossDomainWindowType, component : Component<P>, props : (PropsType<P>), origin : string, helpers : ChildHelpers<P>, isUpdate : boolean = false) : (PropsType<P>) {

    const result = {};

    for (const key of Object.keys(props)) {
        const prop = component.getPropDefinition(key);

        if (prop && prop.sameDomain && (origin !== getDomain(window) || !isSameDomain(parentComponentWindow))) {
            continue;
        }

        // $FlowFixMe
        const value = normalizeChildProp(component, props, key, props[key], helpers);

        result[key] = value;
        if (prop && prop.alias && !result[prop.alias]) {
            result[prop.alias] = value;
        }
    }

    if (!isUpdate) {
        for (const key of component.getPropNames()) {
            if (!props.hasOwnProperty(key)) {
                result[key] = normalizeChildProp(component, props, key, props[key], helpers);
            }
        }
    }

    // $FlowFixMe
    return result;
}
