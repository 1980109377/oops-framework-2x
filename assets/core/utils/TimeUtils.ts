/** 时间工具 */
export class TimeUtil {
    /**
     * 间隔天数
     * @param time1 开始时间
     * @param time2 结束时间
     * @returns 
     */
    public static daysBetween(time1: number | string | Date, time2: number | string | Date): number {
        if (time2 == undefined) {
            time2 = +new Date();
        }
        let startDate = new Date(time1).toLocaleDateString()
        let endDate = new Date(time2).toLocaleDateString()
        let startTime = new Date(startDate).getTime();
        let endTime = new Date(endDate).getTime();
        return Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    }

    /** 间隔秒数，时间顺序无要求，最后会获取绝对值 */
    public static secsBetween(time1: number, time2: number) {
        let dates = Math.abs((time2 - time1)) / (1000);
        dates = Math.floor(dates) + 1;
        return dates;
    }

    /**
     * 代码休眠时间
     * @param ms 毫秒
     */
    public static async sleep(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms)
        });
    }

    /**
     * 等待直到条件成立，否则每隔 intervalMs 检查一次，超时则 reject
     * @param predicate 检查条件的函数
     * @param intervalMs 轮询间隔，默认100ms
     * @param timeoutMs 超时时间，0为不超时
     */
    public static async waitUntil(predicate: () => boolean, intervalMs = 100, timeoutMs = 0): Promise<void> {
        const start = Date.now();
        return new Promise<void>((resolve, reject) => {
            const check = () => {
                if (predicate()) {
                    resolve();
                } else if (timeoutMs > 0 && Date.now() - start >= timeoutMs) {
                    reject(new Error('waitUntil timeout'));
                } else {
                    setTimeout(check, intervalMs);
                }
            };
            check();
        });
    }
}