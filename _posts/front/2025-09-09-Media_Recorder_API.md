---
layout: post
title: "[FRONT] 알고있으면 너무 좋은 프론트엔드 웹 기술 Media Recorder API"

subtitle: "오디오 및 비디오 녹화를 위한 웹 표준 API"

date: 2025-09-09 08:35:20
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/09/web-api.png"

#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - FRONT
tags:
  - Web API
  - Media Recorder API
  - MediaRecorder
  - 오디오녹음
  - 비디오녹화
  - 미디어스트림
---

{% include post/front_contents.md %}

## 참고문서

- 📚 [MDN MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) - 공식 웹 표준 문서
- 📖 [MDN MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) - MediaRecorder 인터페이스 가이드
- 🎥 [GIS DEVELOPER YOUTUBE](https://youtube.com/playlist?list=PLe6NQuuFBu7EgOm0n1l-qzn1hDBG5AW8_&si=uPucP6NMF9vq5K1s) - 실습 영상

## Media Recorder API란?

**Media Recorder API**는 웹 애플리케이션에서 오디오와 비디오를 녹음하고 저장할 수 있게 해주는 강력한 웹 표준 API입니다. 이 API를 활용하면 사용자의 미디어 스트림을 캡처하여 다양한 형식으로 저장하거나 서버로 전송할 수 있습니다.

### 핵심 장점

✅ **실시간 녹화**: 오디오와 비디오를 실시간으로 녹화하고 처리  
✅ **다양한 포맷 지원**: WebM, MP4 등 다양한 미디어 형식 지원  
✅ **스트림 기반**: MediaStream과 완벽 호환  
✅ **이벤트 기반**: 녹화 과정을 세밀하게 제어 가능

### 주요 용도

- **음성 녹음**: 보이스 메모, 팟캐스트, 음성 피드백
- **화상 회의**: 회의 내용 녹화, 온라인 강의 제작
- **실시간 스트리밍**: 라이브 방송, 게임 스트리밍
- **콘텐츠 제작**: 동영상 편집, 튜토리얼 제작

### MediaStream과의 관계

Media Recorder API는 `getUserMedia()`, `getDisplayMedia()` 등으로 얻은 **MediaStream** 객체를 입력으로 받아 녹화 파일을 생성합니다.

```
getUserMedia() → MediaStream → MediaRecorder → Blob(녹화파일)
```

## 핵심 인터페이스: MediaRecorder

`MediaRecorder` 클래스는 미디어 녹화의 핵심으로, 다양한 메서드와 이벤트를 제공합니다.

### 기본 구문

```javascript
const mediaRecorder = new MediaRecorder(stream, options);
```

### 생성자 옵션

```javascript
const options = {
  mimeType: "video/webm;codecs=vp8,opus", // 출력 형식
  audioBitsPerSecond: 128000, // 오디오 비트레이트
  videoBitsPerSecond: 2500000, // 비디오 비트레이트
  bitsPerSecond: 2628000, // 전체 비트레이트
};

const mediaRecorder = new MediaRecorder(stream, options);
```

### 주요 메서드

```javascript
// 녹화 시작
mediaRecorder.start(timeslice); // timeslice: 데이터 청크 간격(ms)

// 녹화 중지
mediaRecorder.stop();

// 녹화 일시정지
mediaRecorder.pause();

// 녹화 재개
mediaRecorder.resume();

// 데이터 요청 (녹화 중에도 가능)
mediaRecorder.requestData();
```

### 주요 이벤트

```javascript
mediaRecorder.ondataavailable = function (event) {
  // 녹화 데이터가 준비될 때마다 호출
  console.log("데이터 크기:", event.data.size);
};

mediaRecorder.onstart = function () {
  console.log("녹화 시작됨");
};

mediaRecorder.onstop = function () {
  console.log("녹화 중지됨");
};

mediaRecorder.onpause = function () {
  console.log("녹화 일시정지됨");
};

mediaRecorder.onresume = function () {
  console.log("녹화 재개됨");
};

mediaRecorder.onerror = function (event) {
  console.error("녹화 오류:", event.error);
};
```

## 기본 사용법

### 1. 오디오 녹음 예제

```javascript
async function startAudioRecording() {
  try {
    // 마이크 권한 요청 및 스트림 획득
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // MediaRecorder 생성
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 128000,
    });

    const chunks = [];

    // 데이터 수집
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    // 녹음 완료 처리
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // 오디오 재생 또는 다운로드
      playAudio(audioUrl);
      downloadAudio(audioBlob);
    };

    // 녹음 시작
    mediaRecorder.start(1000); // 1초마다 데이터 청크 생성

    return { mediaRecorder, stream };
  } catch (error) {
    console.error("오디오 녹음 시작 실패:", error);
    throw error;
  }
}

function playAudio(audioUrl) {
  const audioElement = document.createElement("audio");
  audioElement.src = audioUrl;
  audioElement.controls = true;
  document.body.appendChild(audioElement);
}

function downloadAudio(audioBlob) {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `audio-${Date.now()}.webm`;
  link.click();
  URL.revokeObjectURL(url);
}
```

### 2. 비디오 녹화 예제

```javascript
async function startVideoRecording() {
  try {
    // 카메라와 마이크 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    // 비디오 미리보기
    const videoPreview = document.getElementById("preview");
    videoPreview.srcObject = stream;

    // MediaRecorder 생성
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8,opus",
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000,
    });

    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);

      // 녹화된 비디오 표시
      displayRecordedVideo(videoUrl);

      // 스트림 정리
      stream.getTracks().forEach((track) => track.stop());
      videoPreview.srcObject = null;
    };

    mediaRecorder.start();
    return mediaRecorder;
  } catch (error) {
    console.error("비디오 녹화 시작 실패:", error);
    throw error;
  }
}

function displayRecordedVideo(videoUrl) {
  const recordedVideo = document.createElement("video");
  recordedVideo.src = videoUrl;
  recordedVideo.controls = true;
  recordedVideo.style.width = "100%";
  recordedVideo.style.maxWidth = "640px";

  document.getElementById("recorded-videos").appendChild(recordedVideo);
}
```

### 3. 화면 + 오디오 녹화 예제

```javascript
async function startScreenWithAudioRecording() {
  try {
    // 화면 캡처 스트림
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: "screen",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: true, // 시스템 오디오
    });

    // 마이크 스트림
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    // 스트림 결합
    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...screenStream.getAudioTracks(), // 시스템 오디오
      ...micStream.getAudioTracks(), // 마이크 오디오
    ]);

    // MediaRecorder 생성
    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm;codecs=vp9,opus",
      videoBitsPerSecond: 5000000, // 화면 녹화는 높은 비트레이트
      audioBitsPerSecond: 128000,
    });

    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);

      // 다운로드 링크 생성
      createDownloadLink(videoBlob, "screen-recording");

      // 스트림 정리
      screenStream.getTracks().forEach((track) => track.stop());
      micStream.getTracks().forEach((track) => track.stop());
    };

    // 화면 공유 중지 감지
    screenStream.getVideoTracks()[0].addEventListener("ended", () => {
      mediaRecorder.stop();
    });

    mediaRecorder.start();
    return { mediaRecorder, screenStream, micStream };
  } catch (error) {
    console.error("화면 녹화 실패:", error);
    throw error;
  }
}

function createDownloadLink(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${Date.now()}.webm`;
  link.textContent = `📥 ${filename} 다운로드 (${(
    blob.size /
    1024 /
    1024
  ).toFixed(2)} MB)`;
  link.style.display = "block";
  link.style.margin = "10px 0";

  document.getElementById("downloads").appendChild(link);
}
```

## 실전 예제: 완전한 미디어 녹화 앱

다음은 모든 기능을 포함한 완전한 미디어 녹화 애플리케이션입니다:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Media Recorder 앱</title>
    <style>
      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        font-family: "Segoe UI", sans-serif;
      }

      .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }

      .control-group {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background: #f9f9f9;
      }

      .control-group h3 {
        margin-top: 0;
        color: #333;
      }

      button {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .primary {
        background-color: #007bff;
        color: white;
      }
      .primary:hover {
        background-color: #0056b3;
      }
      .primary:disabled {
        background-color: #6c757d;
      }

      .danger {
        background-color: #dc3545;
        color: white;
      }
      .danger:hover {
        background-color: #c82333;
      }

      .success {
        background-color: #28a745;
        color: white;
      }
      .success:hover {
        background-color: #218838;
      }

      .video-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 20px 0;
      }

      video {
        width: 100%;
        max-width: 100%;
        border: 2px solid #ddd;
        border-radius: 8px;
        background: #000;
      }

      .status {
        padding: 15px;
        margin: 15px 0;
        border-radius: 8px;
        font-weight: bold;
      }

      .status.recording {
        background-color: #ffebee;
        color: #c62828;
        border: 2px solid #ef5350;
      }

      .status.ready {
        background-color: #e8f5e8;
        color: #2e7d32;
        border: 2px solid #66bb6a;
      }

      .status.error {
        background-color: #fff3e0;
        color: #f57c00;
        border: 2px solid #ffb74d;
      }

      .recordings {
        margin-top: 30px;
      }

      .recording-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
      }

      .recording-info {
        flex-grow: 1;
      }

      .recording-actions {
        display: flex;
        gap: 10px;
      }

      .recording-actions button {
        width: auto;
        padding: 8px 16px;
        margin: 0;
      }

      .settings {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }

      .setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
      }

      select,
      input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 150px;
      }

      @media (max-width: 768px) {
        .video-container {
          grid-template-columns: 1fr;
        }
        .controls {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎬 Media Recorder API 데모</h1>

      <div class="settings">
        <h3>⚙️ 녹화 설정</h3>
        <div class="setting-row">
          <label>비디오 품질:</label>
          <select id="videoQuality">
            <option value="720p">720p (1280x720)</option>
            <option value="1080p" selected>1080p (1920x1080)</option>
            <option value="4k">4K (3840x2160)</option>
          </select>
        </div>
        <div class="setting-row">
          <label>오디오 비트레이트:</label>
          <select id="audioBitrate">
            <option value="64000">64 kbps</option>
            <option value="128000" selected>128 kbps</option>
            <option value="192000">192 kbps</option>
          </select>
        </div>
        <div class="setting-row">
          <label>비디오 비트레이트:</label>
          <select id="videoBitrate">
            <option value="1000000">1 Mbps</option>
            <option value="2500000" selected>2.5 Mbps</option>
            <option value="5000000">5 Mbps</option>
          </select>
        </div>
        <div class="setting-row">
          <label>출력 형식:</label>
          <select id="outputFormat">
            <option value="webm" selected>WebM</option>
            <option value="mp4">MP4 (브라우저 지원시)</option>
          </select>
        </div>
      </div>

      <div class="controls">
        <div class="control-group">
          <h3>🎤 오디오 녹음</h3>
          <button id="startAudio" class="primary">오디오 녹음 시작</button>
          <button id="pauseAudio" class="success" disabled>일시정지</button>
          <button id="stopAudio" class="danger" disabled>녹음 중지</button>
        </div>

        <div class="control-group">
          <h3>📹 비디오 녹화</h3>
          <button id="startVideo" class="primary">비디오 녹화 시작</button>
          <button id="pauseVideo" class="success" disabled>일시정지</button>
          <button id="stopVideo" class="danger" disabled>녹화 중지</button>
        </div>

        <div class="control-group">
          <h3>🖥️ 화면 녹화</h3>
          <button id="startScreen" class="primary">화면 녹화 시작</button>
          <button id="pauseScreen" class="success" disabled>일시정지</button>
          <button id="stopScreen" class="danger" disabled>녹화 중지</button>
        </div>

        <div class="control-group">
          <h3>🎮 고급 설정</h3>
          <button id="testFormats" class="primary">지원 형식 확인</button>
          <button id="clearAll" class="danger">모든 녹화 삭제</button>
          <button id="downloadAll" class="success">전체 다운로드</button>
        </div>
      </div>

      <div id="status" class="status ready">준비됨 - 녹화를 시작하세요</div>

      <div class="video-container">
        <div>
          <h3>📹 라이브 미리보기</h3>
          <video id="preview" autoplay muted playsinline></video>
        </div>
        <div>
          <h3>🎬 최근 녹화</h3>
          <video id="playback" controls playsinline></video>
        </div>
      </div>

      <div class="recordings">
        <h3>📂 녹화 파일들</h3>
        <div id="recordingsList"></div>
      </div>
    </div>

    <script>
      class MediaRecorderApp {
        constructor() {
          this.currentRecorder = null;
          this.currentStream = null;
          this.recordings = [];
          this.recordingId = 1;

          this.initializeElements();
          this.bindEvents();
          this.checkBrowserSupport();
        }

        initializeElements() {
          // UI 요소들
          this.preview = document.getElementById("preview");
          this.playback = document.getElementById("playback");
          this.status = document.getElementById("status");
          this.recordingsList = document.getElementById("recordingsList");

          // 설정 요소들
          this.videoQuality = document.getElementById("videoQuality");
          this.audioBitrate = document.getElementById("audioBitrate");
          this.videoBitrate = document.getElementById("videoBitrate");
          this.outputFormat = document.getElementById("outputFormat");

          // 버튼들
          this.buttons = {
            startAudio: document.getElementById("startAudio"),
            pauseAudio: document.getElementById("pauseAudio"),
            stopAudio: document.getElementById("stopAudio"),

            startVideo: document.getElementById("startVideo"),
            pauseVideo: document.getElementById("pauseVideo"),
            stopVideo: document.getElementById("stopVideo"),

            startScreen: document.getElementById("startScreen"),
            pauseScreen: document.getElementById("pauseScreen"),
            stopScreen: document.getElementById("stopScreen"),

            testFormats: document.getElementById("testFormats"),
            clearAll: document.getElementById("clearAll"),
            downloadAll: document.getElementById("downloadAll"),
          };
        }

        bindEvents() {
          // 오디오 녹음 이벤트
          this.buttons.startAudio.addEventListener("click", () =>
            this.startAudioRecording()
          );
          this.buttons.pauseAudio.addEventListener("click", () =>
            this.togglePause("audio")
          );
          this.buttons.stopAudio.addEventListener("click", () =>
            this.stopRecording("audio")
          );

          // 비디오 녹화 이벤트
          this.buttons.startVideo.addEventListener("click", () =>
            this.startVideoRecording()
          );
          this.buttons.pauseVideo.addEventListener("click", () =>
            this.togglePause("video")
          );
          this.buttons.stopVideo.addEventListener("click", () =>
            this.stopRecording("video")
          );

          // 화면 녹화 이벤트
          this.buttons.startScreen.addEventListener("click", () =>
            this.startScreenRecording()
          );
          this.buttons.pauseScreen.addEventListener("click", () =>
            this.togglePause("screen")
          );
          this.buttons.stopScreen.addEventListener("click", () =>
            this.stopRecording("screen")
          );

          // 기타 이벤트
          this.buttons.testFormats.addEventListener("click", () =>
            this.testSupportedFormats()
          );
          this.buttons.clearAll.addEventListener("click", () =>
            this.clearAllRecordings()
          );
          this.buttons.downloadAll.addEventListener("click", () =>
            this.downloadAllRecordings()
          );
        }

        checkBrowserSupport() {
          const support = {
            mediaRecorder: !!window.MediaRecorder,
            getUserMedia: !!(
              navigator.mediaDevices && navigator.mediaDevices.getUserMedia
            ),
            getDisplayMedia: !!(
              navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
            ),
          };

          if (!support.mediaRecorder) {
            this.updateStatus(
              "브라우저가 MediaRecorder API를 지원하지 않습니다",
              "error"
            );
            return false;
          }

          if (!support.getUserMedia) {
            this.updateStatus(
              "브라우저가 getUserMedia를 지원하지 않습니다",
              "error"
            );
            return false;
          }

          return true;
        }

        getQualitySettings() {
          const qualityMap = {
            "720p": { width: 1280, height: 720 },
            "1080p": { width: 1920, height: 1080 },
            "4k": { width: 3840, height: 2160 },
          };

          return qualityMap[this.videoQuality.value];
        }

        getRecorderOptions() {
          const format = this.outputFormat.value;
          const audioBitrate = parseInt(this.audioBitrate.value);
          const videoBitrate = parseInt(this.videoBitrate.value);

          const options = {
            audioBitsPerSecond: audioBitrate,
            videoBitsPerSecond: videoBitrate,
          };

          // MIME 타입 설정
          const mimeTypes =
            format === "webm"
              ? [
                  "video/webm;codecs=vp9,opus",
                  "video/webm;codecs=vp8,opus",
                  "video/webm",
                ]
              : ["video/mp4;codecs=h264,aac", "video/mp4"];

          for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
              options.mimeType = mimeType;
              break;
            }
          }

          return options;
        }

        async startAudioRecording() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 44100,
              },
            });

            this.startRecording(stream, "audio", "🎤 오디오 녹음");
          } catch (error) {
            this.handleError("오디오 녹음 시작 실패", error);
          }
        }

        async startVideoRecording() {
          try {
            const quality = this.getQualitySettings();
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: quality.width },
                height: { ideal: quality.height },
                frameRate: { ideal: 30 },
              },
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
              },
            });

            this.preview.srcObject = stream;
            this.startRecording(stream, "video", "📹 비디오 녹화");
          } catch (error) {
            this.handleError("비디오 녹화 시작 실패", error);
          }
        }

        async startScreenRecording() {
          try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
              video: {
                mediaSource: "screen",
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              },
              audio: true,
            });

            // 마이크 추가 (선택사항)
            try {
              const micStream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true },
              });

              const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...screenStream.getAudioTracks(),
                ...micStream.getAudioTracks(),
              ]);

              this.startRecording(combinedStream, "screen", "🖥️ 화면 녹화");
            } catch {
              // 마이크 없이 화면만 녹화
              this.startRecording(
                screenStream,
                "screen",
                "🖥️ 화면 녹화 (마이크 없음)"
              );
            }

            // 화면 공유 중지 감지
            screenStream.getVideoTracks()[0].addEventListener("ended", () => {
              this.stopRecording("screen");
            });
          } catch (error) {
            this.handleError("화면 녹화 시작 실패", error);
          }
        }

        startRecording(stream, type, title) {
          if (this.currentRecorder) {
            this.stopRecording();
          }

          const options = this.getRecorderOptions();
          this.currentRecorder = new MediaRecorder(stream, options);
          this.currentStream = stream;
          this.currentType = type;

          const chunks = [];
          const startTime = Date.now();

          this.currentRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };

          this.currentRecorder.onstop = () => {
            const blob = new Blob(chunks, {
              type: this.currentRecorder.mimeType,
            });

            const duration = Date.now() - startTime;
            this.addRecording(blob, title, duration, type);
            this.cleanupRecording();
          };

          this.currentRecorder.onerror = (event) => {
            this.handleError("녹화 중 오류 발생", event.error);
          };

          this.currentRecorder.start(1000);
          this.updateButtonStates(type, "recording");
          this.updateStatus(`${title} 중...`, "recording");
        }

        togglePause(type) {
          if (!this.currentRecorder) return;

          if (this.currentRecorder.state === "recording") {
            this.currentRecorder.pause();
            this.updateStatus("일시정지됨", "ready");
            this.buttons[
              `pause${type.charAt(0).toUpperCase() + type.slice(1)}`
            ].textContent = "계속";
          } else if (this.currentRecorder.state === "paused") {
            this.currentRecorder.resume();
            this.updateStatus("녹화 재개됨", "recording");
            this.buttons[
              `pause${type.charAt(0).toUpperCase() + type.slice(1)}`
            ].textContent = "일시정지";
          }
        }

        stopRecording(type) {
          if (
            this.currentRecorder &&
            this.currentRecorder.state !== "inactive"
          ) {
            this.currentRecorder.stop();
          }

          this.updateButtonStates(type, "stopped");
          this.updateStatus("녹화 완료", "ready");
        }

        cleanupRecording() {
          if (this.currentStream) {
            this.currentStream.getTracks().forEach((track) => track.stop());
            this.currentStream = null;
          }

          if (this.preview.srcObject) {
            this.preview.srcObject = null;
          }

          this.currentRecorder = null;
          this.updateButtonStates(this.currentType, "stopped");
        }

        addRecording(blob, title, duration, type) {
          const recording = {
            id: this.recordingId++,
            blob,
            title,
            duration,
            type,
            size: blob.size,
            timestamp: new Date(),
            url: URL.createObjectURL(blob),
          };

          this.recordings.push(recording);
          this.displayRecording(recording);

          // 최근 녹화를 재생 영역에 표시
          this.playback.src = recording.url;
        }

        displayRecording(recording) {
          const item = document.createElement("div");
          item.className = "recording-item";
          item.innerHTML = `
                    <div class="recording-info">
                        <strong>${recording.title}</strong><br>
                        <small>
                            ${this.formatDuration(recording.duration)} | 
                            ${this.formatFileSize(recording.size)} | 
                            ${recording.timestamp.toLocaleString()}
                        </small>
                    </div>
                    <div class="recording-actions">
                        <button class="primary" onclick="app.playRecording(${
                          recording.id
                        })">재생</button>
                        <button class="success" onclick="app.downloadRecording(${
                          recording.id
                        })">다운로드</button>
                        <button class="danger" onclick="app.deleteRecording(${
                          recording.id
                        })">삭제</button>
                    </div>
                `;

          this.recordingsList.appendChild(item);
        }

        playRecording(id) {
          const recording = this.recordings.find((r) => r.id === id);
          if (recording) {
            this.playback.src = recording.url;
            this.playback.play();
          }
        }

        downloadRecording(id) {
          const recording = this.recordings.find((r) => r.id === id);
          if (recording) {
            const link = document.createElement("a");
            link.href = recording.url;
            link.download = `${recording.title.replace(/[^a-zA-Z0-9]/g, "_")}_${
              recording.id
            }.webm`;
            link.click();
          }
        }

        deleteRecording(id) {
          const index = this.recordings.findIndex((r) => r.id === id);
          if (index !== -1) {
            const recording = this.recordings[index];
            URL.revokeObjectURL(recording.url);
            this.recordings.splice(index, 1);
            this.updateRecordingsList();
          }
        }

        clearAllRecordings() {
          if (confirm("모든 녹화를 삭제하시겠습니까?")) {
            this.recordings.forEach((recording) => {
              URL.revokeObjectURL(recording.url);
            });
            this.recordings = [];
            this.updateRecordingsList();
          }
        }

        downloadAllRecordings() {
          this.recordings.forEach((recording) => {
            this.downloadRecording(recording.id);
          });
        }

        testSupportedFormats() {
          const formats = [
            "video/webm",
            "video/webm;codecs=vp8,opus",
            "video/webm;codecs=vp9,opus",
            "video/mp4",
            "video/mp4;codecs=h264,aac",
            "audio/webm",
            "audio/webm;codecs=opus",
            "audio/ogg;codecs=opus",
          ];

          const supported = formats.filter((format) =>
            MediaRecorder.isTypeSupported(format)
          );

          alert(`지원되는 형식:\n${supported.join("\n")}`);
        }

        updateRecordingsList() {
          this.recordingsList.innerHTML = "";
          this.recordings.forEach((recording) => {
            this.displayRecording(recording);
          });
        }

        updateButtonStates(type, state) {
          const typeKey = type.charAt(0).toUpperCase() + type.slice(1);
          const startBtn = this.buttons[`start${typeKey}`];
          const pauseBtn = this.buttons[`pause${typeKey}`];
          const stopBtn = this.buttons[`stop${typeKey}`];

          if (state === "recording") {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            pauseBtn.textContent = "일시정지";
          } else if (state === "stopped") {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            pauseBtn.textContent = "일시정지";
          }
        }

        updateStatus(message, type = "ready") {
          this.status.textContent = message;
          this.status.className = `status ${type}`;
        }

        handleError(message, error) {
          console.error(message, error);
          this.updateStatus(`${message}: ${error.message || error}`, "error");
          this.cleanupRecording();
        }

        formatDuration(ms) {
          const seconds = Math.floor(ms / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);

          if (hours > 0) {
            return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${(
              seconds % 60
            )
              .toString()
              .padStart(2, "0")}`;
          } else {
            return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
          }
        }

        formatFileSize(bytes) {
          const units = ["B", "KB", "MB", "GB"];
          let size = bytes;
          let unitIndex = 0;

          while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
          }

          return `${size.toFixed(1)} ${units[unitIndex]}`;
        }
      }

      // 앱 초기화
      const app = new MediaRecorderApp();
    </script>
  </body>
