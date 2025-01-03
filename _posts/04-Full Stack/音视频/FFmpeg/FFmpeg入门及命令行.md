---
date created: 2024-06-03 23:24
date updated: 2024-12-26 00:19
tags:
  - '#播放本地文件'
  - '#提取音频'
  - '#如果不想重新编码video，需要加上-vcodec'
dg-publish: true
---

# FFmpeg 基础

## 什么是 FFmpeg？

FFmpeg 是一个开源的自由软件，主要用于处理音频和视频数据，如录制、转码、流式传输等。它包括 `libavcodec`——音视频编解码器库，和 `libavformat`——音视频格式转换库。FFmpeg 以其强大的功能、高性能和跨平台特性被广泛使用，同时它也支持最全面的编解码库，几乎包括了所有的音频/视频编码格式。
FFmpeg 的常用组件包括：

- `ffmpeg`：命令行工具，用于对视频文件或音频文件进行格式转换。
- `ffplay`：一个简单的基于 SDL 和 FFmpeg 库的播放器。
- `ffprobe`：用于显示媒体文件信息。

它还提供多个函数库（libraries），例如：

- `libswresample` 和 `libavresample`：用于音频重采样的库。
- `libavcodec`：包含所有 FFmpeg 音频/视频编解码功能的库。
- `libavformat`：包含了 `demuxers` 和 `muxers` 的函数库，用于音视频的格式化。
- `libavutil`：包含了一些工具函数库。
- `libpostproc`：视频前处理的函数库。
- `libswscale`：用于图像缩放的函数库。
- `libavfilter`：用于图像转换的函数库。

## FFmpeg 下载和安装

