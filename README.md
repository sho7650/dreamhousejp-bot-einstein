# Facebook Messenger 用の Salesforce Bot

DreamHouse サンプルアプリケーションで使用する、Salesforce ベースのBotです。

Botのインスタンスを作成するには、以下の手順を実行します。

### ステップ 1：DreamHouse アプリをインストールする

DreamHouse サンプルアプリケーションをまだインストールしていない場合は、[この手順](http://dreamhouseappjp.io/installation/)を実行してインストールします。

### ステップ 2：接続アプリケーションを作成する

Salesforce 接続アプリケーションをまだ作成していない場合は、以下の手順を実行して作成します。

1. Salesforce の［設定］で、クイック検索ボックスに「**アプリ**」と入力して［**アプリケーション**］リンクをクリックします。

1. ［**接続アプリケーション**］セクションで、［**新規**］をクリックし、次のように接続アプリケーションを定義します。

    - 接続アプリケーション名：DreamhouseJpMessengerBot（または任意の名前）
    - API 参照名：DreamhouseJpMessengerBot
    - 取引先責任者メール：自分のメールアドレスを入力します。
    - OAuth 設定の有効化：チェックボックスをオンにします。
    - コールバック URL：http://localhost:8200/oauthcallback.html
    - 選択した OAuth 範囲：フルアクセス（full）
    - ［**保存**］をクリックします。

### ステップ 3：Messenger ボットをデプロイする

1. [Heroku ダッシュボード](https://dashboard.heroku.com/)にログインしていることを確認します。
1. 下のボタンをクリックして、Messenger Bot を Heroku にデプロイします。

    [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. 以下の通りに環境変数を設定します。

    - ［**FB_PAGE_TOKEN**］：ここでは空白のままにします。
    - ［**FB_VERIFY_TOKEN**］：任意のパスフレーズを入力します。Facebook で Web フックを作成するときに同じパスフレーズを入力する必要があります。
    - ［**SF_CLIENT_ID**］：Salesforce 接続アプリケーションのコンシューマキーを入力します。
    - ［**SF_CLIENT_SECRET**］：Salesforce 接続アプリケーションのコンシューマの秘密を入力します。
    - ［**SF_USER_NAME**］：Salesforce 統合ユーザーのユーザー名を入力します。
    - ［**SF_PASSWORD**］：Salesforce 統合ユーザーのパスワードを入力します。

1. Salesforceの [**接続アプリケーション**］セクションにある、コールバック URLをデプロイしたHerokuアプリのドメイン http://yourappname.herokuapp.com/oauthcallback.html へ変更します。

### ステップ 4：Facebook アプリを作成する

1. [この手順](https://developers.facebook.com/docs/messenger-platform/quickstart?locale=ja_JP)を実行して、Facebook アプリを作成します。Facebook ページ、Facebook アプリケーションを作成し、アプリケーション用の Messenger を構成する必要があります。

    - **コールバック URL** の入力を求められたら、デプロイした Heroku アプリの URL を入力し、末尾に /webhook を付加します。次に例を示します。
        ```
        https://myapp.herokuapp.com/webhook
        ```
    - ページアクセストークンが生成されたら、Heroku ダッシュボードにログインし、Heroku の **FB_PAGE_TOKEN** 環境変数にそのトークンの値を設定します（［**Setting**］>［**Reveal Config Vars**］）
    - **トークンの確認** を求められたら、Heroku アプリをデプロイするときに **FB_VERIFY_TOKEN** 環境変数に入力したのと同じ値を入力します。
    - ［**Select a page to subscribe your webhook...**］ドロップダウンでページを選択します。

1. 前のステップで作成した Facebook ページにアクセスし、［**Message**］ボタンをクリックします。チャットBotに「**help**」と入力します。Botとの会話は、スマートフォンの Messenger アプリでもブラウザでも（http://messenger.com）続けることができます。