</html>
```

## 고급 기능 및 활용 사례

### 1. 실시간 서버 전송

```javascript
class LiveStreamRecorder {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.socket = null;
    this.mediaRecorder = null;
  }

  async startLiveStream() {
    try {
      // WebSocket 연결
      this.socket = new WebSocket(this.serverUrl);

      // 미디어 스트림 획득
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      // MediaRecorder 설정
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 1000000,
      });

      // 실시간 데이터 전송
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(event.data);
        }
      };

      // 100ms마다 데이터 청크 생성 (실시간성 향상)
      this.mediaRecorder.start(100);

      console.log("라이브 스트리밍 시작됨");
    } catch (error) {
      console.error("라이브 스트림 시작 실패:", error);
    }
  }

  stopLiveStream() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }

    if (this.socket) {
      this.socket.close();
    }
  }
}
```

### 2. 음성 인식과 연동

```javascript
class VoiceRecognitionRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recognition = null;
    this.transcripts = [];
  }

  async startRecordingWithTranscription() {
    try {
      // 음성 인식 설정
      if ("webkitSpeechRecognition" in window) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "ko-KR";

        this.recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          this.transcripts.push({
            timestamp: Date.now(),
            text: transcript,
          });

          console.log("실시간 음성 인식:", transcript);
        };

        this.recognition.start();
      }

      // 오디오 녹음
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // 음성 인식 정확도 향상
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        this.createTranscriptedAudio(audioBlob);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error("음성 인식 녹음 실패:", error);
    }
  }

  createTranscriptedAudio(audioBlob) {
    // 오디오와 자막을 결합한 결과물 생성
    const result = {
      audio: audioBlob,
      transcripts: this.transcripts,
      duration:
        this.transcripts.length > 0
          ? this.transcripts[this.transcripts.length - 1].timestamp -
            this.transcripts[0].timestamp
          : 0,
    };

    this.downloadTranscriptedAudio(result);
  }

  downloadTranscriptedAudio(result) {
    // 오디오 파일 다운로드
    const audioUrl = URL.createObjectURL(result.audio);
    const audioLink = document.createElement("a");
    audioLink.href = audioUrl;
    audioLink.download = `audio-with-transcript-${Date.now()}.webm`;
    audioLink.click();

    // 자막 파일 다운로드 (SRT 형식)
    const srtContent = this.generateSRT(result.transcripts);
    const srtBlob = new Blob([srtContent], { type: "text/plain" });
    const srtUrl = URL.createObjectURL(srtBlob);
    const srtLink = document.createElement("a");
    srtLink.href = srtUrl;
    srtLink.download = `transcript-${Date.now()}.srt`;
    srtLink.click();

    URL.revokeObjectURL(audioUrl);
    URL.revokeObjectURL(srtUrl);
  }

  generateSRT(transcripts) {
    return transcripts
      .map((transcript, index) => {
        const startTime = this.formatSRTTime(transcript.timestamp);
        const endTime = this.formatSRTTime(
          transcript.timestamp + 3000 // 3초 지속
        );

        return `${index + 1}\n${startTime} --> ${endTime}\n${
          transcript.text
        }\n`;
      })
      .join("\n");
  }

  formatSRTTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    return `${hours}:${minutes}:${seconds},${milliseconds}`;
  }
}
```

### 3. 분할 녹화 및 자동 업로드

```javascript
class ChunkedRecorder {
  constructor(options = {}) {
    this.chunkDuration = options.chunkDuration || 60000; // 1분
    this.maxChunks = options.maxChunks || 10;
    this.uploadUrl = options.uploadUrl;
    this.chunks = [];
    this.currentRecorder = null;
    this.chunkIndex = 0;
  }

