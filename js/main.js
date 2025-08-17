document.getElementById('maidCount').addEventListener('change', e => {
    updateMaidInputs(e.target.value);
});

document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const maidCount = parseInt(document.getElementById('maidCount').value);
    const maidNames = Array.from(document.querySelectorAll('#maidNames input')).map(input => input.value.trim()).filter(name => name);
    if (maidNames.length !== maidCount) {
        alert('Por favor, informe nomes para todas as camareiras.');
        return;
    }
    const noCleanRooms = document.getElementById('noCleanRooms').value.split(',').map(r => r.trim()).filter(r => r);
    let result;
    if (editingId) {
        result = updateRecord(editingId, maidCount, maidNames, noCleanRooms);
        if (result) {
            editingId = null;
            const submitButton = document.querySelector('#registerForm button[type="submit"]');
            submitButton.textContent = 'Registrar';
            document.getElementById('cancelEdit').classList.add('hidden');
        }
    } else {
        result = saveRecord(maidCount, maidNames, noCleanRooms);
    }
    if (result) {
        renderRecords();
        document.getElementById('registerForm').reset();
        document.getElementById('maidNames').innerHTML = '';
        showTab('recordsTab');
    }
});

document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

document.getElementById('registerTab').addEventListener('click', () => showTab('registerTab'));
document.getElementById('recordsTab').addEventListener('click', () => showTab('recordsTab'));
document.getElementById('downloadCsv').addEventListener('click', downloadCsv);
document.getElementById('printAll').addEventListener('click', printAllRecords);