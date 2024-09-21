---
layout: post
title: "[Algorithm] Math - Fisher–Yates shuffle"

subtitle: "수학 Fisher–Yates 셔플"

date: 2024-09-21 12:10:12
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/algorithm.jpg"
multilingual: true
mathjax: true #수학쓸껀지?

# hidden: true

tags:
  - algorithm
  - 알고리즘
  - Math
  - 수학
  - Fisher–Yates shuffle
  - Fisher–Yates 셔플
---

<div class="ko post-container">
    {% capture about_ko %}{% include post/algorithms/2024-09-21/fisher-yates.ko.md %}{% endcapture %}
    {{ about_ko | markdownify }}
</div>
<div class="en post-container">
    {% capture about_en %}{% include post/algorithms/2024-09-21/fisher-yates.en.md %}{% endcapture %}
    {{ about_en | markdownify }}
</div>

{% if site.google_ads_open %}

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3587550545741227" crossorigin="anonymous"></script>

<ins class="adsbygoogle" style="display:block" data-ad-client="{{site.googl_ca_pub}}" data-ad-slot="4449058731"
  data-ad-format="auto" data-full-width-responsive="true"></ins>

<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

{% endif %}

{% if site.kakao_adfit_open %}
<ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-PCSCzPH4DUFDJxkc" data-ad-width="728"
  data-ad-height="90" />
{% endif %}
