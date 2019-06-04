import {isArray, indexOf} from 'lodash';

/**
 * Resolve spread operator
 */
export function ResolveArray(): any {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      
      if(isArray(args[0])){
        args = args[0];
      }

      return originalMethod.apply(this, args);
    }

    return descriptor;
  }
}