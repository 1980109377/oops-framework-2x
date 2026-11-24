import { Enum } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { EventMessage } from '../common/event/EventMessage';
import { EventManager } from '../common/event/EventManager';
import { math } from 'cc';
import { view } from 'cc';
import { CCFloat } from 'cc';
import { Widget } from 'cc';
import { Vec4 } from 'cc';
import { UITransform } from 'cc';
import { TimeUtil } from './TimeUtils';
import { size } from 'cc';
const { ccclass, property } = _decorator;

enum adapterType {
    bottom = "bottom",
    visible = "visible",
    positonAndScale = "positonAndScale",
    scale = "scale",
}

enum dir {
    horizontal = "horizontal",
    vertical = "vertical",
}
Enum(adapterType)
Enum(dir)
@ccclass('screenAdapter')
export class screenAdapter extends Component {

    @property({ type: adapterType })
    adapterType: adapterType = adapterType.bottom;

    @property({ group: adapterType.bottom, type: CCFloat , visible: function () { return this.adapterType === adapterType.bottom; }})
    widgetBottom: number = 0; // 底部适配节点

    @property({ group: adapterType.visible, type: dir , visible: function () { return this.adapterType === adapterType.visible; }})
    direction: dir = dir.horizontal; // 可见区域适配节点


    @property({ group: adapterType.positonAndScale, type: Vec4 ,visible: function () { return this.adapterType === adapterType.positonAndScale; }})
    paddingVertical: Vec4 = new Vec4(-1, -1, -1, -1); // 左右上下

    @property({ group: adapterType.positonAndScale, type: Vec4 , visible: function () { return this.adapterType === adapterType.positonAndScale; }})
    paddingHorizontal: Vec4 = new Vec4(-1, -1, -1, -1); // 左右上下

    @property({ group: adapterType.positonAndScale, type: CCFloat , visible: function () { return this.adapterType === adapterType.positonAndScale; }})
    scaleVerticle: number = 1; // 可见区域适配节点缩放

    @property({ group: adapterType.positonAndScale, type: CCFloat , visible: function () { return this.adapterType === adapterType.positonAndScale; }})
    scaleHorizontal: number = 1; // 可见区域适配节点缩放


    @property({ group: adapterType.scale, type: CCFloat , visible: function () { return this.adapterType === adapterType.scale; }})
    verticalScale: number = 1; // 可见区域适配节点缩放
    @property({ group: adapterType.scale, type: CCFloat , visible: function () { return this.adapterType === adapterType.scale; }})
    horizontalScale: number = 1; // 可见区域适配节点缩放

    onLoad() {
        EventManager.on(EventMessage.GAME_ORIENTATION, this.onOrientationChange, this);
        this.scheduleOnce(() => {
            this.onOrientationChange();

        })
    }

    async onOrientationChange() {
        let designSize = math.size(750, 1334);
        let visibleSize = view.getVisibleSize();
        let ishorizontal = view.getViewportRect().width > view.getViewportRect().height;

        if (this.adapterType === adapterType.bottom) {
            if (visibleSize.height / visibleSize.width >= 1457 / 1000) { // 长屏
                const bottom = this.widgetBottom / designSize.height * visibleSize.height;
                this.node.getComponent(Widget).bottom = bottom;
            } else {
                const bottom = this.widgetBottom / designSize.width * visibleSize.height;
                console.log("bottom", bottom);
                this.node.getComponent(Widget).bottom = bottom;
            }
        } else if (this.adapterType === adapterType.visible) {

            this.node.active = ishorizontal ? this.direction === dir.horizontal : this.direction === dir.vertical;

        } else if (this.adapterType === adapterType.positonAndScale) {


            const scale = ishorizontal ? this.scaleHorizontal : this.scaleVerticle;
            this.node.setScale(scale, scale, scale);

            await TimeUtil.sleep(40);
            const padding = ishorizontal ? this.paddingHorizontal : this.paddingVertical;

            const originalsize = this.node.getComponent(UITransform).contentSize;
            const contentSize = math.size(originalsize.width * scale, originalsize.height * scale);
            const viewSize = view.getVisibleSize();
            const ishorizontalCenter = padding.x == -1 && padding.y == -1;
            const isverticalCenter = padding.z == -1 && padding.w == -1;

            const x = ishorizontalCenter ? (viewSize.width) / 2 : padding.y != -1 ? (viewSize.width - contentSize.width / 2) - padding.y : padding.x + contentSize.width / 2;
            const y = isverticalCenter ? viewSize.height / 2 : padding.w != -1 ? contentSize.height / 2 + padding.w : (viewSize.height - contentSize.height / 2) - padding.z;
            this.node.setWorldPosition(x, y, 0);


        } else if (this.adapterType === adapterType.scale) {
            const scale = ishorizontal ? this.horizontalScale : this.verticalScale;
            this.node.setScale(scale, scale, scale);
        }
    }

    update(deltaTime: number) {

    }
}


