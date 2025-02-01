---
date_created: Friday, February 23rd 2022, 10:10:45 pm
date_updated: Wednesday, January 29th 2025, 11:17:35 pm
title: Google Identity
author: hacket
categories:
  - Android进阶
category: 出海
tags: [Google, 出海, 登录]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-09-14 00:14
date updated: 2024-12-24 00:35
aliases: [Authentication 认证]
linter-yaml-title-alias: Authentication 认证
---

- [ ] [identity-samples](https://github.com/android/identity-samples)

# Authentication 认证

- [x] [Authentication](https://developers.google.com/identity/authentication)
- Legacy Sign In
- Sign In with Google SDKs
- Industry standards

## Google Sign In (Google 登录，过时)

- [ ] [Create access credentials](https://developers.google.com/workspace/guides/create-credentials)
- [x] [Try Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)

[Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/sign-in) 已经过时了，现在用 [Google Identity Services One Tap sign-in/sign-up](https://developers.google.com/identity/one-tap/android/overview)

### Google Sign-In API （Legacy）

#### 准备工作 配置 Google Console API

##### [Add Google Play services](https://developers.google.com/identity/sign-in/android/start-integrating#add_google_play_services)

```groovy
// project's top-level build.gradle
allprojects {
    repositories {
        google()
        // If you're using a version of Gradle lower than 4.1, you must instead use:
        // maven {
        //     url 'https://maven.google.com'
        // }
    }
}

// app-level build.gradle
apply plugin: 'com.android.application'
// ...
dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.5.0'
}
```

##### [Configure a Google API Console project](https://developers.google.com/identity/sign-in/android/start-integrating#configure_a_project)

##### [Get your backend server's OAuth 2.0 client ID](https://developers.google.com/identity/sign-in/android/start-integrating#get_your_backend_servers_oauth_20_client_id)

Sign-in 用的是 Web Client Id<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684244433454-1914caba-8b90-4407-a4d9-9e4ebfb9dab5.png)

- [ ] [具体参考：start-integrating](https://developers.google.com/identity/sign-in/android/start-integrating)

#### [Integrating Google Sign-In into Your Android App](https://developers.google.com/identity/sign-in/android/sign-in)

##### [Configure Google Sign-in and the GoogleSignInClient object](https://developers.google.com/identity/sign-in/android/sign-in#configure_google_sign-in_and_the_googlesigninclient_object) 配置请求登录要获取的基本信息

- 用 `GoogleSignInOptions` 配置必要的信息，请求 id 及用户的基本信息
- 如果需要请求其他 scope 的信息，加上 `requestScopes()`（尽可能请求获取所需的最小数据原则），具体可参考 [Requesting Additional Scopes](https://developers.google.com/identity/sign-in/android/additional-scopes)
- 配置好后，得到一个 `GoogleSignInClient` 实例

##### [Check for an existing signed-in user](https://developers.google.com/identity/sign-in/android/sign-in#check_for_an_existing_signed-in_user) 检测是否已经登录过

```java
// Check for existing Google Sign In account, if the user is already signed in
// the GoogleSignInAccount will be non-null.
GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
updateUI(account);
```

返回了 GoogleSignInAccount 不为 null 说明之前已经登录过了，否则就是没有登录过<br />如果需要检查用户账号的状态，用下面：

```java
/**
 *  If you need to detect changes to a user's auth state that happen outside your app, such as access token or ID token revocation, or to perform cross-device sign-in, you might also call GoogleSignInClient.silentSignIn when your app starts.
 */
public static void silentSignIn() {
    if (googleApiClient == null) return;
    Task<GoogleSignInAccount> googleSignInAccountTask = googleApiClient.silentSignIn();
    googleSignInAccountTask.addOnSuccessListener(new OnSuccessListener<GoogleSignInAccount>() {
        @Override
        public void onSuccess(GoogleSignInAccount account) {
            if (account == null) return;
        }
    });
}
```

#### [Add the Google Sign-in button to your app](https://developers.google.com/identity/sign-in/android/sign-in#add_the_google_sign-in_button_to_your_app) 用自带登录按钮（也可以自定义登录按钮）

- xml

```java
<com.google.android.gms.common.SignInButton
 android:id="@+id/sign_in_button"
 android:layout_width="wrap_content"
 android:layout_height="wrap_content" />
```

- 配置

```java
// Set the dimensions of the sign-in button.
SignInButton signInButton = findViewById(R.id.sign_in_button);
signInButton.setSize(SignInButton.SIZE_STANDARD);
```

- 效果

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684293816187-20ec69ed-ee2c-438a-9b09-2d094b805a35.png)

#### [Start the sign-in flow](https://developers.google.com/identity/sign-in/android/sign-in#start_the_sign-in_flow) 开始登录

- 发起登录请求

```java
private void signIn() {
    Intent signInIntent = mGoogleSignInClient.getSignInIntent();
    startActivityForResult(signInIntent, RC_SIGN_IN);
}

```

- 请求回调到**onActivityResult**

```java
@Override
public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
    if (requestCode == RC_SIGN_IN) {
        // The Task returned from this call is always completed, no need to attach
        // a listener.
        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
        handleSignInResult(task);
    }
}
private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
    try {
        GoogleSignInAccount account = completedTask.getResult(ApiException.class);

        // Signed in successfully, show authenticated UI.
        updateUI(account);
    } catch (ApiException e) {
        // The ApiException status code indicates the detailed failure reason.
        // Please refer to the GoogleSignInStatusCodes class reference for more information.
        Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
        updateUI(null);
    }
}
```

- **getEmail()** 获取 user's email address
- **getId()** 获取 user's Google ID (for client-side use)
- **getToken()** 获取 ID token
- 将登录获取的信息传递到自己的后端

#### [Authenticate with a backend server](https://developers.google.com/identity/sign-in/android/backend-auth)

##### 获取 id token

```java
// Request only the user's ID token, which can be used to identify the
// user securely to your backend. This will contain the user's basic
// profile (name, profile picture URL, etc) so you should not need to
// make an additional call to personalize your application.
GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestIdToken(getString(R.string.server_client_id))
        .requestEmail()
        .build();
```

##### 发送给你的后端服务器

```java
HttpClient httpClient = new DefaultHttpClient();
HttpPost httpPost = new HttpPost("https://yourbackend.example.com/tokensignin");

try {
    List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
    nameValuePairs.add(new BasicNameValuePair("idToken", idToken));
    httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
    
    HttpResponse response = httpClient.execute(httpPost);
    int statusCode = response.getStatusLine().getStatusCode();
    final String responseBody = EntityUtils.toString(response.getEntity());
Log.i(TAG, "Signed in as: " + responseBody);
} catch (ClientProtocolException e) {
	Log.e(TAG, "Error sending ID token to backend.", e);
} catch (IOException e) {
	Log.e(TAG, "Error sending ID token to backend.", e);
}
```

#### [Signing Out Users and Disconnecting Accounts](https://developers.google.com/identity/sign-in/android/disconnect) 退出登录

##### Sign out user

```java
private void signOut() {
    mGoogleSignInClient.signOut()
            .addOnCompleteListener(this, new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    // ...
                }
            });
}
```

##### Disconnect accounts

```java
private void revokeAccess() {
    mGoogleSignInClient.revokeAccess()
            .addOnCompleteListener(this, new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    // ...
                }
            });
}
```

#### [Enabling Server-Side Access](https://developers.google.com/identity/sign-in/android/offline-access)

- requestServerAuthCode 来请求 ServerAuthCode

```java
// Configure sign-in to request offline access to the user's ID, basic
// profile, and Google Drive. The first time you request a code you will
// be able to exchange it for an access token and refresh token, which
// you should store. In subsequent calls, the code will only result in
// an access token. By asking for profile access (through
// DEFAULT_SIGN_IN) you will also get an ID Token as a result of the
// code exchange.
String serverClientId = getString(R.string.server_client_id);
GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestScopes(new Scope(Scopes.DRIVE_APPFOLDER))
        .requestServerAuthCode(serverClientId)
        .requestEmail()
        .build();
```

- [getServerAuthCode](https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInAccount#getServerAuthCode()) 获取 ServerAuthCode

```java
Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
try {
    GoogleSignInAccount account = task.getResult(ApiException.class);
    String authCode = account.getServerAuthCode();

    // Show signed-un UI
    updateUI(account);

    // TODO(developer): send code to server and exchange for access/refresh/ID tokens
} catch (ApiException e) {
    Log.w(TAG, "Sign-in failed", e);
    updateUI(null);
}
```

- 将 ServerAuthCode 发送到你自己的服务器

```java
HttpPost httpPost = new HttpPost("https://yourbackend.example.com/authcode");

try {
    List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
    nameValuePairs.add(new BasicNameValuePair("authCode", authCode));
    httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

    HttpResponse response = httpClient.execute(httpPost);
    int statusCode = response.getStatusLine().getStatusCode();
    final String responseBody = EntityUtils.toString(response.getEntity());
} catch (ClientProtocolException e) {
    Log.e(TAG, "Error sending auth code to backend.", e);
} catch (IOException e) {
    Log.e(TAG, "Error sending auth code to backend.", e);
}
```

- 你的后端拿到这个 ServerAuthCode 来交换获取 `access and refresh tokens`，用来代表用户来调用 Google APIs

```java
// (Receive authCode via HTTPS POST)


if (request.getHeader("X-Requested-With") == null) {
  // Without the `X-Requested-With` header, this request could be forged. Aborts.
}

// Set path to the Web application client_secret_*.json file you downloaded from the
// Google API Console: https://console.cloud.google.com/apis/credentials
// You can also find your Web application client ID and client secret from the
// console and specify them directly when you create the GoogleAuthorizationCodeTokenRequest
// object.
String CLIENT_SECRET_FILE = "/path/to/client_secret.json";

// Exchange auth code for access token
GoogleClientSecrets clientSecrets =
    GoogleClientSecrets.load(
        JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));
GoogleTokenResponse tokenResponse =
          new GoogleAuthorizationCodeTokenRequest(
              new NetHttpTransport(),
              JacksonFactory.getDefaultInstance(),
              "https://oauth2.googleapis.com/token",
              clientSecrets.getDetails().getClientId(),
              clientSecrets.getDetails().getClientSecret(),
              authCode,
              REDIRECT_URI)  // Specify the same redirect URI that you use with your web
                             // app. If you don't have a web version of your app, you can
                             // specify an empty string.
              .execute();

String accessToken = tokenResponse.getAccessToken();

// Use access token to call API
GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
Drive drive =
    new Drive.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), credential)
        .setApplicationName("Auth Code Exchange Demo")
        .build();
File file = drive.files().get("appfolder").execute();

// Get profile info from ID token
GoogleIdToken idToken = tokenResponse.parseIdToken();
GoogleIdToken.Payload payload = idToken.getPayload();
String userId = payload.getSubject();  // Use this value as a key to identify a user.
String email = payload.getEmail();
boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
String name = (String) payload.get("name");
String pictureUrl = (String) payload.get("picture");
String locale = (String) payload.get("locale");
String familyName = (String) payload.get("family_name");
String givenName = (String) payload.get("given_name");
```

#### 完整代码

```java
public class GoogleSignInHelper {
    private static final String TAG = "hacket";
    // Web client (auto created by Google Service)
    private static final String webClientId = "448384031016-i7ai1nu1426359lag8kd8i0v6p8663o1.apps.googleusercontent.com";
    @SuppressLint("StaticFieldLeak")

    private static GoogleSignInClient googleApiClient;

    /**
     * 检查谷歌服务是否可用
     */
    public static boolean isGooglePlayServiceEnable(Context context) {
        try {
//            GooglePlayServicesUtil.isGooglePlayServicesAvailable(this)
            int available = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context);
            return available == ConnectionResult.SUCCESS;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 登录
     *
     * @param activity Activity
     */
    public static void signInLegacy(Activity activity) {
        // Configure sign-in to request the user's ID, email address, and basic profile. ID and
        // basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions
                .Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)//获取用户的基本信息
                .requestId() // 明文id
                .requestIdToken(webClientId)
//                .requestIdToken(getString(R.string.default_web_client_id)) // 从这里获取clientId: https://console.cloud.google.com/apis/credentials?project=the-monkey-king-assistant
                .requestEmail()//获取邮箱
                .requestProfile()
//                .requestScopes()
                .build();

        // Build a GoogleApiClient with access to GoogleSignIn.API and the options above.
        googleApiClient = GoogleSignIn.getClient(activity, gso);//创建 GoogleSignInClient 对象
        Intent signInIntent = googleApiClient.getSignInIntent();
        activity.startActivityForResult(signInIntent, 10086); // 开始请求授权,请求码自己定
    }
    /**
     * If you need to detect changes to a user's auth state that happen outside your app, such as
     * access token or ID token revocation, or to perform cross-device sign-in, you might also call
     * GoogleSignInClient.silentSignIn when your app starts.
     */
    public static void silentSignIn() {
        if (googleApiClient == null) return;
        Task<GoogleSignInAccount> googleSignInAccountTask = googleApiClient.silentSignIn();
        googleSignInAccountTask.addOnSuccessListener(new OnSuccessListener<GoogleSignInAccount>() {
            @Override
            public void onSuccess(GoogleSignInAccount account) {
                if (account == null) return;
            }
        });
    }
    /**
     * 登出
     *
     * @param activity Activity
     */
    public static void signOutLegacy(Activity activity) {
        if (googleApiClient == null) return;

//        Auth.GoogleSignInApi.signOut(googleApiClient) // 过时写法
        googleApiClient.signOut()
                .addOnCompleteListener(activity, new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        boolean successful = task.isSuccessful();
                        Log.w("hacket", "google signOut successful = " + successful);
                    }
                });
    }
    public static void revokeAccess(Activity activity) {
        if (googleApiClient == null) {
            return;
        }
        // 断开连接--可选
        googleApiClient.revokeAccess()
                .addOnCompleteListener(activity, new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        boolean successful = task.isSuccessful();
                        Log.w("hacket", "google revokeAccess successful = " + successful);
                    }
                });
    }
}
```

UI 展示：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684244308362-36b336cf-d271-46e0-a8b1-17b48e0b3871.png)

#### Ref

Google 登录参考这个即可

- [x] [Android三方登录之Google登录](https://blog.csdn.net/wangchaojing/article/details/125680497)

### [New Google Sign-In API](https://developers.google.com/identity/sign-in/android/sign-in-identity)

`Google Identity Services (GIS)` 是一系列用来 Google 登录和退出新的 API。

#### New Sign-In API 概述

你不应该用这些 API 在 app launch 或触发加入购物车时提示用户登录，这些场景你应该用 [One Tap for Android](https://developers.google.com/identity/one-tap/android/get-started)。<br />登录过程中会展示这些 UI<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684303449537-24fd5b64-c921-46a5-91f8-58649d5e334a.png)

#### [Make a sign-in request](https://developers.google.com/identity/sign-in/android/sign-in-identity#make_a_sign-in_request)

```java
private static final int REQUEST_CODE_GOOGLE_SIGN_IN = 1; /* unique request id */
private void signIn() {
    GetSignInIntentRequest request =
        GetSignInIntentRequest.builder()
            .setServerClientId(getString(R.string.server_client_id))
            .build();
    Identity.getSignInClient(activity)
        .getSignInIntent(request)
        .addOnSuccessListener(
                result -> {
                    try {
                        startIntentSenderForResult(
                                result.getIntentSender(),
                                REQUEST_CODE_GOOGLE_SIGN_IN,
                                /* fillInIntent= */ null,
                                /* flagsMask= */ 0,
                                /* flagsValue= */ 0,
                                /* extraFlags= */ 0,
                                /* options= */ null);
                    } catch (IntentSender.SendIntentException e) {
                        Log.e(TAG, "Google Sign-in failed");
                    }
                })
        .addOnFailureListener(
                e -> {
                    Log.e(TAG, "Google Sign-in failed", e);
                });
}
```

需要注意：web_client_id 用的是这个红色框的，而不是 Android client 的那个：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684244433454-1914caba-8b90-4407-a4d9-9e4ebfb9dab5.png)

#### [Handle sign in results](https://developers.google.com/identity/sign-in/android/sign-in-identity#handle_sign_in_results)

```java
@Override
public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if(resultCode == Activity.RESULT_OK) {
        if (requestCode == REQUEST_CODE_GOOGLE_SIGN_IN) {
            try {
                SignInCredential credential = Identity.getSignInClient(this).getSignInCredentialFromIntent(data);
                // Signed in successfully - show authenticated UI
                updateUI(credential);
            } catch (ApiException e) {
                // The ApiException status code indicates the detailed failure reason.
            }
        }
    }
}
```

也可以用 Activity Result API 来简化 onActivityResult

```java
private val googleLoginLauncher =
    registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
        val resultCode = result.resultCode
        Log.i(TAG, "google login get account info result.resultCode:$resultCode")
        if (resultCode == Activity.RESULT_OK) {
            try {
                val credential =
                    Identity.getSignInClient(this).getSignInCredentialFromIntent(result.data)
                Log.i(TAG, "google login get account info id:${credential.id}")
                Log.i(
                    TAG,
                    "google login get account info googleIdToken:${credential.googleIdToken}"
                )
                Log.i(TAG, "google login get account info password:${credential.password}")
                Log.i(TAG, "google login get account info givenName:${credential.givenName}")
                Log.i(TAG, "google login get account info familyName:${credential.familyName}")
                Log.i(
                    TAG,
                    "google login get account info displayName:${credential.displayName}"
                )
                Log.i(
                    TAG,
                    "google login get account info profilePictureUri:${credential.profilePictureUri}"
                )
                updateUI(credential)
            } catch (exception: ApiException) {
                Log.e(TAG, "google login get account info error :${exception.message}")
                exception.printStackTrace()
            }
        }
    }
```

效果图：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684244277951-36993cbb-40f6-4f6c-b226-07612dacebdd.png)

#### 完整代码

```java
public static void signInNewApi(
        Activity activity,
        ActivityResultLauncher<IntentSenderRequest> launcher) {
//        Android client for me.hacket.assistant.samples (auto created by Google Service)
//        String clientId = "448384031016-24iv7e5c7ltl7t204urdin6n8l1f7d83.apps.googleusercontent.com";
    GetSignInIntentRequest request =
            GetSignInIntentRequest.builder()
//                        .setServerClientId(getString(R.string.server_client_id))
                    .setServerClientId(webClientId)
                    .build();
    Identity.getSignInClient(activity)
            .getSignInIntent(request)
            .addOnSuccessListener(
                    result -> {
                        launcher.launch(new IntentSenderRequest.Builder(result).build());
//                            try {
//                                activity.startIntentSenderForResult(
//                                        result.getIntentSender(),
//                                        REQUEST_CODE_GOOGLE_SIGN_IN,
//                                        /* fillInIntent= */ null,
//                                        /* flagsMask= */ 0,
//                                        /* flagsValue= */ 0,
//                                        /* extraFlags= */ 0,
//                                        /* options= */ null);
//                            } catch (IntentSender.SendIntentException e) {
//                                Log.e(TAG, "Google Sign-in failed");
//                            }
                    })
            .addOnFailureListener(
                    e -> {
                        Log.e(TAG, "Google Sign-in failed", e);
                    });
}
public static void signOutNewApi(Activity activity) {
    Identity.getSignInClient(activity)
            .signOut()
            .addOnSuccessListener(new OnSuccessListener<Void>() {
                @Override
                public void onSuccess(Void unused) {
                    Log.i(TAG, "google call logout success");
                }
            });
}
```

## [One tap sign-in/sign-out for Android](https://developers.google.com/identity/one-tap/android/overview)

### 什么是 One tap？

一键登录，检索你之前登录过的账号，避免再次创建账号，减少登录的阻力。

### [Sign users in with their saved credentials](https://developers.google.com/identity/one-tap/android/get-saved-credentials) 配置 SignInClient

```kotlin
class YourActivity : AppCompatActivity() {
    // ...
    private lateinit var oneTapClient: SignInClient
    private lateinit var signInRequest: BeginSignInRequest
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        oneTapClient = Identity.getSignInClient(this)
        signInRequest = BeginSignInRequest.builder()
            .setPasswordRequestOptions(BeginSignInRequest.PasswordRequestOptions.builder()
                    .setSupported(true)
                    .build())
            .setGoogleIdTokenRequestOptions(
                BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                    .setSupported(true)
                // Your server's client ID, not your Android client ID.
                    .setServerClientId(getString(R.string.your_web_client_id))
                // Only show accounts previously used to sign in.
                    .setFilterByAuthorizedAccounts(true)
                    .build())
        // Automatically sign in when exactly one credential is retrieved.
            .setAutoSelectEnabled(true)
            .build()
        // ...
    }
    // ...
}
```

### Display the One Tap sign-in UI 展示 One Tap UI

```kotlin
oneTapClient.beginSignIn(signInRequest)
    .addOnSuccessListener(this) { result ->
        try {
            startIntentSenderForResult(
                result.pendingIntent.intentSender, REQ_ONE_TAP,
                null, 0, 0, 0, null)
        } catch (e: IntentSender.SendIntentException) {
            Log.e(TAG, "Couldn't start One Tap UI: ${e.localizedMessage}")
        }
    }
    .addOnFailureListener(this) { e ->
        // No saved credentials found. Launch the One Tap sign-up flow, or
        // do nothing and continue presenting the signed-out UI.
        Log.d(TAG, e.localizedMessage)
    }
```

### Handle the user's response 处理 One Tap 请求数据

```kotlin
class YourActivity : AppCompatActivity() {

    // ...
    private val REQ_ONE_TAP = 2  // Can be any integer unique to the Activity
    private var showOneTapUI = true
    // ...

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        when (requestCode) {
             REQ_ONE_TAP -> {
                try {
                    val credential = oneTapClient.getSignInCredentialFromIntent(data)
                    val idToken = credential.googleIdToken
                    val username = credential.id
                    val password = credential.password
                    when {
                        idToken != null -> {
                            // Got an ID token from Google. Use it to authenticate
                            // with your backend.
                            Log.d(TAG, "Got ID token.")
                        }
                        password != null -> {
                            // Got a saved username and password. Use them to authenticate
                            // with your backend.
                            Log.d(TAG, "Got password.")
                        }
                        else -> {
                            // Shouldn't happen.
                            Log.d(TAG, "No ID token or password!")
                        }
                    }
                } catch (e: ApiException) {
                    // ...
                }
            }
        }
    }
    // ...
}
```

### Stop displaying the One Tap UI 停止展示 One Tap UI 框

- 用户取消了的话，临时不要展示该弹窗
- 展示频次的控制

```kotlin
class YourActivity : AppCompatActivity() {
    // ...
    private val REQ_ONE_TAP = 2  // Can be any integer unique to the Activity
    private var showOneTapUI = true
    // ...
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        when (requestCode) {
            REQ_ONE_TAP -> {
                try {
                    // ...
                } catch (e: ApiException) {
                    when (e.statusCode) {
                        CommonStatusCodes.CANCELED -> { // 用户取消
                            Log.d(TAG, "One-tap dialog was closed.")
                            // Don't re-prompt the user.
                            showOneTapUI = false
                        }
                        CommonStatusCodes.NETWORK_ERROR -> {
                            Log.d(TAG, "One-tap encountered a network error.")
                            // Try again or just ignore.
                        }
                        else -> {
                            Log.d(TAG, "Couldn't get credential from result." +
                                " (${e.localizedMessage})")
                        }
                    }
                }
            }
        }
    }
    // ...
}
```

## Handle sign-out

用户登出了 App，调用 One Tap client's `signOut()`

![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684308070963-20ac846e-2645-4d05-820c-dce86feb80df.png)<br />**注意：**One Tap 需要在之前已经登录过了账号才会弹出 UI；未登录时不会弹出 UI 框，且报错：16: Cannot find a matching credential.

## [Save passwords with Credential Saving](https://developers.google.com/identity/one-tap/android/save-passwords)

```kotlin
fun savePassword(activity: Activity, username: String, password: String) {
    val signInPassword = SignInPassword(username, password)
    val savePasswordRequest =
        SavePasswordRequest.builder().setSignInPassword(signInPassword).build()

    Identity.getCredentialSavingClient(activity)
        .savePassword(savePasswordRequest)
        .addOnSuccessListener { result ->
            activity.startIntentSenderForResult(
                result.pendingIntent.intentSender,
                REQUEST_CODE_GIS_SAVE_PASSWORD,
                /* fillInIntent= */ null,
                /* flagsMask= */ 0,
                /* flagsValue= */ 0,
                /* extraFlags= */ 0,
                /* options= */ null
            )
        }
}
```

UI 效果：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684315094569-ac3b5743-17d9-496c-bcc8-977df32af06a.png)<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684315141061-d941adfa-d059-4536-ba24-a5175d030069.png)

# [Credential management](https://developers.google.com/identity/credential-management) 凭据管理

## [Blockstore encrypted credential storage](https://developers.google.com/identity/blockstore/android)

Block Store API 可以让您的应用存储用户凭据，从而可在未来的新设备中取回凭据，并用于重新验证用户。当用户使用一台设备引导另一台设备时，凭据数据就会在设备间传输。

- [x] [通过 Block Store 实现账户无缝迁移](https://mp.weixin.qq.com/s/1qCCDHHGL_xtxBElm6aPMQ)

## [Smart Lock for Passwords](https://developers.google.com/identity/smartlock-passwords/android/overview)

### 什么是 Smart Lock for Passwords？

程序化的保存和检索凭据，跨端和网站自动登录。<br />All Smart Lock for Passwords functionality has been migrated to [One Tap](https://developers.google.com/identity/one-tap/android/overview), and Smart Lock for Passwords is deprecated. Use [One Tap](https://developers.google.com/identity/one-tap/android/overview) instead.

### [Store a user's credentials](https://developers.google.com/identity/smartlock-passwords/android/store-credentials)

```kotlin
fun save(
    activity: Activity,
    name: String,
    password: String,
    email: String,
    requestCode: Int
) {
    val credential: Credential = Credential.Builder(email)
        .setName(name)
        .setPassword(password) // Important: only store passwords in this field.
        // Android autofill uses this value to complete
        // sign-in forms, so repurposing this field will
        // likely cause errors.
        .build()
    val mCredentialsClient = Credentials.getClient(activity)
    mCredentialsClient.save(credential).addOnCompleteListener { task ->
        if (task.isSuccessful) {
            Log.d(TAG, "SAVE: OK")
            Toast.makeText(activity, "Credentials saved", Toast.LENGTH_SHORT).show()
            return@addOnCompleteListener
        }

        val e = task.exception
        if (e is ResolvableApiException) {
            // Try to resolve the save request. This will prompt the user if
            // the credential is new.
            try {
                e.startResolutionForResult(activity, requestCode)
            } catch (exception: SendIntentException) {
                // Could not resolve the request
                Log.e(TAG, "Failed to send resolution.", exception)
                Toast.makeText(activity, "Save failed", Toast.LENGTH_SHORT).show()
            }
        } else {
            // Request has no resolution
            Toast.makeText(activity, "Save failed", Toast.LENGTH_SHORT).show()
        }
    }
}
```

如果没有立即 save 成功，就会抛出一个 `ResolvableApiException�` 异常，调用 `startResolutionForResult�()` 让用户来确认，效果图如下：<br />![image.png](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1684327508971-70f83a10-a4a5-4216-9958-b6ccf2d59774.png)

### [Retrieve a user's stored credentials](https://developers.google.com/identity/smartlock-passwords/android/retrieve-credentials)

```kotlin
fun retrive(activity: Activity) {
    val mCredentialsClient = Credentials.getClient(activity)
    val mCredentialRequest = CredentialRequest.Builder()
        .setPasswordLoginSupported(true)
        .setAccountTypes(IdentityProviders.GOOGLE, IdentityProviders.TWITTER)
        .build()

    mCredentialsClient?.request(mCredentialRequest)
        ?.addOnCompleteListener(object :
            OnCompleteListener<CredentialRequestResponse> {
            override fun onComplete(task: Task<CredentialRequestResponse>) {
                if (task.isSuccessful) {
                    // See "Handle successful credential requests"
                    Log.i(TAG, "onComplete Successful onCredentialRetrieved.")
                    onCredentialRetrieved(activity, task.result.credential)
                    return
                }
                // See "Handle unsuccessful and incomplete credential requests"
                val e = task.exception
                e?.printStackTrace()
                Log.w(TAG, "onComplete Unsuccessful credential request. ${e?.message}")
                if (e is ResolvableApiException) {
                    // This is most likely the case where the user has multiple saved
                    // credentials and needs to pick one. This requires showing UI to
                    // resolve the read request.
                    resolveResult(activity, e, 0x11)
                } else if (e is com.google.android.gms.common.api.ApiException) {
                    // The user must create an account or sign in manually.
                    Log.e(TAG, "Unsuccessful credential request.", e)
                    val ae = e as com.google.android.gms.common.api.ApiException?
                    val code: Int = ae!!.statusCode
                    // ...
                }
            }
        })
}

private fun resolveResult(activity: Activity, rae: ResolvableApiException, requestCode: Int) {
    try {
        rae.startResolutionForResult(activity, requestCode)
//            mIsResolving = true
    } catch (e: IntentSender.SendIntentException) {
        Log.e(TAG, "Failed to send resolution.", e)
        e.printStackTrace()
//            hideProgress()
    }
}

fun onCredentialRetrieved(activity: Activity, credential: Credential?) {
    val accountType: String? = credential?.accountType
    val name = credential?.name
    val id = credential?.id
    val password = credential?.password
    val idTokens = credential?.idTokens
    Log.w(
        TAG,
        "onCredentialRetrieved accountType: $accountType name: $name id: $id password: $password idTokens: $idTokens"
    )
    if (accountType == null) {
        // Sign the user in with information from the Credential.
        Log.i(TAG, "[accountType=null] signInWithPassword id: $id password: $password")
    } else if (accountType == IdentityProviders.GOOGLE) {
        // The user has previously signed in with Google Sign-In. Silently
        // sign in the user with the same ID.
        // See https://developers.google.com/identity/sign-in/android/
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build()
        val signInClient = GoogleSignIn.getClient(activity, gso)
        val task = signInClient.silentSignIn()
        // There's no immediate result ready, displays some progress indicator and waits for the
        // async callback.
        Log.i(TAG, "[accountType=GOOGLE] silentSignIn.")
        task.addOnCompleteListener { t ->
            if (t.isSuccessful) {
                // There's immediate result available.
                val signInAccount = t.result
                // ...
            } else {
                // Unsuccessful sign-in, show the user an error dialog.
                // ...
            }
        }
        // ...
    }
}
```

### [Delete stored credentials](https://developers.google.com/identity/smartlock-passwords/android/delete-credentials)

```kotlin
mCredentialsClient.delete(credential).addOnCompleteListener(
    new OnCompleteListener<Void>() {
        @Override
        public void onComplete(@NonNull Task<Void> task) {
            if (task.isSuccessful()) {
                // Credential deletion succeeded.
                // ...
            }
        }
    });
```

## [Autofill on the device](https://developer.android.com/guide/topics/text/autofill-optimize)