1. **下载和安装**
   - [Download for Microsoft Windows](https://ffmpeg.org/download.html#build-windows)
   - [Download for Mac](https://ffmpeg.org/download.html#build-mac)
   - [Download for Linux](https://ffmpeg.org/download.html#build-linux)
   - [Releases · BtbN/FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds/releases)

2. **将解压的包含 `ffmpeg.exe ffplay.exe ffprobe.exe` 的 bin 目录配置的 PATH**

3. 测试：`ffmpeg -version`

## ffmpeg/ffplay/ffprobe区别

- **ffmpeg:** Hyper fast Audio and Video encoder 超快音视频编码器（类似爱剪辑）
- **ffplay:** Simple media player 简单媒体播放器
- **ffprobe:** Simple multimedia streams analyzer 简单多媒体流分析器

# ffmpeg 命令

## ffmpeg 的使用格式

FFmpeg 的命令行参数非常多，可以分成五个部分：

```shell
ffmpeg {1} {2} -i {3} {4} {5}
# 
ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}
```

上面命令中，五个部分的参数依次如下：

1. 全局参数 `options`
2. 输入文件参数 `infile options`
3. 输入文件 `infile`
4. 输出文件参数 `outfile options`
5. 输出文件 `outfile`

**示例：**

```shell
ffmpeg \
-y \ # 全局参数
-c:a libfdk_aac -c:v libx264 \ # 输入文件参数
-i input.mp4 \ # 输入文件
-c:v libvpx-vp9 -c:a libvorbis \ # 输出文件参数
output.webm # 输出文件
# 上面的命令将 mp4 文件转成 webm 文件，这两个都是容器格式。输入的 mp4 文件的音频编码格式是 aac，视频编码格式是 H.264；输出的 webm 文件的视频编码格式是 VP9，音频格式是 Vorbis。
```

如果不指明编码格式，FFmpeg 会自己判断输入文件的编码。因此，上面的命令可以简单写成下面的样子。

```shell
ffmpeg -i input.avi output.mp4
```

## 常用命令行参数

FFmpeg 常用的命令行参数如下：

```shell
-c：指定编码器
-c copy：直接复制，不经过重新编码（这样比较快）
-c:v：指定视频编码器
-c:a：指定音频编码器
-i：指定输入文件
-an：去除音频流
-vn： 去除视频流
-preset：指定输出的视频质量，会影响文件的生成速度，有以下几个可用的值 ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow。
-y：不经过确认，输出时直接覆盖同名文件。
```

```shell
# 主要参数：
-i 设定输入流
-f 设定输出格式(format)
-ss 开始时间
-t 时间长度

# 音频参数：
-aframes 设置要输出的音频帧数
-b:a 音频码率
-ar 设定采样率
-ac 设定声音的Channel数
-acodec 设定声音编解码器，如果用copy表示原始编解码数据必须被拷贝。
-an 不处理音频
-af 音频过滤器

ffmpeg -i test.mp4 -b:a 192k -ar 48000 -ac 2 -acodec libmp3lame - aframes 200 out2.mp3

# 视频参数：
-vframes 设置要输出的视频帧数
-b 设定视频码率
-b:v 视频码率
-r 设定帧速率
-s 设定画面的宽与高
-vn 不处理视频
-aspect aspect 设置横纵比 4:3 16:9 或 1.3333 1.7777
-vcodec 设定视频编解码器，如果用copy表示原始编解码数据必须被拷贝。
-vf 视频过滤器

ffmpeg -i test.mp4 -vframes 300 -b:v 300k -r 30 -s 640x480 -aspect 16:9 -vcodec libx265
```

## ffmpeg 常用命令

### ffmpeg 查询命令

| **命令参数**     | **内容**                        | **命令参数**       | **内容**         |
| ------------ | ----------------------------- | -------------- | -------------- |
| `-version`   | 显示版本                          | `-bsfs`        | 显示可用比特流 filter |
| `-buildconf` | 显示编译配置                        | `-protocols`   | 显示可用的协议        |
| `-formats`   | 显示可用格式(`muxers+demuxers`)     | `-filters`     | 显示可用的过滤器       |
| `-muxers`    | 显示可用复用器                       | `-pix_fmts`    | 显示可用的像素格式      |
| `-demuxers`  | 显示可用解复用器                      | `-layouts`     | 显示标准声道名称       |
| `-codecs`    | 显示可用编解码器(`decoders+encoders`) | `-sample_fmts` | 显示可用的音频采样格式    |
| `-decoders`  | 显示可用解码器                       | `-colors`      | 显示可用的颜色名称      |
| `-encoders`  | 显示可用编码器                       |                |                |

### 查看文件信息

查看视频文件的元信息，比如编码格式和比特率，可以只使用`-i`参数。

```shell
ffmpeg -i input.mp4
```

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406040022095.png)
上面命令会输出很多冗余信息，加上`-hide_banner`参数，可以只显示元信息。

```shell
ffmpeg -i input.mp4 -hide_banner
```

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406040022757.png)

### 转封装

#### 转换编码格式

转换编码格式（`transcoding`）指的是， 将视频文件从一种编码转成另一种编码。比如转成 H.264 编码，一般使用编码器`libx264`，所以只需指定输出文件的视频编码器即可。

```shell
ffmpeg -i [input.file] -c:v libx264 output.mp4
# 转成 H.265 编码的写法。
ffmpeg -i [input.file] -c:v libx265 output.mp4
```

**示例：**

```shell
# MPEG4编码转成H264编码
ffmpeg -i input.mp4 -strict -2 -vcodec h264 output.mp4

# H264编码转成MPEG4编码
ffmpeg -i input.mp4 -strict -2 -vcodec mpeg4 output.mp4
```

#### 转换容器格式

转换容器格式（`transmuxing`）指的是，将视频文件从一种容器转到另一种容器。下面是 mp4 转 webm 的写法。

```shell
ffmpeg -i input.mp4 -c copy output.webm
# 上面例子中，只是转一下容器，内部的编码格式不变，所以使用`-c copy`指定直接拷贝，不经过转码，这样比较快。

# 保持编码格式，mp4转ts
ffmpeg -i test.mp4 -vcodec copy -acodec copy test_copy.ts 
ffmpeg -i test.mp4 -codec copy test_copy2.ts

# 改变编码格式，mp4转mkv
ffmpeg -i test.mp4 -vcodec libx265 -acodec libmp3lame out_h265_mp3.mkv
```

#### 修改帧率

```shell
# 修改帧率：
ffmpeg -i test.mp4 -r 15 -codec copy output.mp4 (错误命令)
ffmpeg -i test.mp4 -r 15 output2.mp4
```

#### 调整码率

调整码率（`transrating`）指的是，改变编码的比特率，一般用来将视频文件的体积变小。下面的例子指定码率最小为`964K`，最大为`3856K`，缓冲区大小为 `2000K`。

```shell
ffmpeg \
-i input.mp4 \
-minrate 964K -maxrate 3856K -bufsize 2000K \
output.mp4

# 修改视频码率
ffmpeg -i test.mp4 -b 400k output_b.mkv （此时音频也被重新编码）
ffmpeg -i test.mp4 -b:v 400k output_bv.mkv

# 修改音频码率
ffmpeg -i test.mp4 -b:a 192k output_ba.mp4 #如果不想重新编码video，需要加上-vcodec copy

ffmpeg -i test.mp4 -b:v 400k -b:a 192k output_bva.mp4
```

#### 屏幕和分辨率相关

##### 设置视频的屏幕高宽比

使用 `-aspect` 标志设置一个视频文件的屏幕高宽比。
通常使用的宽高比是： `16:9 4:3 16:10 5:4 2:21:1 2:35:1 2:39:1`

```shell
ffmpeg -i input.mp4 -aspect 16:9 output.mp4 
```

##### 改变分辨率（transsizing）

- 从 1080p 转为 480p

```shell

ffmpeg \
-i input.mp4 \
-vf scale=480:-1 \
output.mp4
```

- 设置一个视频文件为指定的分辨率：

```shell
# 设置给定视频文件的分辨率到 1280×720
ffmpeg -i input.mp4 -filter:v scale=1280:720 -c:a copy output.mp4
# 或 
ffmpeg -i input.mp4 -s 1280x720 -c:a copy output.mp4

# 转换上面的文件到 640×480 大小
ffmpeg -i input.mp4 -filter:v scale=640:480 -c:a copy output.mp4
# 或者，
ffmpeg -i input.mp4 -s 640x480 -c:a copy output.mp4
```

#### 修改采样率

```shell
# 修改音频采样率:
ffmpeg -i test.mp4 -ar 44100 output_44100hz.mp4
```

### 提取

#### 提取音、视频

**提取音频**

```shell
#提取音频
## 提取aac
ffmpeg -i input.mp4 -vn -c:a copy output.aac

## 保留编码格式： 
ffmpeg -i test.mp4 -acodec copy -vn test.aac强制格式： ffmpeg -i test.mp4 -acodec libmp3lame -vn test.mp3

## 提取PCM
ffmpeg -i buweishui.mp3 -ar 48000 -ac 2 -f s16le 48000_2_s16le.pcm
ffmpeg -i buweishui.mp3 -ar 48000 -ac 2 -sample_fmt s16 out_s16.wav
ffmpeg -i buweishui.mp3 -ar 48000 -ac 2 -codec:a pcm_s16le out2_s16le.wav
ffmpeg -i buweishui.mp3 -ar 48000 -ac 2 -f f32le 48000_2_f32le.pcm
ffmpeg -i test.mp4 -t 10 -vn -ar 48000 -ac 2 -f f32le 48000_2_f32le_2.pcm
```

**提取视频**

```shell
# 提取视频
ffmpeg -i test.mp4 -acodec copy -vn audio.mp4 
ffmpeg -i test.mp4 -vcodec copy -an video.mp4

## 保留编码格式： 
ffmpeg -i test.mp4 -vcodec copy -an test_copy.h264

## 强制格式： 
ffmpeg -i test.mp4 -vcodec libx264 -an test.h264

## 提取YUV
### 提取3秒数据，分辨率和源视频一致
ffmpeg -i test_1280x720.mp4 -t 3 -pix_fmt yuv420p yuv420p_orig.yuv
### 提取3秒数据，分辨率转为320x240
ffmpeg -i test_1280x720.mp4 -t 3 -pix_fmt yuv420p -s 320x240 yuv420p_320x240.yuv

## 提取RGB
### 提取3秒数据，分辨率转为320x240
ffmpeg -i test.mp4 -t 3 -pix_fmt rgb24 -s 320x240 rgb24_320x240.rgb

## RGB和YUV之间的转换
ffmpeg -s 320x240 -pix_fmt yuv420p -i yuv420p_320x240.yuv -pix_fmt rgb24 rgb24_320x240_2.rgb
```

### 转换视频文件到音频文件

转换一个视频文件到音频文件，只需具体指明输出格式，像 `.mp3`，或 `.ogg`，或其它任意音频格式。

```shell
# 转换 input.mp4 视频文件到 output.mp3 音频文件
ffmpeg -i input.mp4 -vn output.mp3
```

此外，你也可以对输出文件使用各种各样的音频转换编码选项：

```shell
ffmpeg -i input.mp4 -vn -ar 44100 -ac 2 -ab 320 -f mp3 output.mp3
```

- `-vn` 表明我们已经在输出文件中禁用视频录制。
- `-ar` 设置输出文件的音频频率。通常使用的值是`22050Hz`、`44100Hz`、`48000Hz`。
- `-ac` 设置音频通道的数目。
- `-ab` 表明音频比特率。
- `-f` 输出文件格式。在我们的实例中，它是`mp3`格式。

### 添加音轨

添加音轨（`muxing`）指的是，将外部音频加入视频，比如添加背景音乐或旁白。

```shell
ffmpeg \
-i input.aac -i input.mp4 \
output.mp4
# 上面例子中，有音频和视频两个输入文件，FFmpeg 会将它们合成为一个文件。
```

### 图片

#### 截图

```shell
# 从指定时间开始，连续对1秒钟的视频进行截图。
ffmpeg \
-y \
-i input.mp4 \
-ss 00:01:24 -t 00:00:01 \
output_%3d.jpg
```

如果只需要截一张图，可以指定只截取一帧。

```shell
ffmpeg \
-ss 01:23:45 \
-i input \
-vframes 1 -q:v 2 \
output.jpg
# 上面例子中，`-vframes 1`指定只截取一帧，`-q:v 2`表示输出的图片质量，一般是1到5之间（1 为质量最高）。
```

#### 从视频中提取图像

FFmpeg 的另一个有用的特色是我们可以从一个视频文件中轻松地提取图像。如果你想从一个视频文件中创建一个相册，这可能是非常有用的。

**截取一张图片**

```shell
# 截取一张图片
ffmpeg -i test.mp4 -y -f image2 -ss 00:00:02 -vframes 1 -s 640x360 test.jpg
ffmpeg -i test.mp4 -y -f image2 -ss 00:00:02 -vframes 1 -s 640x360 test.bmp
# -i 输入
# -y 覆盖
# -f 格式
# image2 一种格式
# -ss 起始值
# -vframes 帧 如果大于1 那么 输出加%03d test%03d.jpg
# -s 格式大小size
```

**每帧截取一张图片**

```shell
ffmpeg -i input.mp4 -r 1 -f image2 image-%2d.png
```

- `-r` 设置帧速度。即，每秒提取帧到图像的数字。默认值是 25。
- `-f` 表示输出格式，即，在我们的实例中是图像。
- `image-%2d.png` 表明我们如何想命名提取的图像。在这个实例中，命名应该像这样 `image-01.png`、`image-02.png`、`image-03.png` 等等开始。如果你使用 `%3d`，那么图像的命名像 `image-001.png`、`image-002.png` 等等开始。

**从视频中生成GIF图片**

```shell
# 从视频中生成GIF图片
ffmpeg -i test.mp4 -t 5 -r 1 image1.gif
ffmpeg -i test.mp4 -t 5 -r 25 -s 640x360 image2.gif

# 将 GIF 转化为 视频
ffmpeg -f gif -i image2.gif image2.mp4
```

### 裁剪 cutting

#### 指定时间裁剪

截取原始视频里面的一个片段，输出为一个新视频。可以指定开始时间（`start`）和持续时间（`duration`），也可以指定结束时间（`end`）。
**格式：**

```shell
ffmpeg -ss [start] -i [input] -t [duration] -c copy [output]
ffmpeg -ss [start] -i [input] -to [end] -c copy [output]
# 以秒具体说明时间。此外，以 `hh.mm.ss` 格式具体说明时间也是可以的
```

- `–s` – 表示视频剪辑的开始时间。
- `-t` – 表示总的持续时间。

**示例1：**

```shell
ffmpeg -ss 00:01:50 -i [input] -t 10.5 -c copy [output]
ffmpeg -ss 2.5 -i [input] -to 10 -c copy [output]
# 上面例子中，-c copy表示不改变音频和视频的编码格式，直接拷贝，这样会快很多。
```

#### 指定位置裁剪

**格式：**

```shell
ffmpeg -i input.mp4 -filter:v "crop=w:h:x:y" output.mp4
```

- `input.mp4` – 源视频文件。
- `-filter:v` – 表示视频过滤器。
- `crop` – 表示裁剪过滤器。
- `w` – 我们想自源视频中裁剪的矩形的宽度。
- `h` – 矩形的高度。
- `x` – 我们想自源视频中裁剪的矩形的 x 坐标 。
- `y` – 矩形的 y 坐标。

比如说你想要一个来自视频的位置 `(200,150)`，且具有 `640` 像素宽度和 `480` 像素高度的视频，命令应该是：

```shell
ffmpeg -i input.mp4 -filter:v "crop=640:480:200:150" output.mp4
```

### 图片转成视频

#### 为音频添加封面（一张图片）

有些视频网站只允许上传视频文件。如果要上传音频文件，必须为音频添加封面，将其转为视频，然后上传。

```shell
# 下面命令可以将音频文件，转为带封面的视频文件。
ffmpeg \
-loop 1 \
-i cover.jpg -i input.mp3 \
-c:v libx264 -c:a aac -b:a 192k -shortest \
output.mp4
# 上面命令中，有两个输入文件，一个是封面图片cover.jpg，另一个是音频文件input.mp3。-loop 1参数表示图片无限循环，-shortest参数表示音频文件结束，输出视频就结束。
```

#### 多张图片转视频

```shell
ffmpeg -f image2 -i 'in%6d.jpg' -vcodec libx264 -r 25 -b 200k test.mp4  
# -r 25 表示每秒播放25帧
# -b 200k 指定码率为200k
# 图片的文件名为"in000000.jpg"，从0开始依次递增。
```

### 压缩

#### 视频压缩

**示例1：**

```shell
ffmpeg -i 2020.mp4 -vcodec h264 -vf scale=640:-2 -threads 4 2020_conv.mp4

ffmpeg -i 1579251906.mp4 -strict -2 -vcodec h264 1579251906_output.mp4
```

- `-i 2020.mp4` 输入文件，源文件
- `2020_conv.mp4` 输出文件，目标文件
- `-vf scale=640:-2` 改变视频分辨率，缩放到640px 宽，高度的-2是考虑到 libx264要求高度是偶数，所以设置成-2，让软件自动计算得出一个接近等比例的偶数高
- `-threads 4` 4核运算

**示例2：**

```shell
ffmpeg -i input.mp4 -vf scale=1280:-1 -c:v libx264 -preset veryslow -crf 24 output.mp4
```

如果你尝试减小视频文件的大小，你将损失视频质量。如果 `24` 太有侵略性，你可以降低 `-crf` 值到或更低值。

也可以通过下面的选项来转换编码音频降低比特率，使其有立体声感，从而减小大小。

```shell
-ac 2 -c:a aac -strict -2 -b:a 128k
```

#### 音频压缩

**示例1：**

你有一个 `320kbps` 比特率的音频文件。你想通过更改比特率到任意较低的值来压缩它，像下面。

```shell
ffmpeg -i input.mp3 -ab 128 output.mp3
```

- `-ab` 标志压缩音频文件

各种各样可用的音频比特率列表是：

1. `96kbps`
2. `112kbps`
3. `128kbps`
4. `160kbps`
5. `192kbps`
6. `256kbps`
7. `320kbps`

#### 其他参数

```shell
-s 1280x720 
设置输出文件的分辨率，w*h。

-b:v 
输出文件的码率，一般500k左右即可，人眼看不到明显的闪烁，这个是与视频大小最直接相关的。

-preset
指定输出的视频质量，会影响文件的生成速度，有以下几个可用的值 ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow。
与 veryslow相比，placebo以极高的编码时间为代价，只换取了大概1%的视频质量提升。这是一种收益递减准则：slow 与 medium相比提升了5%~10%；slower 与 slow相比提升了5%；veryslow 与 slower相比提升了3%。
针对特定类型的源内容（比如电影、动画等），还可以使用-tune参数进行特别的优化。

-an
去除音频流。

-vn
去除视频流。

-c:a
指定音频编码器。

-c:v
指定视频编码器，libx264，libx265，H.262，H.264，H.265。
libx264：最流行的开源 H.264 编码器。
NVENC：基于 NVIDIA GPU 的 H.264 编码器。
libx265：开源的 HEVC 编码器。
libvpx：谷歌的 VP8 和 VP9 编码器。
libaom：AV1 编码器。

-vcodec copy
表示不重新编码，在格式未改变的情况采用。

-re 
以源文件固有帧率发送数据。

-minrate 964K -maxrate 3856K -bufsize 2000K 
指定码率最小为964K，最大为3856K，缓冲区大小为 2000K。

-y
不经过确认，输出时直接覆盖同名文件。

-crf
参数来控制转码，取值范围为 0~51，其中0为无损模式，18~28是一个合理的范围，数值越大，画质越差。
```

### 移除

#### 从一个视频文件移除音频流

示例：如果你不想要一个视频文件中的音频，使用 `-an` 标志。

```shell
ffmpeg -i input.mp4 -an output.mp4
# -an 表示没有音频录制
# 上面的命令会撤销所有音频相关的标志，因为我们不要来自 input.mp4 的音频
```

#### 从一个媒体文件移除视频流

如果你不想要视频流，你可以使用 `-vn` 标志从媒体文件中简单地移除它。`-vn` 代表没有视频录制。换句话说，这个命令转换所给定媒体文件为音频文件。
下面的命令将从所给定媒体文件中移除视频：

```shell
ffmpeg -i input.mp4 -vn output.mp3
```

你也可以使用 `-ab` 标志来指出输出文件的比特率，如下面的示例所示：

```shell
ffmpeg -i input.mp4 -vn -ab 320 output.mp3
```

### 视频拼接

#### 将4个视频拼接成一个很长的视频（无声音）

```shell
# 无声音
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex '[0:0][1:0] [2:0][3:0] concat=n=4:v=1 [v]' -map '[v]' output.mp4

# 有声音
ffmpeg -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex '[0:0][0:1] [1:0][1:1] [2:0][2:1] concat=n=3:v=1:a=1 [v][a]' -map '[v]' -map '[a]’  output.mp4
```

参数解释：

- `[0:0][0:1] [1:0][1:1] [2:0][2:1]` 分别表示第1个输入文件的视频、音频，第2个输入文件的视频、音频，第3个输入文件的视频、音频。
- `concat=n=3:v=1:a=1` 表示有3个输入文件，输出一条视频流和一条音频流。
- `[v][a]` 得到的视频流和音频流的名字，注意在 `bash` 等 `shell` 中需要用引号，防止通配符扩展。

#### 横向拼接2个视频

```shell
ffmpeg -i 0.mp4 -i 1.mp4 -filter_complex "[0:v]pad=iw*2:ih*1[a];[a][1:v]overlay=w" out.mp4
```

参数解释：

- `pad` 将合成的视频宽高，这里`iw`代表第1个视频的宽，`iw*2`代表合成后的视频宽度加倍，`ih`为第1个视频的高，合成的两个视频最好分辨率一致。
- `overlay` 覆盖，`[a][1:v]overlay=w`，后面代表是覆盖位置`w:0`。

#### 竖向拼接2个视频

```shell
ffmpeg -i 0.mp4 -i 1.mp4 -filter_complex "[0:v]pad=iw:ih*2[a];[a][1:v]overlay=0:h" out_2.mp4
```

#### 横向拼接3个视频

```shell
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -filter_complex "[0:v]pad=iw*3:ih*1[a];[a][1:v]overlay=w[b];[b][2:v]overlay=2.0*w" out_v3.mp4
```

#### 竖向拼接3个视频

```shell
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -filter_complex "[0:v]pad=iw:ih*3[a];[a][1:v]overlay=0:h[b];[b][2:v]overlay=0:2.0*h" out_v4.mp4
```

#### 4个视频2x2方式排列

```shell
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex "[0:v]pad=iw*2:ih*2[a];[a][1:v]overlay=w[b];[b][2:v]overlay=0:h[c];[c][3:v]overlay=w:h" out.mp4
```

#### 添加字幕到一个视频文件

可以使用 FFmpeg 来添加字幕到视频文件。为你的视频下载正确的字幕，并如下所示添加它到你的视频。

```shell
ffmpeg -i input.mp4 -i subtitle.srt -map 0 -map 1 -c copy -c:v libx264 -crf 23 -preset veryfast output.mp4
```

### 视频分割

#### 切分视频文件为多个部分

切分大的视频文件到多个较小的部分：

```shell
ffmpeg -i input.mp4 -t 00:00:30 -c copy part1.mp4 -ss 00:00:30 -codec copy part2.mp4
```

- `-t 00:00:30` 表示从视频的开始到视频的第 30 秒创建一部分视频。
- `-ss 00:00:30` 为视频的下一部分显示开始时间戳。它意味着第 2 部分将从第 30 秒开始，并将持续到原始视频文件的结尾。

#### 合并多个视频为一个

FFmpeg 也可以接合多个视频部分，并创建一个单个视频文件。

```shell
# 创建包含你想接合文件的准确的路径的 `join.txt`。所有的文件都应该是相同的格式（相同的编码格式）。所有文件的路径应该逐个列出，像下面。
file /home/sk/myvideos/part1.mp4
file /home/sk/myvideos/part2.mp4
file /home/sk/myvideos/part3.mp4
file /home/sk/myvideos/part4.mp4

# 接合所有文件，使用命令：
ffmpeg -f concat -i join.txt -c copy output.mp4
# 报错，添加 -safe 0 :
ffmpeg -f concat -safe 0 -i join.txt -c copy output.mp4
```

### 录制视频

### 视频帧操作

## ffmpeg filter 过滤器

### filter 的分类

按照处理数据的类型，通常多媒体的 filter 分为：

- 音频 filter
- 视频 filter
- 字幕 filter

另一种按照处于编解码器的位置划分：

- **prefilters**: used before encoding
- **intrafilters**: used while encoding (and are thus an integral part of a video codec)
- **postfilters**: used after decoding

FFmpeg 中 filter 分为：

- **source filter** （只有输出）
- **audio filter**
- **video filter**
- **Multimedia filter**
- **sink filter** （只有输入）

除了 `source` 和 `sink filter`，其他 `filter` 都至少有一个输入、至少一个输出

### 视频裁剪

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202406052324723.png)

