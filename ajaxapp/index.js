
// HTTPリウエスト
// 練習で自分のGitHubアカウントのユーザー情報を取得
const userId = "tomosuke-art"

// GitHubからユーザー情報を取得する関数
function fetchUserInfo(userId) {
  fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
  // レスポンスのログをコンソールに出力する処理
  // fetchメソッドはPromiseを返す,thenでコールバック
  .then(response => {
    console.log(response.status); // =>200を返す
    if(!response.ok){ // リクエストが成功したかどうかはResponseオブジェクトのokプロパティで認識
      console.error("エラーレスポンス", response);
    }else{
      return response.json().then(userInfo => {
        // JSONパースされたオブジェクトが渡される（JSで使える形にする！）
        // HTMLの組み立て(GitHubのユーザー情報から組み立てるHTMLのテンプレートを宣言)
        const view = escapeHTML`
        <h4>${userInfo.name} (@${userInfo.login})</h4>
        <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
        <dl>
            <dt>Location</dt>
            <dd>${userInfo.location}</dd>
            <dt>Repositories</dt>
            <dd>${userInfo.public_repos}</dd>
        </dl>
        `;
        // HTMLの挿入
        const result = document.getElementById("result");
        result.innerHTML = view;
        // console.log(userInfo);
      })
    }
  }).catch(error => { // エラーハンドリング
    console.log(error);
  })
}

// HTML文字列をエスケープする処理(文字列をセットする前に、特定の記号を安全な表現に置換する)
function escapeSpecialChars(str) {
  return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

// タグ関数(文字列リテラルの配列, 埋め込まれる値の配列)
// 呼び出す時は、テンプレートリテラルに対してタグづけして使う
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => { //テンプレートの文字列と変数を順番に結合できる
      const value = values[i - 1];
      if (typeof value === "string") {
          return result + escapeSpecialChars(value) + str;
      } else {
          return result + String(value) + str;
      }
  });  
}

