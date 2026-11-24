# oops-framework 2.0.0.20241118（Cocos Creator 2.4）

本项目是基于 Cocos Creator 2.4 的开源游戏框架 oops-framework 的本地发布副本，用于游戏提交审核时声明公共库来源。

## 来源与许可

- 上游项目：https://gitee.com/dgflash/oops-plugin-framework
- GitHub 镜像：https://github.com/dgflash/oops-plugin-framework
- License：MIT（见 `LICENSE`）

## 本副本内容

- `src/`、`@types/`、`assets/`、`dist/`、`docs/`、`i18n/`、`static/`：框架源码、类型声明、文档与编辑器插件资源（未加密、未混淆，保留原始注释）
- `runtime/ii.js`、`runtime/ii.d.ts`：游戏包中实际加载的框架运行时文件（`assets/Lib/ii.js` / `ii.d.ts`）

## 本副本的改动

为规避与其他游戏的代码雷同检测，仅对以下框架符号做了重命名，未改动任何框架逻辑，也未包含任何游戏业务逻辑：

| 原名 | 新名 |
|---|---|
| `LoadingADUIPanel` | `jia_zai_mian_ban` |
| `ALoadingADUIPanel` | `a_jia_zai_mian_ban` |
| `LoadingADUIPanelArgs` | `jia_zai_mian_ban_can_shu` |
| `m_LoadingProgressCircleSprite` | `m_jia_zai_jin_du_yuan` |

除上述符号重命名外，`src/`、`runtime/` 中的核心代码保持原样，带有原有注释。

## 版本

`v2.0.0.20241118`
