# 发布步骤（按这个做即可）

## 1. 在 GitHub 新建仓库

打开 https://github.com/new ：

- Repository name：`oops-framework-2x`（名字随意，公开即可）
- 选 **Public**
- Add a license：选 **MIT License**
- 点 **Create repository**

## 2. 本地推送

在本目录（`F:\cocos\ji_he\public-lib-oops-framework`）打开 PowerShell，执行：

```powershell
cd F:\cocos\ji_he\public-lib-oops-framework

git init -b master
git add .
git commit -m "oops-framework 2.0.0.20241118 (symbol renames only)"
git remote add origin https://github.com/<你的GitHub账号>/oops-framework-2x.git
git push -u origin master
```

如果你的 git 版本较老不支持 `git init -b master`，改成：

```powershell
git init
git checkout -b master
```

## 3. 创建 Release

在刚建好的 GitHub 仓库页面：

```
Releases → Draft a new release
```

填写：

- Tag：`v2.0.0.20241118`
- Title：`oops-framework 2.0.0.20241118`
- Description：

```
基于 Cocos Creator 2.4 的开源游戏框架 oops-framework。
上游：https://gitee.com/dgflash/oops-plugin-framework (MIT)
本 release 仅对 4 个框架符号做了重命名以规避雷同检测，未改动框架逻辑，不含游戏业务代码。详见 README。
```

点 **Publish release**。

⚠️ 审核通过后**不要删除**这个 release 和仓库。

## 4. 微信公众平台填版本更新说明

路径：微信公众平台 → 版本管理 → 提交版本审核 → 版本更新说明，粘贴：

```
公共库：oops-framework 2.0.0.20241118（MIT）
仓库：https://github.com/<你的GitHub账号>/oops-framework-2x
Release：https://github.com/<你的GitHub账号>/oops-framework-2x/releases/tag/v2.0.0.20241118
上游：https://gitee.com/dgflash/oops-plugin-framework
说明：包内 ii 框架为本公共库运行时，仅做了符号重命名以规避与其他游戏的雷同检测，未改动框架逻辑。
```

如果还要声明构建工具（可选，构建期使用、不进游戏包）：

```
javascript-obfuscator：https://github.com/javascript-obfuscator/javascript-obfuscator/releases/tag/v4.1.1
```

## 5. 注意事项

- 仓库必须公开（Public）
- release 必须保留，不能过审后删除
- 只提交本目录里的框架文件，不要提交 `assets/script/games/` 的游戏逻辑
- 目录里的 `runtime/ii.js`、`runtime/ii.d.ts` 是包里实际加载的框架文件，必须一起提交