  async startChunkedRecording(stream) {
    this.currentRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8,opus",
    });

    const recordedChunks = [];

    this.currentRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    this.currentRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      await this.handleChunk(blob);

      // 다음 청크 녹화 시작 (스트림이 활성화되어 있다면)
      if (stream.active) {
        recordedChunks.length = 0;
        this.currentRecorder.start();

        // 지정된 시간 후 자동 중지
        setTimeout(() => {
          if (this.currentRecorder.state === "recording") {
            this.currentRecorder.stop();
          }
        }, this.chunkDuration);
      }
    };

    // 첫 번째 청크 시작
    this.currentRecorder.start();
    setTimeout(() => {
      if (this.currentRecorder.state === "recording") {
        this.currentRecorder.stop();
      }
    }, this.chunkDuration);
  }

  async handleChunk(blob) {
    const chunk = {
      id: this.chunkIndex++,
      blob,
      timestamp: Date.now(),
      size: blob.size,
    };

    // 로컬 저장
    this.chunks.push(chunk);

    // 최대 청크 수 관리
    if (this.chunks.length > this.maxChunks) {
      const oldChunk = this.chunks.shift();
      URL.revokeObjectURL(oldChunk.url);
    }

    // 자동 업로드
    if (this.uploadUrl) {
      await this.uploadChunk(chunk);
    }

    console.log(
      `청크 ${chunk.id} 처리 완료 (${this.formatFileSize(chunk.size)})`
    );
  }

  async uploadChunk(chunk) {
    try {
      const formData = new FormData();
      formData.append("chunk", chunk.blob, `chunk-${chunk.id}.webm`);
      formData.append("timestamp", chunk.timestamp.toString());
      formData.append("chunkId", chunk.id.toString());

      const response = await fetch(this.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(`청크 ${chunk.id} 업로드 성공`);
      } else {
        throw new Error(`업로드 실패: ${response.status}`);
      }
    } catch (error) {
      console.error(`청크 ${chunk.id} 업로드 실패:`, error);
      // 재시도 로직 구현 가능
    }
  }

  mergeChunks() {
    const mergedBlob = new Blob(
      this.chunks.map((chunk) => chunk.blob),
      { type: "video/webm" }
    );

    const url = URL.createObjectURL(mergedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `merged-recording-${Date.now()}.webm`;
    link.click();

    URL.revokeObjectURL(url);
  }

  formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}
