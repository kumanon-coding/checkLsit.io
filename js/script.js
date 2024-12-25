// ローカルストレージキー
const STORAGE_KEY = 'page_records';

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  const recordForm = document.getElementById('recordForm');
  const recordList = document.getElementById('recordList');

  // ローカルストレージからデータを取得して表示
  const loadRecords = () => {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    recordList.innerHTML = '';
    records.forEach(record => addRecordToDOM(record));
  };

  // ローカルストレージにデータを保存
  const saveRecords = (records) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  };

  // DOMに新しい項目を追加
const addRecordToDOM = ({ pageNumber, pageName, status, date }) => {
  const li = document.createElement('li');
  // 稼働中と停止中に応じて背景色を変更
  if (status === '稼働中') {
    li.style.backgroundColor = '#d4edda'; // セーフの色 (緑)
    li.style.color = '#155724'; // セーフの色に合わせたテキスト色
  } else {
    li.style.backgroundColor = '#f8d7da'; // アウトの色 (赤)
    li.style.color = '#721c24'; // アウトの色に合わせたテキスト色
  }

  li.innerHTML = `
    <span>${pageNumber} - ${pageName} - ${status} - 記録日時: ${date}</span>
    <button class="status-toggle-btn">${status === '稼働中' ? '停止中にする' : '稼働中にする'}</button>
    <button class="delete-btn">削除</button>
  `;

  const statusToggleBtn = li.querySelector('.status-toggle-btn');
  statusToggleBtn.addEventListener('click', () => {
    toggleStatus(pageNumber);
  });

  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    if (confirm('本当に削除しますか？')) {
      deleteRecord(pageNumber);
    }
  });

  recordList.appendChild(li);
};

  // 新しい項目を追加
  recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pageNumber = document.getElementById('pageNumber').value;
    const pageName = document.getElementById('pageName').value;

    // データを取得し、重複を防止
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (records.some(record => record.pageNumber === pageNumber)) {
      alert('このページ番号は既に記録されています！');
      return;
    }

    const newRecord = {
      pageNumber,
      pageName,
      status: '稼働中', // 初期状態は「稼働中」
      date: new Date().toLocaleString() // 現在日時を記録
    };

    records.push(newRecord);
    saveRecords(records);
    addRecordToDOM(newRecord);

    recordForm.reset();
  });

  // 稼働中/停止中の切り替え
const toggleStatus = (pageNumber) => {
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const record = records.find(record => record.pageNumber === pageNumber);
  if (record) {
    // 状態を切り替える
    record.status = record.status === '稼働中' ? '停止中' : '稼働中';
    // 日時を現在の時刻に更新
    record.date = new Date().toLocaleString(); // 日時を更新

    // ローカルストレージに保存
    saveRecords(records);
    loadRecords(); // 状態変更後にリストを再読み込み
  }
};

  // 項目を削除
  const deleteRecord = (pageNumber) => {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedRecords = records.filter(record => record.pageNumber !== pageNumber);
    saveRecords(updatedRecords);
    loadRecords();
  };

  // ページ読み込み時にデータをロード
  loadRecords();
});
