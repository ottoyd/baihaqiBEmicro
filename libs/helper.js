function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

async function getNextSequenceValue(sequenceName, redis) {
    const currentDate = getCurrentDate();
    const key = sequenceName;

    const dateKey = `${sequenceName}:date`;
    const storedDate = await redis.get(dateKey);

    if (storedDate !== currentDate) {
        await redis.set(key, 0, 'EX', 3600 * 24);
        await redis.set(dateKey, currentDate, 'EX', 3600 * 24);
    }

    const sequenceValue = await redis.incr(key);

    const paddedSequence = String(sequenceValue).padStart(5, '0');
    const formattedNumber = `${key}_${currentDate}${paddedSequence}`;
    return formattedNumber;
}

module.exports = { getCurrentDate, getNextSequenceValue }