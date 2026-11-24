/*
 * @Author: dgflash
 * @Date: 2025-06-12
 * @LastEditors: dgflash
 * @LastEditTime: 2025-06-12
 */

import { TweenEasing } from 'cc';
import { Node, Vec3, tween } from 'cc';

/** 
 * 贝塞尔曲线工具类
 * 
 * 使用示例：
 * 
 * // 1. 简单的抛物线运动
 * BezierUtil.createParabolicMotion(
 *     targetNode, 
 *     startPos, 
 *     endPos, 
 *     0.8,  // 持续时间
 *     2.0,  // 高度
 *     () => console.log("动画完成")
 * );
 * 
 * // 2. 快捷跳跃动画
 * BezierUtil.createJumpAnimation(node, targetPos, 1.5, 0.6);
 * 
 * // 3. 自定义贝塞尔曲线
 * const controlPoints = [startPos, controlPoint1, controlPoint2, endPos];
 * BezierUtil.createCustomBezierMotion(node, controlPoints, 1.0);
 * 
 * // 4. 获取曲线上的点（用于路径预览等）
 * const points = BezierUtil.getBezierCurvePoints([p0, p1, p2], 50);
 */
export class BezierUtil {

    /**
     * 创建抛物线运动动画
     * @param targetNode 目标节点
     * @param startPos 起始位置
     * @param endPos 结束位置
     * @param duration 动画持续时间（秒）
     * @param height 抛物线高度
     * @param onComplete 完成回调
     * @param onUpdate 更新回调（可选）
     */
    static createParabolicMotion(
        targetNode: Node,
        startPos: Vec3,
        endPos: Vec3,
        duration: number = 0.8,
        height: number = 2.0,
        isWorld: boolean = true,
        easing: TweenEasing = 'smooth',
        onComplete?: () => void,
        onUpdate?: (progress: number, currentPos: Vec3) => void
    ) {
        // 计算中间控制点（抛物线顶点）
        const midPos = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + height,
            (startPos.z + endPos.z) / 2
        );

        isWorld ? targetNode.setWorldPosition(startPos) : targetNode.setPosition(startPos);

