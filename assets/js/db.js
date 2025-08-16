// Define floors correctly
const FLOOR1 = Array.from({length: 22}, (_, i) => (101 + i).toString());
const FLOOR2 = Array.from({length: 19}, (_, i) => (201 + i).toString());
const FLOOR3 = Array.from({length: 14}, (_, i) => (301 + i).toString());
const FLOOR4 = Array.from({length: 16}, (_, i) => (401 + i).toString());
const FLOOR5 = [...Array.from({length: 12}, (_, i) => (501 + i).toString()), '514', '515', '516'];

const ROOMS = [...FLOOR1, ...FLOOR2, ...FLOOR3, ...FLOOR4, ...FLOOR5];

function assignConsecutive(rooms, maidCount) {
    const assignments = Array(maidCount).fill().map(() => []);
    const total = rooms.length;
    if (total === 0) return assignments;
    const q = Math.floor(total / maidCount);
    const r = total % maidCount;
    let start = 0;
    for (let i = 0; i < maidCount; i++) {
        const size = q + (i < r ? 1 : 0);
        assignments[i] = rooms.slice(start, start + size);
        start += size;
    }
    return assignments;
}

function distributeRooms(noCleanRooms, maidCount) {
    const assignments = Array(maidCount).fill().map(() => []);
    const noCleanSet = new Set(noCleanRooms);

    // Consecutive distribution for floors 1-3
    [FLOOR1, FLOOR2, FLOOR3].forEach(floorRooms => {
        const clean = floorRooms.filter(r => !noCleanSet.has(r));
        const floorAssign = assignConsecutive(clean, maidCount);
        floorAssign.forEach((rooms, i) => assignments[i].push(...rooms));
    });

    // Round-robin distribution for floors 4-5
    [FLOOR4, FLOOR5].forEach(floorRooms => {
        const clean = floorRooms.filter(r => !noCleanSet.has(r));
        clean.forEach((room, idx) => {
            assignments[idx % maidCount].push(room);
        });
    });

    return assignments;
}

function saveRecord(maidCount, maidNames, noCleanRooms) {
    const records = getRecords();
    const assignments = distributeRooms(noCleanRooms, maidCount);
    const record = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
        maids: maidNames,
        rooms: assignments,
        noCleanRooms
    };
    records.push(record);
    localStorage.setItem('cleaningRecords', JSON.stringify(records));
    return record;
}

function getRecords() {
    return JSON.parse(localStorage.getItem('cleaningRecords') || '[]');
}

function updateRecord(id, maidCount, maidNames, noCleanRooms) {
    const records = getRecords();
    const assignments = distributeRooms(noCleanRooms, maidCount);
    const updatedRecord = {
        id,
        date: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
        maids: maidNames,
        rooms: assignments,
        noCleanRooms
    };
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
        records[index] = updatedRecord;
        localStorage.setItem('cleaningRecords', JSON.stringify(records));
    }
    return updatedRecord;
}

function deleteRecord(id) {
    const records = getRecords().filter(r => r.id !== id);
    localStorage.setItem('cleaningRecords', JSON.stringify(records));
}

function downloadCsv() {
    const records = getRecords();
    const headers = ['ID', 'Date', 'Maids', 'Rooms', 'No Clean Rooms'];
    const csv = [
        headers.join(','),
        ...records.map(r => [
            r.id,
            `"${r.date}"`,
            `"${r.maids.join(', ')}"`,
            `"${r.rooms.map((rooms, i) => `${r.maids[i]}: ${rooms.sort((a,b)=>parseInt(a)-parseInt(b)).join(', ')}`).join('; ')}"`,
            `"${r.noCleanRooms.join(', ')}"`
        ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaning_records.csv';
    a.click();
    URL.revokeObjectURL(url);
}