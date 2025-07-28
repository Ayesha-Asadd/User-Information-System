document.addEventListener('DOMContentLoaded', () => {
    const userDataForm = document.getElementById('userDataForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submitBtn');
    const dataList = document.getElementById('dataList');
    const exportBtn = document.getElementById('exportBtn');
    const successOverlay = document.getElementById('successOverlay');

    let users = [];
    let editingIndex = -1;

    function renderUsers() {
        dataList.innerHTML = '';

        if (users.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `
                <td colspan="5" class="text-center py-4 text-gray-500">
                    No users registered yet. Add one above!
                </td>
            `;
            dataList.appendChild(noDataRow);
            return;
        }

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 transition";

            row.innerHTML = `
                <td class="px-4 py-2">${user.firstName}</td>
                <td class="px-4 py-2">${user.lastName}</td>
                <td class="px-4 py-2">${user.email}</td>
                <td class="px-4 py-2">${user.phone}</td>
                <td class="px-4 py-2">
                    <button class="update-btn bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-xs transition" data-index="${index}">
                        Update
                    </button>
                </td>
            `;
            dataList.appendChild(row);
        });
    }

    function showOverlay(message) {
        successOverlay.textContent = `✅ ${message}`;
        successOverlay.classList.add("show");
        setTimeout(() => {
            successOverlay.classList.remove("show");
        }, 2000);
    }

    userDataForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newUser = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.phone) {
            console.error('Please fill in all fields.');
            return;
        }

        if (editingIndex === -1) {
            users.push(newUser);
        } else {
            users[editingIndex] = newUser;
            editingIndex = -1;
            submitBtn.textContent = 'Add User';
            submitBtn.style.backgroundColor = '#373F38';
            showOverlay("Updated Successfully!");
        }

        renderUsers();
        userDataForm.reset();
    });

    dataList.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('update-btn')) {
            const indexToUpdate = parseInt(target.dataset.index);
            const userToUpdate = users[indexToUpdate];

            firstNameInput.value = userToUpdate.firstName;
            lastNameInput.value = userToUpdate.lastName;
            emailInput.value = userToUpdate.email;
            phoneInput.value = userToUpdate.phone;

            editingIndex = indexToUpdate;
            submitBtn.textContent = 'Update User';
            submitBtn.style.backgroundColor = '#224942';

            userDataForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    exportBtn.addEventListener('click', () => {
        if (users.length === 0) {
            alert("No users to export.");
            return;
        }

        const worksheetData = [
            ["First Name", "Last Name", "Email", "Phone"],
            ...users.map(user => [user.firstName, user.lastName, user.email, user.phone])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        XLSX.writeFile(workbook, "UserList.xlsx");
    });

    submitBtn.style.backgroundColor = '#373F38';
    renderUsers();
});
