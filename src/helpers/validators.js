import { allPass, pipe, values, filter, length, equals, propEq, countBy, identity, gte, complement } from 'ramda';
import { COLORS, SHAPES } from '../constants';

// функция для подсчета количества фигур определенного цвета
const countColor = color => pipe(
    values,
    filter(val => equals(val, color)),
    length
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    propEq(SHAPES.STAR, COLORS.RED),
    propEq(SHAPES.SQUARE, COLORS.GREEN),
    propEq(SHAPES.TRIANGLE, COLORS.WHITE),
    propEq(SHAPES.CIRCLE, COLORS.WHITE),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = field => {
    return gte(countColor(COLORS.GREEN)(field), 2);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = field => {
    return equals(countColor(COLORS.RED)(field), countColor(COLORS.BLUE)(field));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    propEq(SHAPES.CIRCLE, COLORS.BLUE),
    propEq(SHAPES.STAR, COLORS.RED),
    propEq(SHAPES.SQUARE, COLORS.ORANGE),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true). // доделать
export const validateFieldN5 = field => {
    // убираем белые фигуры и считаем, сколько каждого цвета
    const counts = countBy(identity)(filter(complement(equals(COLORS.WHITE)), values(field)));
    return pipe(
        values,                 // извлекает массив количеств из объекта counts
        filter(c => gte(c, 3)), // фильтрует количества, оставляя только те, которые >= 3
        length,                 // считает, сколько таких количеств
        x => gte(x, 1)          // возвращает true, если есть хотя бы одно количество >= 3
    )(counts);                  // применяем к counts
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    field => equals(countColor(COLORS.GREEN)(field), 2),
    field => equals(field[SHAPES.TRIANGLE], COLORS.GREEN),
    field => equals(countColor(COLORS.RED)(field), 1)
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = field => {
    return equals(countColor(COLORS.ORANGE)(field), values(field).length);
}

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    complement(propEq(SHAPES.STAR, COLORS.RED)),
    complement(propEq(SHAPES.STAR, COLORS.WHITE))
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = field => {
    return equals(countColor(COLORS.GREEN)(field), values(field).length);
}

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    field => equals(field[SHAPES.TRIANGLE], field[SHAPES.SQUARE]),
    complement(propEq(SHAPES.TRIANGLE, COLORS.WHITE))
]);