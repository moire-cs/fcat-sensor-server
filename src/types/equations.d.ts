// equations.d.ts
declare module 'equations' {
    export function solve(expression: string): number;
    export function equation(expression: string): (...args: number[]) => number;
    export function registerOperator(key: string, options: OperatorOptions): void;
    export function registerConstant(key: string, options: ConstantOptions): void;

    interface OperatorOptions {
        fn: (...args: number[]) => number;
        format: string;
        precedence: number;
        hasExpression?: boolean;
    }

    interface ConstantOptions {
        value: number | (() => number);
    }

    export function isVariable(a: string): boolean;
}