import { pipe, test, gte, allPass, lte, tap, pipeWith } from 'ramda';
import Api from '../tools/api';

const api = new Api();

// Обёртка над pipeWith для асинхронных шагов
const createAsyncPipeline = fns => pipeWith(
    (fn, res) => Promise.resolve(res).then(fn),
    fns
);

// Функция для перевода числа в двоичную систему через API
const baseConvert = num =>
    api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: num })
        .then(({ result }) => result);

// Функция для получения животного по ID через API
const getAnimal = id =>
    api.get(`https://animals.tech/${id}`)({})
        .then(({ result }) => result);

// Проверка формата строки: только цифры и точки
const isValidFormat = pipe(
    test(/^[0-9.]+$/),
    Boolean
);

// Проверка длины строки: от 3 до 9 символов
const isLengthValid = allPass([
    value => gte(value.length, 3),
    value => lte(value.length, 9)
]);

// Проверка, что число положительное
const isPositive = value => gte(parseFloat(value), 1);

// Общая валидация строки
const validate = allPass([
    isValidFormat,
    isLengthValid,
    isPositive
]);

const validationCheck = (value) => {
    if (!validate(value)) throw new Error("ValidationError");
    return value;
};

// Преобразование в число с округлением и логированием
const toNumber = pipe(
    parseFloat, 
    Math.round
);

// Получение длины строки
const toLength = x => x.length;

// Возведение в квадрат
const toSquare = x => x * x;

// Остаток от деления на 3
const toMod3 = x => x % 3;

// Композиция функций с поддержкой промисов
const pipeline = writeLog => createAsyncPipeline([
    tap(writeLog),
    validationCheck,
    toNumber,
    tap(writeLog),
    baseConvert,
    tap(writeLog),
    toLength,
    tap(writeLog),
    toSquare,
    tap(writeLog),
    toMod3,
    tap(writeLog),
    getAnimal
]);

// Основная функция для обработки последовательности
const processSequence = ({ value, writeLog, handleSuccess, handleError }) =>
    pipeline(writeLog)(value)
        .then(handleSuccess) // Успешный результат
        .catch(err => 
            handleError(err.message === "ValidationError" 
                ? "ValidationError" // Ошибка валидации
                : err // Ошибка API или другая
            )
        );

export default processSequence;
