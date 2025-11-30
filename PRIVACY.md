# Privacy Policy

This Privacy Policy (“Policy”) explains how the **VWFit** browser extension (“Extension”) handles user information.

By installing or using this Extension, you agree to this Policy.

## 1. Scope

This Policy applies to VWFit distributed via the Chrome Web Store and its future updates.  
The source code and this Policy are publicly available at:

- GitHub repository: <https://github.com/kojimajunya/vwfit>

## 2. What the Extension does

VWFit is a Chrome extension primarily for web developers. Its **only purpose** is to resize the active tab’s viewport to a user-defined width.

- It adjusts the browser window’s outer width so that  
  **viewport width ≒ specified width**,  
  even when Chrome DevTools is open (in that case: target viewport width + DevTools pane width).
- You can choose whether to include the scrollbar width in the target viewport width.

The Extension uses browser permissions and minimal information only for this resizing behavior.

## 3. Data collected and stored

The Extension stores the following data in **`chrome.storage`**:

- The viewport width specified by the user (numeric)
- The setting for whether to include the scrollbar width (boolean)

These values are used only to restore user preferences the next time the popup is opened.

### 3.1 Data temporarily accessed

To correctly calculate the viewport width, the Extension temporarily accesses the following values in the active tab:

- `window.innerWidth`
- `document.documentElement.clientWidth`

These values are used **only for on-the-fly calculation** and are **not stored or transmitted** by the Extension.

### 3.2 No collection of personal or page content data

The Extension does **not** collect, store, or transmit:

- Page content, titles, or input form values
- Browsing history, search queries, cookies, or similar data
- Names, email addresses, or other personally identifiable information

## 4. Purpose of data use

Any data accessed or stored by the Extension is used only for the following purposes:

1. To resize the browser window so that the viewport matches the user-specified width
2. To enable the “include scrollbar width” option according to the user’s choice
3. To automatically restore the last used settings when the popup is opened

The data is **not used for any other purposes**.

## 5. Data sharing and third parties

The Extension does **not** send user information to servers controlled by the developer or by third parties.

- No analytics tools (such as Google Analytics) are used.
- No data is sent to advertising networks.
- Data collected or stored by the Extension is not sold, rented, or shared with third parties.

If `chrome.storage.sync` is used by the browser, the stored settings may be synchronized between Chrome instances associated with the same Google account. Such synchronization is handled by the browser and is subject to Google’s privacy policy, not this Extension.

## 6. Browser permissions and their purposes

The Extension uses the following permissions.  
All permissions are used **only** to implement the single, narrow purpose of resizing the viewport to a specified width.

### 6.1 `tabs`

- Used to obtain the ID of the active tab and the window ID containing that tab.
- Not used to read page content or analyze browsing history.

### 6.2 `scripting`

- Used to execute a small script on the active tab to read layout-related values (e.g. viewport width, client width).
- Not used to modify the DOM in a persistent way or to transmit content outside the browser.

### 6.3 `storage`

- Used to store and restore user preferences such as viewport width and the “include scrollbar” option.

### 6.4 `system.display`

- Used to read information about the primary display’s work area (resolution and position) so that the window can be centered when resizing, where possible.
- Display information is **not** stored or transmitted.

### 6.5 Host permissions (e.g. `<all_urls>`)

- Required in order to run the measurement script on the active page and access layout information such as `window.innerWidth`.
- The Extension does **not** collect, store, or transmit page text, form contents, or user input.

## 7. Logging and analytics

Currently, the Extension does **not** perform any external logging or analytics, such as:

- Sending events to external servers
- Uploading error logs
- Tracking user behavior or building user profiles

Any debug logs are written only to the browser’s developer console and are **not** sent to any server.

## 8. User choices

Users can stop the Extension’s behavior at any time by:

- Disabling or removing VWFit from the browser’s extension management page
- Optionally clearing data stored in `chrome.storage` via Chrome’s settings, if desired

Once the Extension is disabled or removed, it will no longer access or store data.

## 9. Changes to this Policy

This Policy may be updated when features are added or the Extension’s behavior changes.

In the event of important changes, this `PRIVACY.md` file and the Chrome Web Store listing for VWFit will be updated to reflect the new Policy.

- GitHub repository: <https://github.com/kojimajunya/vwfit>

## 10. Contact

If you have any questions or comments about this Policy or the Extension’s privacy practices, please contact the developer via the GitHub Issues page:

- Issues: <https://github.com/kojimajunya/vwfit/issues>

# プライバシーポリシー

このプライバシーポリシー（以下「本ポリシー」）は、ブラウザ拡張機能 **VWFit**（以下「本拡張機能」）におけるユーザー情報の取り扱いについて定めるものです。

本拡張機能をインストール・利用する前に、本ポリシーをよくお読みください。

## 1. 適用範囲

本ポリシーは、Chrome ウェブストア経由で配布される VWFit およびそのアップデート版に適用されます。  
本拡張機能のソースコードおよび本ポリシーは、以下のリポジトリで公開されています。

- GitHub リポジトリ: <https://github.com/kojimajunya/vwfit>