**语法：**`crop=ow[:oh[:x[:y[:keep_aspect]]]]`

**描述：**
将输入视频帧的宽度和高度从 x 和 y 值表示的位置裁剪到指定的宽度和高度；x 和 y 是输出的左上角坐标，协调系统的中心是输入视频帧的左上角。如果使用了可选的 `keep_aspect` 参数，将会改变输出 `SAR` (样本宽比)以补偿新的 `DAR` (显示长宽比)

**变量：**

- `x, y` 对 x 的计算值(从左上角水平方向的像素个数)和 y(垂直像素的数量)，对每个帧进行评估， x

的默认值为`(iw - ow)/2`, y 的默认值为`(ih - oh)/2`

- `in_w, iw` 输入的高度
- `in_h, ih` 输入的高度
- `out_w, ow` 输出（裁剪）宽度，默认值为iw
- `out_h, oh` 输出（裁剪）高度，默认值ih
- `a` 纵横比，与 `iw/ih` 相同
- `sar` 输入样本的比例
- `dar` 输入显示宽比，等于表达式 `a*sar`
- `hsub, vsub` 水平和垂直的色度子样本值，对于像素格式 `yuv422p`，`hsub`的值为2，`vsub`为1
- `n` 输入帧的数目，从 0 开始
- `pos` 位置在输入框的文件中
- `t` 时间戳以秒表示