```

## 브라우저 호환성 및 지원 현황

### 브라우저 지원 현황

Media Recorder API는 대부분의 최신 브라우저에서 지원됩니다:

#### ✅ 완전 지원

- **Chrome**: 47+ (2015년 12월)
- **Firefox**: 25+ (2013년 10월)
- **Edge**: 79+ (2020년 1월)
- **Safari**: 14.1+ (2021년 4월)
- **Opera**: 36+ (2016년 3월)

#### ⚠️ 제한적 지원

- **iOS Safari**: 14.5+ (일부 코덱 제한)
- **Samsung Internet**: 5.0+ (Android)

#### ❌ 미지원

- **Internet Explorer**: 모든 버전

### Feature Detection 및 폴백

```javascript
class MediaRecorderCompat {
  static checkSupport() {
    const support = {
      mediaRecorder: !!window.MediaRecorder,
      getUserMedia: !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      ),
      getDisplayMedia: !!(
        navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
      ),
      webRTC: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
    };

    return {
      ...support,
      fullSupport: Object.values(support).every(Boolean),
      recording: support.mediaRecorder && support.getUserMedia,
    };
  }

  static getSupportedMimeTypes() {
    const types = [
      // 비디오 형식
      "video/webm",
      "video/webm;codecs=vp8",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
      "video/mp4",
      "video/mp4;codecs=h264",
      "video/mp4;codecs=h264,aac",

      // 오디오 형식
      "audio/webm",
      "audio/webm;codecs=opus",
      "audio/ogg",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "audio/mp4;codecs=aac",
    ];

    return types.filter((type) => {
      try {
        return MediaRecorder.isTypeSupported(type);
      } catch {
        return false;
      }
    });
  }

  static getBestMimeType(preferVideo = true) {
    const videoTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4;codecs=h264,aac",
      "video/mp4",
    ];

    const audioTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4;codecs=aac",
    ];

    const types = preferVideo ? videoTypes : audioTypes;

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return null;
  }

  static createWithFallback(stream, preferredOptions = {}) {
    const mimeType = this.getBestMimeType(stream.getVideoTracks().length > 0);

    if (!mimeType) {
      throw new Error("지원되는 미디어 형식이 없습니다");
    }

    const options = {
      mimeType,
      ...preferredOptions,
    };

    try {
      return new MediaRecorder(stream, options);
    } catch (error) {
      // 옵션 없이 재시도
      console.warn("옵션 적용 실패, 기본 설정으로 재시도:", error);
      return new MediaRecorder(stream);
    }
  }
}