## 2. 本拡張機能が行うことの概要

VWFit は、主に Web 開発者向けに、**アクティブなタブのビューポート幅をユーザー指定のピクセル値にリサイズするため**の拡張機能です。

- ウィンドウの外側の幅を、  
  「指定したビューポート幅 ＋ Chrome DevTools の幅（開いている場合）」  
  となるように調整します。
- 必要に応じて、スクロールバー幅を含めるかどうかを切り替えることができます。

本拡張機能は、このリサイズ機能のためにのみブラウザの権限と最小限の情報を利用します。

## 3. 収集・保存される情報

本拡張機能は、以下の情報のみを **`chrome.storage` に保存**します。

- ユーザーが指定したビューポート幅（数値）
- 「スクロールバー幅を含めるかどうか」の設定（真偽値）

これらは、ユーザーの利便性（次回起動時の設定復元）のためだけに利用されます。

### 3.1 一時的に参照する情報

ビューポート幅を正しく計算するために、アクティブなタブ上で以下の情報を一時的に参照します。

- `window.innerWidth`
- `document.documentElement.clientWidth`

これらは **その場で計算にのみ使用され、拡張機能側で保存・送信されることはありません。**

### 3.2 個人情報・閲覧コンテンツについて

本拡張機能は、次のような情報を**取得・保存・送信しません**。

- 閲覧中のページの本文やタイトル、入力フォームの内容
- 閲覧履歴、検索キーワード、Cookie 等
- 氏名、メールアドレス等の個人情報

## 4. 取得した情報の利用目的

取得・保存される情報は、以下の目的のためにのみ利用されます。

1. ユーザーが指定したビューポート幅に合わせてウィンドウサイズを調整すること
2. スクロールバー幅を含める／含めない動作をユーザーの設定に従って切り替えること
3. 拡張機能のポップアップを開いたときに、前回の設定値を自動復元すること

これ以外の目的で利用することはありません。

## 5. 情報の共有・第三者提供について

本拡張機能は、開発者が管理するサーバーや第三者のサーバーに対して、ユーザー情報を送信しません。

- 解析ツール（Google Analytics 等）は利用していません。
- 広告ネットワーク等へのデータ送信も行っていません。
- 取得した情報を第三者に販売・譲渡・共有することはありません。

なお、`chrome.storage.sync` を利用している環境では、設定値がブラウザの仕組みによって Google アカウント間で同期される場合がありますが、その管理はブラウザおよび Google のプライバシーポリシーに従います。

## 6. 利用するブラウザ権限と目的

本拡張機能は、以下の権限を利用します。  
権限はすべて、ビューポート幅を指定値にリサイズするという単一の用途のためにのみ使われます。

### 6.1 `tabs`

- アクティブなタブの ID と、そのタブが属するウィンドウ ID を取得するために使用します。
- ページ内容の読み取りや閲覧履歴の解析には使用しません。

### 6.2 `scripting`

- アクティブなタブ上で、ビューポート幅やクライアント幅を取得するための短いスクリプトを実行するために使用します。
- ページの DOM を書き換えたり、コンテンツを外部送信したりすることはありません。

### 6.3 `storage`

- ビューポート幅・スクロールバー設定といったユーザーの設定値を保存・復元するために使用します。

### 6.4 `system.display`

- ウィンドウの幅を変更する際に、メインディスプレイのワークエリア（解像度や位置）情報を取得し、可能であればウィンドウを画面中央付近に配置するために利用します。
- 取得したディスプレイ情報を保存・送信することはありません。

### 6.5 ホスト権限（例：`<all_urls>` 等）

- アクティブなタブのページ上で、`window.innerWidth` などのレイアウト情報を取得するためのスクリプトを実行するために必要です。
- ページのテキストやフォームの内容など、ユーザーの入力情報を収集・保存・送信することはありません。

## 7. ログ・解析について

現在、本拡張機能は以下のような外部解析・ログ収集は行っていません。

- 外部サーバーへのイベント送信
- エラーログの外部送信
- 行動トラッキングやユーザープロファイリング

開発時のデバッグ用ログはブラウザのコンソールにのみ出力され、開発者のサーバー等には送信されません。

## 8. ユーザーの選択

ユーザーは、次の方法で本拡張機能による情報の利用を停止できます。

- ブラウザの拡張機能管理画面から VWFit を無効化または削除する
- 必要に応じて、Chrome の設定から `chrome.storage` に保存された同期データを削除する

## 9. プライバシーポリシーの変更

本拡張機能の機能追加や仕様変更に伴い、本ポリシーの内容を変更する場合があります。

重要な変更がある場合は、Chrome ウェブストアの拡張機能ページおよび以下のリポジトリ内の `PRIVACY.md` を更新することでお知らせします。

- GitHub リポジトリ: <https://github.com/kojimajunya/vwfit>

## 10. お問い合わせ

本ポリシーや本拡張機能のプライバシーに関するご質問・ご意見がある場合は、以下の Issue ページからお問い合わせください。

- Issues: <https://github.com/kojimajunya/vwfit/issues>
