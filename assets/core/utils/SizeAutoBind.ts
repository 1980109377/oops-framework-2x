import { Size } from 'cc';
import { CCInteger } from 'cc';
import { Node, _decorator, Component, Enum, Sprite, UITransform } from 'cc';

import { EDITOR } from 'cc/env';
const { ccclass, property, executeInEditMode } = _decorator;

enum E_BindTarget {
    ALIGN_TO_WIDTH,
    ALIGN_TO_HEIGHT,
    ALIGN_TO_FIT,
    ALIGN_TO_LIMIT
}

// @ts-expect-error
const REAL_EDITOR = EDITOR && !cc.GAME_VIEW;

Enum(E_BindTarget);

@ccclass
@executeInEditMode
export class SizeAutoBind extends Component {
    isSetting = false;

    @property({ type: E_BindTarget })
    bindTarget = E_BindTarget.ALIGN_TO_WIDTH;


    @property(CCInteger)
    maxWidth: number = 0;

    private _size: Size = new Size(0, 0)

    protected onLoad(): void {
        const tr = this.getComponent(UITransform);
        if (tr) {
            // this._size = tr.contentSize;
            this._size.set(tr.width, tr.height)
        }
        this.adjustSize();
        this.node.on(Node.EventType.SIZE_CHANGED, this.adjustSize, this);
        this.node.on("sprite_frame_change", this.adjustSize, this);
    }


    adjustSize() {
        if (this.isSetting) {
            return;
        }
        this.isSetting = true;
        // console.log('调整');
        const nowSize = this.getComponent(UITransform);
        let originalSize = this.getComponent(Sprite)?.spriteFrame?.rect.size;
        if (!originalSize) {
            this.isSetting = false;
            return
        };
        if (this.bindTarget == E_BindTarget.ALIGN_TO_WIDTH) {
            // 计算缩放比例
            const scale = nowSize.width / originalSize.width;
            // 设置图片的高度，以使其适应宽度的变化
            nowSize.height = originalSize.height * scale;
        } else if (this.bindTarget == E_BindTarget.ALIGN_TO_FIT) {

            if (originalSize.height >= originalSize.width) {
                const scale2 = originalSize.width / originalSize.height;
                nowSize.width = nowSize.height * scale2;
            } else {
                // 计算缩放比例
                const scale3 = originalSize.width / originalSize.height;
                nowSize.height = nowSize.width / scale3;
            }

        } else if (this.bindTarget == E_BindTarget.ALIGN_TO_LIMIT) {
            let scale = nowSize.height / originalSize.height;
            let designWidth = originalSize.width * scale;

            if (designWidth > this.maxWidth) {
                
                nowSize.width = this.maxWidth;
                scale = this.maxWidth / originalSize.width;
                nowSize.height = originalSize.height * scale;
            }else{
                nowSize.width = originalSize.width * scale;
            }
        } else {
            // 计算缩放比例
            const scale = nowSize.height / originalSize.height;
            // 设置图片的高度，以使其适应宽度的变化
            nowSize.width = originalSize.width * scale;
        }
        this.isSetting = false;
        // if (REAL_EDITOR) this.onFocusInEditor();
    }
}
