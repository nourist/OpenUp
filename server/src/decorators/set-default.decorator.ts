import { Transform, TransformFnParams } from 'class-transformer';

export function Default<T>(defaultValue: T): PropertyDecorator {
	return Transform(({ value }: TransformFnParams): T => {
		return (value ?? defaultValue) as T;
	});
}
