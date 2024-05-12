import { ValidationPipeOptions } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { isEmpty, startCase } from "lodash";
import { ValidationFailed } from "../exceptions";
export const ROUTE_NAME = 'nestjs-boilerplate::route-name';

export function parseError(error) {
    const children = [];
    for (const child of error.children || []) {
        children.push(parseError(child));
    }

    const messages = [];
    for (const c in error.constraints) {
        let message = error.constraints[c];
        message = message.replace(error.property, startCase(error.property));
        messages.push(message);
    }

    const errors = {};
    if (!isEmpty(messages)) {
        errors[error.property] = messages;
    }

    for (const child of children) {
        for (const key in child) {
            errors[`${error.property}.${key}`] = child[key];
        }
    }

    return errors;
}

export const ValidatorPipeOptions: ValidationPipeOptions = {
    transform: true,
    whitelist: true,
    stopAtFirstError: true,
    validateCustomDecorators: true,
    exceptionFactory: (errors: ValidationError[]) => {
        let bag = {};
        if (errors.length > 0) {

            for (const error of errors) {
                const errorsFromParser = parseError(error);
                const childErrorBag = {};
                for (const key in errorsFromParser) {
                    if (!isEmpty(errorsFromParser[key])) {
                        childErrorBag[key] = errorsFromParser[key];
                    }
                }

                bag = { ...bag, ...childErrorBag };
            }

            throw new ValidationFailed(bag);
        }
    }
}