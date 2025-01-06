firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // マルシェ情報を追加
  document.getElementById('addMarche').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    
    if (location && date) {
      const newMarcheRef = db.ref('marches').push();
      newMarcheRef.set({
        location: location,
        date: date
      }).then(() => {
        alert("マルシェ情報を追加しました");
        document.getElementById('location').value = '';
        document.getElementById('date').value = '';
        loadMarches();
      }).catch(error => {
        console.error("Error adding marche: ", error);
      });
    }
  });
  
  // マルシェ情報の表示
  function loadMarches() {
    const marcheList = document.getElementById('marcheList');
    marcheList.innerHTML = '';
    
    db.ref('marches').on('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        const marche = childSnapshot.val();
        const li = document.createElement('li');
        li.textContent = `${marche.location} - ${marche.date}`;
        
        // 編集ボタン
        const editBtn = document.createElement('button');
        editBtn.textContent = '編集';
        editBtn.onclick = () => editMarche(childSnapshot.key, marche.location, marche.date);
        
        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.onclick = () => deleteMarche(childSnapshot.key);
  
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        marcheList.appendChild(li);
      });
    });
  }
  
  // マルシェ情報の削除
  function deleteMarche(id) {
    db.ref('marches/' + id).remove()
      .then(() => {
        alert("マルシェ情報を削除しました");
        loadMarches();
      })
      .catch(error => {
        console.error("Error deleting marche: ", error);
      });
  }
  
  // マルシェ情報の編集
  function editMarche(id, location, date) {
    const newLocation = prompt("新しい開催地を入力してください", location);
    const newDate = prompt("新しい日時を入力してください", date);
    
    if (newLocation && newDate) {
      db.ref('marches/' + id).update({
        location: newLocation,
        date: newDate
      }).then(() => {
        alert("マルシェ情報を更新しました");
        loadMarches();
      }).catch(error => {
        console.error("Error updating marche: ", error);
      });
    }
  }
  
  // 初期ロード
  loadMarches();
  