// 사용 예제
const support = MediaRecorderCompat.checkSupport();
console.log("브라우저 지원 현황:", support);

if (support.recording) {
  const supportedTypes = MediaRecorderCompat.getSupportedMimeTypes();
  console.log("지원되는 형식:", supportedTypes);

  // 스트림 획득 후
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const recorder = MediaRecorderCompat.createWithFallback(stream, {
    videoBitsPerSecond: 2500000,
    audioBitsPerSecond: 128000,
  });
} else {
  console.error("이 브라우저는 미디어 녹화를 지원하지 않습니다");
  // 대체 솔루션 제시
}
```

## 성능 최적화 및 모범 사례

### 1. 메모리 관리

```javascript
class MemoryEfficientRecorder {
  constructor() {
    this.maxMemoryMB = 100; // 최대 메모리 사용량 (MB)
    this.chunks = [];
    this.totalSize = 0;
  }

  addChunk(chunk) {
    this.chunks.push(chunk);
    this.totalSize += chunk.size;

    // 메모리 사용량 체크
    if (this.totalSize > this.maxMemoryMB * 1024 * 1024) {
      this.flushChunks();
    }
  }

  flushChunks() {
    // 청크들을 파일로 저장하고 메모리에서 제거
    const blob = new Blob(this.chunks, { type: "video/webm" });
    this.saveChunkToFile(blob);

    this.chunks = [];
    this.totalSize = 0;

    // 가비지 컬렉션 힌트
    if (window.gc) {
      window.gc();
    }
  }

