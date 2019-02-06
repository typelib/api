import {isArray, indexOf} from 'lodash';
import {TypeError} from '@kernel-js/exceptions';
import { isString } from 'util';

export function Validate(): any {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
  
      descriptor.value = function(...args: any[]) {
        
        if (!isArray(args)) {
          throw new TypeError('Invalid argument', 500);
        }

        return originalMethod.apply(this, args);
      }
  
      return descriptor;
    }
  }