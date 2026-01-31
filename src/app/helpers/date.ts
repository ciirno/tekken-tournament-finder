const dateToday = new Date();

const startOfDay = new Date(dateToday.setHours(0, 0, 0, 0));
const endOfDay = new Date(dateToday.setHours(23, 59, 59, 999));

export { dateToday, startOfDay, endOfDay };
