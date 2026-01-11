export function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// build a 6x7 matrix (weeks x days) for the calendar view
export function buildMonthMatrix(monthStart) {
    const start = startOfMonth(monthStart);
    const end = endOfMonth(monthStart);

    const matrix = [];
    // day index in week: 0 (Sun) .. 6 (Sat)
    let current = new Date(start);
    current.setDate(current.getDate() - current.getDay());

    for (let week = 0; week < 6; week++) {
        const row = [];
        for (let d = 0; d < 7; d++) {
            // include Date objects for days that belong to the visible grid; caller can style empties
            const isInMonth = current.getMonth() === monthStart.getMonth();
            row.push(isInMonth ? new Date(current) : null);
            current.setDate(current.getDate() + 1);
        }
        matrix.push(row);
    }

    return matrix;
}

export function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
