import { Node, tween, v3 } from 'cc';
import { BezierUtil } from './BezierUtil';
import { Vec3 } from 'cc';
import { TweenEasing } from 'cc';

export class AnimationUtils {
    static shake(node: Node, shakeIntensity: number = 15, shakeDuration: number = 0.05) {
        if (!node || !node.isValid) return;

        // 保存原始旋转
        const originalRotation = node.eulerAngles.clone();

        // 创建摇晃动画序列
        tween(node)
            .to(shakeDuration, { eulerAngles: v3(originalRotation.x, originalRotation.y, originalRotation.z + shakeIntensity) })
            .to(shakeDuration, { eulerAngles: v3(originalRotation.x, originalRotation.y, originalRotation.z - shakeIntensity) })
            .to(shakeDuration, { eulerAngles: v3(originalRotation.x, originalRotation.y, originalRotation.z + shakeIntensity) })
            .to(shakeDuration, { eulerAngles: v3(originalRotation.x, originalRotation.y, originalRotation.z - shakeIntensity) })
            .to(shakeDuration, { eulerAngles: originalRotation })
            .call(() => {

            })
            .start();
    }


    static berzierMove(node: Node, controlPoints: Vec3[], duration: number = 0.8, isWorld: boolean = true, easing: TweenEasing = 'smooth', followNode?: Node, followOffset?: Vec3, callback?: () => void): Promise<void> {
        return new Promise((resolve) => {
            BezierUtil.createCustomBezierMotion(
                node,
                controlPoints,
                duration,
                isWorld,
                easing,
                followNode,
                followOffset,
                () => {
                    resolve();
                    if (callback) {
                        callback();
                    }
                }
            )
        })
    }

    static berzierFollowNode() {

    }


    static promiseTween(target: any, duration: number, toProps: any, options: any = {}): Promise<void> {
        return new Promise((resolve) => {
            tween(target)
                .to(duration, toProps, options)
                .call(() => {
                    resolve();
                })
                .start();
        })
    }

    static scalePopTween(node: Node, baseScale: Vec3, popScale: number = 1.2, popDuration: number = 0.2, backDuration: number = 0.1): Promise<void> {
        return new Promise((resolve) => {
            tween(node)
                .set({ scale: v3(0, 0, 0) })
                .to(popDuration, { scale: v3(baseScale.x * popScale, baseScale.y * popScale, baseScale.z * popScale) }, { easing: 'smooth' })
                .to(backDuration, { scale: baseScale }, { easing: 'smooth' })
                .call(() => {
                    node.scale = baseScale;
                    resolve();
                })
                .start();
        })
    }
}