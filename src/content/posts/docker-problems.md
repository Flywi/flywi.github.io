---
title: "最近使用docker碰到的一些问题记录下"
description: "最近在使用了下docker，期间遇到了不少问题，特别记录下： centos7使用systemctl报错问题 报Failed to get D-Bus connection: Operation not permitted错误 其实是权限问题 1.如果是docker命令的话加入docker run --privileged -d ...就行。 2.如果使用docker-compose.yml启动的"
pubDate: 2018-08-31
updatedDate: 2018-08-31T07:43:41.268Z
legacyPath: "/2018/08/31/docker-problems/"
tags: ["docker","centos"]
---

<p>最近在使用了下docker，期间遇到了不少问题，特别记录下：</p>
<h3 id="centos7使用systemctl报错问题">centos7使用<code>systemctl</code>报错问题</h3><blockquote>
<p>报<code>Failed to get D-Bus connection: Operation not permitted</code>错误</p>
</blockquote>
<p>其实是权限问题</p>
<p>1.如果是<code>docker</code>命令的话加入<code>docker run --privileged -d ...</code>就行。</p>
<p>2.如果使用<code>docker-compose.yml</code>启动的话在配置文件中加入
<figure class="highlight yaml"><table><tr><td class="gutter"><pre>1
2
3
4
</pre></td><td class="code"><pre>services:
  web:
   image: ...
   privileged: true
</pre></td></tr></table></figure>
<p>就可以了</p>
<h3 id="centos7使用systemctl配置nginx自启动">centos7使用<code>systemctl</code>配置nginx自启动</h3><p>这个在网上有各种不一样的版本，个人推荐个简单的。</p>
<p>1.首先使用<code>vim /lib/systemd/system/nginx.service</code>创建nginx.service 文件。</p>
<p>2.文件中写入
<figure class="highlight markdown"><table><tr><td class="gutter"><pre>1
2
3
4
5
6
7
8
9
10
11
12
13
</pre></td><td class="code"><pre>[Unit]
Description=nginx 
After=network.target 
   
[Service] 
Type=forking 
ExecStart=/usr/local/nginx/sbin/nginx -c &lt;nginx配置文件地址,这里可以不填&gt;
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true 
   
[Install] 
WantedBy=multi-user.target
</pre></td></tr></table></figure>
<p>上面的<code>/usr/local/nginx/sbin/nginx</code>改成自己的nginx地址就行，保存退出。</p>
<p>3.使用<code>systemctl enable nginx.service</code>把nginx加入开机启动服务就ok了。</p>
<blockquote>
<p>再次使用<code>systemctl</code>可以看到nginx.service加入到启动列表中</p>
</blockquote>