**示例**

```shell
ffmpeg -i input -vf crop=iw/3:ih:0:0 output
ffmpeg -i input -vf crop=iw/3:ih:iw/3:0 output
ffmpeg -i input -vf crop=iw/3:ih:iw/3*2:0 output

# 1、裁剪 100x100 的区域，起点为(12,34).
crop=100:100:12:34
# 相同效果: 
crop=w=100:h=100:x=12:y=34

# 2、裁剪中心区域，大小为 100x100
crop=100:100

# 3、裁剪中心区域，大小为输入视频的 2/3
crop=2/3*in_w:2/3*in_h

# 4、裁剪中心区域的正方形，高度为输入视频的高
crop=out_w=in_h
crop=in_h

# 5、裁剪偏移左上角 100 像素
crop=in_w-100:in_h-100:100:100

# 6、裁剪掉左右 10 像素，上下 20 像素
crop=in_w-2*10:in_h-2*20

# 7、裁剪右下角区域
crop=in_w/2:in_h/2:in_w/2:in_h/2
```

### FFmpeg 滤镜 Filter 内置变量

在使用 `Filter` 时，经常会用到根据时间轴进行操作的需求，在使用 `FFmpeg` 的 `Filter` 时可以使用 Filter`Filter` 的时间相关的内置变量，下面先来了解一下这些相关的变量

