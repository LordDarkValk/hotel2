document.getElementById('maidCount').addEventListener('change', e => {
    updateMaidInputs(e.target.value);
});

document.getElementById('registerForm').addEventListener('submit', handleRegister);

function handleRegister(e) {
    e.preventDefault();
    const maidCount = parseInt(document.getElementById('maidCount').value);
    const maidNames = Array.from(document.querySelectorAll('#maidNames input')).map(input => input.value);
    const noCleanRooms = document.getElementById('noCleanRooms').value.split(',').map(r => r.trim()).filter(r => r);
    saveRecord(maidCount, maidNames, noCleanRooms);
    renderRecords();
    document.getElementById('registerForm').reset();
    document.getElementById('maidNames').innerHTML = '';
    showTab('recordsTab');
}

document.getElementById('registerTab').addEventListener('click', () => showTab('registerTab'));
document.getElementById('recordsTab').addEventListener('click', () => showTab('recordsTab'));
document.getElementById('downloadCsv').addEventListener('click', downloadCsv);