/*
 Task

 A small model class for calendar "chips" (events/items you can drag onto days).

 Properties:
 - id: string (simple unique id)
 - color: string (CSS color)
 - label: string
 - start: number (epoch milliseconds)
 - duration: number (milliseconds)
 - meta: object (optional additional data)

 Methods: getEnd(), toJSON(), static fromJSON(), overlapsWith(other)
*/

export default class Task {
    constructor({ id = null, color = 'blue', label = '', start = null, duration = null, meta = {} } = {}) {
        this.id = id || Task._generateId();
        this.color = color;
        this.label = label;
        this.start = Number(start) || null;
        this.duration = Number(duration) || null; // milliseconds
        this.meta = meta || {};
    }

    static _generateId() {
        return `chip_${Date.now().toString(36)}_${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    getColor() {
        return this.color;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.start + this.duration;
    }

    setStartEpochMs(epochMs) {
        this.start = Number(epochMs);
        return this;
    }

    setDurationMs(ms) {
        this.duration = Number(ms);
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            color: this.color,
            label: this.label,
            start: this.start,
            duration: this.duration,
            meta: this.meta,
        };
    }

    static fromJSON(obj) {
        if (!obj) return null;
        return new Task({
            id: obj.id,
            color: obj.color,
            label: obj.label,
            start: obj.start,
            duration: obj.duration,
            meta: obj.meta,
        });
    }

    // Returns true if this chip overlaps time range of `other` (inclusive start, exclusive end)
    overlapsWith(other) {
        if (!other) return false;
        const a1 = this.start;
        const a2 = this.getEnd();
        const b1 = other.start;
        const b2 = other.getEnd();
        return a1 < b2 && b1 < a2;
    }
}