| 变量      | 说明                         |
| ------- | -------------------------- |
| **t**   | 以秒表示的时间戳，如果输入的时间是未知的则是 NAN |
| **n**   | 输入帧的顺序编号，从 0 开始            |
| **pos** | 输入帧的位置，如果未知的则是 NAN         |
| **w**   | 输入视频帧的宽度                   |
| **h**   | 输入视频帧的高度                   |

### 添加水印

#### 文字水印

在视频中增加文字水印需要准备的条件比较多，需要有文字字库处理的相关文件，在编译 `FFmpeg` 时需要支持 `FreeType`、`FontConfig`、`iconv`，系统中需要有相关的字库，在 FFmpeg 中增加纯字母水印可以使用 `drawtext` 滤镜进行支持，下面就来看一下 `drawtext` 的滤镜参数

| 参数           | 类型  | 说明                |
| ------------ | --- | ----------------- |
| **text**     | 字符串 | 文字                |
| **textfile** | 字符串 | 文字文件              |
| **box**      | 布尔  | 文字区域背景框(缺省 false) |
| **boxcolor** | 色彩  | 展示字体区域块的颜色        |
| **font**     | 字符串 | 字体名称（默认为 Sans 字体） |
| **fontsize** | 整数  | 显示字体的大小           |
| **x**        | 字符串 | 缺省为 0             |
| **y**        | 字符串 | 缺省为 0             |
| **alpha**    | 浮点数 | 透明度(默认为 1)，值从 0~1 |

