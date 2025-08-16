function updateMaidInputs(count) {
    const maidNamesDiv = document.getElementById('maidNames');
    maidNamesDiv.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Maid ${i + 1} Name`;
        input.className = 'w-full p-2 border rounded mb-2';
        input.required = true;
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
                    <th>Date</th>
                    <th>Maids</th>
                    <th>Rooms Assigned</th>
                    <th>No Clean Rooms</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${records.map(r => `
                    <tr>
                        <td>${r.date}</td>
                        <td>${r.maids.join(', ')}</td>
                        <td>${r.rooms.map((rooms, i) => `${r.maids[i]}: ${rooms.sort((a,b)=>parseInt(a)-parseInt(b)).join(', ')}`).join('<br>')}</td>
                        <td>${r.noCleanRooms.join(', ')}</td>
                        <td>
                            <button onclick="editRecord('${r.id}')" class="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700">Edit</button>
                            <button onclick="deleteRecordUI('${r.id}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                            <button onclick="printRecord('${r.id}')" class="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 print-button">Print</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editRecord(id) {
    const records = getRecords();
    const record = records.find(r => r.id === id);
    if (!record) return;
    document.getElementById('maidCount').value = record.maids.length;
    updateMaidInputs(record.maids.length);
    document.querySelectorAll('#maidNames input').forEach((input, i) => {
        input.value = record.maids[i];
    });
    document.getElementById('noCleanRooms').value = record.noCleanRooms.join(', ');
    document.getElementById('registerForm').onsubmit = e => {
        e.preventDefault();
        const maidNames = Array.from(document.querySelectorAll('#maidNames input')).map(input => input.value);
        const noCleanRooms = document.getElementById('noCleanRooms').value.split(',').map(r => r.trim()).filter(r => r);
        updateRecord(id, maidNames.length, maidNames, noCleanRooms);
        renderRecords();
        document.getElementById('registerForm').reset();
        document.getElementById('maidNames').innerHTML = '';
        document.getElementById('registerForm').onsubmit = handleRegister;
        showTab('recordsTab');
    };
    showTab('registerTab');
}

function deleteRecordUI(id) {
    if (confirm('Are you sure you want to delete this record?')) {
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
        <head><title>Print Record</title><style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; }</style></head>
        <body>
            <h1>Hotel Cleaning Record</h1>
            <p><strong>Date:</strong> ${record.date}</p>
            <table>
                <thead>
                    <tr>
                        <th>Maid</th>
                        <th>Rooms Assigned</th>
                    </tr>
                </thead>
                <tbody>
                    ${record.maids.map((maid, i) => `
                        <tr>
                            <td>${maid}</td>
                            <td>${record.rooms[i].sort((a,b)=>parseInt(a)-parseInt(b)).join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p><strong>Rooms Not Needing Cleaning:</strong> ${record.noCleanRooms.join(', ')}</p>
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