---
date created: 2024-08-15 17:14
date updated: 2024-12-24 00:33
dg-publish: true
---

# Room基本用法

<https://developer.android.com/topic/libraries/architecture/adding-components#room>

## Room介绍

Room是对SQLite的抽象，允许访问SQLite数据库的全部功能。

Room主要由三部分组成：Datebase、Entity、DAO

1. Database 包含数据库持有者，并作为应用程序持久关系数据的基础连接的主要访问点
2. Entity 表示数据库中的表
3. DAO 用于访问数据库的方法

这些组件以及它们与应用程序其余部分的关系：
![image.png|400](https://cdn.nlark.com/yuque/0/2023/png/694278/1691240970563-a1882d98-136d-41ec-8cd9-f0d93e4d92cb.png#averageHue=%2388b375&clientId=ue828a953-98d4-4&from=paste&height=271&id=uf8d4754c&originHeight=542&originWidth=600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=87028&status=done&style=stroke&taskId=u9d4c1bf7-0cf9-486b-8097-25bf501a60b&title=&width=300)

## 集成 Gradle 依赖

<https://developer.android.com/jetpack/androidx/releases/room#declaring_dependencies>

```groovy
dependencies {
  def room_version = "2.2.3"

  implementation "androidx.room:room-runtime:$room_version"
  annotationProcessor "androidx.room:room-compiler:$room_version" // For Kotlin use kapt instead of annotationProcessor

  // optional - Kotlin Extensions and Coroutines support for Room
  implementation "androidx.room:room-ktx:$room_version"

  // optional - RxJava support for Room
  implementation "androidx.room:room-rxjava2:$room_version"

  // optional - Guava support for Room, including Optional and ListenableFuture
  implementation "androidx.room:room-guava:$room_version"

  // Test helpers
  testImplementation "androidx.room:room-testing:$room_version"
}
```

## 注解

### 数据库 `@Database`

1. 一个继承`RoomDatabase`的抽象类
2. 在注解中包括与数据库相关联的实体类（被`@Entity`注解的类）
3. 包含一个没有参数的抽象方法并且返回一个带有注解的DAO（`@DAO`）

#### 获取数据库实例

1. Room.databaseBuilder()
2. Room.inMemoryDatabaseBuilder()  获取内存数据库

> 注意:数据库的实例化是很昂贵的，所以建议我们使用单例模式来初始化，而且也很少情况下需要访问多个实例。

```kotlin
@Database(entities = [User::class], version = 2) 
abstract class UserAppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao // 一个抽象没有参数的DAO方法
    companion object {
        private var INSTANCE: UserAppDatabase? = null
        fun getInstance(context: Context): UserAppDatabase {
            synchronized(this) {
                if (INSTANCE != null) {
                    return INSTANCE!!
                } else {
                    INSTANCE = buildDatebase(context)
                }
                return INSTANCE!!
            }
        }
        private fun buildDatebase(context: Context): UserAppDatabase {
            return Room.databaseBuilder(context, UserAppDatabase::class.java, "Sample.db")
                    .fallbackToDestructiveMigration() // 删除并重新创建整个数据库
                    .build()
        }
    }
}
```

#### fallbackToDestructiveMigration()

如果找不到对应的`Migration`，就会崩溃，添加`fallbackToDestructiveMigration`就不会崩溃取而代之的是重建数据库，数据库内容都没有了

#### addMigrations([@NonNull ](/NonNull) Migration... migrations)

添加数据库升级

#### enableMultiInstanceInvalidation()

如果您的应用在多个进程中运行，请在数据库构建器调用中包含 enableMultiInstanceInvalidation()。这样，如果您在每个进程中都有一个 AppDatabase 实例，就可以在一个进程中使共享数据库文件失效，并且这种失效会自动传播到其他进程中的 AppDatabase 实例。

### 表 `@Entity`

默认情况下，Room会为实体类中定义的每个字段创建一列，如果实体中有我们不想保留的字段，可以使用`@Ignore` 注解它们。我们必须通过 Database 类中的 entities 数组来引用实体类

1. 默认情况下，Entity类名作为数据库表名，`@Entity(tableName = "users")`自定义表名

> 注意:表名在数据库是不区分大小写的

2. 字段需public或者提供getter/setter
3. Room使用字段名作为数据库的列名，如果你想修改一个列的名称，添加 `@ColumnInfo`
4. Entity类中有你不想存储的字段，你可以使用@Ignore注解

#### 主键  @PrimaryKey/primaryKeys

每个Entity都必须至少定义一个主键。即使只有一个字段，我们仍然需要使用`@PrimaryKey`注解。

1. Room自动分配主键 ，设置`@PrimaryKey`的 `autoGenerate=true` 属性
2. 复合主键 `primaryKeys属性`

```kotlin
@Entity(tableName = "users"/*, primaryKeys = ["first_name", "last_name"]*/)
data class User(
        @ColumnInfo(name = "uid")
        @PrimaryKey(autoGenerate = true)
        val id: Int,

        @ColumnInfo(name = "first_name")
        val firstName: String,
        @ColumnInfo(name = "last_name")
        val lastName: String
//        ,
//        @Ignore
//        val hah: String
)
```

#### [@Ignore ](/Ignore) 忽略

- 子类忽略父类属性用`ignoredColumns`

```kotlin
@Entity
data class User(
    @PrimaryKey val id: Int,
    val firstName: String?,
    val lastName: String?,
    @Ignore val picture: Bitmap?)


open class User {
    var picture: Bitmap? = null
}

@Entity(ignoredColumns = arrayOf("picture"))
data class RemoteUser(
    @PrimaryKey val id: Int,
    val hasVpn: Boolean
) : User()
```

### 操作 `@Dao`

数据访问对象（DAO）

> 注意：Room不支持主线程上的数据库访问，因为它可能会长时间锁定 UI， 除非我们调用 RoomDatabase.Builder 的 allowMainThreadQueries() 。

异步查询 - 返回 LiveData or Flowable 实例的查询不受此规则影响，因为它们在需要时会在后台线程上运行异步查询。

DAO 可以是接口，也可以是抽象类。如果它是一个抽象类，它可以选择使用一个构造函数，该构造函数将 RoomDatabase 作为唯一参数。Room在编译期创建每个DAO 的实现

## 预填充数据库(room2.2.0+)

<https://developer.android.com/training/data-storage/room/prepopulate>

> inMemoryDatabaseBuilder()不支持

### Prepopulate from an app asset

```kotlin
Room.databaseBuilder(appContext, AppDatabase.class, "Sample.db")
    .createFromAsset("database/myapp.db")
    .build()
```

> 从assets预填充数据库，Room会校验数据库确保它的schema匹配预填充的数据库。

### Prepopulate from the file system

```kotlin
Room.databaseBuilder(appContext, AppDatabase.class, "Sample.db")
    .createFromFile(File("mypath"))
    .build()
```

> 从file system预填充数据库，Room会校验数据库确保它的schema匹配预填充的数据库。

### Handle migrations that include prepackaged databases

#### Example: Fallback migration with a prepackaged database(数据库升级失败且带有预填充数据)

1. 新version定义了预填充数据库，旧版本升级到新版本没有migration路径，升级失败，且定义了`fallbackToDestructiveMigration()`，那么重建数据库会用预填充数据填充到数据库中

```kotlin
// Database class definition declaring version 3.
@Database(version = 3)
abstract class AppDatabase : RoomDatabase() {
    ...
}

// Destructive migrations are enabled and a prepackaged database
// is provided.
Room.databaseBuilder(appContext, AppDatabase.class, "Sample.db")
    .createFromAsset("database/myapp.db")
    .fallbackToDestructiveMigration()
    .build()
```

#### Example: Implemented migration with a prepackaged database(升级数据库成功且带预填充数据)

不会用到填充数据，用到填充数据只有在数据库升级失败(fallback)用到

```kotlin
// Database class definition declaring version 3.
@Database(version = 3)
abstract class AppDatabase : RoomDatabase() {
    ...
}

// Migration path definition from version 2 to version 3.
val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(database: SupportSQLiteDatabase) {
        ...
    }
}

// A prepackaged database is provided.
Room.databaseBuilder(appContext, AppDatabase.class, "Sample.db")
    .createFromAsset("database/myapp.db")
    .addMigrations(MIGRATION_2_3)
    .build()
```

#### Example: Multi-step migration with a prepackaged database

```kotlin
// Database class definition declaring version 4.
@Database(version = 4)
abstract class AppDatabase : RoomDatabase() {
    ...
}

// Migration path definition from version 3 to version 4.
val MIGRATION_3_4 = object : Migration(3, 4) {
    override fun migrate(database: SupportSQLiteDatabase) {
        ...
    }
}

// Destructive migrations are enabled and a prepackaged database is
// provided.
Room.databaseBuilder(appContext, AppDatabase.class, "Sample.db")
    .createFromAsset("database/myapp.db")
    .addMigrations(MIGRATION_3_4)
    .fallbackToDestructiveMigration()
    .build()
```

- 2→3未定义migration，数据库升级失败，fallback会预填充数据库
- 3→4定义了migration，数据库升级成功，原始数据保留

## 对象间的关系

SQLite是一个关系数据库，你可以定义2个对象之间的关系。尽管大多数对象关系映射库允许实体对象相互引用，但Room 明确禁止这样做，要想了解此决策背后的技术原理，请看<br />[Understand why Room doesn't allow object references](https://developer.android.com/training/data-storage/room/referencing-data.html#understand-no-object-references)

### 定义一对多个关系

即使你不能使用直接关系，Room仍然允许我们定义外键约束的实体

要调用 Book，我们可以使用注解 [@ForeignKey ](/ForeignKey) 定义 User实体与它的关系，如以下代码所示：

```kotlin
@Entity(foreignKeys = [
    ForeignKey(entity = User::class,
            parentColumns = ["uid"],
            childColumns = ["user_id"],
            onDelete = ForeignKey.CASCADE
    )])
data class Book(
        @PrimaryKey val bookId: Int,
        val title: String?,
        @ColumnInfo(name = "user_id") val userId: Int
)
```

外键非常强大，因为它允许我们指定：引用的实体类更新时发生的情况。例如，如果要告诉SQLite删除 user 的所有books，可以通过在注解 `@ForeignKey` 中包含 `onDelete = CASCADE`来删除相应的User实例。

> 注意:SQLite处理 [@Insert(onConflict ](/Insert(onConflict ) = REPLACE) 作为一组REMOVE 和 REPLACE 操作，而不是单个的 UPDATE 操作。这种替换冲突值的方法可能会影响外键约束。

### 嵌套对象

有时，我们希望将实体或普通旧Java对象（POJO）表示为数据库逻辑中的一个组合体，也就是让该对象包含多个字段。在这些情况下，我们可以使用注解 `@Embedded` 来表示要分解到表中子字段的对象。然后我们就可以像查找其他单个列一样查询嵌入字段。<br />例如,用户类可以包含一个字段类型的地址,代表组成的字段命名的街道,城市,国家,邮编。存储由单独列在表中,包括一个地址字段与@Embedded用户注释的类,如下面代码片段所示:

```kotlin
data class Address(
    val street: String?,
    val state: String?,
    val city: String?,
    @ColumnInfo(name = "post_code") val postCode: Int
)

@Entity
data class User(
    @PrimaryKey val id: Int,
    val firstName: String?,
    @Embedded val address: Address?
)
```

> 注意:嵌入字段还可以嵌入其他字段

### 多对多的关系

两个实体之间的多对多关系,每个实体可以与其他的零个或多个实例。

例如,考虑一个音乐流媒体应用,用户可以将自己喜欢的歌曲到播放列表。每一个播放列表可以拥有任意数量的歌,每首歌可以包含任意数量的播放列表，这种关系模型,您将需要创建三个对象:

1. 播放列表的一个实体类
2. 歌曲的一个实体类
3. 一个调度类控制信息哪一首歌曲在哪一个列表里面

```kotlin
@Entity
data class Playlist(
    @PrimaryKey var id: Int,
    val name: String?,
    val description: String?
)

@Entity
data class Song(
    @PrimaryKey var id: Int,
    val songName: String?,
    val artistName: String?
)

// 中间类定义为一个实体包含外键引用歌曲和播放列表
@Entity(tableName = "playlist_song_join",
        primaryKeys = arrayOf("playlistId","songId"),
        foreignKeys = arrayOf(
                         ForeignKey(entity = Playlist::class,
                                    parentColumns = arrayOf("id"),
                                    childColumns = arrayOf("playlistId")),
                         ForeignKey(entity = Song::class,
                                    parentColumns = arrayOf("id"),
                                    childColumns = arrayOf("songId"))
                              )
        )
data class PlaylistSongJoin(
    val playlistId: Int,
    val songId: Int
)

// 这产生一个多对多关系模型,允许您使用一个DAO查询播放列表的歌曲和播放列表的歌曲:
@Dao
interface PlaylistSongJoinDao {
    @Insert
    fun insert(playlistSongJoin: PlaylistSongJoin)

    @Query("""
           SELECT * FROM playlist
           INNER JOIN playlist_song_join
           ON playlist.id=playlist_song_join.playlistId
           WHERE playlist_song_join.songId=:songId
           """)
    fun getPlaylistsForSong(songId: Int): Array<Playlist>

    @Query("""
           SELECT * FROM song
           INNER JOIN playlist_song_join
           ON song.id=playlist_song_join.songId
           WHERE playlist_song_join.playlistId=:playlistId
           """)
    fun getSongsForPlaylist(playlistId: Int): Array<Song>
}
```

### 索引 [@Index ](README.md)

添加索引以加快查询速度，可以使用 [@Entity ](/Entity) 注解的 `indices` 属性创建索引，如果某个字段或字段组是唯一的，可以将`@Index` 注解的 `unique` 属性设置为 true 来强制这个唯一性，如:

```java
public @interface Index {
  //定义需要添加索引的字段
  String[] value();
  //定义索引的名称
  String name() default "";
  //true-设置唯一键，标识value数组中的索引字段必须是唯一的，不可重复
  boolean unique() default false;
}
```

1. 在`@Entity`的`@ColumnInfo`的`index`设置为true将该字段定义为索引；如果需要定义复合索引用`Index`

```java
@Entity(indices = {@Index(value = {"first_name", "last_name"},
        unique = true)})
class User {
    @ColumnInfo(name = "uid", index = true)
    @PrimaryKey
    public int id;

    @ColumnInfo(name = "first_name")
    public String firstName;

    @ColumnInfo(name = "last_name")
    public String lastName;

    @Ignore
    Bitmap picture;
}
```

2. @Index定义

```kotlin
@Entity(tableName = "users", indices = [Index(value = ["uid"], unique = true)])
data class User(
        @ColumnInfo(name = "uid", index = true)
        @PrimaryKey(autoGenerate = true)
        val id: Int,
        @ColumnInfo(name = "first_name")
        val firstName: String,
        @ColumnInfo(name = "last_name")
        val lastName: String,
        val timestamp: String = DateUtils.formatDateToString(System.currentTimeMillis())
)
```

3. 如果一个索引字段定义在`@Embedded`，那么包含它的Entity不会拥有该索引，需要重新声明定义该索引
4. 如果一个Entity继承自其它的class，索引默认不会被继承下来，需要在`Entity#inheritSuperIndices()=true`；或者在子类Entity重新声明索引

## DAO中的操作

使用 Room 数据库访问应用程序的数据 ，我们需要使用数据访问对象 或 DAO。这组 Dao 对象是构成Room的主要组件，因为每个 DAO 都包含抽象访问我们应用程序数据库的方法

> 注意：Room不支持主线程上的数据库访问，因为它可能会长时间锁定 UI， 除非我们调用 RoomDatabase.Builder 的 allowMainThreadQueries() 。<br />异步查询 - 返回 LiveData or Flowable 实例的查询不受此规则影响，因为它们在需要时会在后台线程上运行异步查询。

DAO 可以是接口，也可以是抽象类。如果它是一个抽象类，它可以选择使用一个构造函数，该构造函数将 RoomDatabase 作为唯一参数。Room在编译期创建每个DAO 的实现

### 插入 [@Insert ](/Insert)

当您创建一个DAO方法和注解`@Insert`，Room生成一个实现,在单个事务中将所有参数插入到数据库中。

#### 1、 @Insert方法的参数为带有@Entity的类，或者collection/array的@Entity类

#### 2、 onConflict定义冲突后怎么处理

1. OnConflictStrategy#ABORT 终止，默认，回滚事务
2. OnConflictStrategy#REPLACE 替换，用新的row替换旧row
3. OnConflictStrategy#IGNORE 忽略，保存旧row

```kotlin
@Dao
interface MyDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertUsers(vararg users: User)

    @Insert
    fun insertBothUsers(user1: User, user2: User)

    @Insert
    fun insertUsersAndFriends(user: User, friends: List<User>)
}
```

#### 3、entity

指定Entity class后，@Insert方法的参数可以是任意的POJO了，只要和Entity class属性对应；如果Entity class的`PrimaryKey`不是autoGenerate的，那么POJO是一定要存在PrimaryKey字段的。

```java
@Entity
public class Playlist {
    @PrimaryKey(autoGenerate = true)
    long playlistId;
    String name;
    @Nullable
    String description
    @ColumnInfo(defaultValue = "normal")
    String category;
    @ColumnInfo(defaultValue = "CURRENT_TIMESTAMP")
    String createdTime;
    @ColumnInfo(defaultValue = "CURRENT_TIMESTAMP")
    String lastModifiedTime;
}

public class NameAndDescription {
    String name;
    String description
}

@Dao
public interface PlaylistDao {
    @Insert(entity = Playlist.class)
    public void insertNewPlaylist(NameAndDescription nameDescription);
}
```

如果 [@Insert ](/Insert) 方法只接收 1 个参数，则它可以返回一个 long，这是插入条目的新 rowId，如果参数是数组或集合，则应返回 long[]或 `List<Long>` 替代。返回Int都不行，只有Insert是返回行，只要返回行的都要用Long，影响行数的可以用Int。

### 更新 [@Update ](/Update)

Update 方法可以在数据库中方便的修改一组给定为参数的实体，它使用与每个实体主键匹配的查询。

```kotlin
@Dao
interface MyDao {
    @Delete
    fun deleteUsers(vararg users: User)
}
```

此方法返回一个int值，表示数据库中更新的行数

### 删除 [@Delete ](/Delete)

Delete 方法可以在数据库中方便的移除一组给定为参数的实体。它使用主键来查找要删除的实体。

```kotlin
@Dao
interface MyDao {
    @Delete
    fun deleteUsers(vararg users: User)
}
```

这个方法返回一个int值,表示从数据库中删除的行数

### 查询 [@Query ](/Query) (主要)

`@Query`是DAO类中使用的主要注解，它允许我们对数据库执行 **读/写** 操作。每个 [@Query ](/Query) 方法都在编译时进行验证，因此如果查询出现问题，则会发生编译错误而不是运行时失败。

Room 还会验证查询的返回值，如果返回的对象中的字段名称与查询响应中的相应列名称不匹配时，Room会以下列两种方式之一提醒：

1. 如果只有一些字段名称匹配，它会发出警告。
2. 如果没有字段名称匹配，则会出错

#### 简单查询

```kotlin
@Dao
interface MyDao {
    @Query("SELECT * FROM user")
    fun loadAllUsers(): Array<User>
}
```

#### 传递参数查询

```kotlin
@Dao
interface MyDao {
    @Query("SELECT * FROM user WHERE age > :minAge")
    fun loadAllUsersOlderThan(minAge: Int): Array<User>
}
```

在编译时处理此查询，Room 会将 `:minAge` 绑定参数与 minAge 方法参数匹配，Room 使用参数名称执行匹配。如果存在不匹配，在应用编译时会发生错误。

传递多个参数或查询中多次引用它们:

```kotlin
@Dao
interface MyDao {
    @Query("SELECT * FROM user WHERE age BETWEEN :minAge AND :maxAge")
    fun loadAllUsersBetweenAges(minAge: Int, maxAge: Int): Array<User>

    @Query("SELECT * FROM user WHERE first_name LIKE :search " +
           "OR last_name LIKE :search")
    fun findUserWithName(search: String): List<User>
}
```

#### 返回列的子集

只需要一个实体里面的几个字段。例如,UI 可能只显示用户的名字和姓氏，而不是每个用户的详细信息。通过仅获取应用程序 UI 中显示的列，可以节省宝贵的资源，并且可以更快地完成查询。

Room 允许从查询结果中返回任何基于Java 的对象，只要结果 列 的集合可以映射到返回的对象中即可：

```kotlin
data class NameTuple(
    @ColumnInfo(name = "first_name") val firstName: String?,
    @ColumnInfo(name = "last_name") val lastName: String?
)

@Dao
interface MyDao {
    @Query("SELECT first_name, last_name FROM user")
    fun loadFullName(): List<NameTuple>
}
```

Room 了解查询返回 first_name 和 last_name 列的值，并且这些值可以映射到 NameTuple 类的字段中 。因此，Room 可以生成正确的代码。如果查询返回太多列 或 NameTuple 类中不存在的列，则Room会显示警告。

> 这些 POJO 也可以使用 `@Embedded` 注解。

#### 传递一组参数

有些查询可能要求传入**可变数量**的参数，并且在运行之前不知道参数的确切数量。例如，我们可能希望从区域的子集中检索有关所有用户的信息。Room了解参数何时表示集合，并根据提供的参数数量在运行时自动扩展它。

```kotlin
@Dao
interface MyDao {
    @Query("SELECT first_name, last_name FROM user WHERE region IN (:regions)")
    fun loadUsersFromRegions(regions: List<String>): List<NameTuple>
}
```

#### 可观察的查询 LiveData

执行查询时，我们通常希望应用程序的 UI在数据更改时自动更新。要实现此目的，可以在查询方法描述中使用 LiveData 类型的返回值，Room 会生成所有必要的代码，当数据库更新时以更新 LiveData 。

```kotlin
@Dao
interface MyDao {
    @Query("SELECT first_name, last_name FROM user WHERE region IN (:regions)")
    fun loadUsersFromRegionsSync(regions: List<String>): LiveData<List<User>>
}
```

#### 使用RxJava进行响应式查询

```kotlin
@Dao
interface MyDao {
    @Query("SELECT * from user where id = :id LIMIT 1")
    fun loadUserById(id: Int): Flowable<User>

    // Emits the number of users added to the database.
    @Insert
    fun insertLargeNumberOfUsers(users: List<User>): Maybe<Int>

    // Makes sure that the operation finishes successfully.
    @Insert
    fun insertLargeNumberOfUsers(varargs users: User): Completable

    /* Emits the number of users removed from the database. Always emits at
       least one user. */
    @Delete
    fun deleteAllUsers(users: List<User>): Single<Int>
}
```

#### 游标卡尺查询(不推荐)

```kotlin
@Dao
interface MyDao {
    @Query("SELECT * FROM user WHERE age > :minAge LIMIT 5")
    fun loadRawUsersOlderThan(minAge: Int): Cursor
}
```

> 注意：Google 非常不鼓励使用 Cursor API，因为它不保证行是否存在或 行 包含的值。仅当我们已经拥有需要光标的代码且无法轻松重构时才使用此功能。

#### 查询多个表

某些查询可能需要访问多个表来计算结果。Room允许编写任何查询，因此我们也可以连接表。此外，如果响应是可观察的数据类型，例如 LiveData 或 Flowable ，Room则会监视查询中引用的所有失效的表。

下面的代码片段展示了如何执行表连接信息表包含用户借阅书籍和一个表包含数据书目前租借：

```kotlin
@Dao
interface MyDao {
    @Query(
        "SELECT user.name AS userName, pet.name AS petName " +
        "FROM user, pet " +
        "WHERE user.id = pet.user_id"
    )
    fun loadUserAndPetNames(): LiveData<List<UserPet>>

    // You can also define this class in a separate file.
    data class UserPet(val userName: String?, val petName: String?)
}
```

#### 协程查询

你可以通过添加kotlin的关键字suspend到你的DAO方法,让他们使用kotlin协程异步功能，这将确保他们无法在主线程上执行

```
// UserDao
@Query("""SELECT * FROM users""")
suspend fun queryAllByCoroutine(): List<User>

btn_query_all_coroutine.setOnClickListener {
    lifecycleScope.launch {
        tv_result.append("launch before ${Thread.currentThread().name}\n")
        val names = db.userDao().queryAllByCoroutine()
        tv_result.append("${names.log()}\n")
        tv_result.append("launch after ${Thread.currentThread().name}\n")
    }
}
```

## 测试

### 导出schemas

编译后，Room将数据库的schemas信息导出到JSON文件中。您应该在您的版本控制系统中存储表示数据库的schema历史的导出JSON文件，因为它允许Room创建用于测试目的的数据库的旧版本。

#### Gradle配置

1. java

```groovy
android {
    // ...
    defaultConfig {
        // ...
        javaCompileOptions {
            annotationProcessorOptions {
                arguments = ["room.schemaLocation":
                        "$projectDir/schemas".toString()]
            }
        }
    }
}
```

2. kotlin

```groovy
kapt {
    arguments {
        // 配置并启用将数据库架构导出到给定目录中的 JSON 文件的功能
        arg("room.schemaLocation", "$projectDir/schemas".toString())
        // 启用 Gradle 增量注释处理器
        arg("room.incremental", "true")
        // 配置 Room 以重新编写查询，使其顶部星形投影在展开后仅包含 DAO 方法返回类型中定义的列。
        arg("room.expandProjection", "true")
    }
}
```

3. 添加`"androidx.room:room-testing:${config['room_version']}"`依赖，

```
android {
    // ...
    sourceSets {
        androidTest.assets.srcDirs += files("$projectDir/schemas".toString())
    }
}
```

## Ref

- [x] Android Room 官方指南<br /><https://blog.csdn.net/u011897062/article/details/82107709>

> 详细，翻译官方

- [ ] Android架构组件Room的使用<br /><https://blog.csdn.net/qq_21793463/article/details/78905316>

# Room进阶

## 外键 [@ForeignKey ](/ForeignKey)

```java
public @interface ForeignKey {
  //引用外键的表的实体
  Class entity();
  //要引用的外键列
  String[] parentColumns();
  //要关联的列
  String[] childColumns();
  //当父类实体(关联的外键表)从数据库中删除时执行的操作
  @Action int onDelete() default NO_ACTION;
  //当父类实体(关联的外键表)更新时执行的操作
  @Action int onUpdate() default NO_ACTION;
  //在事务完成之前，是否应该推迟外键约束
  boolean deferred() default false;
  //给onDelete，onUpdate定义的操作
  int NO_ACTION = 1;
  int RESTRICT = 2;
  int SET_NULL = 3;
  int SET_DEFAULT = 4;
  int CASCADE = 5;
  @IntDef({NO_ACTION, RESTRICT, SET_NULL, SET_DEFAULT, CASCADE})
  @interface Action {
    }
}
```

### 一对多（1 vs N）

定义ForeignKey一端的是N，另外一端是1

```kotlin
// 订单为N
@Entity(tableName = "orders", foreignKeys =
[ForeignKey(entity = Person::class, parentColumns = ["id_p"], childColumns = ["id_o"], onUpdate = ForeignKey.CASCADE, onDelete = ForeignKey.CASCADE)
])
data class Order(
        @PrimaryKey
        @ColumnInfo(name = "id_o")
        val id: Int,
        val orderno: String = "",
        val timestamp: String = DateUtils.formatDateToString(System.currentTimeMillis())
)

// 人是1，一个人拥有多个订单
@Entity(tableName = "persons")
data class Person(
//        @ForeignKey
        @PrimaryKey
        @ColumnInfo(name = "id_p")
        val id: Int,
        val firstname: String = "",
        val lastname: String = "",
        val address: String = "",
        val city: String = "",
        val timestamp: String = DateUtils.formatDateToString(System.currentTimeMillis())
)
```

### 多对多

在SQL中，多对多（或M：N）关系需要将具有外键的连接表返回给其他实体

#### 引入中间Entity

每个用户都可以拥有多个存储库，而且每个存储库都可以属于多个用户！

```kotlin
@Entity
class Repo(@field:PrimaryKey val id: Int, val name: String, val url: String)

@Entity
class User(@field:PrimaryKey val id: Int, val login: String, val avatarUrl: String)

// 中间Entity
@Entity(tableName = "user_repo_join",
        primaryKeys = ["userId", "repoId"],
        foreignKeys = [ForeignKey(entity = User::class, parentColumns = ["id"], childColumns = ["userId"]),
            ForeignKey(entity = Repo::class, parentColumns = ["id"], childColumns = ["repoId"])])
class UserRepoJoin(val userId: Int, val repoId: Int)

@Dao
interface UserRepoJoinDao {
    @Insert
    fun insert(userRepoJoin: UserRepoJoin)
    @Query("""SELECT * FROM user INNER JOIN user_repo_join ON
            user.id=user_repo_join.userId WHERE
            user_repo_join.repoId=:repoId""")
    fun getUsersForRepository(repoId: Int): List<User>
}


// 通过这种方式，我们可以将两个用户的资源库和用户的资源库都存储起来。最后一步是更改我们的RepoDatabase：
@Database(entities = [Repo::class, User::class, UserRepoJoin::class],
        version = 1)
abstract class RepoDatabase {
//    abstract fun getRepoDao(): RepoDao
//    abstract fun getUserDao(): UserDao
    abstract fun getUserRepoJoinDao(): UserRepoJoinDao
}

// 现在我们可以将用户和存储库插入到数据库中：

RepoDao repoDao = RepoDatabase
    .getInstance(context)
    .getRepoDao();

UserDao userDao = RepoDatabase
    .getInstance(context)
    .getUserDao();

UserRepoJoinDao userRepoJoinDao = RepoDatabase
    .getInstance(context)
    .getUserRepoJoinDao();
    
userDao.insert(new User(1,
    "Jake Wharton",
    "https://avatars0.githubusercontent.com/u/66577"));

repoDao.insert(new Repo(1, 
    "square/retrofit", 
    "https://github.com/square/retrofit"));
    
userRepoJoinDao.insert(new UserRepoJoin(1, 1));
```

#### 使用@Relation注解

另一种使用Room提供关系的方法-带有`@Relation`注释。你只能在非实体类中声明这样的关系

```java
@Entity
public class User {
    @PrimaryKey public final int id;
    public final String login;
    public final String avatarUrl;

    public User(int id, String login, String avatarUrl) {
        this.id = id;
        this.login = login;
        this.avatarUrl = avatarUrl;
    }
}
@Entity
public class Repo {
    @PrimaryKey public final int id;
    public final String name;
    public final String url;
    public final int userId;

    public Repo(int id, String name, String url, int userId) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.userId = userId;
    }
}

// 非Entity类
public class UserWithRepos {
    @Embedded public User user;

    @Relation(parentColumn = "id",
              entityColumn = "userId") public List<Repo> repoList;
}
```

这里我们有两个新的注释：

1. `@Embedded`用于嵌套字段 - 这样我们就可以将User类嵌入到我们的UserWithRepos类中
2. `@Relation`是与其他模型类的关系。这两个参数表示来自User类的parentColumn名称是id，而来自Repo类的entityColumn名称是userId。

通过这种方式，我们可以在DAO中使用适当的SQL语句来选择具有其所有存储库的用户：

```java
@Dao
public interface UserWithReposDao {

    @Query("SELECT * from user")
    public List<UserWithRepos> getUsersWithRepos();

}
```

这是最简单的方法，但是，您不能像删除或更新父母时那样对`@ForeignKey`注解设置操作。

## [@TypeConverter ](/TypeConverter)

<https://developer.android.com/training/data-storage/room/referencing-data>

Room 提供了在基元类型和盒装类型之间进行转换的功能，但不允许实体之间进行对象引用。

通常情况下，数据库存储的是基本类型float，int，String等。但是有时需要存储自定义类型，比如Date，或者我们自定义的类。如果想在数据库中存储这样的值，我们就需要通知Room如何将我们自定义的类型转换为原始类型。

案例：Date转为long

```kotlin
// 定义了 2 个函数，一个用于将 Date 对象转换为 Long 对象，另一个用于执行从 Long 到 Date 的反向转换。由于Room已知道如何保留 Long 对象，因此可以使用此转换器来保存 Date 类型的值。
class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }
    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time?.toLong()
    }
}


// 将 @TypeConverters 注释添加到 AppDatabase 类中，以便 Room 可以使用您为该 AppDatabase 中的每个实体和 DAO 定义的转换器
@Database(entities = arrayOf(User::class), version = 1)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}


// 通过使用这些转换器，您就可以在其他查询中使用自定义类型，就像使用基元类型一样，如以下代码段所示：
@Entity
data class User(private val birthday: Date?)
```

### 了解 Room 为何不允许对象引用

<https://developer.android.com/training/data-storage/room/referencing-data#understand-no-object-references>

## 线程切换

## 全文搜索（full-text search，FTS）支持 文本查询速度优化

如果你的应用需要通过全文搜索（FTS）快速访问数据库信息，请使用虚拟表（使用 `FTS3` 或者 `FTS4` SQLite扩展模块）为你的数据实体类提供支持。如果需要在 2.1.0 及以上版本的 Room 中使用这项功能，在声明数据实体类的时候添加 `@Fts3` 或者 `@Fts4` 注解。

```java
@Fts4
@Entity(tableName = "users")
// 数据实体类定义了主键，主键列名必须以 rowid 为列名，数据类型为 INTEGER
data class User(@PrimaryKey @ColumnInfo(name = "rowid") val uid: Int, @ColumnInfo(name = "name") val name: String, val age: Int)
```

如果表中存储的内容支持多语言，那么使用 [@Fts4 ](/Fts4) 注解的 `languageId` 属性指定表示语言类别的属性（仅对于 FTS4），如下示例代码所示：

```java
@Fts4(languageId = "motherLang")
@Entity(tableName = "users")
data class User(@PrimaryKey @ColumnInfo(name = "rowid") val uid: Int, @ColumnInfo(name = "name") val name: String, val age: Int, val motherLang: String)
```

- [ ] <https://www.sqlite.org/fts3.html>
- [ ] <https://developer.android.com/training/data-storage/room/defining-data#fts>

## Room数据库升级

<https://developer.android.com/training/data-storage/room/migrating-db-versions><br />Room 允许你写一些 Migration 类去保护用户数据，每个 Migration 类指定一个 startVersion 和 endVersion，在运行时，Room 会运行每个 Migration 类的 migrate()方法，以正确的顺序将数据库迁移到最新版本:

```java
Room.databaseBuilder(getApplicationContext(), MyDb.class, "database-name")
        .addMigrations(MIGRATION_1_2, MIGRATION_2_3).build();

static final Migration MIGRATION_1_2 = new Migration(1, 2) {
    @Override
    public void migrate(SupportSQLiteDatabase database) {
        database.execSQL("CREATE TABLE `Fruit` (`id` INTEGER, "
                + "`name` TEXT, PRIMARY KEY(`id`))");
    }
};

static final Migration MIGRATION_2_3 = new Migration(2, 3) {
    @Override
    public void migrate(SupportSQLiteDatabase database) {
        database.execSQL("ALTER TABLE Book "
                + " ADD COLUMN pub_year INTEGER");
    }
};
```

比如Room需要从1升级到3，先是1→2，然后2→3，如果需要1→3，需要定义`Migration(1, 3)`

### 数据库升级测试

## Room数据库升级想问题

### 问题1：java.lang.IllegalStateException: Room cannot verify the data integrity

如果咱们删除了一个字段，运行程序后，就会出现下面这个问题。

```
java.lang.IllegalStateException: Room cannot verify the data integrity. Looks like you've changed schema but forgot to update the version number. You can simply fix this by increasing the version number.
```

> 你修改了数据库，但是没有升级数据库的版本

### 问题2：java.lang.IllegalStateException: A migration from 1 to 2 was required but not found.

这时候咱们根据错误提示增加版本号，但没有提供`migration`，APP一样会crash。

```
java.lang.IllegalStateException: A migration from 1 to 2 was required but not found. Please provide the necessary Migration path via RoomDatabase.Builder.addMigration(Migration ...) or allow for destructive migrations via one of the RoomDatabase.Builder.fallbackToDestructiveMigration* methods.
```

> 让我们添加一个addMigration或者调用fallbackToDestructiveMigration完成迁移

### 1、增加版本号并使用fallbackToDestructiveMigration()

```java
Room.databaseBuilder(
context,
DepartmentDatabase.class,
DB_NAME).allowMainThreadQueries()
.fallbackToDestructiveMigration()
.build();
```

> 数据库的内容都被我们清空了。显然这种方式是不友好的，

### 2、不想清空数据库，就需要提供一个实现了的migration

比如咱们要在Department中添加phoneNum

```java
public class Department {
    @PrimaryKey(autoGenerate = true)
    private int id;
    private String dept;
    @ColumnInfo(name = "emp_id")
    private int empId;
    @ColumnInfo(name = "phone_num")
    private String phoneNum;
}
```

把版本号自增：

```java
@Database(entities = {Department.class, Company.class}, version = 2, exportSchema = false)
@TypeConverters(DateConverter.class)
public abstract class DepartmentDatabase extends RoomDatabase {
   // ...
}
```

添加一个version：1->2的migration：

```java
static final Migration MIGRATION_1_2 = new Migration(1, 2) {
    @Override
    public void migrate(SupportSQLiteDatabase database) {
        database.execSQL("ALTER TABLE department "
                + " ADD COLUMN phone_num TEXT");
    }
};
```

> 当添加的数据类型为 int 时，需要添加默认值 "ALTER TABLE department " + " ADD COLUMN phone_num INTEGER NOT NULL DEFAULT 0"

把migration 添加到 databaseBuilder：

```java
Room.databaseBuilder(
context,
DepartmentDatabase.class,
DB_NAME).allowMainThreadQueries()
.addMigrations(MIGRATION_1_2)
.build();
```

## AS4.1Database Inspector 使用

在 Android Studio 4.1 Canary 5 以及更高版本 上，内置了 Database Inspector ，提供了以下功能：

1. 查询和修改表数据
2. 执行查询语句
3. 执行 Dao 文件中定义的 Room 查询语句

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691241228611-55cc3767-6d20-47f4-af69-3b020d44b4bc.png#averageHue=%23e3e3db&clientId=ue828a953-98d4-4&from=paste&height=543&id=ub4872523&originHeight=1086&originWidth=1274&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1302715&status=done&style=none&taskId=u65988c9a-7c8b-43a8-b463-7f6b48dd027&title=&width=637)<br />Database Inspector会自动列出当前可调试的进程，以及该进程的应用所包含的数据库中的所有表

> 需要数据库连接上，才会在as中出现。

- [x] [database-inspector](https://developer.android.com/studio/preview/features?utm_source=android-studio#database-inspector)

# Room遇到的问题

## java.lang.IllegalStateException: Cannot access database on the main thread since it may potentially lock the UI for a long period of time.

在Room中，对于 `insert` ,`update`, `query` 需要使用后台线程，否则就会报错：`java.lang.IllegalStateException: Cannot access database on the main thread since it may potentially lock the UI for a long period of time.`

## java.lang.IllegalStateException: Room cannot verify the data integrity. Looks like you've changed schema but forgot to update the version number. You can simply fix this by increasing the version number.

有时需要更改现有的数据库架构。如果我们将添加，更新或删除数据库中的某些字段然后运行我们的应用程序，我们将看到来自Room的异常

解决：需要升级数据版本

## java.lang.IllegalStateException: A migration from 1 to 2 was required but not found. Please provide the necessary Migration path via RoomDatabase.Builder.addMigration(Migration ...) or allow for destructive migrations via one of the RoomDatabase.Builder.fallbackToDestructiveMigration* methods.

现在Room不知道如何将数据库从版本1迁移到版本2.在此错误房间建议我们两个解决方案：

- 删除并重新创建整个数据库 fallbackToDestructiveMigration
- 将现有的数据库架构升级到较新的版本 需要在数据库构建器中声明Migration

## android.database.sqlite.SQLiteConstraintException: FOREIGN KEY constraint failed (code 787 SQLITE_CONSTRAINT_FOREIGNKEY)

## No native library is found for os. Name=Mac and os. Arch=aarch 64. Path=/org/sqlite/native/Mac/aarch 64

- 解决 1：

apple 芯片，升级到 room-2.4.0 就可以了

- [android - Caused by: java.lang.Exception: No native library is found for os.name=Mac and os.arch=aarch64. path=/org/sqlite/native/Mac/aarch64 - Stack Overflow](https://stackoverflow.com/questions/68884589/caused-by-java-lang-exception-no-native-library-is-found-for-os-name-mac-and-o)

- 解决 2：

```groovy
// 添加下面的依赖
kapt("org.xerial:sqlite-jdbc:3.41.2.2")
```