#### 图片水印

## ffplay 命令

| **选项**   | **说明**       | **选项**     | **说明**              |
| -------- | ------------ | ---------- | ------------------- |
| `q, ESC` | 退出播放         | t          | 循环切换字幕流             |
| `f`      | 全屏切换         | c          | 循环切换节目              |
| `p, SPC` | 暂停           | w          | 循环切换过滤器或显示模式        |
| `m`      | 静音切换         | s          | 逐帧播放                |
| `9, 0`   | 9减少音量， 0增加音量 | left/right | 向后/向前拖动10秒          |
| `/, *`   | /减少音量， *增加音量 | down/up    | 向后/向前拖动1分钟          |
| `a`      | 循环切换音频流      | 鼠标右键单击     | 拖动与显示宽度对应百分比的文件进行播放 |
| `v`      | 循环切换视频流      | 鼠标左键双击     | 全屏切换                |

### ffplay 格式

```shell
ffplay [options] input_file
```

### ffplay 命令选项

- -x width 强制显示宽带。
- -y height 强制显示高度。
- -video_size size 帧尺寸设置显示帧存储(WxH 格式)，仅适用于类似

原始YUV等没有包含帧大小(WxH)的视频。
比如: ffplay -pixel_format yuv420p -video_size 320x240 -framerate 5 yuv420p_320x240.yuv
-pixel_format format 格式设置像素格式。

