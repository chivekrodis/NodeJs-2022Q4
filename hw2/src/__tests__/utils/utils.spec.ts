import { ZodError } from 'zod';
import { isUUID, getValidationErrors } from '../../utils';

describe('isUUID should', () => {
  test('return true if string is valid UUID', () => {
    expect(isUUID('30c9ad90-ffec-40e6-9357-8a2378f3a807')).toBeTruthy();
  });

  test('return false if string invalid UUID', () => {
    expect(isUUID('string')).toBeFalsy();
  });
});

describe('getValidationErrors should', () => {
  const error = {
    issues: [
      {
        code: 'too_small',
        minimum: 4,
        type: 'number',
        inclusive: true,
        exact: false,
        message: 'Number must be greater than or equal to 4',
        path: ['age'],
      },
    ],
  };
  test('return array of errors', () => {
    expect(getValidationErrors(error as ZodError)).toEqual([
      { message: 'Number must be greater than or equal to 4', path: ['age'] },
    ]);
  });
});
