---
title: cookies
date: 2020-05-08
tags:
    - http
    - cookie
    - cookies
---

之前讲Http是无状态的，服务器不会对Http请求有记忆性。在一些需要服务器记忆的场景，比如用户识别、登录状态保持方面，略有不足。

Cookies机制应运而生，浏览器发送请求后，服务器可在响应报文中设置Cookies字段，浏览器接收到后存储在Cookies的存储区中。在后续符合要求的请求中，会默认携带Cookies信息。

## Cookies字段
### Set-Cookie
服务器通过Set-Cookie字段设置Cookies，以name=value的形式。

还可设置Cookie的属性值，如
- domain（域名）、path（路径），只有请求符合域名和path时才会携带Cookies。
- Expires和max-age，都表示Cookies的过期时间，其中Expires是绝对时间，max-age为相对时间（即是一个时间长度，单位为ms，收到请求时间为起始时间，推算出绝对时间）。两者可以不一致，最终以max-age为准。
- HttpOnly关键字，表示此Cookie只能在Http请求中读取，其他获取方式无效（如document.cookie），可以提升隐私安全性。
- SameSite属性，可用于防御跨站点伪造攻击（XSRF）。决定在跳转到的第三方网站中发送的伪造请求是否携带Cookie信息。可选三个值：Lax（默认值）、Strict和None。为Lax时在跳转到的页面中发送Get、Head请求时可携带Cookies，为Strict时，不允许携带Cookies；为None时不做限制。
- Secure关键字，表示只在Https加密请求中携带Cookies。
## Cookie
浏览器收到响应报文中的`Set-Cookie`字段后，将cookies存储到专用的存储区。发送符合条件（域名、路径、过期时间等上述几个属性）的请求时，会携带Cookie。

Cookie中可有多个name-value字段，用分号隔开
## 实例
第一次请求该网站，还没有Cookies，服务器会在响应报文中设置Cookies。

![第一次请求报文](~@blogImg/cookies-req1.png)

![第一次响应报文](~@blogImg/cookies-res1.png)


第二次请求该网站，已有Cookies，响应报文中会携带Cookies。

![第二次请求报文](~@blogImg/cookies-req2.png)

![第二次响应报文](~@blogImg/cookies-res2.png)
## 用途
主要用于身份识别，从而进行登录状态保持、内容和广告的精准投放等事务。