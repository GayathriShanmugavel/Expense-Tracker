const USERS_SHEET = 'Users';
const TX_SHEET = 'Transactions';
 
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  let result;
  try {
    switch (data.action) {
      case 'signup': result = handleSignup(data); break;
      case 'login': result = handleLogin(data); break;
      case 'getTransactions': result = handleGetTransactions(data); break;
      case 'addTransaction': result = handleAddTransaction(data); break;
      case 'editTransaction': result = handleEditTransaction(data); break;
      case 'deleteTransaction': result = handleDeleteTransaction(data); break;
      default: result = { status: 'error', message: 'Unknown action' };
    }
  } catch (err) {
    result = { status: 'error', message: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
 
function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}
 
/* ---------------- Auth ---------------- */
function handleSignup(data) {
  const sheet = getSheet(USERS_SHEET);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === data.email) {
      return { status: 'error', message: 'An account with this email already exists.' };
    }
  }
  const id = Utilities.getUuid();
  sheet.appendRow([id, data.name, data.email, data.password, new Date()]);
  return { status: 'ok', user: { id: id, name: data.name, email: data.email } };
}
 
function handleLogin(data) {
  const sheet = getSheet(USERS_SHEET);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const [id, name, email, password] = rows[i];
    if (String(email).toLowerCase() === data.email && String(password) === data.password) {
      return { status: 'ok', user: { id: id, name: name, email: email } };
    }
  }
  return { status: 'error', message: 'Invalid email or password.' };
}
 
/* ---------------- Transactions ---------------- */
function handleGetTransactions(data) {
  const sheet = getSheet(TX_SHEET);
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [id, email, type, date, category, amount, note] = rows[i];
    if (String(email).toLowerCase() === data.email) {
      out.push({
        id: id, type: type,
        date: formatDate(date),
        category: category, amount: amount, note: note
      });
    }
  }
  return { status: 'ok', transactions: out };
}
 
function handleAddTransaction(data) {
  const sheet = getSheet(TX_SHEET);
  const id = Utilities.getUuid();
  sheet.appendRow([id, data.email, data.type, data.date, data.category, data.amount, data.note || '', new Date()]);
  return { status: 'ok', id: id };
}
 
function handleEditTransaction(data) {
  const sheet = getSheet(TX_SHEET);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.getRange(i + 1, 3, 1, 5).setValues([[data.type, data.date, data.category, data.amount, data.note || '']]);
      return { status: 'ok' };
    }
  }
  return { status: 'error', message: 'Transaction not found.' };
}
 
function handleDeleteTransaction(data) {
  const sheet = getSheet(TX_SHEET);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 1);
      return { status: 'ok' };
    }
  }
  return { status: 'error', message: 'Transaction not found.' };
}
 
function formatDate(d) {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return d;
}
 