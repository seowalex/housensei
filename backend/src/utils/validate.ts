import { validate, ValidationError } from 'class-validator';
import Exception from './exception';

const CREATE_OPTIONS = { forbidUnknownValues: true };

const UPDATE_OPTIONS = {
  forbidUnknownValues: true,
  skipMissingProperties: true,
};

// throws error if validation fails
const classValidate = async (obj: any, isCreate: boolean) => {
  const option = isCreate ? CREATE_OPTIONS : UPDATE_OPTIONS;

  const allErrors = await validate(obj, option).then(
    (errors: ValidationError[]) =>
      errors.map((err) => ({
        field: err.property,
        detail: Object.values(err.constraints ?? {}),
      }))
  );

  if (allErrors.length !== 0) {
    throw new Exception(allErrors);
  }
};

export default classValidate;
