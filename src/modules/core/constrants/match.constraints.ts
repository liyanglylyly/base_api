/**
 * 判断两个字段的值是否相等的验证规则
 * */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMatch' })
export class MatchConstraints implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const [relateProperty] = args.constraints;
    const relateValue = (args.object as any)[relateProperty];
    return value === relateValue;
  }

  defaultMessage(args?: ValidationArguments): string {
    const [relateProperty] = args.constraints;
    return `${relateProperty} and ${args.property} don't match`;
  }
}

/**
 * 判断DTO中两个属性的值是否相等的验证规则
 * @param relatedProperty 用于对比的属性名称
 * @param validationOptions class-validator库的选项
 *
 * @IsMatch('password', {message: '两次输入密码不同})
 * readonly plainPassword: string
 */
export function IsMatch(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedProperty],
      validator: MatchConstraints,
    });
  };
}
