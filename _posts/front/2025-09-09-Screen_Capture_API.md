---
layout: post
title: "[FRONT] 알고있으면 너무 좋은 프론트엔드 웹 기술 Screen Capture API"

subtitle: "화면 캡처 및 녹화를 위한 웹 표준 API"

date: 2025-09-09 08:31:20
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/09/web-api.webp"

#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - FRONT
tags:
  - Web API
  - Screen Capture API
  - getDisplayMedia
  - 화면녹화
  - 스트리밍
---

{% include post/front_contents.md %}

## 참고문서

- 📚 [MDN Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API) - 공식 웹 표준 문서
- 📖 [MDN Using Screen Capture](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture) - 사용법 가이드
- 🎥 [GIS DEVELOPER YOUTUBE](https://youtube.com/playlist?list=PLe6NQuuFBu7EgOm0n1l-qzn1hDBG5AW8_&si=uPucP6NMF9vq5K1s)

## Screen Capture API란?

**Screen Capture API**는 웹 애플리케이션이 사용자의 화면 또는 특정 창을 캡처하여 미디어 스트림으로 활용할 수 있게 해주는 웹 표준 API입니다. 이를 통해 화면 공유, 녹화, 스냅샷 촬영 등 다양한 기능을 구현할 수 있습니다.

### 핵심 장점

✅ **브라우저 내장**: 별도 플러그인이나 확장 프로그램 없이 순수 웹 기술로 화면 캡처 가능  
✅ **실시간 스트리밍**: 캡처된 화면을 실시간으로 스트리밍하거나 녹화 가능  
✅ **사용자 제어**: 사용자가 직접 캡처할 영역을 선택하고 제어 가능  
✅ **보안 강화**: 명시적인 사용자 동의와 브라우저 수준의 보안 기능 제공

### 주요 용도

- **화면 공유**: 온라인 회의, 원격 지원, 협업 도구
- **화면 녹화**: 교육 콘텐츠, 튜토리얼, 데모 영상 제작
- **스트리밍**: 라이브 방송, 게임 스트리밍
- **스크린샷**: 웹 페이지 또는 앱 화면 캡처

### Media Capture와의 관계

Screen Capture API는 기존의 **Media Capture and Streams API**를 확장한 것으로, `getUserMedia()`가 카메라와 마이크를 캡처하는 것과 달리 화면 콘텐츠를 캡처하는 데 특화되어 있습니다.

## 핵심 메서드: `getDisplayMedia()`

화면 캡처의 핵심은 `navigator.mediaDevices.getDisplayMedia()` 메서드입니다. 이 메서드는 사용자가 선택한 화면 영역을 포함하는 `MediaStream` 객체를 반환합니다.

### 기본 구문

```javascript
navigator.mediaDevices
  .getDisplayMedia(constraints)
  .then((stream) => {
    // 캡처된 스트림 활용
  })
  .catch((err) => {
    console.error("화면 캡처 실패:", err);
  });
```

### 제약 조건 (Constraints)

```javascript
const constraints = {
  video: {
    mediaSource: "screen", // 'screen', 'window', 'application'
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1080, max: 1080 },
    frameRate: { ideal: 30, max: 60 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};
```

## 기본 사용법

### 1. 간단한 화면 캡처 예제

```javascript
async function startScreenCapture() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    // 비디오 엘리먼트에 스트림 연결
    const videoElement = document.getElementById("preview");
    videoElement.srcObject = stream;

    console.log("화면 캡처 시작됨");
    return stream;
  } catch (error) {
    console.error("화면 캡처 실패:", error);
    throw error;
  }
}

// 캡처 중지
function stopScreenCapture(stream) {
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
    console.log(`${track.kind} 트랙 중지됨`);
  });
}
```

### 2. 화면 캡처 상태 감지

```javascript
async function captureWithStatusDetection() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    // 트랙 종료 이벤트 리스너
    stream.getVideoTracks()[0].addEventListener("ended", () => {
      console.log("사용자가 화면 공유를 중지했습니다");
      // UI 업데이트 또는 정리 작업
      handleCaptureStop();
    });

    return stream;
  } catch (error) {
    if (error.name === "NotAllowedError") {
      console.log("사용자가 화면 공유를 거부했습니다");
    } else if (error.name === "NotSupportedError") {
      console.log("브라우저가 Screen Capture API를 지원하지 않습니다");
    }
    throw error;
  }
}

function handleCaptureStop() {
  // 캡처 중지 시 실행할 로직
  document.getElementById("status").textContent = "화면 공유 중지됨";
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
}
```

## 실전 예제: 화면 녹화 앱

다음은 완전한 화면 녹화 애플리케이션 예제입니다:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>화면 녹화 앱</title>
    <style>
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .controls {
        margin: 20px 0;
      }
      button {
        margin: 5px;
        padding: 10px 20px;
        font-size: 16px;
      }
      #preview {
        width: 100%;
        max-width: 640px;
        height: auto;
        border: 2px solid #ddd;
        border-radius: 8px;
      }
      .status {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        background-color: #f0f0f0;
      }
      .recording {
        background-color: #ffebee;
        color: #c62828;
      }
      .capturing {
        background-color: #e8f5e8;
        color: #2e7d32;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Screen Capture & Recording App</h1>

      <div class="controls">
        <button id="startCapture">화면 캡처 시작</button>
        <button id="stopCapture" disabled>화면 캡처 중지</button>
        <button id="startRecord" disabled>녹화 시작</button>
        <button id="stopRecord" disabled>녹화 중지</button>
      </div>

      <div id="status" class="status">대기 중</div>

      <video id="preview" autoplay muted></video>

      <div id="downloads"></div>
    </div>

    <script>
      class ScreenRecorder {
        constructor() {
          this.captureStream = null;
          this.mediaRecorder = null;
          this.recordedChunks = [];
          this.isRecording = false;

          this.initializeElements();
          this.bindEvents();
        }

        initializeElements() {
          this.preview = document.getElementById("preview");
          this.status = document.getElementById("status");
          this.startCaptureBtn = document.getElementById("startCapture");
          this.stopCaptureBtn = document.getElementById("stopCapture");
          this.startRecordBtn = document.getElementById("startRecord");
          this.stopRecordBtn = document.getElementById("stopRecord");
          this.downloadsDiv = document.getElementById("downloads");
        }

        bindEvents() {
          this.startCaptureBtn.addEventListener("click", () =>
            this.startCapture()
          );
          this.stopCaptureBtn.addEventListener("click", () =>
            this.stopCapture()
          );
          this.startRecordBtn.addEventListener("click", () =>
            this.startRecording()
          );
          this.stopRecordBtn.addEventListener("click", () =>
            this.stopRecording()
          );
        }

        async startCapture() {
          try {
            this.captureStream = await navigator.mediaDevices.getDisplayMedia({
              video: {
                mediaSource: "screen",
                width: { ideal: 1920, max: 1920 },
                height: { ideal: 1080, max: 1080 },
                frameRate: { ideal: 30 },
              },
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
              },
            });

            this.preview.srcObject = this.captureStream;
            this.updateStatus("화면 캡처 중", "capturing");
            this.updateButtonStates(false, true, true, false);

            // 트랙 종료 이벤트 리스너
            this.captureStream
              .getVideoTracks()[0]
              .addEventListener("ended", () => {
                this.handleStreamEnded();
              });
          } catch (error) {
            this.handleError("화면 캡처 실패", error);
          }
        }

        stopCapture() {
          if (this.captureStream) {
            this.captureStream.getTracks().forEach((track) => track.stop());
            this.preview.srcObject = null;
            this.captureStream = null;
          }

          if (this.isRecording) {
            this.stopRecording();
          }

          this.updateStatus("대기 중");
          this.updateButtonStates(true, false, false, false);
        }

        async startRecording() {
          if (!this.captureStream) return;

          try {
            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(this.captureStream, {
              mimeType: "video/webm;codecs=vp8,opus",
            });

            this.mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
              }
            };

            this.mediaRecorder.onstop = () => {
              this.createDownloadLink();
            };

            this.mediaRecorder.start(1000); // 1초마다 데이터 수집
            this.isRecording = true;
            this.updateStatus("녹화 중", "recording");
            this.updateButtonStates(false, true, false, true);
          } catch (error) {
            this.handleError("녹화 시작 실패", error);
          }
        }

        stopRecording() {
          if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.updateStatus("화면 캡처 중", "capturing");
            this.updateButtonStates(false, true, true, false);
          }
        }

        createDownloadLink() {
          const blob = new Blob(this.recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

          const downloadDiv = document.createElement("div");
          downloadDiv.innerHTML = `
                    <p>녹화 완료! (${(blob.size / 1024 / 1024).toFixed(
                      2
                    )} MB)</p>
                    <a href="${url}" download="screen-recording-${timestamp}.webm" 
                       style="display: inline-block; padding: 10px 20px; 
                              background-color: #4CAF50; color: white; 
                              text-decoration: none; border-radius: 4px; margin: 5px;">
                        📥 다운로드
                    </a>
                    <button onclick="this.parentElement.remove()" 
                            style="padding: 10px 20px; margin: 5px;">
                        삭제
                    </button>
                `;

          this.downloadsDiv.appendChild(downloadDiv);
        }

        handleStreamEnded() {
          this.captureStream = null;
          this.preview.srcObject = null;

          if (this.isRecording) {
            this.stopRecording();
          }

          this.updateStatus("사용자가 화면 공유를 중지했습니다");
          this.updateButtonStates(true, false, false, false);
        }

        handleError(message, error) {
          console.error(message, error);
          let errorMessage = message;

          if (error.name === "NotAllowedError") {
            errorMessage = "사용자가 화면 공유를 거부했습니다";
          } else if (error.name === "NotSupportedError") {
            errorMessage = "브라우저가 Screen Capture를 지원하지 않습니다";
          } else if (error.name === "NotFoundError") {
            errorMessage = "캡처할 수 있는 화면을 찾을 수 없습니다";
          }

          this.updateStatus(errorMessage);
          this.updateButtonStates(true, false, false, false);
        }

        updateStatus(message, className = "") {
          this.status.textContent = message;
          this.status.className = `status ${className}`;
        }

        updateButtonStates(start, stop, record, stopRecord) {
          this.startCaptureBtn.disabled = !start;
          this.stopCaptureBtn.disabled = !stop;
          this.startRecordBtn.disabled = !record;
          this.stopRecordBtn.disabled = !stopRecord;
        }
      }

      // 앱 초기화
      document.addEventListener("DOMContentLoaded", () => {
        // 브라우저 지원 확인
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getDisplayMedia
        ) {
          document.getElementById("status").textContent =
            "이 브라우저는 Screen Capture API를 지원하지 않습니다";
          return;
        }

        new ScreenRecorder();
      });
    </script>
  </body>
