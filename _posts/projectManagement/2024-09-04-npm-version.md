---
layout: post
title: "[Npm] Npm package version Management"

subtitle: "프로젝트 package.json 버전을 관리해 보자"

date: 2024-09-04 10:35:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0904/git-tags.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - git
  - git tags
  - git push --tags
  - github
  - git-version
  - project management
  - package.json
  - package.json 버전관리
  - 프로젝트 버전 관리
  - 버전관리
---

> 프로젝트를 버전으로 관리하기로 하여 정리해봄  
> [ 《 npm-version docs 》](https://docs.npmjs.com/cli/v8/commands/npm-version)를 참고하여 작성함

## 버전 변경 방법

1. **수동 버전 변경**:

   - `package.json` 파일에서 `"version"` 필드를 찾아 현재 버전을 확인할 수 있다. 수동으로 이 숫자를 수정하여 버전을 변경할 수 있다.
   - 예를 들어 `"version": "1.0.0"`에서 `"version": "1.0.1"`로 변경하여 마이너 업데이트를 반영할 수 있다.

2. **npm version 명령어 사용**:

   - `npm version <update_type>` 명령어를 사용하여 자동으로 버전을 업데이트할 수 있다.
   - `<update_type>`에는 다음과 같은 옵션이 있다:
     - `patch`: 패치 버전을 올립니다. (예: 1.0.0 -> 1.0.1)
     - `minor`: 마이너 버전을 올립니다. (예: 1.0.0 -> 1.1.0)
     - `major`: 메이저 버전을 올립니다. (예: 1.0.0 -> 2.0.0)
   - 사전 릴리스 버전 관리 `<update_type> --preid=릴리즈문구`
     - `prepatch --preid=beta`: 패치 버전을 올립니다. (예: 1.0.0 -> 1.0.1-beta.0)
     - `prerelease`: 패치 버전을 올립니다. (예: 1.0.1-beta.0 -> 1.0.1-beta.1)
     - `preminor --preid=alpha`: 마이너 버전을 올립니다. (예: 1.0.0 -> 1.1.0-alpha.0)
     - `prerelease`: 패치 버전을 올립니다. (예: 1.0.0-alpha.0 -> 1.1.0-alpha.1)
     - `premajor`: `prepatch` `prerelease` 같이사용하면됨
   - 예를 들어 `npm version patch`를 실행하면 패치 버전이 자동으로 증가하고, `package.json` 파일이 업데이트됩니다.

3. **Git 태그와의 연동**:

   - `npm version` 명령어를 사용하면 자동으로 Git 태그가 생성됩니다. 이는 버전 관리 및 배포 과정에서 매우 유용합니다.
   - 예를 들어, `npm version minor`를 실행하면 `v1.1.0`과 같은 Git 태그가 생성됩니다.

4. **버전 커밋 및 푸시**:
   - `npm version` 명령어를 사용하면 변경 사항이 자동으로 커밋됩니다. 이후 `git push` 명령어를 사용하여 리포지토리에 푸시할 수 있다.
   - 태그도 함께 푸시하려면 `git push --tags` 명령어를 추가로 실행해야 합니다.

이 방법들을 통해 `package.json`의 버전을 효과적으로 관리할 수 있다.  
`git`연동도 할꺼고 수동으로관리하기는 힘드니깐 `npm version`사용하여 버전관리하기로 결정!

## 실습

```bash
#명령어
$ npm version -help

Bump a package version

Usage:
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

Options:
[--allow-same-version] [--no-commit-hooks] [--no-git-tag-version] [--json]
[--preid prerelease-id] [--sign-git-tag]
[-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
[-ws|--workspaces] [--no-workspaces-update] [--include-workspace-root]

alias: verison

Run "npm help version" for more info
```

```bash
# 버전확인 #
$ npm version

{
'POcodingWER-blog': '1.8.2',
npm: '10.8.1',
node: '20.16.0',
acorn: '8.11.3',
ada: '2.8.0',
ares: '1.32.2',
base64: '0.5.2',
brotli: '1.1.0',
cjs_module_lexer: '1.2.2',
cldr: '44.1',
icu: '74.2',
llhttp: '8.1.2',
modules: '115',
napi: '9',
nghttp2: '1.61.0',
openssl: '3.3.1',
simdutf: '5.2.8',
tz: '2023c',
undici: '6.19.2',
unicode: '15.1',
uv: '1.48.0',
uvwasi: '0.0.21',
v8: '11.3.244.8-node.23',
zlib: '1.2.12'
}
```

```bash
# 올려보기
$ npm version patch
v1.8.3
$ npm version minor
v1.9.0
$ npm version major
v2.0.0
```

```bash
# git tags
$ git push origin --tags

Enumerating objects: 18, done.
Counting objects: 100% (18/18), done.
Delta compression using up to 8 threads
Compressing objects: 100% (15/15), done.
Writing objects: 100% (15/15), 1.54 KiB | 1.54 MiB/s, done.
Total 15 (delta 9), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (9/9), completed with 3 local objects.
remote: This repository moved. Please use the new location:
remote:   https://github.com/POcodingWER/POcodingWER.github.io.git
To https://github.com/POcodingWER/POcodingWER_Blog.git
 * [new tag]         v1.8.3 -> v1.8.3
 * [new tag]         v1.9.0 -> v1.9.0
 * [new tag]         v2.0.0 -> v2.0.0
```

![](/img/post/2024/0904/git-tags.png)
깃 tags 연동까지 마무리했다.

## 마무리

정리하고 작업해보니 크게 어려움 없었고 버전관리를 더욱 잘할수 있는 자신감이 생긴듯
