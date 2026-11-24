import { Enum } from 'cc';
import { Vec3 } from 'cc';
import { CCInteger } from 'cc';
import { UIOpacity } from 'cc';
import { CCFloat } from 'cc';
import { Tween } from 'cc';
import { tween } from 'cc';
import { ccenum } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
enum AnimationType {
    scale,
    translate,
    Tip,
    GuideArrow,
    roomGuide,
    rotation,
    opacity
}
Enum(AnimationType);
@ccclass('anis')
export class anis extends Component {

    @property({ type: AnimationType })
    public animationType: AnimationType = AnimationType.scale; // 动画类型

    @property(Vec3)
    translateOffset: Vec3 = new Vec3(0, 0, 0); // 平移向量

    @property({ type: CCFloat })
    duration: number = 0.5

    onEnable() {
        switch (this.animationType) {
            case AnimationType.scale:
                this.playScale();
                break;
            case AnimationType.translate:
                this.playTranslate();
                break;
            case AnimationType.Tip:
                this.FullTTip();
                break;
            case AnimationType.GuideArrow:
                this.playGuideArrow();
                break;
            case AnimationType.roomGuide:
                this.playRoomGuide();
                break;
            case AnimationType.rotation:
                this.playRotation();
                break;
            case AnimationType.opacity:
                this.playOpacity();
                break;
        }
    }

    private playRotation() {
        tween(this.node)
            .by(1, { eulerAngles: new Vec3(0, 0, 360) })
            .repeatForever()
            .start();
    }

    private playOpacity() {
        const uiOpacity = this.node.getComponent(UIOpacity);
        if (uiOpacity) {
            tween(uiOpacity)
                .to(this.duration, { opacity: 0 })
                .to(this.duration, { opacity: 255 })
                .union()
                .repeatForever()
                .start();
        }
    }

    /**
     * 指引箭头上下浮动动画
     */
    private playGuideArrow() {
        const startPos = this.node.position.clone();
        const upPos = startPos.clone().add(new Vec3(0, 0, 30));
        tween(this.node)
            .to(0.6, { position: upPos })
            .to(0.6, { position: startPos })
            .union()
            .repeatForever()
            .start();
    }

    playRoomGuide() {
        const startPos = this.node.position.clone();
        const upPos = startPos.clone().add(new Vec3(0, 100, 0));
        tween(this.node)
            .to(0.6, { position: upPos })
            .to(0.6, { position: startPos })
            .union()
            .repeatForever()
            .start();
    }

    private playScale() {
        tween(this.node)
            .by(0.5, { scale: new Vec3(0.1, 0.15, 0.1) })
            .by(0.5, { scale: new Vec3(-0.1, -0.15, -0.1) })
            .union()
            .repeatForever()
            .start();
    }

    private playTranslate() {
        this.scheduleOnce(() => {
            const targetPos = this.node.position.clone().add(this.translateOffset.clone());
            const nowPos = this.node.position.clone();
            tween(this.node)
                .to(this.duration, { position: targetPos.clone() })
                .to(this.duration, { position: nowPos.clone() })
                .union()
                .repeatForever()
                .start();
        }, 0.5);
    }




    private FullTTip() {
        const startPos = this.node.position.clone();
        const endPos = startPos.clone().add(new Vec3(0, 80, 0));
        const uiOpacity = this.node.getComponent(UIOpacity);
        if (uiOpacity) uiOpacity.opacity = 255;
        tween(this.node)
            .to(this.duration, { position: endPos })
            .call(() => {
                this.node.destroy();
            })
            .start();
        if (uiOpacity) {
            tween(uiOpacity)
                .to(this.duration, { opacity: 0 })
                .start();
        }
    }

    protected onDisable(): void {
        Tween.stopAllByTarget(this.node);
    }
}