</html>
```

## 고급 활용 사례

### 1. 스크린샷 캡처 유틸리티

```javascript
class ScreenshotCapture {
  static async captureScreenshot() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      return new Promise((resolve) => {
        video.addEventListener("loadedmetadata", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0);

          // 스트림 중지
          stream.getTracks().forEach((track) => track.stop());

          // 이미지 데이터 반환
          canvas.toBlob(resolve, "image/png");
        });
      });
    } catch (error) {
      console.error("스크린샷 캡처 실패:", error);
      throw error;
    }
  }

  static downloadScreenshot(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `screenshot-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// 사용 예제
document
  .getElementById("screenshot-btn")
  .addEventListener("click", async () => {
    try {
      const screenshot = await ScreenshotCapture.captureScreenshot();
      ScreenshotCapture.downloadScreenshot(screenshot);
    } catch (error) {
      alert("스크린샷 캡처에 실패했습니다.");
    }
  });
```

### 2. 실시간 화면 공유 (WebRTC 연동)

```javascript
class ScreenSharingRTC {
  constructor() {
    this.localStream = null;
    this.peerConnection = null;
    this.socket = null; // WebSocket 연결
  }

  async startScreenShare() {
    try {
      // 화면 캡처 시작
      this.localStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });

      // WebRTC PeerConnection 설정
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // 로컬 스트림을 PeerConnection에 추가
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // ICE 후보 이벤트 처리
      this.peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
          this.sendSignal("ice-candidate", event.candidate);
        }
      });

      // Offer 생성 및 전송
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.sendSignal("offer", offer);

      // 스트림 종료 감지
      this.localStream.getVideoTracks()[0].addEventListener("ended", () => {
        this.stopScreenShare();
      });

      console.log("화면 공유 시작됨");
    } catch (error) {
      console.error("화면 공유 실패:", error);
      throw error;
    }
  }

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  async handleIceCandidate(candidate) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  stopScreenShare() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.sendSignal("screen-share-ended");
    console.log("화면 공유 종료됨");
  }

  sendSignal(type, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
    }
  }
}
```

### 3. 화면 최적화 캡처 클래스

```javascript
class OptimizedScreenCapture {
  constructor(options = {}) {
    this.options = {
      quality: options.quality || "high", // 'low', 'medium', 'high'
      frameRate: options.frameRate || 30,
      audioBitrate: options.audioBitrate || 128000,
      videoBitrate: options.videoBitrate || 2500000,
      ...options,
    };

    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }

  getConstraints() {
    const qualitySettings = {
      low: { width: 1280, height: 720, frameRate: 15 },
      medium: { width: 1920, height: 1080, frameRate: 24 },
      high: { width: 1920, height: 1080, frameRate: 30 },
    };

    const setting = qualitySettings[this.options.quality];

    return {
      video: {
        mediaSource: "screen",
        width: { ideal: setting.width, max: setting.width },
        height: { ideal: setting.height, max: setting.height },
        frameRate: { ideal: setting.frameRate, max: setting.frameRate },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      },
    };
  }

  async startCapture() {
    try {
      const constraints = this.getConstraints();
      this.stream = await navigator.mediaDevices.getDisplayMedia(constraints);

      // 스트림 통계 모니터링
      this.monitorStreamStats();

      return this.stream;
    } catch (error) {
      console.error("최적화된 캡처 실패:", error);
      throw error;
    }
  }

  async startRecording() {
    if (!this.stream) {
      throw new Error("캡처 스트림이 없습니다");
    }

    // 최적화된 MediaRecorder 옵션
    const mimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=h264,opus",
      "video/webm",
    ];

    let selectedMimeType = null;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        break;
      }
    }

    if (!selectedMimeType) {
      throw new Error("지원되는 비디오 형식이 없습니다");
    }

    this.recorder = new MediaRecorder(this.stream, {
      mimeType: selectedMimeType,
      audioBitsPerSecond: this.options.audioBitrate,
      videoBitsPerSecond: this.options.videoBitrate,
    });

    this.chunks = [];

    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.recorder.onstop = () => {
      this.handleRecordingComplete();
    };

    this.recorder.start(1000); // 1초마다 데이터 청크 생성
    console.log(`녹화 시작 (${selectedMimeType})`);
  }

  stopRecording() {
    if (this.recorder && this.recorder.state === "recording") {
      this.recorder.stop();
    }
  }

  handleRecordingComplete() {
    const blob = new Blob(this.chunks, {
      type: this.recorder.mimeType,
    });

    const stats = {
      size: (blob.size / 1024 / 1024).toFixed(2) + " MB",
      duration: this.getRecordingDuration(),
      quality: this.options.quality,
      mimeType: this.recorder.mimeType,
    };

    console.log("녹화 완료:", stats);
    this.downloadRecording(blob, stats);
  }

  downloadRecording(blob, stats) {
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `screen-${this.options.quality}-${timestamp}.webm`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  monitorStreamStats() {
    if (!this.stream) return;

    setInterval(() => {
      const videoTrack = this.stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        console.log("스트림 상태:", {
          width: settings.width,
          height: settings.height,
          frameRate: settings.frameRate,
          deviceId: settings.deviceId,
        });
      }
    }, 5000);
  }

  getRecordingDuration() {
    // 녹화 시간 계산 로직
    return "계산 중...";
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.recorder) {
      this.recorder = null;
    }

    this.chunks = [];
  }
}
```

## 브라우저 호환성 및 보안

### 브라우저 지원 현황

Screen Capture API는 대부분의 최신 브라우저에서 지원됩니다:

#### ✅ 완전 지원

- **Chrome**: 72+ (2019년 1월)
- **Firefox**: 66+ (2019년 3월)
- **Edge**: 79+ (2020년 1월)
- **Safari**: 13+ (2019년 9월)

#### ⚠️ 제한적 지원

- **모바일 브라우저**: iOS Safari, Chrome Mobile에서 제한적
- **구형 브라우저**: Internet Explorer 미지원

### Feature Detection

```javascript
function checkScreenCaptureSupport() {
  const support = {
    getDisplayMedia: !!(
      navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
    ),
    mediaRecorder: !!window.MediaRecorder,
    webRTC: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
  };

  return {
    ...support,
    fullSupport: Object.values(support).every(Boolean),
  };
}

// 사용 예제
const support = checkScreenCaptureSupport();
console.log("브라우저 지원 현황:", support);

if (!support.getDisplayMedia) {
  alert("이 브라우저는 Screen Capture API를 지원하지 않습니다.");
} else if (!support.mediaRecorder) {
  alert("이 브라우저는 화면 녹화를 지원하지 않습니다.");
}
```

### 보안 고려사항

#### 1. 사용자 권한

```javascript
// 권한 상태 확인
async function checkPermissions() {
  try {
    const result = await navigator.permissions.query({
      name: "display-capture",
    });
    console.log("화면 캡처 권한 상태:", result.state);

    result.addEventListener("change", () => {
      console.log("권한 상태 변경:", result.state);
    });
  } catch (error) {
    console.log("권한 확인 불가:", error);
  }
}
```

#### 2. 보안 컨텍스트 요구사항

```javascript
// HTTPS 환경에서만 동작
if (location.protocol !== "https:" && location.hostname !== "localhost") {
  console.error("Screen Capture API는 HTTPS 환경에서만 사용 가능합니다.");
}
```

#### 3. 민감 정보 보호

```javascript
class SecureScreenCapture {
  constructor() {
    this.sensitivePatterns = [
      /password/i,
      /credit.?card/i,
      /ssn|social.?security/i,
    ];
  }

  async startSecureCapture() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false, // 오디오는 보안상 비활성화
      });

      // 민감 정보 감지 및 경고
      this.monitorSensitiveContent(stream);

      return stream;
    } catch (error) {
      console.error("보안 캡처 실패:", error);
      throw error;
    }
  }

  monitorSensitiveContent(stream) {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    setInterval(() => {
      // OCR 라이브러리를 사용하여 텍스트 추출 (예: Tesseract.js)
      // 실제 구현에서는 적절한 OCR 솔루션 사용
      this.detectSensitiveText(video);
    }, 5000);
  }

  detectSensitiveText(video) {
    // 실제 구현에서는 OCR 라이브러리 사용
    console.log("민감 정보 감지 모니터링 중...");
  }
}
```

## 성능 최적화 팁

### 1. 프레임률 최적화

```javascript
const optimizedConstraints = {
  video: {
    mediaSource: "screen",
    frameRate: { ideal: 15, max: 30 }, // 낮은 프레임률로 시작
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
  },
};
```

### 2. 메모리 관리

```javascript
class MemoryEfficientCapture {
  constructor() {
    this.chunks = [];
    this.maxChunks = 100; // 최대 청크 수 제한
  }

  handleDataAvailable(event) {
    if (event.data.size > 0) {
      this.chunks.push(event.data);

      // 메모리 사용량 제한
      if (this.chunks.length > this.maxChunks) {
        this.chunks.shift(); // 가장 오래된 청크 제거
      }
    }
  }

  cleanup() {
    this.chunks = [];
    if (global.gc) {
      global.gc(); // 가비지 컬렉션 강제 실행 (Node.js)
    }
  }
}
```

### 3. CPU 사용량 모니터링

```javascript
class PerformanceMonitor {
  constructor() {
    this.stats = {
      frameDrops: 0,
      cpuUsage: 0,
      memoryUsage: 0,
    };
  }

  startMonitoring(stream) {
    const videoTrack = stream.getVideoTracks()[0];

    setInterval(() => {
      // 브라우저 성능 API 사용
      const perfEntries = performance.getEntriesByType("measure");

      // 메모리 사용량 확인 (지원되는 브라우저에서)
      if (performance.memory) {
        this.stats.memoryUsage = performance.memory.usedJSHeapSize;
      }

      console.log("성능 통계:", this.stats);
    }, 10000);
  }
}
```

## 결론

Screen Capture API는 웹 애플리케이션에서 화면 캡처와 녹화 기능을 구현할 수 있는 강력한 도구입니다. 특히:

### 🎯 핵심 장점

- **표준화된 API**: 브라우저 간 일관된 인터페이스 제공
- **보안성**: 사용자 명시적 동의와 브라우저 수준 보안
- **유연성**: 다양한 용도로 활용 가능 (녹화, 스트리밍, 스크린샷)
- **성능**: 네이티브 수준의 최적화된 성능

### 🚀 활용 분야

- **원격 협업**: 화면 공유, 온라인 미팅, 원격 지원
- **교육**: 튜토리얼 제작, 온라인 강의, 데모 영상
- **콘텐츠 제작**: 스트리밍, 게임 방송, 프레젠테이션 녹화
- **개발 도구**: 버그 리포트, UI 테스트, 사용자 행동 분석

### ⚠️ 고려사항

- **브라우저 호환성**: 최신 브라우저에서만 완전 지원
- **보안 요구사항**: HTTPS 환경과 사용자 권한 필요
- **성능 최적화**: 메모리와 CPU 사용량 관리 중요
- **사용자 경험**: 직관적인 UI와 명확한 안내 필요

Screen Capture API는 웹 기술의 발전과 함께 더욱 강력해지고 있으며, 앞으로 웹 애플리케이션에서 멀티미디어 기능의 핵심 요소가 될 것으로 예상됩니다.
