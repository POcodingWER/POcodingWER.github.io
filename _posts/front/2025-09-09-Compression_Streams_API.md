---
layout: post
title: "[FRONT] 알고있으면 너무 좋은 프론트엔드 웹 기술 Compression Streams API"

subtitle: "텍스트 데이터에 대한 압축 및 해제"

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
  - CompressionStreams API
  - 압축
  - 웹표준API
  - 데이터압축
---

{% include post/front_contents.md %}

## 참고문서

- 📚 [MDN Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API) - 공식 웹 표준 문서
- 🎥 [GIS DEVELOPER YOUTUBE](https://youtube.com/playlist?list=PLe6NQuuFBu7EgOm0n1l-qzn1hDBG5AW8_&si=uPucP6NMF9vq5K1s) - 실습 영상
- 📖 [GIS DEVELOPER](http://www.gisdeveloper.co.kr/?p=16084) - 한글 설명 및 예제 코드
- 🔧 [WHATWG Compression Specification](https://compression.spec.whatwg.org/#compression-stream) - 기술 명세서

## Compression Streams API란?

**Compression Streams API**는 웹 표준 API로 **gzip** 또는 **deflate** 형식을 사용하여 데이터 스트림을 압축 및 해제하는 JavaScript API입니다. 파일 단위가 아닌 데이터에 대한 압축으로 그 목적이 zip과는 다르지만 데이터 압축에 대한 알고리즘은 유사합니다.

### 핵심 장점

✅ **내장 압축**: JavaScript 애플리케이션에 압축 라이브러리를 포함할 필요가 없어 애플리케이션 다운로드 크기가 작아집니다  
✅ **Web Workers 지원**: 별도 스레드에서 압축 작업을 수행할 수 있습니다  
✅ **스트림 기반**: 메모리 효율적인 스트림 방식으로 대용량 데이터 처리 가능

### 주요 인터페이스

Compression Streams API는 두 가지 핵심 인터페이스를 제공합니다:

1. **`CompressionStream`**: 데이터 스트림을 압축합니다
2. **`DecompressionStream`**: 데이터 스트림을 압축 해제합니다

### 지원하는 압축 형식

- **gzip**: 일반적으로 사용되는 압축 형식 (RFC 1952)
- **deflate**: zlib 압축 형식 (RFC 1951)

### ZIP과의 차이점

- **ZIP**: 여러개의 파일을 압축하면서 압축 해제시에는 파일명과 디렉토리 구조까지 복원
- **Compression Streams API**: 데이터에 대한 압축으로 압축을 해제하면 해제된 데이터가 나오며 그 데이터를 하나의 파일로 저장

### Response API와의 연동

Fetch API의 `Response`를 사용하여 스트림을 다음과 같은 형태로 변환할 수 있습니다:

- `ArrayBuffer`
- `Blob`
- `Uint8Array`
- `String`
- `JSON`

## 기본 사용법

### 1. 간단한 압축 예제

MDN에서 제공하는 가장 간단한 압축 예제입니다:

```javascript
// 입력 스트림을 gzip으로 압축
const compressedReadableStream = inputReadableStream.pipeThrough(
  new CompressionStream("gzip")
);
```

### 2. Blob 압축 해제 예제

다음은 Blob을 gzip으로 압축 해제하는 함수입니다:

```javascript
async function DecompressBlob(blob) {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}
```

## 텍스트 데이터 압축 및 해제 완전한 예제

다음은 텍스트에 대한 압축과 압축된 데이터를 다시 원래의 텍스트 데이터로 복원(압축 해제)하는 완전한 예제 코드입니다:

```javascript
async function compressAndDecompressString(text) {
  // 1. 텍스트를 Uint8Array로 변환
  const textEncoder = new TextEncoder();
  const encodedData = textEncoder.encode(text);

  console.log("원본 데이터:", text);
  console.log("원본 데이터 크기 (바이트):", encodedData.byteLength);

  // 2. 데이터를 압축 (gzip 형식)
  // ReadableStream.from()은 Node.js에서 사용 가능하며,
  // 브라우저에서는 ArrayBuffer를 직접 ReadableStream으로 변환해야 함.
  // 여기서는 편의를 위해 Blob을 사용하여 ReadableStream을 생성합니다.
  const originalStream = new Blob([encodedData]).stream();
  const compressedStream = originalStream.pipeThrough(
    new CompressionStream("gzip")
  );

  // 3. 압축된 데이터를 ArrayBuffer로 읽기
  const compressedResponse = new Response(compressedStream);
  const compressedBuffer = await compressedResponse.arrayBuffer();

  console.log("압축된 데이터 크기 (바이트):", compressedBuffer.byteLength);
  console.log(
    "압축률:",
    ((1 - compressedBuffer.byteLength / encodedData.byteLength) * 100).toFixed(
      2
    ) + "%"
  );

  // 4. 압축된 데이터를 압축 해제
  const decompressedStream = new Blob([compressedBuffer])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));

  // 5. 압축 해제된 데이터를 ArrayBuffer로 읽기
  const decompressedResponse = new Response(decompressedStream);
  const decompressedBuffer = await decompressedResponse.arrayBuffer();

  // 6. 압축 해제된 Uint8Array를 다시 텍스트로 변환
  const textDecoder = new TextDecoder();
  const decompressedText = textDecoder.decode(decompressedBuffer);

  console.log("압축 해제된 데이터:", decompressedText);
  console.log(
    "압축 해제된 데이터 크기 (바이트):",
    decompressedBuffer.byteLength
  );

  // 원본 데이터와 압축 해제된 데이터가 동일한지 확인
  console.log(
    "원본과 압축 해제된 데이터 일치 여부:",
    text === decompressedText
  );
}

// 예제 실행
const longText = `The quick brown fox jumps over the lazy dog.`;

compressAndDecompressString(longText);
```

## 코드 동작 과정 설명

### 1단계: 텍스트 인코딩

```javascript
const textEncoder = new TextEncoder();
const encodedData = textEncoder.encode(text);
```

- `TextEncoder`를 사용하여 텍스트를 UTF-8로 인코딩된 `Uint8Array`로 변환

### 2단계: 데이터 압축

```javascript
const originalStream = new Blob([encodedData]).stream();
const compressedStream = originalStream.pipeThrough(
  new CompressionStream("gzip")
);
```

- `Blob`을 사용해 `ReadableStream` 생성
- `CompressionStream`을 사용해 gzip 형식으로 압축

### 3단계: 압축된 데이터 읽기

```javascript
const compressedResponse = new Response(compressedStream);
const compressedBuffer = await compressedResponse.arrayBuffer();
```

- `Response` 객체를 통해 압축된 스트림을 `ArrayBuffer`로 변환

### 4단계: 데이터 압축 해제

```javascript
const decompressedStream = new Blob([compressedBuffer])
  .stream()
  .pipeThrough(new DecompressionStream("gzip"));
```

- `DecompressionStream`을 사용해 압축된 데이터를 해제

### 5-6단계: 텍스트 복원

```javascript
const textDecoder = new TextDecoder();
const decompressedText = textDecoder.decode(decompressedBuffer);
```

- `TextDecoder`를 사용해 바이트 데이터를 다시 텍스트로 변환

## deflate 형식 사용 예제

gzip 대신 deflate 형식을 사용하는 예제입니다:

```javascript
async function compressWithDeflate(text) {
  const textEncoder = new TextEncoder();
  const encodedData = textEncoder.encode(text);

  // deflate 형식으로 압축
  const originalStream = new Blob([encodedData]).stream();
  const compressedStream = originalStream.pipeThrough(
    new CompressionStream("deflate")
  );

  const compressedResponse = new Response(compressedStream);
  const compressedBuffer = await compressedResponse.arrayBuffer();

  console.log("deflate 압축 완료:", compressedBuffer.byteLength, "바이트");
  return compressedBuffer;
}

async function decompressWithDeflate(compressedBuffer) {
  // deflate 형식으로 압축 해제
  const decompressedStream = new Blob([compressedBuffer])
    .stream()
    .pipeThrough(new DecompressionStream("deflate"));

  const decompressedResponse = new Response(decompressedStream);
  const decompressedBuffer = await decompressedResponse.arrayBuffer();

  const textDecoder = new TextDecoder();
  return textDecoder.decode(decompressedBuffer);
}
```

## Web Workers에서의 사용

메인 스레드를 블록하지 않고 압축 작업을 수행할 수 있습니다:

```javascript
// worker.js
self.onmessage = async function (e) {
  const { data, action } = e.data;

  if (action === "compress") {
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(data);

    const originalStream = new Blob([encodedData]).stream();
    const compressedStream = originalStream.pipeThrough(
      new CompressionStream("gzip")
    );

    const compressedResponse = new Response(compressedStream);
    const compressedBuffer = await compressedResponse.arrayBuffer();

    self.postMessage({
      result: compressedBuffer,
      originalSize: encodedData.byteLength,
      compressedSize: compressedBuffer.byteLength,
    });
  }
};

// main.js
const worker = new Worker("worker.js");
worker.postMessage({ data: "Large text data...", action: "compress" });
worker.onmessage = function (e) {
  console.log("압축 완료:", e.data);
};
```

## 활용 사례

### 1. 대용량 텍스트 데이터 전송

- API 응답 데이터 압축
- 로그 데이터 압축
- JSON 데이터 압축

### 2. 클라이언트 사이드 데이터 저장

- localStorage에 저장할 데이터 압축
- IndexedDB 저장 데이터 압축

### 3. 실시간 데이터 처리

- WebSocket 통신 데이터 압축
- 스트리밍 데이터 압축

## 실제 프로젝트 적용 예시

### API 응답 압축 미들웨어

```javascript
class CompressionMiddleware {
  static async compressApiResponse(data) {
    const jsonString = JSON.stringify(data);
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(jsonString);

    if (encodedData.byteLength < 1024) {
      // 1KB 미만은 압축하지 않음
      return { compressed: false, data };
    }

    const originalStream = new Blob([encodedData]).stream();
    const compressedStream = originalStream.pipeThrough(
      new CompressionStream("gzip")
    );

    const compressedResponse = new Response(compressedStream);
    const compressedBuffer = await compressedResponse.arrayBuffer();

    return {
      compressed: true,
      data: compressedBuffer,
      originalSize: encodedData.byteLength,
      compressedSize: compressedBuffer.byteLength,
      ratio: (
        (1 - compressedBuffer.byteLength / encodedData.byteLength) *
        100
      ).toFixed(2),
    };
  }
}
```

### localStorage 압축 저장

```javascript
class CompressedStorage {
  static async setItem(key, data) {
    const jsonString = JSON.stringify(data);
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(jsonString);

    const originalStream = new Blob([encodedData]).stream();
    const compressedStream = originalStream.pipeThrough(
      new CompressionStream("gzip")
    );

    const compressedResponse = new Response(compressedStream);
    const compressedBuffer = await compressedResponse.arrayBuffer();

    // ArrayBuffer를 Base64로 인코딩하여 저장
    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(compressedBuffer))
    );
    localStorage.setItem(key, base64);
  }

  static async getItem(key) {
    const base64 = localStorage.getItem(key);
    if (!base64) return null;

    // Base64를 ArrayBuffer로 디코딩
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decompressedStream = new Blob([bytes])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));

    const decompressedResponse = new Response(decompressedStream);
    const decompressedBuffer = await decompressedResponse.arrayBuffer();

    const textDecoder = new TextDecoder();
    const jsonString = textDecoder.decode(decompressedBuffer);

    return JSON.parse(jsonString);
  }
}
```

## 브라우저 지원 현황 (2023년 기준)

MDN에 따르면 **Baseline 2023 (Newly available)** 상태로, 2023년 5월부터 최신 기기와 브라우저 버전에서 작동합니다:

### ✅ 지원 브라우저

- **Chrome**: 80+ (2020년 2월)
- **Firefox**: 113+ (2023년 5월)
- **Safari**: 16.4+ (2023년 3월)
- **Edge**: 80+ (2020년 2월)

### ⚠️ 주의사항

- 구형 기기나 브라우저에서는 작동하지 않을 수 있습니다
- 프로덕션 환경에서는 feature detection을 권장합니다

```javascript
// Feature Detection 예제
function isCompressionStreamsSupported() {
  return "CompressionStream" in window && "DecompressionStream" in window;
}

if (isCompressionStreamsSupported()) {
  // Compression Streams API 사용
  console.log("Compression Streams API 지원됨");
} else {
  // 폴백 방법 사용 (예: pako.js 라이브러리)
  console.log("Compression Streams API 미지원 - 폴백 사용");
}
```

## 성능 고려사항

### 압축 효율성

1. **최소 크기**: 1KB 이하의 데이터는 압축 오버헤드로 인해 오히려 커질 수 있음
2. **압축률**: 텍스트 데이터는 평균 60-80% 압축률 달성 가능
3. **처리 시간**: CPU 사용량과 압축 시간의 트레이드오프 고려 필요

### 메모리 사용량

```javascript
// 스트림 기반 처리로 메모리 효율성 확보
const processLargeFile = async (file) => {
  const stream = file.stream().pipeThrough(new CompressionStream("gzip"));

  // 청크별 처리로 메모리 사용량 최소화
  const reader = stream.getReader();
  const chunks = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return new Blob(chunks);
};
```

## 주의사항 및 제한사항

1. **환경별 차이점**

   - **Node.js**: `ReadableStream.from()` 직접 사용 가능
   - **브라우저**: `Blob`을 통해 `ReadableStream` 생성 필요

2. **압축 효율성**

   - 짧은 텍스트나 이미 압축된 데이터는 효과 제한적
   - 반복적인 패턴이 많은 데이터에서 높은 압축률

3. **비동기 처리**

   - 모든 압축/해제 작업은 비동기로 처리됨
   - 대용량 데이터 처리 시 적절한 에러 핸들링 필요

4. **에러 처리**

```javascript
async function safeCompress(data) {
  try {
    return await compressData(data);
  } catch (error) {
    console.error("압축 실패:", error);
    // 원본 데이터 반환 또는 다른 압축 방법 시도
    return { compressed: false, data };
  }
}
```

## 결론

Compression Streams API는 웹 환경에서 데이터 압축을 표준화된 방식으로 처리할 수 있는 강력한 도구입니다. 특히:

🎯 **핵심 장점**

- 별도 라이브러리 없이 내장 압축 기능 사용
- Web Workers 지원으로 메인 스레드 블록 방지
- 스트림 기반 처리로 메모리 효율성 확보
- gzip/deflate 표준 형식 지원

🚀 **활용 영역**

- 대용량 JSON 데이터 API 통신
- 클라이언트 사이드 데이터 저장 최적화
- 실시간 데이터 스트리밍
- 로그 데이터 압축 및 전송

2023년부터 주요 브라우저에서 안정적으로 지원되기 시작한 이 API는 앞으로 웹 개발에서 데이터 최적화의 핵심 도구가 될 것으로 예상됩니다.