- fs 以全屏模式启动。
- -an 禁用音频（不播放声音）
- -vn 禁用视频（不播放视频）
- -sn 禁用字幕（不显示字幕）
- -ss pos 根据设置的秒进行定位拖动，注意时间单位：比如 `'55' 55 seconds, ' 12:03:45' ,12 hours, 03 minutes and 45 seconds, '23.189' 23.189` second
- -t duration 设置播放视频/音频长度，时间单位如 -ss 选项

### 播放

```shell
ffplay input.mp4/.mp3

#播放本地文件

ffplay -window_title "test time" -ss 2 -t 10 -autoexit test.mp4
ffplay buweishui.mp3

# 播放网络流

ffplay -window_title "rtmp stream" rtmp://202.69.69.180:443/webcast/bshdlive-pc

# 强制解码器
## mpeg4解码器： 
ffplay -vcodec mpeg4 test.mp4

## h264解码器： 
ffplay -vcodec h264 test.mp4

# 禁用音频或视频
## 禁用音频： 
ffplay test.mp4 -an

## 禁用视频： 
ffplay test.mp4 -vn

# 播放YUV数据

ffplay -pixel_format yuv420p -video_size 320x240 -framerate 5 yuv420p_320x240.yuv

# 播放RGB数据
ffplay -pixel_format rgb24 -video_size 320x240 -i rgb24_320x240.rgb

ffplay -pixel_format rgb24 -video_size 320x240 -framerate 5 -i rgb24_320x240.rgb

# 播放PCM数据

ffplay -ar 48000 -ac 2 -f f32le 48000_2_f32le.pcm -ar set audio sampling rate (in Hz) (from 0 to INT_MAX) (default 0) -ac set number of audio channels (from 0 to INT_MAX) (default 0)
```

### 简单过滤器

```shell
# 视频旋转
ffplay -i test.mp4 -vf transpose=1

# 视频反转
ffplay test.mp4 -vf hflip
ffplay test.mp4 -vf vflip

# 视频旋转和反转
ffplay test.mp4 -vf hflip,transpose=1

# 音频变速播放
ffplay -i test.mp4 -af atempo=2

# 视频变速播放
ffplay -i test.mp4 -vf setpts=PTS/2

# 音视频同时变速
ffplay -i test.mp4 -vf setpts=PTS/2 -af atempo=2
```

## ffprobe

格式：

```shell
ffprobe [OPTIONS] [INPUT_FILE]
```
