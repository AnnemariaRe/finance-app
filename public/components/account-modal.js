function openEditModal(id, name, currency, accountType, isActive) {
    document.getElementById('edit_account_id').value = id;
    document.getElementById('edit_account_name').value = name;
    document.getElementById('edit_currency_select').value = currency;
    document.getElementById('edit_account_type_select').value = accountType;
    document.getElementById('edit_account_is_active').checked = isActive;

    document.getElementById('editAccountForm').action = `/wallet/account/edit`;

    document.getElementById('editAccountModal').style.display = 'block';
}

async function deleteAccount(accountId) {
    if (!confirm('Вы уверены, что хотите удалить счёт?')) return;

    try {
      const response = await fetch('/wallet/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert('Ошибка при попытке удаления счёта: ' + error.message);
    }
  }

// Закрытие по клику вне формы
window.onclick = function (event) {
    const editModal = document.getElementById('editAccountModal');
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
    const createModal = document.getElementById('createAccountModal');
    if (event.target == createModal) {
        createModal.style.display = "none";
    }
};