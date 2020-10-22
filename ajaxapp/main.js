// index.jsのソースコードを整理　関数の分割等

// function main() {
//   fetchUserInfo("js-primer-example")
//     .catch((error) => {
//       // Promiseチェーンの中で発生したエラーを受け取る
//       console.error(`エラーが発生しました(${error})`);
//     })
// }

// Async Functionへ置き換える
async function main() {
  try {
      const userId = getUserId();
      const userInfo = await fetchUserInfo(userId); // Promiseにより解決したJSONオブジェクトを代入
      const view = createView(userInfo);
      displayView(view);
  } catch (error) {
      console.error(`エラーが発生しました (${error})`);
  }
}

// データの取得を行う
function fetchUserInfo(userId) {
      // fetchの戻り値のPromiseをreturnする
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
      .then(response => {
          if (!response.ok) {
              // エラーレスポンスからRejectedなPromiseを作成して返す
              return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
              // console.error("エラーレスポンス", response);
          } else {
            // JSONオブジェクトで解決されるPromiseを返す
              return response.json();
                  //.then(userInfo => {
                  // HTMLの組み立て
                  // const view = createView(userInfo);
                  // HTMLの挿入
                  // displayView(view);
                  // });
          }
      });
      // .catch(error => {
      //     console.error(error);
      // });
}

// 任意のGitHubユーザーIDを取得
function getUserId() {
  return document.getElementById("userId").value;
}

// HTML文字列を組み立てる
function createView(userInfo) {
  return escapeHTML`
  <h3>こちらのGitHubアカウントですか？</h3>
  <h4>${userInfo.name} (@${userInfo.login})</h4>
  <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
  <dl>
      <dt>~Location~</dt>
      <dd>${userInfo.location}</dd>
      <dt>~Repositories~</dt>
      <dd>${userInfo.public_repos}</dd>
      <dt>~Company~</dt>
      <dd>${userInfo.company}</dd>
  </dl>
  `;
}

// HTMLを表示する
function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}
function escapeSpecialChars(str) {
  return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
      const value = values[i - 1];
      if (typeof value === "string") {
          return result + escapeSpecialChars(value) + str;
      } else {
          return result + String(value) + str;
      }
  });
}