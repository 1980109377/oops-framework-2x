import { Vec3 } from "cc";

/** 数学工具 */
export class MathUtil {
    /**
     * 角度转弧度
     */
    static deg2Rad: number = Math.PI / 180;

    /**
     * 弧度转角度
     */
    static rad2Deg: number = 180 / Math.PI;

    /**
     * 获得随机方向
     * @param x -1为左，1为右
     * @returns 
     */
    static sign(x: number) {
        if (x > 0) {
            return 1;
        }
        if (x < 0) {
            return -1;
        }
        return 0;
    }

    /**
     * 随时间变化进度值
     * @param start 初始值
     * @param end   结束值
     * @param t     时间
     */
    static progress(start: number, end: number, t: number) {
        return start + (end - start) * t;
    }

    /**
     * 插值
     * @param numStart 开始数值
     * @param numEnd   结束数值
     * @param t        时间
     */
    static lerp(numStart: number, numEnd: number, t: number): number {
        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0
        }

        return numStart * (1 - t) + (numEnd * t);
    }

    /**
     * 角度插值
     * @param current 当前角度
     * @param target  目标角度
     * @param t       时间
     */
    static lerpAngle(current: number, target: number, t: number): number {
        current %= 360;
        target %= 360;

        const dAngle: number = target - current;

        if (dAngle > 180) {
            target = current - (360 - dAngle);
        }
        else if (dAngle < -180) {
            target = current + (360 + dAngle);
        }

        return (MathUtil.lerp(current, target, t) % 360 + 360) % 360;
    }

    /**
     * 按一定的速度从一个角度转向令一个角度
     * @param current 当前角度
     * @param target  目标角度
     * @param speed   速度
     */
    static angleTowards(current: number, target: number, speed: number): number {
        current %= 360;
        target %= 360;

        const dAngle: number = target - current;

        if (dAngle > 180) {
            target = current - (360 - dAngle);
        }
        else if (dAngle < -180) {
            target = current + (360 + dAngle);
        }

        const dir = target - current;

        if (speed > Math.abs(dir)) {
            return target;
        }

        return ((current + speed * Math.sign(dir)) % 360 + 360) % 360;
    }

    /**
     * 获取方位内值，超过时获取对应边界值
     * @param value     值
     * @param minLimit  最小值
     * @param maxLimit  最大值
     */
    static clamp(value: number, minLimit: number, maxLimit: number) {
        if (value < minLimit) {
            return minLimit;
        }

        if (value > maxLimit) {
            return maxLimit;
        }

        return value;
    }

    /**
     * 获得一个值的概率
     * @param value 值
     */
    static probability(value: number) {
        return Math.random() < value;
    }


    /**
         * 使用三次贝塞尔曲线将一系列点转换为平滑曲线
         * @param points 输入点数组
         * @param resolution 每两个原始点之间生成的点数量（越高越平滑）
         * @param tension 控制曲线的张力，范围[0,1]，越大曲线越平滑
         * @returns 平滑曲线上的点数组
         */
    static createSmoothCurve3D(
        points: Vec3[],
        resolution: number = 20,
        tension: number = 0.5
    ): Vec3[] {
        if (points.length < 2) {
            return [...points];
        }

        const result: Vec3[] = [];
        result.push(points[0]); // 添加第一个点

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];

            // 计算控制点
            let cp1: Vec3, cp2: Vec3;

            if (i === 0) {
                // 第一段曲线的第一个控制点

                cp1 = new Vec3(
                    p1.x + (p2.x - p1.x) * tension,
                    p1.y + (p2.y - p1.y) * tension,
                    p1.z + (p2.z - p1.z) * tension
                );
            } else {
                const p0 = points[i - 1];

                cp1 = new Vec3(
                    p1.x + (p2.x - p0.x) * tension,
                    p1.y + (p2.y - p0.y) * tension,
                    p1.z + (p2.z - p0.z) * tension
                );
            }

            if (i === points.length - 2) {
                cp2 = new Vec3(
                    p2.x - (p2.x - p1.x) * tension,
                    p2.y - (p2.y - p1.y) * tension,
                    p2.z - (p2.z - p1.z) * tension
                );
            } else {
                const p3 = points[i + 2];
                cp2 = new Vec3(
                    p2.x - (p3.x - p1.x) * tension,
                    p2.y - (p3.y - p1.y) * tension,
                    p2.z - (p3.z - p1.z) * tension
                );
            }

            // 生成贝塞尔曲线点
            for (let j = 1; j <= resolution; j++) {
                const t = j / resolution;
                const point = MathUtil.cubicBezier3D(p1, cp1, cp2, p2, t);
                result.push(point);
            }
        }

        return result;
    }

    /**
     * 三次贝塞尔曲线插值
     */
    static cubicBezier3D(
        p1: Vec3,
        cp1: Vec3,
        cp2: Vec3,
        p2: Vec3,
        t: number
    ): Vec3 {
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;

        return new Vec3(
            mt3 * p1.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p2.x,
            mt3 * p1.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p2.y,
            mt3 * p1.z + 3 * mt2 * t * cp1.z + 3 * mt * t2 * cp2.z + t3 * p2.z
        );
    }

    /**
     * 对3D曲线进行重采样，使所有点之间的距离相等
     * @param points 原始3D曲线点数组
     * @param numSamples 可选参数，输出的点数量，默认与输入点数相同
     * @returns 等间距的3D点数组
     */
    static resampleCurveEquallySpaced(
        points: Vec3[],
        segmentLength: number = 1,
        numSamples?: number
    ): Vec3[] {
        if (points.length < 2) return [...points];

        const equallySpacedPoints: Vec3[] = [];
        let totalLength = 0;
        const distances: number[] = [0];

        for (let i = 1; i < points.length; i++) {
            const distance = Vec3.distance(points[i], points[i - 1]);
            totalLength += distance;
            distances.push(totalLength);
        }

        const numPoints = numSamples || points.length;

        equallySpacedPoints.push(points[0]);

        for (let i = 1; i < numPoints - 1; i++) {
            const targetDistance = i * segmentLength;

            let j = 0;
            while (j < distances.length - 1 && distances[j + 1] < targetDistance) {
                j++;
            }

            if (j < distances.length - 1) {
                const p0 = points[j];
                const p1 = points[j + 1];

                const segmentDistance = distances[j + 1] - distances[j];
                const t =
                    segmentDistance === 0
                        ? 0
                        : (targetDistance - distances[j]) / segmentDistance;

                const newPoint = new Vec3();
                Vec3.lerp(newPoint, p0, p1, t);
                equallySpacedPoints.push(newPoint);
            }
        }
        equallySpacedPoints.push(points[points.length - 1]);
        return equallySpacedPoints;
    }


    /**
     * 二次贝塞尔曲线计算
     * @param t 参数t，范围在0到1之间
     * @param p0 起始点
     * @param p1 控制点1
     * @param p3 结束点
     * @return 计算得到的点
     */
    static bezierQuadratic(t: number, p0: Vec3, p1: Vec3, p3: Vec3): Vec3 {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const p = new Vec3(
            uu * p0.x + 2 * u * t * p1.x + tt * p3.x,
            uu * p0.y + 2 * u * t * p1.y + tt * p3.y,
            uu * p0.z + 2 * u * t * p1.z + tt * p3.z
        );
        return p;
    }
}