  saveChunkToFile(blob) {
    // IndexedDB 또는 다른 저장소에 저장
    const timestamp = Date.now();
    console.log(`청크 저장됨: ${timestamp}, 크기: ${blob.size} bytes`);
  }
}
```

### 2. 품질 적응형 녹화

```javascript
class AdaptiveQualityRecorder {
  constructor() {
    this.qualityLevels = [
      { width: 3840, height: 2160, bitrate: 8000000, label: "4K" },
      { width: 1920, height: 1080, bitrate: 2500000, label: "1080p" },
      { width: 1280, height: 720, bitrate: 1000000, label: "720p" },
      { width: 854, height: 480, bitrate: 500000, label: "480p" },
    ];

    this.currentQuality = 1; // 1080p부터 시작
    this.performanceMonitor = new PerformanceMonitor();
  }

  async startAdaptiveRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: this.getCurrentConstraints(),
      audio: { echoCancellation: true },
    });

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8,opus",
      videoBitsPerSecond: this.qualityLevels[this.currentQuality].bitrate,
    });

    // 성능 모니터링 시작
    this.performanceMonitor.start();

    // 품질 조정 타이머
    setInterval(() => {
      this.adjustQuality();
    }, 5000);

    return recorder;
  }

  getCurrentConstraints() {
    const quality = this.qualityLevels[this.currentQuality];
    return {
      width: { ideal: quality.width },
      height: { ideal: quality.height },
      frameRate: { ideal: 30 },
    };
  }

  adjustQuality() {
    const performance = this.performanceMonitor.getMetrics();

    if (performance.cpuUsage > 80 || performance.memoryUsage > 80) {
      // 성능이 낮으면 품질 낮춤
      if (this.currentQuality < this.qualityLevels.length - 1) {
        this.currentQuality++;
        console.log(
          `품질 낮춤: ${this.qualityLevels[this.currentQuality].label}`
        );
      }
    } else if (performance.cpuUsage < 50 && performance.memoryUsage < 50) {
      // 성능이 좋으면 품질 높임
      if (this.currentQuality > 0) {
        this.currentQuality--;
        console.log(
          `품질 향상: ${this.qualityLevels[this.currentQuality].label}`
        );
      }
    }
  }
}

