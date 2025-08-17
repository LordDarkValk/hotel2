// Definir andares corretamente
const FLOOR1 = Array.from({length: 22}, (_, i) => (101 + i).toString());
const FLOOR2 = Array.from({length: 19}, (_, i) => (201 + i).toString());
const FLOOR3 = Array.from({length: 14}, (_, i) => (301 + i).toString());
const FLOOR4 = Array.from({length: 16}, (_, i) => (401 + i).toString());
const FLOOR5 = [...Array.from({length: 12}, (_, i) => (501 + i).toString()), '514', '515', '516'];

const ROOMS = [...FLOOR1, ...FLOOR2, ...FLOOR3, ...FLOOR4, ...FLOOR5];
const ROOMS_SET = new Set(ROOMS);

function formatRooms(rooms) {
    if (!rooms.length) return '';
    rooms = rooms.sort((a, b) => parseInt(a) - parseInt(b));
    let ranges = [];
    let start = rooms[0];
    let end = start;
    for (let i = 1; i < rooms.length; i++) {
        if (parseInt(rooms[i]) === parseInt(end) + 1) {
            end = rooms[i];
        } else {
            ranges.push(start === end ? start : `${start}-${end}`);
            start = end = rooms[i];
        }
    }
    ranges.push(start === end ? start : `${start}-${end}`);
    return ranges.join(', ');
}

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

    // Combinar andares 1-3 e distribuir consecutivamente
    const earlyFloorsRooms = [...FLOOR1, ...FLOOR2, ...FLOOR3].filter(r => !noCleanSet.has(r));
    const earlyAssign = assignConsecutive(earlyFloorsRooms, maidCount);
    earlyAssign.forEach((rooms, i) => assignments[i].push(...rooms));

    // Distribuição round-robin para andares 4-5 combinados
    const lateFloorsRooms = [...FLOOR4, ...FLOOR5].filter(r => !noCleanSet.has(r)).sort((a, b) => parseInt(a) - parseInt(b));
    lateFloorsRooms.forEach((room, idx) => {
        assignments[idx % maidCount].push(room);
    });

    return assignments;
}

function validateNoCleanRooms(noCleanRooms) {
    const invalid = noCleanRooms.filter(r => !ROOMS_SET.has(r));
    if (invalid.length > 0) {
        alert(`Quartos inválidos: ${invalid.join(', ')}. Apenas quartos pré-definidos são permitidos.`);
        return false;
    }
    return true;
}

function saveRecord(maidCount, maidNames, noCleanRooms) {
    if (!validateNoCleanRooms(noCleanRooms)) return null;
    noCleanRooms.sort((a, b) => parseInt(a) - parseInt(b));
    const records = getRecords();
    const assignments = distributeRooms(noCleanRooms, maidCount);
    const record = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
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
    if (!validateNoCleanRooms(noCleanRooms)) return null;
    noCleanRooms.sort((a, b) => parseInt(a) - parseInt(b));
    const records = getRecords();
    const assignments = distributeRooms(noCleanRooms, maidCount);
    const updatedRecord = {
        id,
        date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
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
    const headers = ['ID', 'Data', 'Camareiras', 'Quartos', 'Quartos Sem Limpeza'];
    const csv = [
        headers.join(','),
        ...records.map(r => [
            r.id,
            `"${r.date}"`,
            `"${r.maids.join(', ')}"`,
            `"${r.rooms.map((rooms, i) => `${r.maids[i]}: ${formatRooms(rooms)}`).join('; ')}"`,
            `"${r.noCleanRooms.join(', ')}"`
        ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registros_limpeza.csv';
    a.click();
    URL.revokeObjectURL(url);
}