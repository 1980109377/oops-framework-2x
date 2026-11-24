import { Camera, Vec3, Quat } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('faceToCamera')
export class faceToCamera extends Component {

    @property({ type: Camera })
    camera: Camera = null;
    
    private _worldPos = new Vec3();
    private _cameraPos = new Vec3();
    private _quat = new Quat();

    start() {
        // 可选：初始化时做一些处理
        this.camera = this.node.scene.getComponentInChildren(Camera);
    }

   update(deltaTime: number) {
    if (!this.camera) return;
    // 直接设置为和相机旋转一致
    this.node.setWorldRotation(this.camera.node.getWorldRotation());
}
}