class PerformanceMonitor {
  start() {
    setInterval(() => {
      this.updateMetrics();
    }, 1000);
  }

  updateMetrics() {
    // CPU 사용량 추정 (frame drops 기반)
    this.cpuUsage = this.estimateCPUUsage();

    // 메모리 사용량
    if (performance.memory) {
      this.memoryUsage =
        (performance.memory.usedJSHeapSize /
          performance.memory.jsHeapSizeLimit) *
        100;
    }
  }

  estimateCPUUsage() {
    // requestAnimationFrame을 이용한 CPU 사용량 추정
    const start = performance.now();
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const duration = performance.now() - start;
        const cpuUsage = Math.min(100, duration * 6); // 16.67ms가 100%
        resolve(cpuUsage);
      });
    });
  }

  getMetrics() {
    return {
      cpuUsage: this.cpuUsage || 0,
      memoryUsage: this.memoryUsage || 0,
    };
  }
}
```

## 보안 및 권한 관리

### 1. 권한 체크 및 요청

```javascript
class PermissionManager {
  static async checkPermissions() {
    const permissions = {};

    try {
      // 카메라 권한
      const camera = await navigator.permissions.query({ name: "camera" });
      permissions.camera = camera.state;

      // 마이크 권한
      const microphone = await navigator.permissions.query({
        name: "microphone",
      });
      permissions.microphone = microphone.state;

      // 화면 캡처는 별도 처리 (permissions API 미지원)
      permissions.screen = "prompt"; // 항상 사용자 승인 필요
    } catch (error) {
      console.warn("권한 확인 실패:", error);
    }

    return permissions;
  }