        let _progress = { a: 0 };
        tween(_progress)
            .to(duration, { a: 1 }, {
                //@ts-ignore
                easing: easing,
                onUpdate: (t, r) => {
                    const progress = r

                    const currentPos = BezierUtil.quadraticBezier(startPos, midPos, endPos, progress);
                    isWorld ? targetNode.setWorldPosition(currentPos) : targetNode.setPosition(currentPos);

                    // 调用自定义更新回调
                    if (onUpdate) {
                        onUpdate(progress, currentPos);
                    }
                },
                onComplete: () => {
                    if (onComplete) {
                        onComplete();
                    }
                }
            })
            .start();
    }

    /**
     * 二次贝塞尔曲线计算
     * @param p0 起始点
     * @param p1 控制点
     * @param p2 结束点
     * @param t 插值参数 [0, 1]
     * @returns 插值后的位置
     */
    static quadraticBezier(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        const invT = 1 - t;
        return new Vec3(
            invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x,
            invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y,
            invT * invT * p0.z + 2 * invT * t * p1.z + t * t * p2.z
        );
    }

    /**
     * 三次贝塞尔曲线计算
     * @param p0 起始点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 结束点
     * @param t 插值参数 [0, 1]
     * @returns 插值后的位置
     */
    static cubicBezier(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
        const invT = 1 - t;
        const invT2 = invT * invT;
        const invT3 = invT2 * invT;
        const t2 = t * t;
        const t3 = t2 * t;

        return new Vec3(
            invT3 * p0.x + 3 * invT2 * t * p1.x + 3 * invT * t2 * p2.x + t3 * p3.x,
            invT3 * p0.y + 3 * invT2 * t * p1.y + 3 * invT * t2 * p2.y + t3 * p3.y,
            invT3 * p0.z + 3 * invT2 * t * p1.z + 3 * invT * t2 * p2.z + t3 * p3.z
        );
    }

    /**
     * 创建自定义贝塞尔曲线运动
     * @param targetNode 目标节点
     * @param controlPoints 控制点数组 [起始点, 控制点1, 控制点2, ..., 结束点]
     * @param duration 动画持续时间（秒）
     * @param onComplete 完成回调
     * @param onUpdate 更新回调（可选）
     */
    static createCustomBezierMotion(
        targetNode: Node,
        controlPoints: Vec3[],
        duration: number = 0.8,
        isWorld: boolean = true,
        easing: TweenEasing = 'smooth',
        followNode?: Node,
        followOffset?: Vec3,
        onComplete?: () => void,
        onUpdate?: (progress: number, currentPos: Vec3) => void
    ) {
        if (controlPoints.length < 2) {
            console.warn("贝塞尔曲线至少需要2个控制点");
            return;
        }

        // 设置初始位置
        isWorld ? targetNode.setWorldPosition(controlPoints[0]) : targetNode.setPosition(controlPoints[0]);

        let _progress = { a: 0 };
        tween(_progress)
            .to(duration, { a: 1 }, {
                easing: easing,
                onUpdate: (t, r) => {
                    const progress = r;

                    let currentPos: Vec3;

                    // 根据控制点数量选择不同的贝塞尔曲线
                    if (followNode) {
                        const followPos = followNode.getWorldPosition();
                        controlPoints[controlPoints.length - 1] = followPos.add(followOffset ? followOffset : Vec3.ZERO);
                    }
                    if (controlPoints.length === 2) {
                        // 线性插值
                        currentPos = Vec3.lerp(new Vec3(), controlPoints[0], controlPoints[1], progress);
                    } else if (controlPoints.length === 3) {
                        // 二次贝塞尔曲线
                        currentPos = BezierUtil.quadraticBezier(controlPoints[0], controlPoints[1], controlPoints[2], progress);
                    } else if (controlPoints.length === 4) {
                        // 三次贝塞尔曲线
                        currentPos = BezierUtil.cubicBezier(controlPoints[0], controlPoints[1], controlPoints[2], controlPoints[3], progress);
                    } else {
                        // 多点贝塞尔曲线（递归实现）
                        currentPos = BezierUtil.multiPointBezier(controlPoints, progress);
                    }
                    if (targetNode.isValid) {
                        isWorld ? targetNode?.setWorldPosition(currentPos) : targetNode?.setPosition(currentPos);
                    }


                    // 调用自定义更新回调
                    if (onUpdate) {
                        onUpdate(progress, currentPos);
                    }
                },
                onComplete: () => {
                    if (onComplete) {
                        onComplete();
                    }
                }
            })
            .start();
    }

    /**
     * 多点贝塞尔曲线计算（递归实现）
     * @param points 控制点数组
     * @param t 插值参数 [0, 1]
     * @returns 插值后的位置
     */
    static multiPointBezier(points: Vec3[], t: number): Vec3 {
        if (points.length === 1) {
            return points[0].clone();
        }

        const newPoints: Vec3[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            const lerped = Vec3.lerp(new Vec3(), points[i], points[i + 1], t);
            newPoints.push(lerped);
        }

        return BezierUtil.multiPointBezier(newPoints, t);
    }

    /**
     * 计算贝塞尔曲线上指定数量的点
     * @param controlPoints 控制点数组
     * @param segments 分段数量
     * @returns 曲线上的点数组
     */
    static getBezierCurvePoints(controlPoints: Vec3[], segments: number = 50): Vec3[] {
        const points: Vec3[] = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            let point: Vec3;

            if (controlPoints.length === 3) {
                point = BezierUtil.quadraticBezier(controlPoints[0], controlPoints[1], controlPoints[2], t);
            } else if (controlPoints.length === 4) {
                point = BezierUtil.cubicBezier(controlPoints[0], controlPoints[1], controlPoints[2], controlPoints[3], t);
            } else {
                point = BezierUtil.multiPointBezier(controlPoints, t);
            }
            points.push(point);
        }
        return points;
    }
}