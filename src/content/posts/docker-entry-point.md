---
title: "Dockerfile问题解决"
description: "在windows环境中使用Dockerfile编译自己的镜像时运行镜像会出现报错 standard_init_linux.go:190: exec user process caused \"no such file or directory\" 部分代码如下1234COPY docker-entrypoint.sh /usr/local/bin/RUN ln -s usr/l"
pubDate: 2019-03-21
updatedDate: 2019-03-21T03:42:17.866Z
legacyPath: "/2019/03/21/docker-entry-point/"
tags: ["docker"]
---

<p>在windows环境中使用<code>Dockerfile</code>编译自己的镜像时运行镜像会出现报错</p>
<blockquote>
<p><code>standard_init_linux.go:190: exec user process caused &quot;no such file or directory&quot;</code></p>
</blockquote>
<p>部分代码如下
<figure class="highlight dockerfile"><table><tr><td class="gutter"><pre>1
2
3
4
</pre></td><td class="code"><pre>COPY docker-entrypoint.sh /usr/local/bin/
RUN ln -s usr/local/bin/docker-entrypoint.sh /docker-entrypoint.sh
# ENTRYPOINT 
ENTRYPOINT ["/docker-entrypoint.sh"]
</pre></td></tr></table></figure>
<p>百度，谷歌查了一遍，才知道怎么回事。<br>具体<a href="href=https://forums.docker.com/t/standard-init-linux-go-175-exec-user-process-caused-no-such-file/20025/4">点击链接</a>。<br>简单点说就是window文件换行符为<code>\r\n</code>,linux为<code>\n</code>,拷贝到镜像里的<code>docker-entrypoint.sh</code>无法被识别为可执行文件，所以报错</p>
<p>解决方法</p>
<blockquote>
<p>1</p>
</blockquote>
<p><code>docker-entrypoint.sh</code>保存时候选择<code>LF</code>保存</p>
<blockquote>
<p>2</p>
</blockquote>
<p>使用<code>dos2unix</code></p>
<p>上述<code>Dockerfile</code>代码修改为:
<figure class="highlight dockerfile"><table><tr><td class="gutter"><pre>1
2
3
4
5
6
</pre></td><td class="code"><pre>COPY docker-entrypoint.sh /usr/local/bin/
RUN yum install -y dos2unix
RUN dos2unix /usr/local/bin/docker-entrypoint.sh
RUN ln -s /usr/local/bin/docker-entrypoint.sh /docker-entrypoint.sh
# ENTRYPOINT 
ENTRYPOINT ["/docker-entrypoint.sh"]
</pre></td></tr></table></figure>
