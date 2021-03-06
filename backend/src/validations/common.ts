/* eslint-disable func-names */
/* eslint-disable import/prefer-default-export */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBiggerThanOrEqualTo(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThanOrEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            value === undefined ||
            relatedValue === undefined ||
            (typeof value === 'number' &&
              typeof relatedValue === 'number' &&
              value >= relatedValue)
          );
        },
      },
    });
  };
}
