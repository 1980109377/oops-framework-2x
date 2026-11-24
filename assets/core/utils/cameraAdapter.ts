import { view } from 'cc';
import { math } from 'cc';
import { ResolutionPolicy } from 'cc';
import { v3 } from 'cc';
import { Camera } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { EventManager } from 'db://oops-framework/core/common/event/EventManager';
import { EventMessage } from 'db://oops-framework/core/common/event/EventMessage';
import { tween } from 'cc';
import { cameraConfigs } from '../define';
const { ccclass, property } = _decorator;

@ccclass('cameraAdapter')
export class cameraAdapter extends Component {

static instance: cameraAdapter;

    public isHorizontal: boolean = true; // 是否横屏
    private _horizonCriticalPoint: number = 1042 / 810; // 横屏临界点
    private isInit: boolean = false;
    start() {
        cameraAdapter.instance = this;
        EventManager.on(EventMessage.GAME_ORIENTATION, this.onOrientationChange, this);
        this.scheduleOnce(() => {
            this.onOrientationChange();
        })

    }

    onOrientationChange() {
        let visibleSize = view.getVisibleSize()
        let designSize = math.size(720, 1280);

        if (visibleSize.height / visibleSize.width >= 1) { // 长屏
            view.setDesignResolutionSize(designSize.width, designSize.height, ResolutionPolicy.FIXED_WIDTH);
            this.isHorizontal = false;
        } else {
            view.setDesignResolutionSize(designSize.height, designSize.width, ResolutionPolicy.FIXED_HEIGHT);
            this.isHorizontal = true;
        }

        this.doAni(null);
        this.isInit = true;

        this.scheduleOnce(() => {
            EventManager.dispatchEvent(EventMessage.cameraAdapter, this.isHorizontal);
        })
    }


    BroadenPerspective(scale: number = 1.1) {
        cameraConfigs.horizontal.fov *= scale;
        cameraConfigs.vertical.fov *= scale;
        this.doAni(null , null , 0.7);
    }


    doAni(eventName: string, isInit: boolean = this.isInit , time:number = 0.3) {
        const cameraConfig = this.isHorizontal ? cameraConfigs.horizontal : cameraConfigs.vertical;

        const camera = this.node.getComponent(Camera);
        const duration = 0.3; // 动画持续时间
        if (cameraConfig) {
            tween(camera)
                .to(duration, { orthoHeight: cameraConfig.fov }, { easing: 'cubicOut' })
                .start();
            //     // 位置缓动
            //     tween(this.node)
            //         .to(duration, { position: cameraConfig.position }, { easing: 'cubicOut' })
            //         .start();

            //     // 旋转缓动
            //     tween(this.node)
            //         .to(duration, { eulerAngles: cameraConfig.rotation }, { easing: 'cubicOut' })
            //         .start();
            // }
        }
    }

}



