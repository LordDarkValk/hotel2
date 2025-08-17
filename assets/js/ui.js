function updateMaidInputs(count) {
    const maidNamesDiv = document.getElementById('maidNames');
    maidNamesDiv.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nome da Camareira ${i + 1}`;
        input.className = 'w-full p-2 border rounded mb-2';
        input.required = true;
        input.title = `Informe o nome da camareira ${i + 1}`;
        maidNamesDiv.appendChild(input);
    }
}

function renderRecords() {
    const recordsTable = document.getElementById('recordsTable');
    const records = getRecords();
    recordsTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Camareiras</th>
                    <th>Quartos Atribuídos</th>
                    <th>Quartos Sem Limpeza</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${records.map(r => `
                    <tr>
                        <td>${r.date}</td>
                        <td>${r.maids.join(', ')}</td>
                        <td>${r.rooms.map((rooms, i) => `${r.maids[i]}: ${formatRooms(rooms)}`).join('<br>')}</td>
                        <td>${formatRooms(r.noCleanRooms)}</td>
                        <td>
                            <button onclick="editRecord('${r.id}')" class="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700" title="Editar este registro">Editar</button>
                            <button onclick="deleteRecordUI('${r.id}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" title="Excluir este registro">Excluir</button>
                            <button onclick="printRecord('${r.id}')" class="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 print-button" title="Imprimir este registro">Imprimir</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

let editingId = null;

function editRecord(id) {
    const records = getRecords();
    const record = records.find(r => r.id === id);
    if (!record) return;
    editingId = id;
    document.getElementById('maidCount').value = record.maids.length;
    updateMaidInputs(record.maids.length);
    document.querySelectorAll('#maidNames input').forEach((input, i) => {
        input.value = record.maids[i];
    });
    document.getElementById('noCleanRooms').value = record.noCleanRooms.join(', ');
    const submitButton = document.querySelector('#registerForm button[type="submit"]');
    submitButton.textContent = 'Atualizar';
    document.getElementById('cancelEdit').classList.remove('hidden');
    showTab('registerTab');
}

function cancelEdit() {
    editingId = null;
    document.getElementById('registerForm').reset();
    document.getElementById('maidNames').innerHTML = '';
    const submitButton = document.querySelector('#registerForm button[type="submit"]');
    submitButton.textContent = 'Registrar';
    document.getElementById('cancelEdit').classList.add('hidden');
    showTab('recordsTab');
}

function deleteRecordUI(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        deleteRecord(id);
        renderRecords();
    }
}

function printRecord(id) {
    const records = getRecords();
    const record = records.find(r => r.id === id);
    if (!record) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Imprimir Registro</title><style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; }</style></head>
        <body>
            <h1>Registro de Limpeza do Hotel</h1>
            <p><strong>Data:</strong> ${record.date}</p>
            <table>
                <thead>
                    <tr>
                        <th>Camareira</th>
                        <th>Quartos Atribuídos</th>
                    </tr>
                </thead>
                <tbody>
                    ${record.maids.map((maid, i) => `
                        <tr>
                            <td>${maid}</td>
                            <td>${formatRooms(record.rooms[i])}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p><strong>Quartos que Não Precisam de Limpeza:</strong> ${formatRooms(record.noCleanRooms)}</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function printAllRecords() {
    const records = getRecords();
    if (records.length === 0) {
        alert('Nenhum registro para imprimir.');
        return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Imprimir Todos os Registros</title><style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; } .record { page-break-before: always; } .record:first-child { page-break-before: avoid; }</style></head>
        <body>
            ${records.map(record => `
                <div class="record">
                    <h1>Registro de Limpeza do Hotel - ${record.date}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Camareira</th>
                                <th>Quartos Atribuídos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${record.maids.map((maid, i) => `
                                <tr>
                                    <td>${maid}</td>
                                    <td>${formatRooms(record.rooms[i])}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <p><strong>Quartos que Não Precisam de Limpeza:</strong> ${formatRooms(record.noCleanRooms)}</p>
                </div>
            `).join('')}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(section => section.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(tabId.replace('Tab', 'Section')).classList.remove('hidden');
    document.getElementById(tabId).classList.add('active');
    if (tabId === 'recordsTab') renderRecords();
}