  static async requestPermissions(needVideo = true, needAudio = true) {
    try {
      const constraints = {};

      if (needVideo) {
        constraints.video = { width: 640, height: 480 };
      }

      if (needAudio) {
        constraints.audio = true;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // 권한 확인 후 스트림 즉시 중지
      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (error) {
      console.error("권한 요청 실패:", error);
      return false;
    }
  }

  static getPermissionErrorMessage(error) {
    switch (error.name) {
      case "NotAllowedError":
        return "사용자가 미디어 접근을 거부했습니다.";
      case "NotFoundError":
        return "요청된 미디어 장치를 찾을 수 없습니다.";
      case "NotSupportedError":
        return "브라우저가 요청된 기능을 지원하지 않습니다.";
      case "OverconstrainedError":
        return "요청된 제약 조건을 만족할 수 없습니다.";
      case "SecurityError":
        return "보안상의 이유로 접근이 거부되었습니다.";
      default:
        return `알 수 없는 오류: ${error.message}`;
    }
  }
}
```

### 2. 보안 모범 사례

```javascript
class SecureRecorder {
  constructor() {
    this.isRecording = false;
    this.maxRecordingTime = 30 * 60 * 1000; // 30분 제한
    this.maxFileSize = 100 * 1024 * 1024; // 100MB 제한
  }

  async startSecureRecording(constraints) {
    // HTTPS 환경 체크
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      throw new Error("HTTPS 환경에서만 미디어 녹화가 가능합니다.");
    }

    // 중복 녹화 방지
    if (this.isRecording) {
      throw new Error("이미 녹화가 진행 중입니다.");
    }

    // 권한 체크
    const hasPermission = await PermissionManager.requestPermissions(
      !!constraints.video,
      !!constraints.audio
    );

    if (!hasPermission) {
      throw new Error("미디어 접근 권한이 필요합니다.");
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const recorder = new MediaRecorder(stream);

    let recordedSize = 0;
    const startTime = Date.now();

    recorder.ondataavailable = (event) => {
      recordedSize += event.data.size;

      // 파일 크기 제한 체크
      if (recordedSize > this.maxFileSize) {
        console.warn("최대 파일 크기 초과로 녹화 중지");
        recorder.stop();
        return;
      }

      // 녹화 시간 제한 체크
      if (Date.now() - startTime > this.maxRecordingTime) {
        console.warn("최대 녹화 시간 초과로 녹화 중지");
        recorder.stop();
        return;
      }
    };

    this.isRecording = true;

    recorder.onstop = () => {
      this.isRecording = false;
      stream.getTracks().forEach((track) => track.stop());
    };

    return recorder;
  }

  // 사용자 활동 감지로 자동 녹화 중지
  setupInactivityDetection(recorder, timeoutMs = 300000) {
    // 5분
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log("사용자 비활성으로 인한 자동 녹화 중지");
        recorder.stop();
      }, timeoutMs);
    };

    // 사용자 활동 이벤트 리스너
    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
      (event) => {
        document.addEventListener(event, resetTimer, { passive: true });
      }
    );

    resetTimer(); // 초기 타이머 설정
  }
}
```

## 결론

Media Recorder API는 웹 애플리케이션에서 강력한 미디어 녹화 기능을 제공하는 핵심 도구입니다. 특히:

### 🎯 핵심 장점

- **표준화된 인터페이스**: 크로스 브라우저 호환성과 일관된 API
- **실시간 처리**: 스트리밍과 실시간 데이터 처리 지원
- **유연한 설정**: 다양한 코덱과 품질 옵션 제공
- **이벤트 기반**: 세밀한 제어와 상태 관리 가능

### 🚀 활용 분야

- **교육 플랫폼**: 온라인 강의 녹화, 학습 콘텐츠 제작
- **커뮤니케이션**: 화상 회의, 음성 메시지, 피드백 수집
- **콘텐츠 제작**: 팟캐스트, 스트리밍, 튜토리얼 영상
- **업무 도구**: 회의 기록, 프레젠테이션 녹화, 원격 지원

### ⚠️ 고려사항

- **브라우저 호환성**: 구형 브라우저에서 제한적 지원
- **권한 관리**: 사용자 프라이버시와 보안 고려 필요
- **성능 최적화**: 메모리와 CPU 사용량 관리 중요
- **파일 크기**: 긴 녹화 시간과 고품질로 인한 대용량 파일 처리

Media Recorder API는 웹 기술의 발전과 함께 더욱 정교해지고 있으며, 앞으로 웹 애플리케이션에서 미디어 제작과 공유의 핵심 기술이 될 것으로 예상됩니다. 🎬🎙️
