import { hash, compare } from 'bcryptjs';

export const doHash = async (value, saltValue) => {
    const result = await hash(value, saltValue);
    return result;
};

export const doHashValidation = async (value, hashed) => {
    const result = await compare(value, hashed);
    return result;
};