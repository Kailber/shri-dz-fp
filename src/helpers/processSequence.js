import { pipe, gte, tap, allPass, lte } from 'ramda';
import Api from '../tools/api';

const api = new Api();
// Основная функция для обработки последовательности
const processSequence = async (
    { 
        value, 
        writeLog, 
        handleSuccess, 
        handleError 
    }) => {
        // 1. Логируем исходную строку
        writeLog(value);

        // 2. Валидация
        const isValid = allPass([
            value => lte(value.length, 9), // Длина строки меньше 10 символов
            value => gte(value.length, 3), // Длина строки больше 2 символов
            value => gte(parseFloat(value), 1), // Значение положительное
            value => /^[0-9.]+$/.test(value) // Проверка формата строки: только цифры и точки
        ]);

        // Если строка не валидна, вызываем обработчик ошибки 
        if (!isValid(value)) {
            handleError('ValidationError');
            return;
        }

        // 3. Преобразуем, округляем и логируем значение
        const num = pipe(
            parseFloat, 
            Math.round, 
            tap(writeLog)
        )(value);

        // 4. Перевод в двоичную через API
        api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: num })
            .then(({ result: binary }) => {
                writeLog(binary);
                return binary;
            })
            // 5. Длина бинарной строки
            .then(binary => {
                const len = binary.length;
                writeLog(len);
                return len;
            })
            // 6. Квадрат
            .then(len => {
                const sq = len * len;
                writeLog(sq);
                return sq;
            })
            // 7. Остаток от деления на 3
            .then(sq => {
                const rem = sq % 3;
                writeLog(rem);
                return rem;
            })
            // 8. Получаем животное по id
            .then(rem => api.get(`https://animals.tech/${rem}`, {}))
            .then(({ result: animal }) => {
                // 9. Успех
                handleSuccess(animal);
            })
            .catch(err => {
                handleError(err.toString());
            });
};

export default processSequence;
